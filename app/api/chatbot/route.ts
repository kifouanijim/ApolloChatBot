import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import { PrismaClient } from "../../../generated/prisma";

// ✅ 1. Gestion du Singleton Prisma (Correctement typé pour éviter les erreurs TS)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// ✅ Type FAQ
type FAQ = {
  id: number;
  question: string;
  answer: string;
  keywords: string;
  createdAt: Date;
  updatedAt: Date;
};

// --- Fonctions utilitaires ---

function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(0));
  for (let i = 0; i <= str1.length; i++) track[0][i] = i;
  for (let j = 0; j <= str2.length; j++) track[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(track[j][i - 1] + 1, track[j - 1][i] + 1, track[j - 1][i - 1] + indicator);
    }
  }
  return track[str2.length][str1.length];
}

function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  return maxLen === 0 ? 1 : 1 - levenshteinDistance(str1, str2) / maxLen;
}

function keywordMatch(question: string, keywords: string): number {
  const questionWords = question.toLowerCase().split(/\s+/);
  const keywordList = keywords.split(",").map((k: string) => k.trim().toLowerCase());
  let matchCount = 0;
  for (const keyword of keywordList) {
    if (questionWords.some((word: string) => word === keyword || word.includes(keyword) || keyword.includes(word) || levenshteinDistance(word, keyword) <= 2)) {
      matchCount++;
    }
  }
  return keywordList.length > 0 ? matchCount / keywordList.length : 0;
}

// ✅ 2. Liste d'origines (pense à ajouter ton domaine de prod final ici)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://apollo-chat-bot-1ukr-git-main-jims-projects-ddd71c9f.vercel.app"
];

function setCorsHeaders(res: NextResponse, origin: string | null): NextResponse {
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

// --- Handlers ---

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  try {
    const body = await req.json();
    const message = body.message;

    if (!message) {
      return setCorsHeaders(NextResponse.json({ reply: "Message vide 😅" }, { status: 400 }), origin);
    }

    const question = message.toLowerCase().trim();

    // ✅ 3. Accès à la table FAQ (Prisma génère fAQ pour le modèle FAQ)
    // Si TS souligne .fAQ, essaie .faq ou vérifie ton npx prisma generate
    const faqData = await prisma.fAQ.findMany();

    // Stratégie 1: Exact match
    let result = faqData.find((item: FAQ) =>
      item.keywords.split(",").some((k: string) => question.includes(k.trim().toLowerCase()))
    );

    if (result) {
      return setCorsHeaders(NextResponse.json({ reply: result.answer }), origin);
    }

    // Stratégie 2: Fuse.js
    const fuse = new Fuse<FAQ>(faqData, {
      keys: ["question", "answer", "keywords"],
      threshold: 0.4,
    });
    const fuzzyResults = fuse.search(question);
    if (fuzzyResults.length > 0) {
      const fuzzyMatch = fuzzyResults[0].item as FAQ;
      return setCorsHeaders(NextResponse.json({ reply: fuzzyMatch.answer }), origin);
    }

    // Stratégie 3: Scoring
    let bestMatch: { score: number; answer: string } = { score: 0, answer: "" };
    for (const item of faqData) {
      const questionSim = similarityScore(question, item.question.toLowerCase());
      const keywordSim = keywordMatch(question, item.keywords);
      const score = (questionSim * 0.6) + (keywordSim * 0.4);
      if (score > bestMatch.score) bestMatch = { score, answer: item.answer };
    }

    const reply = bestMatch.score >= 0.25 ? bestMatch.answer : "Je n'ai pas trouvé de réponse... Contactez contact@apollosportingclub.com";
    return setCorsHeaders(NextResponse.json({ reply }), origin);

  } catch (err) {
    console.error(err);
    return setCorsHeaders(NextResponse.json({ reply: "Erreur serveur 😅" }, { status: 500 }), origin);
  }
}

export async function OPTIONS(req: Request) {
  return setCorsHeaders(NextResponse.json(null, { status: 204 }), req.headers.get("origin"));
}