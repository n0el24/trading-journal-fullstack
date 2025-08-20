const express = require('express')
const cors = require('cors')
const { PrismaClient } = require('@prisma/client')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// List all trades
app.get('/api/trades', async (req, res) => {
  const trades = await prisma.trade.findMany({ orderBy: { id: 'desc' } })
  res.json(trades)
})

// Create trade
app.post('/api/trades', async (req, res) => {
  try {
    const data = req.body
    const created = await prisma.trade.create({ data })
    res.status(201).json(created)
  } catch (e) {
    console.error(e)
    res.status(400).json({ error: 'Invalid payload' })
  }
})

// Update trade
app.put('/api/trades/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    const updated = await prisma.trade.update({ where: { id }, data: req.body })
    res.json(updated)
  } catch (e) {
    res.status(404).json({ error: 'Not found' })
  }
})

// Delete trade
app.delete('/api/trades/:id', async (req, res) => {
  const id = Number(req.params.id)
  try {
    await prisma.trade.delete({ where: { id } })
    res.status(204).end()
  } catch (e) {
    res.status(404).json({ error: 'Not found' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API ✅ http://localhost:${PORT}`))
