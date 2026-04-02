import React, { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'
import { useMarketData } from '../../hooks/useMarketData.js'
import './Chart.css'

export default function CandlestickChart() {
  const { candles, symbol } = useMarketData()
  const containerRef = useRef(null)
  const chartRef = useRef(null)
  const seriesRef = useRef(null)
  const volSeriesRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const chart = createChart(containerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#8b949e' },
      grid: { vertLines: { color: '#161b22' }, horzLines: { color: '#161b22' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#21262d' },
      timeScale: { borderColor: '#21262d', timeVisible: true },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
    })
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#00ff88', downColor: '#ff4560',
      borderUpColor: '#00ff88', borderDownColor: '#ff4560',
      wickUpColor: '#00c96a', wickDownColor: '#d63251',
    })
    const volSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'vol',
      color: '#58a6ff33',
    })
    chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } })
    chartRef.current = chart
    seriesRef.current = candleSeries
    volSeriesRef.current = volSeries

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)
    return () => { ro.disconnect(); chart.remove() }
  }, [])

  useEffect(() => {
    if (!seriesRef.current || !candles.length) return
    seriesRef.current.setData(candles)
    volSeriesRef.current.setData(candles.map(c => ({ time: c.time, value: c.volume, color: c.close >= c.open ? '#00ff8833' : '#ff456033' })))
    chartRef.current.timeScale().fitContent()
  }, [candles, symbol])

  return <div className="chart-container" ref={containerRef} />
}
