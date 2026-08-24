import bcrypt from "bcrypt";
import { generateSecret, generateURI } from "otplib";
import { prisma } from "../db.js";
import { encryptField, decryptField } from "./leadCrypto.js";
import { config } from "../config.js";

const DUMMY_PASSWORD_HASH = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36CgAIcmOF.MGr/jA.5K.K";
const USERNAME_PATTERN = /^[a-z0-9._-]{3,32}$/i;

export function sanitizeAdminUser(user) {
  if (!user) return user;
  const { passwordHash, totpSecret, ...rest } = user;
  return {
    ...rest,
    hasTotp: Boolean(totpSecret),
  };
}

export function sanitizeAdminUsers(users) {
  return users.map(sanitizeAdminUser);
}

function encryptTotpSecret(secret) {
  return secret ? encryptField(secret) : null;
}

function decryptTotpSecret(stored) {
  return stored ? decryptField(stored) : null;
}

export function createTotpEnrollment(username, secret = generateSecret()) {
  const otpauthUrl = generateURI({
    issuer: "J-Communities",
    label: username,
    secret,
  });
  return { secret, otpauthUrl };
}

export async function countActiveAdminUsers() {
  return prisma.adminUser.count({ where: { active: true } });
}

export async function findActiveAdminByUsername(username) {
  const normalized = String(username ?? "").trim();
  if (!normalized) return null;
  return prisma.adminUser.findFirst({
    where: { username: normalized, active: true },
  });
}

export async function verifyAdminCredentials(username, password) {
  const normalized = String(username ?? "").trim();
  const user = await findActiveAdminByUsername(normalized);

  if (user) {
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
      return null;
    }
    return user;
  }

  await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
  return null;
}

export function getTotpSecretForAuth(user) {
  if (!user) return null;
  return decryptTotpSecret(user.totpSecret);
}

export async function touchAdminLogin(userId) {
  if (!userId) return;
  await prisma.adminUser.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

export async function listAdminUsers() {
  const users = await prisma.adminUser.findMany({
    orderBy: [{ isSuperAdmin: "desc" }, { username: "asc" }],
  });
  return sanitizeAdminUsers(users);
}

export function validateNewUsername(username) {
  const value = String(username ?? "").trim();
  if (!USERNAME_PATTERN.test(value)) {
    return { ok: false, error: "Username must be 3–32 characters (letters, numbers, . _ -)." };
  }
  return { ok: true, value };
}

export async function createAdminUser({ username, password, isSuperAdmin = false, enrollTotp = true }) {
  const parsed = validateNewUsername(username);
  if (!parsed.ok) return parsed;

  const pwd = String(password ?? "");
  if (pwd.length < 10 || pwd.length > 128) {
    return { ok: false, error: "Password must be 10–128 characters." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { username: parsed.value } });
  if (existing) {
    return { ok: false, error: "Username already exists." };
  }

  const totpSetup = enrollTotp ? createTotpEnrollment(parsed.value) : null;
  const passwordHash = await bcrypt.hash(pwd, 12);

  const user = await prisma.adminUser.create({
    data: {
      username: parsed.value,
      passwordHash,
      totpSecret: totpSetup ? encryptTotpSecret(totpSetup.secret) : null,
      isSuperAdmin: Boolean(isSuperAdmin),
    },
  });

  return {
    ok: true,
    user: sanitizeAdminUser(user),
    totpSetup: totpSetup ? { secret: totpSetup.secret, otpauthUrl: totpSetup.otpauthUrl } : null,
  };
}

export async function setAdminUserActive(id, active) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) return { ok: false, error: "User not found." };

  if (!active && user.isSuperAdmin) {
    const superCount = await prisma.adminUser.count({
      where: { isSuperAdmin: true, active: true, id: { not: id } },
    });
    if (superCount === 0) {
      return { ok: false, error: "Cannot deactivate the last super admin." };
    }
  }

  const updated = await prisma.adminUser.update({
    where: { id },
    data: { active: Boolean(active) },
  });

  return { ok: true, user: sanitizeAdminUser(updated) };
}

export async function resetAdminUserTotp(id) {
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) return { ok: false, error: "User not found." };

  const { secret, otpauthUrl } = createTotpEnrollment(user.username);
  const updated = await prisma.adminUser.update({
    where: { id },
    data: { totpSecret: encryptTotpSecret(secret) },
  });

  return {
    ok: true,
    user: sanitizeAdminUser(updated),
    totpSetup: { secret, otpauthUrl },
  };
}

export async function seedAdminFromEnv() {
  const username = config.adminUsername;
  const passwordHash = config.adminPasswordHash;
  if (!username || !passwordHash) {
    console.error("ADMIN_USERNAME and ADMIN_PASSWORD_HASH are required to seed the first admin.");
    process.exit(1);
  }

  const existing = await prisma.adminUser.findUnique({ where: { username } });
  if (existing) {
    console.log(`Admin user "${username}" already exists — skipping seed.`);
    return existing;
  }

  const envTotp = String(process.env.ADMIN_TOTP_SECRET ?? "").trim();
  const totpSecret = envTotp || createTotpEnrollment(username).secret;

  const user = await prisma.adminUser.create({
    data: {
      username,
      passwordHash,
      totpSecret: encryptTotpSecret(totpSecret),
      isSuperAdmin: true,
    },
  });

  console.log(`Created super admin "${username}" from .env credentials.`);
  if (!envTotp) {
    const { otpauthUrl } = createTotpEnrollment(username, totpSecret);
    console.log("\nNo ADMIN_TOTP_SECRET in .env — new TOTP secret generated.");
    console.log(`Add to .env (optional backup): ADMIN_TOTP_SECRET=${totpSecret}`);
    console.log(`otpauth URL: ${otpauthUrl}`);
  }

  return user;
}
