import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import { Skeleton } from './components/ui/skeleton';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import MemberForm from './pages/Members/MemberForm';
import MemberList from './pages/Members/MemberList';
import UserForm from './pages/Users/UserForm';
import UserList from './pages/Users/UserList';

function PrivateRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-3 w-64">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    );
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />;

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/members"
            element={
              <PrivateRoute>
                <MemberList />
              </PrivateRoute>
            }
          />
          <Route
            path="/members/new"
            element={
              <PrivateRoute>
                <MemberForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/members/:id/edit"
            element={
              <PrivateRoute>
                <MemberForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute adminOnly>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/new"
            element={
              <PrivateRoute adminOnly>
                <UserForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/users/:id/edit"
            element={
              <PrivateRoute adminOnly>
                <UserForm />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
