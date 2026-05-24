import { useEffect, useState } from 'react'

export function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300) // wait for exit animation
    }, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: 'bg-white/90 border-emerald-200/60 text-emerald-800',
    error:   'bg-white/90 border-red-200/60 text-red-800',
    info:    'bg-white/90 border-blue-200/60 text-blue-800',
  }

  const iconBg = {
    success: 'bg-emerald-100 text-emerald-600',
    error:   'bg-red-100 text-red-600',
    info:    'bg-blue-100 text-blue-600',
  }

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-lift backdrop-blur-xl max-w-sm
      transition-all duration-300 ease-out
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      ${styles[type]}`}
    >
      <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${iconBg[type]}`}>
        {icons[type]}
      </span>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="text-current opacity-40 hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-black/5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

export function useToast() {
  const [toast, setToast] = useState(null)
  const show = (message, type = 'success') => setToast({ message, type })
  const hide = () => setToast(null)
  return { toast, show, hide }
}
