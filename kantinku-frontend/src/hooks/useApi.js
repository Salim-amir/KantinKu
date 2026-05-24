import { useState, useCallback } from 'react'

// Generic hook for API calls with loading/error state
export function useApi(fn) {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fn(...args)
      setData(res.data)
      return res.data
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Terjadi kesalahan.'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  return { data, loading, error, execute }
}
