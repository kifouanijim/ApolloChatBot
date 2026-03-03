import mysql from "mysql2/promise";
import { readFile } from "fs/promises";
import path from "path";

async function main() {
  // Connexion à la base MySQL
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "apollo",
    password: "apollo123",
    database: "apollo_chatbot",
  });

  // Lecture du fichier JSON
  const filePath = path.resolve("./data/faq.json");
  const fileContent = await readFile(filePath, "utf-8");
  const faqData = JSON.parse(fileContent);

  for (const item of faqData) {
    await connection.execute(
      "INSERT INTO FAQ (question, answer, keywords, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())",
      [
        item.question,
        item.answer,
        Array.isArray(item.keywords) ? item.keywords.join(",") : item.keywords,
      ]
    );
  }

  console.log("FAQ seed completed!");
  await connection.end();
}

main().catch(console.error);
