import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function GuestRoute({ children }) {
  const { isLoggedIn, isAdmin, loading } = useAuth()

  if (loading) return null  // tunggu session restore

  if (isLoggedIn()) {
    return <Navigate to={isAdmin() ? '/admin' : '/'} replace />
  }

  return children
}