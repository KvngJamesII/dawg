import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch (err) {
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        return { success: true }
      }
      return { success: false, error: res.data.error }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password })
      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setUser(res.data.user)
        return { success: true }
      }
      return { success: false, error: res.data.error }
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Registration failed' }
    }
  }

  // Set auth from token (used for OAuth callbacks)
  const setAuthFromToken = async (token) => {
    localStorage.setItem('token', token)
    await fetchUser()
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      loading, 
      refreshUser,
      fetchUser: refreshUser,
      setAuthFromToken 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
