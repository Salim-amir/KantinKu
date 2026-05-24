import { useEffect, useState } from 'react'
import { cartService } from '../services/cartService'
import { useAuth } from '../context/AuthContext'

export function useCartCount() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!user || user.role !== 'student') return
    cartService.getCart()
      .then(({ data }) => setCount(data.data?.length ?? 0))
      .catch(() => {})
  }, [user])

  return count
}
