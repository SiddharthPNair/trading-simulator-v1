import React from 'react'
import Ticker from '../components/Ticker/Ticker.jsx'
import CandlestickChart from '../components/Chart/CandlestickChart.jsx'
import OrderBook from '../components/OrderBook/OrderBook.jsx'
import TradePanel from '../components/TradePanel/TradePanel.jsx'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Ticker />
      <div className="dashboard-body">
        <div className="main-col">
          <div className="chart-area">
            <CandlestickChart />
          </div>
        </div>
        <div className="side-col">
          <div className="orderbook-area">
            <OrderBook />
          </div>
          <div className="tradepanel-area">
            <TradePanel />
          </div>
        </div>
      </div>
    </div>
  )
}