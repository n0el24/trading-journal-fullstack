export default function Stats({ trades }) {
  const totals = trades.reduce((acc, t) => {
    const side = t.side === 'long' ? 1 : -1
    const pnl = (t.exit - t.entry) * t.qty * side - (t.fees || 0)
    acc.pnl += pnl
    if (pnl >= 0) { acc.wins += 1; acc.grossWin += pnl } else { acc.losses += 1; acc.grossLoss += Math.abs(pnl) }
    return acc
  }, { pnl: 0, wins: 0, losses: 0, grossWin: 0, grossLoss: 0 })

  const total = trades.length || 1
  const winRate = ((totals.wins / total) * 100).toFixed(1)
  const avg = (totals.pnl / (trades.length || 1)).toFixed(2)
  const pf = totals.grossLoss > 0 ? (totals.grossWin / totals.grossLoss).toFixed(2) : '∞'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
      <div className="card p-4">
        <div className="text-xs text-gray-500">Total Trades</div>
        <div className="text-xl font-bold">{trades.length}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-gray-500">Win Rate</div>
        <div className="text-xl font-bold">{winRate}%</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-gray-500">Profit Factor</div>
        <div className="text-xl font-bold">{pf}</div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-gray-500">Avg P/L</div>
        <div className="text-xl font-bold">${avg}</div>
      </div>
    </div>
  )
}
