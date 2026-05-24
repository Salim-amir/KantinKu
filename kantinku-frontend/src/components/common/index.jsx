// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', loading = false, className = '', ...props }) {
  const base = variant === 'primary' ? 'btn-primary'
             : variant === 'secondary' ? 'btn-secondary'
             : 'btn-ghost'
  return (
    <button className={`${base} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const badgeColors = {
  orange: 'bg-amber-50 text-amber-700 border border-amber-100',
  green:  'bg-emerald-50 text-emerald-700 border border-emerald-100',
  blue:   'bg-blue-50 text-blue-700 border border-blue-100',
  purple: 'bg-purple-50 text-purple-700 border border-purple-100',
  gray:   'bg-zinc-50 text-zinc-600 border border-zinc-100',
  red:    'bg-red-50 text-red-700 border border-red-100',
}

export function Badge({ children, color = 'gray', className = '' }) {
  return (
    <span className={`badge ${badgeColors[color]} ${className}`}>
      {children}
    </span>
  )
}

// ─── OrderStatusBadge ─────────────────────────────────────────────────────────
const statusMap = {
  pending:         { label: 'Menunggu Bayar',   color: 'orange', dot: 'bg-amber-400'   },
  paid:            { label: 'Lunas',            color: 'blue',   dot: 'bg-blue-400'    },
  preparing:       { label: 'Disiapkan',        color: 'purple', dot: 'bg-purple-400'  },
  ready_for_pickup:{ label: 'Siap Diambil',     color: 'green',  dot: 'bg-emerald-400' },
  completed:       { label: 'Selesai',          color: 'gray',   dot: 'bg-zinc-400'    },
}

export function OrderStatusBadge({ status }) {
  const cfg = statusMap[status] ?? { label: status, color: 'gray', dot: 'bg-zinc-400' }
  return (
    <Badge color={cfg.color}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status !== 'completed' ? 'animate-pulse-dot' : ''}`} />
      {cfg.label}
    </Badge>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-300 focus:ring-red-400/40 focus:border-red-300' : ''} ${className}`} {...props} />
      {error && <p className="text-xs text-red-500 font-medium flex items-center gap-1"><span>⚠</span> {error}</p>}
    </div>
  )
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 'md' }) {
  const s = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
  return (
    <div className={`${s} relative`}>
      <div className={`${s} rounded-full border-2 border-zinc-200 absolute inset-0`} />
      <div className={`${s} rounded-full border-2 border-transparent border-t-emerald-500 animate-spin absolute inset-0`} />
    </div>
  )
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-up">
      {icon && (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-100 flex items-center justify-center mb-5 shadow-soft">
          <span className="text-4xl">{icon}</span>
        </div>
      )}
      <h3 className="font-display font-bold text-zinc-800 text-lg mb-1.5">{title}</h3>
      {description && <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'error', message }) {
  if (!message) return null
  const styles = {
    error:   'bg-red-50 border-red-200/60 text-red-700',
    success: 'bg-emerald-50 border-emerald-200/60 text-emerald-700',
    info:    'bg-blue-50 border-blue-200/60 text-blue-700',
  }
  const icons = {
    error:   '✕',
    success: '✓',
    info:    'ℹ',
  }
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium flex items-center gap-3 animate-fade-up ${styles[type]}`}>
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
        ${type === 'error' ? 'bg-red-100 text-red-600' : type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
        {icons[type]}
      </span>
      {message}
    </div>
  )
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 animate-fade-up">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-zinc-800 tracking-tight">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}

// ─── formatCurrency ──────────────────────────────────────────────────────────
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// ─── Pagination ──────────────────────────────────────────────────────────────
export { default as Pagination } from './Pagination'
