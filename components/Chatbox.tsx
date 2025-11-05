"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type Message = {
  type: "user" | "bot";
  text: string;
};

export default function Chatbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false); // ✅ Indicateur de frappe
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🔄 Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // 🕓 Effet "le bot écrit..."
      setTimeout(() => {
        setMessages((prev) => [...prev, { type: "bot", text: data.reply }]);
        setIsTyping(false);
      }, 1000);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Une erreur est survenue 😅" },
      ]);
      setIsTyping(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        margin: "40px auto",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          height: 420,
          border: "1px solid #ccc",
          borderRadius: 10,
          padding: 12,
          overflowY: "auto",
          background: "#fafafa",
          marginBottom: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px 14px",
                borderRadius: 16,
                backgroundColor:
                  msg.type === "user" ? "#007bff" : "#e5e5e5",
                color: msg.type === "user" ? "#fff" : "#000",
                maxWidth: "80%",
                wordWrap: "break-word",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {/* ✨ Animation “le bot écrit...” */}
        {isTyping && (
          <div style={{ textAlign: "left", color: "#666", paddingLeft: 6 }}>
            <span className="dot" style={dotStyle(0)}></span>
            <span className="dot" style={dotStyle(1)}></span>
            <span className="dot" style={dotStyle(2)}></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            marginLeft: 8,
            padding: "10px 16px",
            borderRadius: 8,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}

// 🔵 Animation des points "..." pour le bot
const dotStyle = (index: number) => ({
  display: "inline-block",
  width: 8,
  height: 8,
  margin: "0 3px",
  backgroundColor: "#888",
  borderRadius: "50%",
  animation: `bounce 1.4s infinite ease-in-out both`,
  animationDelay: `${index * 0.2}s`,
});

// 🔁 Injection du style de l’animation dans le document
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
  `;
  document.head.appendChild(style);
}
