import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Layout() {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/members', label: 'Members' },
    ...(user?.role === 'ADMIN' ? [{ path: '/users', label: 'Users' }] : []),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-15 flex items-center gap-8">
          <h1 className="text-xl font-bold text-blue-600">UDAS Members</h1>
          <nav className="flex gap-2 flex-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="font-medium">{user?.name}</span>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-500">
              {user?.role}
            </span>
            <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
