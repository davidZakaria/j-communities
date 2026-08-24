import crypto from "crypto";
import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../server/db.js";
import { createAdminUser } from "../server/lib/adminUsers.js";

/** Dashboard usernames mapped to the team notification emails. */
const TEAM = [
  {
    username: "esraa",
    email: "esraa.sami@j-communities.com",
    passwordEnv: "TEAM_ADMIN_ESRAA_PASSWORD",
    isSuperAdmin: false,
  },
  {
    username: "marketing",
    email: "marketing@newjerseyegypt.com",
    passwordEnv: "TEAM_ADMIN_MARKETING_PASSWORD",
    isSuperAdmin: false,
  },
  {
    username: "david",
    email: "davidsamiii97@gmail.com",
    passwordEnv: "TEAM_ADMIN_DAVID_PASSWORD",
    isSuperAdmin: true,
  },
];

function resolvePassword(envKey) {
  const fromEnv = String(process.env[envKey] ?? "").trim();
  if (fromEnv.length >= 10) {
    return { password: fromEnv, generated: false };
  }
  return { password: crypto.randomBytes(12).toString("base64url"), generated: true };
}

try {
  const teamUsernames = TEAM.map((member) => member.username);
  const removed = await prisma.adminUser.deleteMany({
    where: { username: { notIn: teamUsernames } },
  });

  if (removed.count > 0) {
    console.log(`Removed ${removed.count} admin account(s) not in the team list (including legacy "admin").`);
  }

  console.log("\nTeam admin accounts:\n");

  for (const member of TEAM) {
    const { password, generated } = resolvePassword(member.passwordEnv);
    const existing = await prisma.adminUser.findUnique({ where: { username: member.username } });

    if (existing) {
      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.adminUser.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          active: true,
          totpSecret: null,
          isSuperAdmin: member.isSuperAdmin,
        },
      });
      console.log(`Updated  ${member.username.padEnd(10)}  ${member.email}`);
    } else {
      const result = await createAdminUser({
        username: member.username,
        password,
        isSuperAdmin: member.isSuperAdmin,
        enrollTotp: false,
      });
      if (!result.ok) {
        console.error(`Failed to create ${member.username}: ${result.error}`);
        process.exitCode = 1;
        continue;
      }
      console.log(`Created  ${member.username.padEnd(10)}  ${member.email}`);
    }

    console.log(`  Login username: ${member.username}`);
    console.log(`  Password:       ${password}${generated ? "  (generated — save this now)" : ""}`);
    console.log(`  Super admin:    ${member.isSuperAdmin ? "yes" : "no"}`);
    console.log("");
  }

  console.log("Sign in at /admin with the username (not the email).");
  console.log("Two-factor auth is off until you enable it from /admin/users.\n");
} catch (err) {
  console.error(err?.message || err);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
