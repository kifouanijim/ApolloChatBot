"use client";
import { useState } from "react";



export default function Home() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", text: input };
    setMessages(prev => [...prev, newMessage]);

    const res = await fetch("/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-red-600">🤖 Apollo Chatbot</h1>
        <div className="h-96 overflow-y-auto border p-3 rounded-md bg-gray-50">
          {messages.map((msg, i) => (
            <div key={i} className={`my-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <span
                className={`inline-block p-2 rounded-xl ${
                  msg.role === "user" ? "bg-red-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex mt-4">
          <input
            className="flex-1 border rounded-l-xl px-3 py-2"
            placeholder="Posez votre question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-red-600 text-white px-4 py-2 rounded-r-xl hover:bg-red-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </main>
  );
}
