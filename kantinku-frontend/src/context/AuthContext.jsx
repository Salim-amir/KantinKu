import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)
const TOKEN_KEY = 'kantinku_token'

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [token,   setToken]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY)
    if (!stored) { setLoading(false); return }
    authService.me()
      .then(({ data }) => { setUser(data.user); setToken(stored) })
      .catch(() => { localStorage.removeItem(TOKEN_KEY) })
      .finally(() => setLoading(false))
  }, [])

  const saveAuth = (userData, tok) => {
    localStorage.setItem(TOKEN_KEY, tok)
    setToken(tok); setUser(userData)
  }

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null); setUser(null)
  }

  const login = async (email, password) => {
    const { data } = await authService.login({ email, password })
    saveAuth(data.user, data.token)
    return data.user
  }

  const register = async (name, email, password, passwordConfirmation) => {
    const { data } = await authService.register({
      name, email, password,
      password_confirmation: passwordConfirmation,
    })
    // Tidak otomatis login setelah register
    return data.user
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    clearAuth()
  }

  const isAdmin   = () => user?.role === 'admin'
  const isStudent = () => user?.role === 'student'
  const isLoggedIn = () => !!token && !!user
  const updateUser = (newUser) => setUser(newUser)

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, register, logout, updateUser,
      isAdmin, isStudent, isLoggedIn,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}