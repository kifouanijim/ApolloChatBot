import { NextResponse } from "next/server";
import Fuse from "fuse.js";

// ✅ Type FAQ
type FAQ = {
  question: string;
  answer: string;
  keywords: string;
};

// --- données en dur pour faciliter le déploiement ---
const HARD_CODED_FAQS: { question: string; answer: string; keywords: string }[] = [
  { question: "Puis-je annuler un cours", answer: "Oui, mais attention : si vous vous désinscrivez moins de 18h avant le début du cours, l’annulation est hors délai et le crédit sera dû.", keywords: "annuler,cours,crédit,désinscription" },
  { question: "Comment utiliser un code promo WP", answer: "Allez dans l’application mobile, onglet « studio » puis « packs ». Choisissez la cotisation annuelle + 50 crédits, puis entrez le code promo OB50.", keywords: "code promo,welcome pack,réduction" },
  { question: "annulation de cours hors délai", answer: "Attention, quand tu te désinscris -18h avant le début du cours, le crédit est dû. Je te remets le crédit pour cette fois que tu puisses réserver à nouveau.", keywords: "annulation,hors délai,désinscription,crédit" },
  { question: "blocage code promo", answer: "Va sur l’application mobile, onglet « studio » puis « packs », choisis cotisation annuelle + 50 crédits pleins tarif et rentre le code promo OB50. La réduction s’appliquera automatiquement et tu payes.", keywords: "code promo,OB50,blocage,réduction" },
  { question: "demande franchise", answer: "Bonjour, je suis Benjamin Benmoyal, Co-Fondateur du réseau Apollo Sporting Club. Je fais suite à votre demande de franchise, j’aimerais organiser un premier échange téléphonique pour discuter de votre projet. Quand seriez-vous disponible ?", keywords: "franchise,demande,contact,appel" },
  { question: "cotisation annuelle expirée", answer: "Ta cotisation annuelle est expirée, tu dois la renouveler. Connecte-toi à l’application Apollo Sporting Club et vas sur l’onglet « club » puis « cartes de cours » pour acheter la cotisation annuelle seule et pouvoir réserver.", keywords: "cotisation,annuelle,expirée,renouveler,réserver" },
  { question: "cours avancé", answer: "Bonjour, votre cours est avancé. Si vous ne pouvez pas venir, envoyez un mail à contact@apollosportingclub.com pour récupérer votre crédit.", keywords: "cours avancé,crédit,annulé,mail" },
  { question: "inscription kids", answer: "Bonjour, bienvenue à l’Apollo ! Vous trouverez en pièce jointe le document d’inscription pour l’Apollo X pour la prochaine saison avec tous les renseignements nécessaires. Vous pouvez venir faire un cours d’essai gratuit les mercredi ou samedi à 15h. Nous prêterons le matériel pour l’essai.", keywords: "kids,enfant,inscription,cours d’essai" },
  { question: "prolongation crédits", answer: "Pour prolonger la durée de validité de tes crédits restants, il faut reprendre un pack et nous prolongerons tes crédits expirés avec la nouvelle date de validité du pack acheté. Tes crédits ne sont jamais perdus.", keywords: "prolongation,crédits,pack,valide" },
  { question: "programme", answer: "J’ai tenté de vous joindre sans succès, pourriez-vous me rappeler au téléphone pour échanger sur votre demande de programme ?", keywords: "programme,demande,appel" },
  { question: "demande info avant inscription", answer: "Bienvenue à l’Apollo ! Notre offre sans engagement avec paiement à la séance permet une grande flexibilité et notre concept de petit groupe favorise l’accompagnement. Télécharge l’application Apollo Sporting Club pour réserver et tester les cours.", keywords: "information,inscription,débutant,cours" },
  { question: "ouverture droits étudiants", answer: "J’ai ouvert tes droits étudiants, va sur l’application Apollo Sporting Club, onglet « studio » puis « packs », achète le pack cotisation annuelle tarif réduit + le pack de crédits de ton choix.", keywords: "étudiant,droits,cotisation,pack" },
  { question: "cartes cadeaux", answer: "Bonjour, nous avons un système de carte cadeau. Télécharge l’application Apollo Sporting Club, onglet « studio » puis « cartes cadeaux », et achète celle qui te convient le mieux.", keywords: "carte cadeau,cadeau,achat" },
  { question: "choix des cours", answer: "Technique : pour apprendre les bases, la gestuelle, choisir boxe anglaise ou française. Physique : pour se défouler, travail le cardio/renfo, choisir cardio boxing, boxing bag, circuit training.", keywords: "cours,choix,technique,physique,boxe,cardio" },
  { question: "matériel", answer: "Pour démarrer, viens avec une tenue de sport, une paire de basket propre, une serviette. Pour le matériel, il te faut gants et bandes. Deux solutions : 1) tu peux les louer à la salle pour 1€ par article. 2) nous vendons du matériel de très bonne qualité à tarif négocié à la salle et pouvons te conseiller.", keywords: "matériel,gants,bandes,location,achat" },
  { question: "cotisation annuelle", answer: "Tu dois simplement renouveler ta cotisation annuelle qui est expirée pour pouvoir réserver.", keywords: "cotisation,annuelle,expirée,réserver" },
  { question: "cours annulé seul", answer: "Bonjour, tu es seul au cours, celui-ci est donc annulé et ton crédit remis. Tu peux venir à un autre cours si tu le souhaites.", keywords: "cours annulé,seul,crédit,remis" },
  { question: "droits tarif réduit", answer: "J’ai ouvert tes droits tarif réduit. Après l’utilisation de tes 3 crédits d’essai, tu achètes la cotisation annuelle tarif réduit et une fois l’achat validé tu prends le pack de crédits tarif réduit de ton choix.", keywords: "tarif réduit,crédits d’essai,cotisation,pack" },
  { question: "objets trouvés", answer: "Tout ce qui est trouvé dans les salles est conservé, demande-le à l’accueil lors de ta prochaine venue.", keywords: "objets trouvés,perdu,salle,accueil" }
];


// --- Fonctions utilitaires ---
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

    // ✅ 3. Utilisation des FAQ en dur
    const faqData = HARD_CODED_FAQS;

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