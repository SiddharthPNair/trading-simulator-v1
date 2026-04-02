import React, { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/firebase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice, formatPnl } from '../utils/formatters.js'
import './Leaderboard.css'

const MEDALS = ['◈', '◇', '△']

export default function Leaderboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getLeaderboard().then(data => { setEntries(data); setLoading(false) })
  }, [])

  return (
    <div className="leaderboard-page">
      <div className="lb-hero">
        <h1 className="lb-title">LEADERBOARD</h1>
        <p className="lb-subtitle">Top traders ranked by realized P&amp;L</p>
      </div>
      <div className="lb-table-wrap">
        {loading ? (
          <div className="lb-loading">
            <span style={{ animation: 'lbspin 1s linear infinite', display: 'inline-block', fontSize: '24px', color: 'var(--green)' }}>◈</span>
          </div>
        ) : (
          <table className="lb-table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>TRADER</th>
                <th>P&L</th>
                <th>TRADES</th>
                <th>AVG / TRADE</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e, i) => {
                const isMe = user && e.id === user.uid
                return (
                  <tr key={e.id} className={`${i < 3 ? `top-${i + 1}` : ''} ${isMe ? 'is-me' : ''}`}>
                    <td className="rank-cell">
                      {i < 3 ? <span className="medal">{MEDALS[i]}</span> : <span className="rank-num">{i + 1}</span>}
                    </td>
                    <td className="name-cell">
                      <div className="trader-info">
                        {e.photoURL
                          ? <img src={e.photoURL} className="lb-avatar" alt="avatar" referrerPolicy="no-referrer" />
                          : <div className="lb-avatar-fallback">{(e.username || 'T')[0].toUpperCase()}</div>
                        }
                        <span>{e.username}</span>
                        {isMe && <span className="you-badge">YOU</span>}
                      </div>
                    </td>
                    <td className={`pnl-cell ${e.pnl >= 0 ? 'pos' : 'neg'}`}>{formatPnl(e.pnl)}</td>
                    <td className="trades-cell">{e.trades}</td>
                    <td className="avg-cell">{e.trades > 0 ? formatPnl(e.pnl / e.trades) : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <style>{`@keyframes lbspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
