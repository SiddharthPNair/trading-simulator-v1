import React, { useMemo } from 'react'
import { useMarketData } from '../../hooks/useMarketData.js'
import { formatPrice } from '../../utils/formatters.js'
import './OrderBook.css'

export default function OrderBook() {
  const { orderBook, price } = useMarketData()
  const maxSize = useMemo(() => {
    const all = [...(orderBook.asks || []), ...(orderBook.bids || [])]
    return Math.max(...all.map(o => o.size), 1)
  }, [orderBook])

  return (
    <div className="order-book">
      <div className="ob-header">ORDER BOOK</div>
      <div className="ob-cols">
        <span className="ob-col-label">PRICE</span>
        <span className="ob-col-label right">SIZE</span>
      </div>
      <div className="ob-asks">
        {[...(orderBook.asks || [])].reverse().map((ask, i) => (
          <div key={i} className="ob-row ask">
            <div className="ob-bar ask-bar" style={{ width: `${(ask.size / maxSize) * 100}%` }} />
            <span className="ob-price ask-price">{formatPrice(ask.price)}</span>
            <span className="ob-size">{ask.size.toFixed(3)}</span>
          </div>
        ))}
      </div>
      <div className="ob-spread">
        <span className="spread-price">${formatPrice(price)}</span>
        <span className="spread-label">LAST</span>
      </div>
      <div className="ob-bids">
        {(orderBook.bids || []).map((bid, i) => (
          <div key={i} className="ob-row bid">
            <div className="ob-bar bid-bar" style={{ width: `${(bid.size / maxSize) * 100}%` }} />
            <span className="ob-price bid-price">{formatPrice(bid.price)}</span>
            <span className="ob-size">{bid.size.toFixed(3)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
