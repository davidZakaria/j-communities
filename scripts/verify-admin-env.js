import "dotenv/config";
import bcrypt from "bcrypt";

const hash = process.env.ADMIN_PASSWORD_HASH || "";
const username = process.env.ADMIN_USERNAME || "admin";
const password = process.argv[2];

console.log("ADMIN_USERNAME:", JSON.stringify(username));
console.log("Hash length:", hash.length);
console.log("Hash prefix:", JSON.stringify(hash.slice(0, 7)));
console.log("Looks like bcrypt:", /^\$2[aby]\$/.test(hash));

if (!password) {
  console.log("\nUsage: node scripts/verify-admin-env.js <password>");
  process.exit(hash.length >= 60 && /^\$2[aby]\$/.test(hash) ? 0 : 1);
}

const ok = await bcrypt.compare(password, hash);
console.log(`Password match: ${ok ? "YES" : "NO"}`);
process.exit(ok ? 0 : 1);
