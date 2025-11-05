import { NextResponse } from "next/server";
import { FAQItem } from "@/type/faq";
import faqData from "../../../data/faq.json";

const faq: FAQItem[] = faqData as FAQItem[];

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

  // 🔍 Recherche directe par mots-clés
  const result = faq.find((item: FAQItem) =>
    item.keywords.some((k: string) => question.includes(k.toLowerCase()))
  );

  if (result) {
    return NextResponse.json({ reply: result.answer });
  }

  // 🧠 Sinon, recherche par similarité (fallback)
  let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };

  for (const item of faq) {
    const score = similarity(question, item.question);
    if (score > bestMatch.score) {
      bestMatch = { score, answer: item.answer };
    }
  }

  // 🎯 Si on trouve une correspondance approximative (30% de ressemblance)
  if (bestMatch.score >= 0.3) {
    return NextResponse.json({ reply: bestMatch.answer });
  }

  // 📨 Réponse par défaut
  return NextResponse.json({
    reply:
      "Je n’ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com.",
  });
}
