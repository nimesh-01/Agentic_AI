import toast from "react-hot-toast";
import api from "../api/api";

export default function ProfileModal({ user, setUser, closeModal }) {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email_id);
  const [password, setPassword] = useState("");

  const updateProfile = async () => {
    try {
      const res = await api.put("/update-profile", {
        userId: user._id,
        username,
        email_id: email,
        password,
      });

      if (res.data.success) {
        setUser(res.data.user);
        toast.success("Profile Updated ✅");
        closeModal();
      } else {
        toast.error(res.data.msg || "Update failed ❌");
      }
    } catch {
      toast.error("Server error ❌");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={closeModal}></div>

      <div className="relative p-6 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl">
        <h2 className="text-xl font-bold mb-4">Update Profile</h2>

        <input
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="New Username"
        />

        <input
          className="input mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New Email"
        />

        <input
          className="input mt-4"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password (optional)"
        />

        <div className="flex gap-3 justify-end mt-5">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={updateProfile}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
