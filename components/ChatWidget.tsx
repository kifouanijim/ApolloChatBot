"use client";
import { useState } from "react";
import { X } from "lucide-react";

// Choisit l'URL de l'API selon l'environnement
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://apollo-chat-bot-1ukr-git-main-jims-projects-ddd71c9f.vercel.app"
    : "http://localhost:3000/api/chatbot";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Erreur réseau");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { role: "bot", text: "Erreur réseau 😅" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700"
        >
          💬
        </button>
      )}

      {open && (
        <div className="w-96 max-w-full h-[500px] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border-2 border-red-600">
          {/* Header */}
          <div className="flex justify-between items-center p-4 bg-red-600 text-white font-bold cursor-move">
            <span>🤖 Apollo Chatbot</span>
            <button onClick={() => setOpen(false)}>
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={`inline-block px-3 py-2 rounded-xl ${
                    msg.role === "user" ? "bg-red-600 text-white" : "bg-black text-white"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t border-red-600 p-3 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Pose ta question..."
              className="flex-1 border border-black rounded-l-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 text-black"
            />
            <button
              onClick={sendMessage}
              className="bg-red-600 text-white px-4 py-2 rounded-r-xl hover:bg-red-700"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
