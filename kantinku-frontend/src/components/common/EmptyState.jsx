export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center animate-fade-up">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 flex items-center justify-center mb-5 shadow-soft">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-lg font-display font-bold text-zinc-800 mb-1.5">{title}</h3>
      {message && <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
