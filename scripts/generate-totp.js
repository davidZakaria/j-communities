import { generateSecret, generateURI, verifySync } from "otplib";
import qrcode from "qrcode-terminal";

const secret = generateSecret();
const otpauth = generateURI({
  issuer: "J-Communities",
  label: "Admin",
  secret,
});

console.log("\n=== J Communities — Admin TOTP Setup ===\n");
qrcode.generate(otpauth, { small: true });
console.log("\n1. Scan this QR code with Google Authenticator.");
console.log(`2. Add this exact line to your .env file:\n\nADMIN_TOTP_SECRET=${secret}\n`);
