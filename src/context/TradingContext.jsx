import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { generateCandles, generateTick, generateOrderBook, getSymbols, getBasePrice } from '../services/marketService.js'
import { saveScore, loadPortfolio, savePortfolio } from '../services/firebase.js'
import { useAuth } from './AuthContext.jsx'

const TradingContext = createContext(null)

const STARTING_CASH = 100000

export function TradingProvider({ children }) {
  const { user } = useAuth()
  const [symbol, setSymbol] = useState('BTC')
  const [candles, setCandles] = useState([])
  const [price, setPrice] = useState(getBasePrice('BTC'))
  const [orderBook, setOrderBook] = useState({ asks: [], bids: [] })
  const [cash, setCash] = useState(STARTING_CASH)
  const [positions, setPositions] = useState({})
  const [tradeHistory, setTradeHistory] = useState([])
  const [totalPnl, setTotalPnl] = useState(0)
  const [portfolioLoaded, setPortfolioLoaded] = useState(false)
  const priceRef = useRef(price)
  const cashRef = useRef(cash)
  const positionsRef = useRef(positions)
  const tradeHistoryRef = useRef(tradeHistory)
  const totalPnlRef = useRef(totalPnl)
  const tickerRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  // Keep refs in sync
  useEffect(() => { cashRef.current = cash }, [cash])
  useEffect(() => { positionsRef.current = positions }, [positions])
  useEffect(() => { tradeHistoryRef.current = tradeHistory }, [tradeHistory])
  useEffect(() => { totalPnlRef.current = totalPnl }, [totalPnl])

  // Load portfolio when user signs in
  useEffect(() => {
    if (!user) { setPortfolioLoaded(false); return }
    loadPortfolio(user.uid).then(data => {
      if (data) {
        setCash(data.cash ?? STARTING_CASH)
        setPositions(data.positions ?? {})
        setTradeHistory(data.tradeHistory ?? [])
        setTotalPnl(data.totalPnl ?? 0)
      }
      setPortfolioLoaded(true)
    })
  }, [user])

  // Auto-save portfolio (debounced) whenever state changes
  const scheduleSave = useCallback(() => {
    if (!user || !portfolioLoaded) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      savePortfolio(user.uid, {
        cash: cashRef.current,
        positions: positionsRef.current,
        tradeHistory: tradeHistoryRef.current.slice(0, 50),
        totalPnl: totalPnlRef.current,
        updatedAt: Date.now()
      })
    }, 2000)
  }, [user, portfolioLoaded])

  useEffect(() => { scheduleSave() }, [cash, positions, tradeHistory, totalPnl])

  // Chart data
  useEffect(() => {
    const initial = generateCandles(symbol)
    setCandles(initial)
    const last = initial[initial.length - 1].close
    setPrice(last)
    priceRef.current = last
    setOrderBook(generateOrderBook(last))
  }, [symbol])

  // Live tick
  useEffect(() => {
    if (tickerRef.current) clearInterval(tickerRef.current)
    tickerRef.current = setInterval(() => {
      const newPrice = generateTick(priceRef.current)
      priceRef.current = newPrice
      setPrice(newPrice)
      setOrderBook(generateOrderBook(newPrice))
      setCandles(prev => {
        if (!prev.length) return prev
        const last = { ...prev[prev.length - 1] }
        last.close = newPrice
        last.high = Math.max(last.high, newPrice)
        last.low = Math.min(last.low, newPrice)
        return [...prev.slice(0, -1), last]
      })
    }, 1200)
    return () => clearInterval(tickerRef.current)
  }, [symbol])

  const executeTrade = useCallback((side, qty, limitPrice) => {
    const execPrice = limitPrice || priceRef.current
    const total = execPrice * qty
    if (side === 'BUY') {
      if (cashRef.current < total) return { success: false, msg: 'Insufficient funds' }
      setCash(c => c - total)
      setPositions(p => {
        const existing = p[symbol] || { qty: 0, avgCost: 0 }
        const newQty = existing.qty + qty
        const newAvg = (existing.qty * existing.avgCost + total) / newQty
        return { ...p, [symbol]: { qty: newQty, avgCost: newAvg } }
      })
    } else {
      const pos = positionsRef.current[symbol]
      if (!pos || pos.qty < qty) return { success: false, msg: 'Insufficient position' }
      const pnl = (execPrice - pos.avgCost) * qty
      setCash(c => c + total)
      setTotalPnl(t => t + pnl)
      setPositions(p => {
        const remaining = p[symbol].qty - qty
        if (remaining <= 0) { const n = { ...p }; delete n[symbol]; return n }
        return { ...p, [symbol]: { ...p[symbol], qty: remaining } }
      })
    }
    const trade = { id: Date.now(), symbol, side, qty, price: execPrice, time: new Date().toLocaleTimeString() }
    setTradeHistory(h => [trade, ...h.slice(0, 49)])
    return { success: true }
  }, [symbol])

  const submitToLeaderboard = useCallback(async () => {
    if (!user) return
    await saveScore(user.uid, user.displayName || user.email, user.photoURL, totalPnlRef.current, tradeHistoryRef.current.length)
  }, [user])

  const portfolioValue = cash + Object.entries(positions).reduce((sum, [sym, pos]) => {
    return sum + pos.qty * (sym === symbol ? priceRef.current : pos.avgCost)
  }, 0)

  return (
    <TradingContext.Provider value={{
      symbol, setSymbol, symbols: getSymbols(),
      candles, price, orderBook,
      cash, positions, tradeHistory,
      totalPnl, portfolioValue,
      executeTrade,
      submitToLeaderboard,
      startingCash: STARTING_CASH,
      portfolioLoaded
    }}>
      {children}
    </TradingContext.Provider>
  )
}

export function useTrading() {
  const ctx = useContext(TradingContext)
  if (!ctx) throw new Error('useTrading must be inside TradingProvider')
  return ctx
}