import { useState, useEffect, useRef } from "react";
import api from "../api";
import SendIcon from "../../icons/SendIcon";
import Message from "../../components/Message";

export default function ChatView({ chat, socket, messages, setMessages }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef(null);

  useEffect(() => ref.current?.scrollIntoView({ behavior: "smooth" }), [messages, isTyping]);

  useEffect(() => {
    if (!chat) return;

    (async () => {
      try {
        const res = await api.get(`chat/messages/${chat._id}`);
        const msgs = res?.data?.messages || [];
        setMessages(msgs);

        if (msgs.length === 0) {
          setMessages([{ role: "model", content: "Welcome! How can I assist you today?", _id: Date.now() }]);
        }
      } catch {}
    })();
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    const handler = (data) => {
      setMessages((prev) => [...prev, { role: "model", content: data.msg, _id: Date.now() }]);
      setIsTyping(false);
    };
    socket.on("ai-res", handler);
    return () => socket.off("ai-res", handler);
  }, [socket]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !chat) return;

    setMessages((prev) => [...prev, { role: "user", content: input.trim(), _id: Date.now() }]);
    setIsTyping(true);
    socket.emit("ai-msg", { content: input.trim(), chat_id: chat._id });
    setInput("");
  };

  if (!chat)
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a chat or create a new one
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((m) => <Message key={m._id} message={m} />)}
          {isTyping && <Message message={{ role: "model", content: "" }} isTyping />}
          <div ref={ref} />
        </div>
      </main>

      <footer className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <form className="max-w-3xl mx-auto flex items-center gap-3" onSubmit={send}>
          <input
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className={`px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-md hover:shadow-indigo-500/30 ${!input.trim() ? "opacity-60 cursor-not-allowed" : ""}`}
            disabled={!input.trim()}
          >
            <SendIcon />
          </button>
        </form>
      </footer>
    </div>
  );
}
