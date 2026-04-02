import React, { useState } from 'react'
import { useTrading } from '../../context/TradingContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatPrice } from '../../utils/formatters.js'
import './TradePanel.css'

export default function TradePanel() {
  const { symbol, price, executeTrade, cash, positions, submitToLeaderboard } = useTrading()
  const { user } = useAuth()
  const [side, setSide] = useState('BUY')
  const [qty, setQty] = useState('')
  const [orderType, setOrderType] = useState('MARKET')
  const [limitPrice, setLimitPrice] = useState('')
  const [msg, setMsg] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const pos = positions[symbol]
  const total = (parseFloat(qty) || 0) * (orderType === 'LIMIT' ? parseFloat(limitPrice) || price : price)

  function handleTrade() {
    const q = parseFloat(qty)
    if (!q || q <= 0) return setMsg({ type: 'error', text: 'Enter valid quantity' })
    const lp = orderType === 'LIMIT' ? parseFloat(limitPrice) : null
    if (orderType === 'LIMIT' && !lp) return setMsg({ type: 'error', text: 'Enter limit price' })
    const result = executeTrade(side, q, lp)
    if (result.success) {
      setMsg({ type: 'success', text: `${side} ${q} ${symbol} @ $${formatPrice(lp || price)}` })
      setQty(''); setLimitPrice('')
    } else {
      setMsg({ type: 'error', text: result.msg })
    }
    setTimeout(() => setMsg(null), 3000)
  }

  async function handleLeaderboard() {
    setSubmitting(true)
    await submitToLeaderboard()
    setMsg({ type: 'success', text: 'Score submitted to leaderboard!' })
    setSubmitting(false)
    setTimeout(() => setMsg(null), 3000)
  }

  return (
    <div className="trade-panel">
      <div className="tp-header">
        <span>PLACE ORDER</span>
        <span className="tp-symbol">{symbol}</span>
      </div>

      <div className="order-type-tabs">
        {['MARKET', 'LIMIT'].map(t => (
          <button key={t} className={`ot-tab ${orderType === t ? 'active' : ''}`} onClick={() => setOrderType(t)}>{t}</button>
        ))}
      </div>

      <div className="side-tabs">
        <button className={`side-btn buy ${side === 'BUY' ? 'active' : ''}`} onClick={() => setSide('BUY')}>BUY</button>
        <button className={`side-btn sell ${side === 'SELL' ? 'active' : ''}`} onClick={() => setSide('SELL')}>SELL</button>
      </div>

      <div className="tp-info">
        <div className="tp-row"><span>Market Price</span><span className="val">${formatPrice(price)}</span></div>
        <div className="tp-row"><span>Available Cash</span><span className="val">${formatPrice(cash)}</span></div>
        {pos && <div className="tp-row"><span>Position</span><span className="val pos">{pos.qty.toFixed(4)} @ ${formatPrice(pos.avgCost)}</span></div>}
      </div>

      <div className="tp-inputs">
        <div className="input-group">
          <label>QUANTITY</label>
          <input type="number" min="0" step="0.001" placeholder="0.000" value={qty} onChange={e => setQty(e.target.value)} />
        </div>
        {orderType === 'LIMIT' && (
          <div className="input-group">
            <label>LIMIT PRICE</label>
            <input type="number" min="0" step="0.01" placeholder={price.toFixed(2)} value={limitPrice} onChange={e => setLimitPrice(e.target.value)} />
          </div>
        )}
        {total > 0 && <div className="tp-total">TOTAL: <strong>${formatPrice(total)}</strong></div>}
      </div>

      <button className={`execute-btn ${side.toLowerCase()}`} onClick={handleTrade}>
        {side} {symbol}
      </button>

      {msg && <div className={`tp-msg ${msg.type}`}>{msg.text}</div>}

      <div className="tp-divider" />

      <div className="tp-leaderboard-section">
        {user && (
          <div className="lb-user-info">
            {user.photoURL && <img src={user.photoURL} className="lb-avatar" alt="avatar" referrerPolicy="no-referrer" />}
            <span className="lb-username">{user.displayName || user.email}</span>
          </div>
        )}
        <button className="lb-submit-btn" onClick={handleLeaderboard} disabled={submitting}>
          {submitting ? 'SUBMITTING...' : 'SUBMIT TO LEADERBOARD'}
        </button>
      </div>
    </div>
  )
}
