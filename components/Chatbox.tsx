// components/Chatbox.tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type Message = {
  type: "user" | "bot";
  text: string;
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ajout du message utilisateur
    setMessages((prev) => [
      ...prev,
      { type: "user", text: input } as Message,
    ]);

    const userMessage = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Ajout de la réponse du bot
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: data.reply } as Message,
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Une erreur est survenue 😅" } as Message,
      ]);
    }
  };

  return (
    <div style={{ width: 400, margin: "0 auto" }}>
      <div
        style={{
          height: 400,
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 10,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 12,
                backgroundColor:
                  msg.type === "user" ? "#007bff" : "#e5e5e5",
                color: msg.type === "user" ? "#fff" : "#000",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ marginLeft: 8, padding: "8px 16px" }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}
