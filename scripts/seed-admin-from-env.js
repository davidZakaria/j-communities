import "dotenv/config";
import { prisma } from "../server/db.js";
import { seedAdminFromEnv } from "../server/lib/adminUsers.js";

try {
  await seedAdminFromEnv();
} finally {
  await prisma.$disconnect();
}
