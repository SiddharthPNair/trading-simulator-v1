export function formatPrice(n, decimals = 2) {
  if (n === undefined || n === null) return '—'
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

export function formatPnl(n) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}$${formatPrice(Math.abs(n))}`
}

export function formatPercent(n) {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

export function formatVolume(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}