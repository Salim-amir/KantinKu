import { getStatusConfig } from '../../utils/orderStatus'

export function StatusBadge({ status }) {
  const cfg = getStatusConfig(status)
  return (
    <span className={`badge ${cfg.color} gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status !== 'completed' ? 'animate-pulse-dot' : ''}`} />
      {cfg.label}
    </span>
  )
}

export function StockBadge({ stock }) {
  if (stock === 0)  return (
    <span className="badge bg-red-50 text-red-600 border border-red-100">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
      Habis
    </span>
  )
  if (stock <= 5)   return (
    <span className="badge bg-amber-50 text-amber-700 border border-amber-100">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot" />
      Sisa {stock}
    </span>
  )
  return (
    <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
      Tersedia
    </span>
  )
}
