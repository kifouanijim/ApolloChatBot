import { PrismaClient } from "../generated/prisma/index.js";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    await readFile(new URL("./faq.json", import.meta.url), "utf-8")
  );

  for (const faq of data) {
    await prisma.fAQ.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        keywords: faq.keywords.join(","), // tableau → string
        createdAt: new Date(), // ✅ Génère la date actuelle
        updatedAt: new Date(), // ✅ idem
      },
    });
  }

  console.log("✅ Données insérées avec succès !");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
