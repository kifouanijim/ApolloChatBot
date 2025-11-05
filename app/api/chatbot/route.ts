import { NextResponse } from "next/server";
import faq from "@/data/faq.json";

export async function POST(req: Request) {
  const { message } = await req.json();
  const question = message.toLowerCase();

  // Recherche par mots-clés
  const result = faq.find(item =>
    item.keywords.some(k => question.includes(k.toLowerCase()))
  );

  if (result) {
    return NextResponse.json({ reply: result.answer });
  }

  return NextResponse.json({
    reply: "Je n’ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com."
  });
}
