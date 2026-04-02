import { useTrading } from '../context/TradingContext.jsx'

export function usePortfolio() {
  const { cash, positions, tradeHistory, totalPnl, portfolioValue, startingCash } = useTrading()
  const totalReturn = ((portfolioValue - startingCash) / startingCash) * 100
  return { cash, positions, tradeHistory, totalPnl, portfolioValue, totalReturn, startingCash }
}
