import React, { useEffect, useRef } from 'react'
import { useMarketData } from '../../hooks/useMarketData.js'
import { formatPrice, formatPercent } from '../../utils/formatters.js'
import './Ticker.css'

export default function Ticker() {
  const { symbol, setSymbol, symbols, price, change, changePct } = useMarketData()
  const prevPrice = useRef(price)
  const flashRef = useRef(null)

  useEffect(() => {
    if (!flashRef.current) return
    const dir = price > prevPrice.current ? 'up' : 'down'
    flashRef.current.classList.remove('flash-up', 'flash-down')
    void flashRef.current.offsetWidth
    flashRef.current.classList.add(`flash-${dir}`)
    prevPrice.current = price
  }, [price])

  const positive = change >= 0

  return (
    <div className="ticker-bar">
      <div className="symbol-selector">
        {symbols.map(s => (
          <button key={s} className={`sym-btn ${s === symbol ? 'active' : ''}`} onClick={() => setSymbol(s)}>{s}</button>
        ))}
      </div>
      <div className="price-display" ref={flashRef}>
        <span className="price-main">${formatPrice(price)}</span>
        <span className={`price-change ${positive ? 'pos' : 'neg'}`}>
          {positive ? '▲' : '▼'} {formatPercent(Math.abs(changePct))}
        </span>
      </div>
    </div>
  )
}
