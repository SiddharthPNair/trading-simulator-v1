import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, loginWithGoogle, logout } from '../services/firebase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = loading

  useEffect(() => {
    const unsub = onAuthChange(u => setUser(u || null))
    return unsub
  }, [])

  return (
    <AuthContext.Provider value={{ user, loginWithGoogle, logout, loading: user === undefined }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}