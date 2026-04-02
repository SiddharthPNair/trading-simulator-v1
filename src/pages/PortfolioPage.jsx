import React from 'react'
import { useTrading } from '../context/TradingContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { formatPrice, formatPnl, formatPercent } from '../utils/formatters.js'
import './PortfolioPage.css'

const MEDALS = ['◈', '◇', '△']

export default function PortfolioPage() {
  const { cash, positions, tradeHistory, totalPnl, portfolioValue, startingCash, price, symbol, submitToLeaderboard } = useTrading()
  const { user } = useAuth()
  const totalReturn = ((portfolioValue - startingCash) / startingCash) * 100
  const invested = portfolioValue - cash
  const winTrades = tradeHistory.filter(t => t.side === 'SELL').length
  const totalSells = tradeHistory.filter(t => t.side === 'SELL').length
  const totalBuys = tradeHistory.filter(t => t.side === 'BUY').length

  async function handleSubmit() {
    await submitToLeaderboard()
  }

  return (
    <div className="portfolio-page">

      {/* Header */}
      <div className="pp-header">
        <div className="pp-user">
          {user?.photoURL && <img src={user.photoURL} className="pp-avatar" alt="avatar" referrerPolicy="no-referrer" />}
          <div>
            <div className="pp-username">{user?.displayName || user?.email}</div>
            <div className="pp-subtitle">TRADER ACCOUNT</div>
          </div>
        </div>
        <button className="pp-leaderboard-btn" onClick={handleSubmit}>
          ◈ SUBMIT TO LEADERBOARD
        </button>
      </div>

      {/* Summary Cards */}
      <div className="pp-cards">
        <div className="pp-card highlight">
          <span className="pp-card-label">TOTAL VALUE</span>
          <span className="pp-card-value large">${formatPrice(portfolioValue)}</span>
          <span className={`pp-card-sub ${totalReturn >= 0 ? 'pos' : 'neg'}`}>
            {totalReturn >= 0 ? '▲' : '▼'} {formatPercent(Math.abs(totalReturn))} all time
          </span>
        </div>
        <div className="pp-card">
          <span className="pp-card-label">CASH BALANCE</span>
          <span className="pp-card-value">${formatPrice(cash)}</span>
          <span className="pp-card-sub neutral">{((cash / portfolioValue) * 100).toFixed(1)}% of portfolio</span>
        </div>
        <div className="pp-card">
          <span className="pp-card-label">REALIZED P&L</span>
          <span className={`pp-card-value ${totalPnl >= 0 ? 'pos' : 'neg'}`}>{formatPnl(totalPnl)}</span>
          <span className="pp-card-sub neutral">from closed positions</span>
        </div>
        <div className="pp-card">
          <span className="pp-card-label">INVESTED</span>
          <span className="pp-card-value">${formatPrice(invested)}</span>
          <span className="pp-card-sub neutral">{((invested / portfolioValue) * 100).toFixed(1)}% of portfolio</span>
        </div>
        <div className="pp-card">
          <span className="pp-card-label">TOTAL TRADES</span>
          <span className="pp-card-value">{tradeHistory.length}</span>
          <span className="pp-card-sub neutral">{totalBuys} buys · {totalSells} sells</span>
        </div>
        <div className="pp-card">
          <span className="pp-card-label">STARTING CAPITAL</span>
          <span className="pp-card-value">${formatPrice(startingCash)}</span>
          <span className="pp-card-sub neutral">paper trading account</span>
        </div>
      </div>

      <div className="pp-body">

        {/* Open Positions */}
        <div className="pp-section">
          <div className="pp-section-header">
            <span className="pp-section-title">OPEN POSITIONS</span>
            <span className="pp-section-count">{Object.keys(positions).length}</span>
          </div>
          {Object.keys(positions).length === 0 ? (
            <div className="pp-empty">No open positions. Go to the Terminal to start trading.</div>
          ) : (
            <table className="pp-table">
              <thead>
                <tr>
                  <th>ASSET</th>
                  <th>QTY</th>
                  <th>AVG COST</th>
                  <th>CURRENT</th>
                  <th>MARKET VALUE</th>
                  <th>UNREALIZED P&L</th>
                  <th>RETURN</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(positions).map(([sym, pos]) => {
                  const currentPrice = sym === symbol ? price : pos.avgCost
                  const marketValue = pos.qty * currentPrice
                  const unrealized = (currentPrice - pos.avgCost) * pos.qty
                  const ret = ((currentPrice - pos.avgCost) / pos.avgCost) * 100
                  return (
                    <tr key={sym}>
                      <td><span className="pos-sym-badge">{sym}</span></td>
                      <td>{pos.qty.toFixed(4)}</td>
                      <td>${formatPrice(pos.avgCost)}</td>
                      <td>${formatPrice(currentPrice)}</td>
                      <td>${formatPrice(marketValue)}</td>
                      <td className={unrealized >= 0 ? 'pos' : 'neg'}>{formatPnl(unrealized)}</td>
                      <td className={ret >= 0 ? 'pos' : 'neg'}>{formatPercent(ret)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Trade History */}
        <div className="pp-section">
          <div className="pp-section-header">
            <span className="pp-section-title">TRADE HISTORY</span>
            <span className="pp-section-count">{tradeHistory.length}</span>
          </div>
          {tradeHistory.length === 0 ? (
            <div className="pp-empty">No trades yet.</div>
          ) : (
            <table className="pp-table">
              <thead>
                <tr>
                  <th>TIME</th>
                  <th>SIDE</th>
                  <th>ASSET</th>
                  <th>QTY</th>
                  <th>PRICE</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {tradeHistory.map(t => (
                  <tr key={t.id}>
                    <td className="trade-time-cell">{t.time}</td>
                    <td><span className={`trade-side-badge ${t.side === 'BUY' ? 'buy' : 'sell'}`}>{t.side}</span></td>
                    <td><span className="pos-sym-badge">{t.symbol}</span></td>
                    <td>{t.qty}</td>
                    <td>${formatPrice(t.price)}</td>
                    <td>${formatPrice(t.qty * t.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  )
}