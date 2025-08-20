import { useEffect, useState } from 'react'

export default function TradeForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    date: '',
    ticker: '',
    side: 'long',
    qty: 100,
    entry: 0,
    exit: 0,
    fees: 0,
    notes: ''
  })

  useEffect(() => {
    if (initial) setForm(initial)
  }, [initial])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.ticker) return alert('Ticker requerido')
    onSubmit({ ...form, ticker: form.ticker.toUpperCase() })
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Fecha</label>
          <input type="date" className="mt-1 w-full" value={form.date} onChange={e=>update('date', e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Ticker</label>
          <input className="mt-1 w-full" placeholder="AAPL" value={form.ticker.toUpperCase()} onChange={e=>update('ticker', e.target.value.toUpperCase())} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-gray-500">Side</label>
          <select className="mt-1 w-full" value={form.side} onChange={e=>update('side', e.target.value)}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">Qty</label>
          <input type="number" min="1" className="mt-1 w-full" value={form.qty} onChange={e=>update('qty', Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Fees</label>
          <input type="number" step="0.01" className="mt-1 w-full" value={form.fees} onChange={e=>update('fees', Number(e.target.value))} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500">Entry</label>
          <input type="number" step="0.01" className="mt-1 w-full" value={form.entry} onChange={e=>update('entry', Number(e.target.value))} />
        </div>
        <div>
          <label className="text-xs text-gray-500">Exit</label>
          <input type="number" step="0.01" className="mt-1 w-full" value={form.exit} onChange={e=>update('exit', Number(e.target.value))} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500">Notas</label>
        <textarea rows="3" className="mt-1 w-full" placeholder="Razón de entrada/salida, emoción, setup…" value={form.notes} onChange={e=>update('notes', e.target.value)} />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancelar</button>
        <button className="btn-primary" type="submit">Guardar</button>
      </div>
    </form>
  )
}
