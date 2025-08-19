export default function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900">
      <h1 className="text-4xl font-bold mb-4">
        🚀 React + Vite + Tailwind (Latest Setup)
      </h1>
      <button
        className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => alert("It works! 🎉")}
      >
        Test Button
      </button>
    </div>
  )
}
