export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow animate-bounce-subtle">
          <span className="text-white text-2xl font-display font-bold">K</span>
        </div>

        {/* Brand name */}
        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-xl text-zinc-800">Kantin</span>
          <span className="font-display font-bold text-xl text-gradient">Ku</span>
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
