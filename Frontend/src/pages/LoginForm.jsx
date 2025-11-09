import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
import Input from "../components/Input";

export default function LoginForm({ onAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/login", { email_id: email, password });
      const user = res?.data?.user || res?.data?.isUserExist;
      const ok = !!user && res.status === 200;

      if (ok) {
        toast.success("Logged in ✅");
        onAuth(user);
      } else {
        setError(res?.data?.msg || "Login failed");
        toast.error(res?.data?.msg || "Login failed ❌");
      }
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed";
      setError(msg);
      toast.error(msg + " ❌");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <Input label="Email Address" type="email" value={email} setValue={setEmail} />
      <Input label="Password" type="password" value={password} setValue={setPassword} />
      {error && <p className="text-red-400 text-center">{error}</p>}
      <button
        type="submit"
        className="w-full py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-indigo-500/30"
      >
        Sign In
      </button>
    </form>
  );
}
