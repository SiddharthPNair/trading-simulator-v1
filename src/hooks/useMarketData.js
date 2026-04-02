import { useTrading } from '../context/TradingContext.jsx'

export function useMarketData() {
  const { symbol, candles, price, orderBook, setSymbol, symbols } = useTrading()
  const prevClose = candles.length > 1 ? candles[candles.length - 2]?.close : price
  const change = price - prevClose
  const changePct = prevClose ? (change / prevClose) * 100 : 0
  return { symbol, candles, price, orderBook, setSymbol, symbols, change, changePct }
}
