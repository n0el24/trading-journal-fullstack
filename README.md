# Trading Journal — Fullstack (React + Tailwind + Express + Prisma/SQLite)

**Listo para macOS + VS Code**

## Requisitos
- Node LTS (recomendado: usar `nvm`)
- npm

## Instrucciones rápidas

```bash
# 1) Instala dependencias
cd server && npm install && cd ../client && npm install

# 2) Prepara DB (SQLite con Prisma)
cd ../server
npx prisma db push
node prisma/seed.js

# 3) Corre backend
npm run dev
# API: http://localhost:4000/api/trades

# 4) En otra terminal, corre frontend
cd ../client
npm run dev
# Frontend: http://localhost:5173
```

> Durante desarrollo, **Vite** proxeya `/api` a `http://localhost:4000` (no hay CORS).

## Scripts útiles
Backend:
- `npm run dev` → servidor con nodemon
- `npm run start` → servidor sin nodemon
- `npm run db:push` → aplicar schema a SQLite
- `npm run seed` → sembrar datos demo

Frontend:
- `npm run dev` → Vite dev server
- `npm run build` → build de producción
- `npm run preview` → previsualizar build

¡Éxitos!
