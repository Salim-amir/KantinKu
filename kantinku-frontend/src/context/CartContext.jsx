import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isLoggedIn, isStudent } = useAuth()
  const [items,   setItems]   = useState([])
  const [total,   setTotal]   = useState(0)
  const [loading, setLoading] = useState(false)

  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn() || !isStudent()) return
    setLoading(true)
    try {
      const { data } = await cartService.getCart()
      setItems(data.data ?? [])
      setTotal(data.total ?? 0)
    } catch {
      setItems([]); setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [isLoggedIn, isStudent])

  useEffect(() => {
    if (isLoggedIn() && isStudent()) {
      fetchCart()
    } else {
      setItems([]); setTotal(0)
    }
  }, [isLoggedIn, isStudent, fetchCart])

  return (
    <CartContext.Provider value={{ items, total, count, loading, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}