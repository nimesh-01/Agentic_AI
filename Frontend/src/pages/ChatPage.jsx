import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import api from "../api/api";

import MainHeader from "../components/MainHeader";
import ChatView from "./ChatView";
import PlusIcon from "../icons/PlusIcon";
import LogoutIcon from "../icons/LogoutIcon";

export default function ChatPage({ user, onLogout }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const s = io("https://agentic-ai-bxvh.onrender.com", { withCredentials: true });
    setSocket(s);

    const fetchChats = async () => {
      try {
        const res = await api.get("/chat");
        const list = res?.data?.chats || [];
        setChats(list);
        if (list.length > 0) setActiveChat(list[0]);
      } catch {}
    };

    fetchChats();
    return () => s.close();
  }, []);

  const createNewChat = async () => {
    if (!newChatTitle.trim()) return;

    try {
      const res = await api.post("/chat", { title: newChatTitle.trim() });
      const chat = res?.data?.chat;
      const ok = !!chat && (res.status === 201);

      if (ok) {
        setChats((prev) => [chat, ...prev]);
        setActiveChat(chat);
        setNewChatModalOpen(false);

        setMessages([{ role: "model", content: "Welcome! How can I help you today?", _id: Date.now() }]);
        toast.success("New chat created ✅");
      } else {
        toast.error(res?.data?.msg || "Could not create chat ❌");
      }
    } catch {
      toast.error("Could not create chat ❌");
    }
  };

  const deleteChat = async (chat) => {
    try {
      const res = await api.get(`/chat/delete/${chat._id}`);
      const ok = (res.status === 200) && (res?.data?.success !== false);

      if (ok) {
        const next = chats.filter((c) => c._id !== chat._id);
        setChats(next);
        if (activeChat?._id === chat._id) setActiveChat(next[0] || null);
        toast.success("Chat deleted ✅");
      } else {
        toast.error(res?.data?.msg || "Failed to delete ❌");
      }
    } catch {
      toast.error("Failed to delete ❌");
    }
  };

  return (
    <div className="h-full w-full flex">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-72 border-r border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl h-10 w-10 flex items-center justify-center font-bold shadow-md shadow-indigo-500/20">
              {user.username?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{user.username}</p>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => setNewChatModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md hover:shadow-indigo-500/30"
          >
            <PlusIcon /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`group p-3 rounded-xl cursor-pointer flex items-center justify-between border border-white/10 ${
                activeChat?._id === chat._id
                  ? "bg-white/15"
                  : "bg-white/5 hover:bg-white/10"
              } transition`}
            >
              <p
                className="truncate flex-1"
                onClick={() => {
                  setActiveChat(chat);
                  setMessages([]);
                }}
              >
                {chat.title}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(chat);
                }}
                className="ml-2 px-2 py-1 text-xs bg-red-600/90 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <MainHeader
          title={activeChat?.title || "Agentic AI"}
          onMenu={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={() => setNewChatModalOpen(true)}
          onLogout={onLogout}
        />
        <ChatView chat={activeChat} socket={socket} messages={messages} setMessages={setMessages} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white/5 backdrop-blur-xl border-r border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl h-10 w-10 flex items-center justify-center font-bold">
                  {user.username?.charAt(0)?.toUpperCase()}
                </div>
                <span className="font-semibold">{user.username}</span>
              </div>
              <button onClick={onLogout} className="p-2 bg-white/10 rounded-lg">
                <LogoutIcon />
              </button>
            </div>

            <button
              onClick={() => {
                setNewChatModalOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all shadow-md hover:shadow-indigo-500/30 mb-4"
            >
              <PlusIcon /> New Chat
            </button>

            <div className="space-y-2 overflow-y-auto h-[calc(100vh-200px)]">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  className={`group p-3 rounded-xl cursor-pointer flex items-center justify-between border border-white/10 ${
                    activeChat?._id === chat._id ? "bg-white/15" : "bg-white/5 hover:bg-white/10"
                  } transition`}
                >
                  <p
                    className="truncate flex-1"
                    onClick={() => {
                      setActiveChat(chat);
                      setMessages([]);
                      setSidebarOpen(false);
                    }}
                  >
                    {chat.title}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat);
                    }}
                    className="ml-2 px-2 py-1 text-xs bg-red-600/90 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Chat Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setNewChatModalOpen(false)}
          />
          <div className="relative w-full max-w-md p-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg transform transition-all duration-300 scale-100 opacity-100">
            <h3 className="text-lg font-semibold mb-2">Create New Chat</h3>
            <p className="text-sm text-gray-400 mb-4">
              Give a title to quickly recognize this conversation.
            </p>
            <input
              className="w-full px-4 py-3 bg-transparent border border-white/20 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
              value={newChatTitle}
              onChange={(e) => setNewChatTitle(e.target.value)}
              placeholder="e.g., React debugging, DSA practice..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setNewChatModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={createNewChat}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition shadow-md hover:shadow-indigo-500/30"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
