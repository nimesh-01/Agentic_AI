import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import api from "./src/api/api";
import LoadingBar from "./src/components/LoadingBar";
import AuthPage from "./src/pages/AuthPage";
import ChatPage from "./src/pages/ChatPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);

  useEffect(() => {
    const req = api.interceptors.request.use((config) => {
      setApiLoading(true);
      return config;
    });
    const res = api.interceptors.response.use(
      (response) => {
        setApiLoading(false);
        return response;
      },
      (error) => {
        setApiLoading(false);
        return Promise.reject(error);
      }
    );
    return () => {
      api.interceptors.request.eject(req);
      api.interceptors.response.eject(res);
    };
  }, []);

  useEffect(() => {
    const check = async () => {
      try {
        const response = await api.get("/main");
        setUser(response.data?.user || null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");
      const ok = res?.status === 200 && res?.data && res.data.success !== false;
      if (ok) toast.success("Logged out ✅");
    } catch {
      toast.error("Logout failed ❌");
    }
    setUser(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="animate-pulse text-lg">Starting Agentic AI…</div>
      </div>
    );

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 font-sans">
      <Toaster position="top-center" />
      <LoadingBar loading={apiLoading} />
      {user ? <ChatPage user={user} onLogout={handleLogout} /> : <AuthPage onAuth={setUser} />}
    </div>
  );
}
