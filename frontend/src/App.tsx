import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/Layout/Layout'
import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import MemberList from './pages/Members/MemberList'
import MemberForm from './pages/Members/MemberForm'
import UserList from './pages/Users/UserList'
import UserForm from './pages/Users/UserForm'

function PrivateRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" />
  
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/members" element={<PrivateRoute><MemberList /></PrivateRoute>} />
        <Route path="/members/new" element={<PrivateRoute><MemberForm /></PrivateRoute>} />
        <Route path="/members/:id/edit" element={<PrivateRoute><MemberForm /></PrivateRoute>} />
        <Route path="/users" element={<PrivateRoute adminOnly><UserList /></PrivateRoute>} />
        <Route path="/users/new" element={<PrivateRoute adminOnly><UserForm /></PrivateRoute>} />
        <Route path="/users/:id/edit" element={<PrivateRoute adminOnly><UserForm /></UserForm>} />
      </Route>
    </Routes>
  )
}
