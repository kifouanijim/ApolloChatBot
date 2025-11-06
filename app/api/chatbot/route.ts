// app/api/chatbot/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

// Fonction de similarité simple
function similarity(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const common = words1.filter((word) => words2.includes(word));
  return common.length / Math.max(words1.length, words2.length);
}

export async function POST(req: Request) {
  const { message } = await req.json();
  const question = message.toLowerCase();

  // Récupère toutes les FAQ depuis la base MySQL
  const faqData = await prisma.fAQ.findMany();

  // Recherche par mots-clés
  const result = faqData.find((item) =>
    item.keywords.split(",").some((k) => question.includes(k.toLowerCase()))
  );

  if (result) {
    const res = NextResponse.json({ reply: result.answer });
    // ⚠️ CORS : autorise uniquement le site officiel d’Apollo
    res.headers.set("Access-Control-Allow-Origin", "https://www.apollo.fr");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type");
    return res;
  }

  // Recherche par similarité (fallback)
  let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };
  for (const item of faqData) {
    const score = similarity(question, item.question);
    if (score > bestMatch.score) {
      bestMatch = { score, answer: item.answer };
    }
  }

  const reply =
    bestMatch.score >= 0.3
      ? bestMatch.answer
      : "Je n’ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com.";

  const res = NextResponse.json({ reply });
  // ⚠️ CORS
  res.headers.set("Access-Control-Allow-Origin", "https://www.apollo.fr");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return res;
}

// Gestion du préflight OPTIONS pour CORS
export async function OPTIONS() {
  const res = NextResponse.json({});
  res.headers.set("Access-Control-Allow-Origin", "https://www.apollo.fr");
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}
