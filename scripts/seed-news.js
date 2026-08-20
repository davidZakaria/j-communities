import "dotenv/config";
import { prisma } from "../server/db.js";
import { seedNewsArticles } from "../server/lib/newsArticles.js";

async function main() {
  const result = await seedNewsArticles();
  console.log(`News seed complete: ${result.created} created, ${result.updated} updated (${result.total} total).`);
}

main()
  .catch((err) => {
    console.error("News seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
