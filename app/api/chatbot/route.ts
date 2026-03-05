import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import { PrismaClient } from "../../../prisma/schema.prisma";

const prisma = new PrismaClient();

// Calcul de Levenshtein distance (distance d'édition)
function levenshteinDistance(str1: string, str2: string): number {
  const track = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i += 1) track[0][i] = i;
  for (let j = 0; j <= str2.length; j += 1) track[j][0] = j;

  for (let j = 1; j <= str2.length; j += 1) {
    for (let i = 1; i <= str1.length; i += 1) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1,
        track[j - 1][i] + 1,
        track[j - 1][i - 1] + indicator
      );
    }
  }

  return track[str2.length][str1.length];
}

// Fonction de similarité améliorée basée sur Levenshtein
function similarityScore(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

// Fonction de correspondance par keywords améliorée
function keywordMatch(question: string, keywords: string): number {
  const questionWords = question.toLowerCase().split(/\s+/);
  const keywordList = keywords.split(",").map((k) => k.trim().toLowerCase());

  let matchCount = 0;
  for (const keyword of keywordList) {
    if (
      questionWords.some(
        (word) =>
          word === keyword ||
          word.includes(keyword) ||
          keyword.includes(word) ||
          levenshteinDistance(word, keyword) <= 2
      )
    ) {
      matchCount++;
    }
  }

  return keywordList.length > 0 ? matchCount / keywordList.length : 0;
}

// 🌐 Autoriser localhost ET domaine en prod
const ALLOWED_ORIGINS = ["http://localhost:3000", "https://apollo-chat-bot-1ukr-git-main-jims-projects-ddd71c9f.vercel.app"];

function setCorsHeaders(res: NextResponse, origin: string) {
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const question = message.toLowerCase().trim();

    const faqData = await prisma.fAQ.findMany();

    // Strategy 1: Exact keyword match
    let result = faqData.find((item) =>
      item.keywords.split(",").some((k) => question.includes(k.trim().toLowerCase()))
    );

    if (result) {
      const res = NextResponse.json({ reply: result.answer });
      return setCorsHeaders(res, req.headers.get("origin") || "");
    }

    // Strategy 2: Fuzzy search avec Fuse.js
    const fuse = new Fuse(faqData, {
      keys: ["question", "answer", "keywords"],
      threshold: 0.4,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const fuzzyResults = fuse.search(question);

    if (fuzzyResults.length > 0) {
      const res = NextResponse.json({ reply: fuzzyResults[0].item.answer });
      return setCorsHeaders(res, req.headers.get("origin") || "");
    }

    // Strategy 3: Meilleure correspondance
    let bestMatch: { score: number; answer: string; id: number } = {
      score: 0,
      answer: "",
      id: 0,
    };

    for (const item of faqData) {
      const questionSimilarity = similarityScore(question, item.question.toLowerCase());
      const keywordScore = keywordMatch(question, item.keywords);
      const combinedScore = questionSimilarity * 0.6 + keywordScore * 0.4;

      if (combinedScore > bestMatch.score) {
        bestMatch = { score: combinedScore, answer: item.answer, id: item.id };
      }
    }

    const reply = bestMatch.score >= 0.25 ? bestMatch.answer : "Je n'ai pas trouvé de réponse à cette question 😅. Vous pouvez écrire à contact@apollosportingclub.com";

    const res = NextResponse.json({ reply });
    return setCorsHeaders(res, req.headers.get("origin") || "");
  } catch (err) {
    const res = NextResponse.json({ reply: "Erreur serveur 😅" }, { status: 500 });
    return setCorsHeaders(res, req.headers.get("origin") || "");
  }
}

export async function OPTIONS(req: Request) {
  const res = NextResponse.json(null, { status: 204 });
  return setCorsHeaders(res, req.headers.get("origin") || "");
}
