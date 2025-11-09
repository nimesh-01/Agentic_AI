export default function Input({ label, type, value, setValue }) {
  return (
    <div className="relative w-full mb-6">
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        className="peer w-full px-4 py-3 bg-transparent border border-gray-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition placeholder-transparent"
        placeholder={label}
      />
      <label
        className="absolute left-3 top-3 text-gray-400 text-sm transition-all 
        peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-400 
        peer-valid:-top-2.5 peer-valid:text-xs peer-valid:text-indigo-400 
        bg-gray-900 px-1"
      >
        {label}
      </label>
    </div>
  );
}
