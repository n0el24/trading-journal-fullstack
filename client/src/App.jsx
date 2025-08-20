import { useEffect, useMemo, useState } from 'react'
import Stats from './components/Stats.jsx'
import TradeForm from './components/TradeForm.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'

const API = '/api/trades' // proxied to http://localhost:4000

function Navbar({ dark, toggle, filter, setFilter }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-blue-600" />
          <span className="font-bold tracking-tight">Trading Journal</span>
          <span className="badge ml-2">React + Tailwind</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Filtrar por ticker…"
            value={filter}
            onChange={e => setFilter(e.target.value.toUpperCase())}
            className="w-56 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={toggle} className="btn-secondary">{dark ? 'Light' : 'Dark'} mode</button>
        </div>
      </div>
    </header>
  )
}

function TradeRow({ t, onEdit, onDelete }) {
  const sideColor = t.side === 'long' ? 'text-emerald-600' : 'text-rose-600'
  const pnl = ((t.exit - t.entry) * t.qty * (t.side === 'long' ? 1 : -1)) - (t.fees || 0)
  const pnlColor = pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'

  return (
    <tr className="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50/60 dark:hover:bg-gray-900/60">
      <td className="px-3 py-2 text-xs text-gray-500">{t.date || '—'}</td>
      <td className="px-3 py-2 font-semibold">{t.ticker}</td>
      <td className={`px-3 py-2 font-medium ${sideColor}`}>{t.side.toUpperCase()}</td>
      <td className="px-3 py-2 text-right">{t.qty}</td>
      <td className="px-3 py-2 text-right">${t.entry.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">${t.exit.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">${(t.fees || 0).toFixed(2)}</td>
      <td className={`px-3 py-2 text-right font-semibold ${pnlColor}`}>${pnl.toFixed(2)}</td>
      <td className="px-3 py-2 text-right">
        <div className="flex justify-end gap-1">
          <button className="btn-secondary px-3" onClick={() => onEdit(t)}>Editar</button>
          <button className="btn-primary px-3" onClick={() => onDelete(t)}>Borrar</button>
        </div>
      </td>
    </tr>
  )
}

export default function App() {
  const [dark, setDark] = useState(false)
  const [trades, setTrades] = useState([])
  const [filter, setFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState({ open: false, trade: null })

  const filtered = useMemo(() => {
    if (!filter) return trades
    return trades.filter(t => t.ticker.includes(filter))
  }, [trades, filter])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }, [filtered])

  useEffect(() => { document.documentElement.classList.toggle('dark', dark) }, [dark])

  async function load() {
    const res = await fetch(API)
    const data = await res.json()
    setTrades(data)
  }
  useEffect(() => { load() }, [])

  async function createTrade(payload) {
    const res = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function updateTrade(id, payload) {
    const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) await load()
  }

  async function deleteTrade(id) {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (res.ok) await load()
  }

  const startCreate = () => { setEditing(null); setModalOpen(true) }
  const startEdit = (t) => { setEditing(t); setModalOpen(true) }
  const askDelete = (t) => setConfirm({ open: true, trade: t })

  const handleSubmit = async (form) => {
    if (editing) await updateTrade(editing.id, form)
    else await createTrade(form)
    setModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 antialiased dark:bg-gray-950 dark:text-gray-100">
      <Navbar dark={dark} toggle={() => setDark(d => !d)} filter={filter} setFilter={setFilter} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Journal</h1>
          <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>Nuevo Trade</button>
        </div>

        <Stats trades={sorted} />

        <div className="mt-6 card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">Fecha</th>
                  <th className="px-3 py-2 text-left font-semibold">Ticker</th>
                  <th className="px-3 py-2 text-left font-semibold">Side</th>
                  <th className="px-3 py-2 text-right font-semibold">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold">Entry</th>
                  <th className="px-3 py-2 text-right font-semibold">Exit</th>
                  <th className="px-3 py-2 text-right font-semibold">Fees</th>
                  <th className="px-3 py-2 text-right font-semibold">P/L</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(t => <TradeRow key={t.id} t={t} onEdit={startEdit} onDelete={askDelete} />)}
                {sorted.length === 0 && (
                  <tr><td colSpan="9" className="px-3 py-6 text-center text-gray-500">Sin registros. Crea tu primer trade.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{editing ? 'Editar Trade' : 'Nuevo Trade'}</h3>
              <button className="btn-secondary" onClick={() => setModalOpen(false)}>Cerrar</button>
            </div>
            <TradeForm
              initial={editing || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirm.open}
        title="Eliminar trade"
        message={`¿Seguro que deseas eliminar ${confirm.trade?.ticker}? Esta acción no se puede deshacer.`}
        onCancel={() => setConfirm({ open: false, trade: null })}
        onConfirm={() => { deleteTrade(confirm.trade.id); setConfirm({ open: false, trade: null }) }}
      />
    </div>
  )
}
