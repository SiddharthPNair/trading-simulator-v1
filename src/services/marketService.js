const SYMBOLS = ['BTC', 'ETH', 'SOL', 'AAPL', 'TSLA', 'NVDA', 'SPY', 'AMZN']

const BASE_PRICES = {
  BTC: 67400, ETH: 3520, SOL: 178, AAPL: 189.5,
  TSLA: 172.3, NVDA: 875, SPY: 521, AMZN: 185.2
}

export function getSymbols() { return SYMBOLS }

export function getBasePrice(symbol) { return BASE_PRICES[symbol] || 100 }

export function generateCandles(symbol, count = 120) {
  let price = BASE_PRICES[symbol] || 100
  const candles = []
  const now = Math.floor(Date.now() / 1000)
  const interval = 60 * 5 // 5 min

  for (let i = count; i >= 0; i--) {
    const volatility = price * 0.008
    const open = price
    const change = (Math.random() - 0.49) * volatility * 2
    const close = open + change
    const high = Math.max(open, close) + Math.random() * volatility
    const low = Math.min(open, close) - Math.random() * volatility
    const volume = Math.floor(Math.random() * 10000 + 2000)
    candles.push({
      time: now - i * interval,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume
    })
    price = close
  }
  return candles
}

export function generateTick(lastPrice) {
  const change = (Math.random() - 0.49) * lastPrice * 0.003
  return parseFloat((lastPrice + change).toFixed(2))
}

export function generateOrderBook(price) {
  const asks = [], bids = []
  for (let i = 1; i <= 12; i++) {
    asks.push({ price: parseFloat((price + i * 0.08).toFixed(2)), size: parseFloat((Math.random() * 5 + 0.1).toFixed(3)) })
    bids.push({ price: parseFloat((price - i * 0.08).toFixed(2)), size: parseFloat((Math.random() * 5 + 0.1).toFixed(3)) })
  }
  return { asks, bids }
}
