import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold mb-2">UDAS Member Management</h1>
        <p className="text-gray-500 mb-6">
          Sign in to manage organization members
        </p>
        <button 
          onClick={login} 
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
