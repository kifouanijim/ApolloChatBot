import { PrismaClient } from "./generated/prisma";
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const count = await prisma.fAQ.count();
    console.log(`✅ Connexion réussie. FAQ contient ${count} éléments.`);
  } catch (err) {
    console.error("❌ Erreur de connexion :", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
