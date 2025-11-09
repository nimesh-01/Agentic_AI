import { useState } from "react";
import BotIcon from "../../icons/BotIcon";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthPage({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-full w-full flex items-center justify-center relative overflow-hidden">

      {/* Animated blobs */}
      <div className="absolute -top-32 -left-20 h-80 w-80 bg-purple-700/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 bg-indigo-700/30 rounded-full blur-3xl animate-pulse [animation-delay:300ms]" />

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-10 w-full max-w-md transition-all duration-500 hover:shadow-indigo-500/20">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <BotIcon />
          </div>
          <h1 className="text-3xl font-extrabold tracking-wide">
            Agentic <span className="text-indigo-400">AI</span>
          </h1>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">
          {isLogin ? "Welcome back 👋" : "Create your account"}
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          {isLogin ? "Log in to continue your chats" : "Join us to start chatting smarter"}
        </p>

        {isLogin ? <LoginForm onAuth={onAuth} /> : <RegisterForm onAuth={onAuth} />}

        <div className="text-center text-gray-300 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            className="ml-2 text-indigo-400 hover:text-indigo-300 font-semibold transition"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
