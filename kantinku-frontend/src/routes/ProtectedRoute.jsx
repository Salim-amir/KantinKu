import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { isLoggedIn, isAdmin, isStudent, loading } = useAuth()

  if (loading) return null  // tunggu session restore

  if (!isLoggedIn()) return <Navigate to="/login" replace />

  if (role === 'admin'   && !isAdmin())   return <Navigate to="/login"  replace />
  if (role === 'student' && !isStudent()) return <Navigate to="/admin"  replace />

  return children
}