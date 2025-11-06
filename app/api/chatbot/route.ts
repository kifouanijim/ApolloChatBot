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

// 🌐 Origine autorisée
const ALLOWED_ORIGIN = "https://www.apollo.fr";

function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const question = message.toLowerCase();

    // Récupère toutes les FAQ depuis MySQL
    const faqData = await prisma.fAQ.findMany();

    // Recherche par mots-clés
    const result = faqData.find((item) =>
      item.keywords.split(",").some((k) => question.includes(k.toLowerCase()))
    );

    let reply = "";

    if (result) {
      reply = result.answer;
    } else {
      // Recherche par similarité
      let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };
      for (const item of faqData) {
        const score = similarity(question, item.question);
        if (score > bestMatch.score) {
          bestMatch = { score, answer: item.answer };
        }
      }
      reply =
        bestMatch.score >= 0.3
          ? bestMatch.answer
          : "Je n’ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com.";
    }

    const res = NextResponse.json({ reply });
    return setCorsHeaders(res);
  } catch (err) {
    const res = NextResponse.json({ reply: "Erreur serveur 😅" }, { status: 500 });
    return setCorsHeaders(res);
  }
}

// Gestion du préflight OPTIONS pour CORS
export async function OPTIONS() {
  const res = NextResponse.json(null, { status: 204 });
  return setCorsHeaders(res);
}
