// app/chat/page.tsx
import Chatbox from "@/components/Chatbox";

export default function ChatPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "3rem",
      }}
    >
      <Chatbox />
    </div>
  );
}
