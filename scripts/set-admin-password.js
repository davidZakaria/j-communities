import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

const password = process.argv[2];
if (!password) {
  console.error("Usage: npm run admin:set-password -- <password>");
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

if (!fs.existsSync(envPath)) {
  console.error(`Missing .env at ${envPath}`);
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const line = `ADMIN_PASSWORD_HASH='${hash}'`;
let content = fs.readFileSync(envPath, "utf8");

if (/^ADMIN_PASSWORD_HASH=/m.test(content)) {
  content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, line);
} else {
  content = `${content.trimEnd()}\n${line}\n`;
}

fs.writeFileSync(envPath, content, "utf8");

const ok = await bcrypt.compare(password, hash);
console.log("ADMIN_PASSWORD_HASH updated in .env");
console.log(`Self-test: ${ok ? "OK" : "FAILED"}`);
console.log("Restart the server: pm2 restart j-communities --update-env");
