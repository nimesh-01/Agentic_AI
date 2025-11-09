import MenuIcon from "../icons/MenuIcon";
import LogoutIcon from "../icons/LogoutIcon";

export default function MainHeader({ title, onMenu, onNewChat, onLogout }) {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20"
            onClick={onMenu}
          >
            <MenuIcon />
          </button>
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            New
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </header>
  );
}
