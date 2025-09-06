import UserForm from './components/UserForm'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            FYP BUDDY
          </h1>
          <p className="text-blue-100 mt-2">
            Tip: Add as much detail as possible for better matches!
          </p>
        </div>

        {/* Form container */}
        <div className="p-10">
          <UserForm />
        </div>
      </div>
    </div>
  );
}

export default App
