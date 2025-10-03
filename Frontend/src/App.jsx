import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

// ICONS
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.716 7.716 0 0 1 12 15.75a7.716 7.716 0 0 1 5.855 2.062A8.25 8.25 0 0 1 12 20.25a8.25 8.25 0 0 1-5.855-2.438Z" clipRule="evenodd" /></svg>
);
const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M4.5 3.75a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V6.75a3 3 0 0 0-3-3h-15Zm4.125 3.375a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75Zm0 3.75a.75.75 0 0 0 0 1.5h6.75a.75.75 0 0 0 0-1.5h-6.75Zm0 3.75a.75.75 0 0 0 0 1.5h3.75a.75.75 0 0 0 0-1.5h-3.75Z" clipRule="evenodd" /></svg>
);
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" /></svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>
);
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>
);

// AXIOS API SETUP
const api = axios.create({
  baseURL: 'https://agenticais.netlify.app/api',
  withCredentials: true,
});
// LOADING BAR
function LoadingBar({ loading }) {
  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-indigo-500 transition-all duration-300 z-50 ${
        loading ? 'w-full opacity-100' : 'w-0 opacity-0'
      }`}
    />
  );
}

// MAIN APP
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = api.interceptors.request.use((config) => {
      setApiLoading(true);
      return config;
    });
  
    // Response interceptor
    const responseInterceptor = api.interceptors.response.use(
      (response) => {
        setApiLoading(false);
        return response;
      },
      (error) => {
        setApiLoading(false);
        return Promise.reject(error);
      }
    );
  
    // Cleanup
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await api.get('/main');
        const u = response.data.user;
        if (u) setUser(u);
        else setUser(null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (e) {
       setError("Logout failed")
    }
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading...</div>;

   return (
    <div className="h-screen w-screen bg-gray-900 text-gray-100 font-sans">
      {/* ⬇️ ADD THIS ON LINE ~110 */}
      <LoadingBar loading={apiLoading} />

      {user ? <ChatPage user={user} onLogout={handleLogout} /> : <AuthPage onAuth={setUser} />}
    </div>
  );

}

// AUTH
function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-900 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-white">{isLogin ? 'Welcome Back!' : 'Create Account'}</h1>
        {isLogin ? <LoginForm onAuth={onAuth} /> : <RegisterForm onRegister={() => setIsLogin(true)} />}
        <p className="text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-400 hover:text-indigo-300">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginForm({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/login', { email_id: email, password });
      const user = response.data.user || response.data.isUserExist;
      if (user) onAuth(user);
      else setError(response.data.msg || 'Login failed');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      {error && <p className="text-red-400 text-center ">{error}</p>}
      <button type="submit" className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300">Sign In</button>
    </form>
  );
}

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/register', { username, email_id: email, password });
      onRegister();
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      <button type="submit" className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300">Sign Up</button>
      {error && <p className="text-red-400 text-center">{error}</p>}
    </form>
  );
}

// CHAT PAGE
function ChatPage({ user, onLogout }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState('');

  useEffect(() => {
    const newSocket = io('https://agentic-ai-bxvh.onrender.com', { withCredentials: true });
    setSocket(newSocket);

    const fetchChats = async () => {
      try {
        const response = await api.get('/chat');
        setChats(response.data.chats || []);
      } catch (error) {
        console.error('Failed to fetch chats:', error?.response?.data || error.message);
      }
    };
    fetchChats();

    return () => newSocket.close();
  }, []);

  const openNewChatModal = () => {
    setNewChatTitle('');
    setNewChatModalOpen(true);
  };

  const createNewChat = async () => {
    if (!newChatTitle.trim()) return;
    try {
      const response = await api.post('/chat/', { "title": newChatTitle.trim() });
      const chat = response.data.chat;
      setChats(prev => [chat, ...prev]);
      setActiveChat(chat);
      setNewChatModalOpen(false);
    } catch (error) {
      console.error('Could not create chat', error);
      alert('Could not create chat.');
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar
        user={user}
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onNewChat={openNewChatModal}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <ChatView chat={activeChat} socket={socket} toggleSidebar={() => setSidebarOpen(v => !v)} sidebarOpen={sidebarOpen} />

      {/* New Chat Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setNewChatModalOpen(false)} />
          <div className="relative w-full max-w-md p-6 bg-gray-900 rounded-2xl shadow-lg transform transition-transform duration-300 scale-100">
            <h3 className="text-lg font-semibold mb-4">Create New Chat</h3>
            <input value={newChatTitle} onChange={e => setNewChatTitle(e.target.value)} placeholder="Chat title" className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg mb-4" />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setNewChatModalOpen(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600">Cancel</button>
              <button onClick={createNewChat} className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// SIDEBAR
function Sidebar({ user, chats, activeChat, setActiveChat, onNewChat, onLogout, sidebarOpen, setSidebarOpen }) {
  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 w-72 bg-gray-800 p-4 border-r border-gray-700 transform transition-transform duration-300 ease-in-out 
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col`}
    >
      {/* Top Section: User + Close button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 rounded-full h-10 w-10 flex items-center justify-center font-bold">
            {user.username?.charAt(0)?.toUpperCase()}
          </div>
          <span className="font-semibold">{user.username}</span>
        </div>
        <button
          className="text-gray-400 hover:text-white"
          onClick={onLogout}
          title="Logout"
        >
          <LogoutIcon />
        </button>
        <button
          className="md:hidden ml-2"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* New Chat button */}
      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
      >
        <PlusIcon />
        New Chat
      </button>

      {/* Chats list (scrollable) */}
      <div className="flex-grow overflow-y-auto hide-scrollbar">
        {chats.map((chat) => (
          <div
            key={chat._id}
            onClick={() => setActiveChat(chat)}
            className={`p-3 rounded-lg cursor-pointer mb-2 bg-gray-900  transition-colors ${
              activeChat?._id === chat._id
                ? 'bg-gray-700'
                : 'hover:bg-gray-700/50'
            }`}
          >
            <p className="truncate">{chat.title}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}


// CHAT VIEW
function ChatView({ chat, socket, toggleSidebar, sidebarOpen }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chat) return;
      setMessages([]);
      try {
        const response = await api.get(`chat/messages/${chat._id}`);
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [chat]);

  useEffect(() => {
    if (!socket) return;
    const handleAiResponse = (data) => {
      const aiMessage = { role: 'model', content: data.msg, _id: Date.now() };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    };
    socket.on('ai-res', handleAiResponse);
    return () => socket.off('ai-res', handleAiResponse);
  }, [socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket || !chat) return;
    const userMessage = { role: 'user', content: input.trim(), _id: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    socket.emit('ai-msg', { content: input.trim(), chat_id: chat._id });
    setInput('');
  };

  if (!chat) {
    return (
      <div className="flex-grow flex flex-col">
        <header className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md bg-gray-800 hover:bg-gray-700"><MenuIcon /></button>
            <h2 className="text-xl font-semibold">Agentic AI</h2>
          </div>
        </header>
        <div className="flex-grow flex items-center justify-center text-gray-500">Select a chat or start a new one to begin with Agentic AI.</div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full ml-0 ">
      <header className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={toggleSidebar} className="md:hidden p-2 rounded-md bg-gray-800 hover:bg-gray-700"><MenuIcon /></button>
          <h2 className="text-xl font-semibold">{chat.title}</h2>
        </div>
      </header>

      <main className="flex-grow p-6 overflow-y-auto hide-scrollbar">
        <div className="space-y-6 max-w-5xl mx-auto">
          {messages.map(msg => <Message key={msg._id} message={msg} />)}
          {isTyping && <Message message={{ role: 'model', content: '' }} isTyping={true} />}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-4 max-w-3xl mx-auto">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Type your message..." className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="p-3 bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!input.trim()}><SendIcon /></button>
        </form>
      </footer>
    </div>
  );
}

// MESSAGE
function Message({ message, isTyping = false }) {
  const isUser = message.role === 'user';

  const TypingIndicator = () => (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
      <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
      <div className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse"></div>
    </div>
  );

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <div className="flex-shrink-0 text-indigo-400"><BotIcon /></div>}

      <div className={`max-w-xl px-5 py-3 rounded-2xl ${isUser ? 'bg-blue-600 rounded-br-none text-white' : 'bg-gray-700 rounded-bl-none text-gray-100'}`}>
        {isTyping ? <TypingIndicator /> : <p className="whitespace-pre-wrap">{message.content}</p>}
      </div>

      {isUser && <div className="flex-shrink-0 text-blue-500"><UserIcon /></div>}
    </div>
  );
}
