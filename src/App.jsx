import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { TradingProvider } from './context/TradingContext.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TradingProvider>
          <AppRoutes />
        </TradingProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}