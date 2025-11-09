import BotIcon from "../icons/BotIcon";
import UserIcon from "../icons/UserIcon";

export default function Message({ message, isTyping }) {
  const isUser = message.role === "user";

  const TypingDots = () => (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:120ms]" />
      <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:240ms]" />
    </div>
  );

  return (
    <div className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="mt-1 text-indigo-400 bg-white/5 p-2 rounded-xl border border-white/10">
          <BotIcon />
        </div>
      )}

      <div
        className={`
          max-w-[85%] md:max-w-[70%]
          px-5 py-3 rounded-2xl shadow-md border border-white/10
          whitespace-pre-wrap break-words leading-relaxed
          ${isUser
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
            : "bg-white/10 text-gray-100 rounded-bl-none"
          }
        `}
      >
        {isTyping ? <TypingDots /> : message.content}
      </div>

      {isUser && (
        <div className="mt-1 text-indigo-400 bg-white/5 p-2 rounded-xl border border-white/10">
          <UserIcon />
        </div>
      )}
    </div>
  );
}
