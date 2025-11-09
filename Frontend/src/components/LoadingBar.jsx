export default function LoadingBar({ loading }) {
  return (
    <div
      className={`fixed top-0 left-0 h-1 bg-indigo-500 transition-all duration-300 z-50 ${
        loading ? "w-full opacity-100" : "w-0 opacity-0"
      }`}
    />
  );
}
