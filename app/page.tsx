"use client";
import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900 flex items-center justify-center text-white">
      <h1 className="text-4xl font-bold text-red-500">Bienvenue chez Apollo 🥊</h1>
      <ChatWidget />
    </main>
  );
}
