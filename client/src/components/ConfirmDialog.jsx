export default function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card max-w-md w-full p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn-primary" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}
