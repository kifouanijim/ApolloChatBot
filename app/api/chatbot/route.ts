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

  // Récupère toutes les FAQ depuis MySQL
  const faqData = await prisma.fAQ.findMany();

  // Recherche par mots-clés
  const result = faqData.find((item) =>
    item.keywords.split(",").some((k) => question.includes(k.toLowerCase()))
  );

  if (result) {
    return NextResponse.json({ reply: result.answer });
  }

  // Recherche par similarité (fallback)
  let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };
  for (const item of faqData) {
    const score = similarity(question, item.question);
    if (score > bestMatch.score) {
      bestMatch = { score, answer: item.answer };
    }
  }

  if (bestMatch.score >= 0.3) {
    return NextResponse.json({ reply: bestMatch.answer });
  }

  return NextResponse.json({
    reply:
      "Je n’ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com.",
  });
}
