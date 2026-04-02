import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTrading } from '../../context/TradingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPrice, formatPnl } from '../../utils/formatters.js'
import './Navbar.css'

export default function Navbar() {
  const { portfolioValue, totalPnl } = useTrading()
  const { user, logout } = useAuth()
  const loc = useLocation()
  const [showMenu, setShowMenu] = useState(false)
  const pnlPositive = totalPnl >= 0

  const links = [
    { to: '/', label: 'TERMINAL' },
    { to: '/portfolio', label: 'PORTFOLIO' },
    { to: '/leaderboard', label: 'LEADERBOARD' },
  ]

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">◈</span>
        <span className="brand-name">TRADEFORGE</span>
      </div>
      <div className="navbar-links">
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`nav-link ${loc.pathname === l.to ? 'active' : ''}`}>
            {l.label}
          </Link>
        ))}
      </div>
      <div className="navbar-right">
        <div className="navbar-stats">
          <div className="stat-pill">
            <span className="stat-label">PORTFOLIO</span>
            <span className="stat-value">${formatPrice(portfolioValue)}</span>
          </div>
          <div className={`stat-pill pnl ${pnlPositive ? 'positive' : 'negative'}`}>
            <span className="stat-label">P&L</span>
            <span className="stat-value">{formatPnl(totalPnl)}</span>
          </div>
        </div>
        {user && (
          <div className="user-menu-wrap">
            <button className="user-avatar-btn" onClick={() => setShowMenu(m => !m)}>
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" className="user-avatar-img" referrerPolicy="no-referrer" />
                : <span className="user-avatar-fallback">{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
              }
            </button>
            {showMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-name">{user.displayName || user.email}</div>
                <div className="user-dropdown-email">{user.email}</div>
                <button className="user-dropdown-logout" onClick={() => { logout(); setShowMenu(false) }}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}