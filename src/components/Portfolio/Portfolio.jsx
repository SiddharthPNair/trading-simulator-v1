import React from 'react'
import { useTrading } from '../../context/TradingContext.jsx'
import { formatPrice, formatPnl, formatPercent } from '../../utils/formatters.js'
import './Portfolio.css'

export default function Portfolio() {
  const { cash, positions, tradeHistory, totalPnl, portfolioValue, startingCash, price, symbol } = useTrading()
  const totalReturn = ((portfolioValue - startingCash) / startingCash) * 100

  return (
    <div className="portfolio">
      <div className="portfolio-summary">
        <div className="pf-stat">
          <span className="pf-stat-label">PORTFOLIO VALUE</span>
          <span className="pf-stat-value display">${formatPrice(portfolioValue)}</span>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-label">CASH</span>
          <span className="pf-stat-value">${formatPrice(cash)}</span>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-label">TOTAL P&L</span>
          <span className={`pf-stat-value ${totalPnl >= 0 ? 'pos' : 'neg'}`}>{formatPnl(totalPnl)}</span>
        </div>
        <div className="pf-stat">
          <span className="pf-stat-label">RETURN</span>
          <span className={`pf-stat-value ${totalReturn >= 0 ? 'pos' : 'neg'}`}>{formatPercent(totalReturn)}</span>
        </div>
      </div>

      <div className="pf-section-title">OPEN POSITIONS</div>
      <div className="positions-list">
        {Object.keys(positions).length === 0
          ? <div className="empty-msg">No open positions</div>
          : Object.entries(positions).map(([sym, pos]) => {
              const currentPrice = sym === symbol ? price : pos.avgCost
              const unrealized = (currentPrice - pos.avgCost) * pos.qty
              return (
                <div key={sym} className="position-row">
                  <span className="pos-symbol">{sym}</span>
                  <span className="pos-qty">{pos.qty.toFixed(3)}</span>
                  <span className="pos-avg">${formatPrice(pos.avgCost)}</span>
                  <span className={`pos-pnl ${unrealized >= 0 ? 'pos' : 'neg'}`}>{formatPnl(unrealized)}</span>
                </div>
              )
            })
        }
      </div>

      <div className="pf-section-title">TRADE HISTORY</div>
      <div className="trade-history">
        {tradeHistory.length === 0
          ? <div className="empty-msg">No trades yet</div>
          : tradeHistory.map(t => (
              <div key={t.id} className="trade-row">
                <span className={`trade-side ${t.side === 'BUY' ? 'buy' : 'sell'}`}>{t.side}</span>
                <span className="trade-sym">{t.symbol}</span>
                <span className="trade-qty">{t.qty}</span>
                <span className="trade-price">${formatPrice(t.price)}</span>
                <span className="trade-time">{t.time}</span>
              </div>
            ))
        }
      </div>
    </div>
  )
}
