import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [errors,   setErrors]   = useState({})
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrors({})

    // Validasi frontend dulu
    if (password !== confirm) {
      setErrors({ password_confirmation: ['Password tidak cocok.'] })
      return
    }

    setLoading(true)
    try {
      await register(name, email, password, confirm)
      navigate('/login', { replace: true })
    } catch (err) {
      console.log('Register error:', err.response?.data)
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {})
      } else {
        const errorMsg = err.response?.data?.message || err.message || 'Registrasi gagal.'
        setError(`Error: ${errorMsg}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left — Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 via-emerald-600 to-emerald-700 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-32 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-teal-300/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-emerald-300/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 border border-white/10">
            <span className="text-white text-2xl font-display font-bold">K</span>
          </div>
          <h1 className="font-display text-4xl xl:text-5xl text-white font-bold leading-tight mb-4">
            Bergabung<br />dengan KantinKu.
          </h1>
          <p className="text-emerald-100/90 text-lg leading-relaxed max-w-md">
            Buat akun gratis dan mulai pesan makanan dari kantinmu.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3">
          {[
            { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, label: 'Gratis Daftar' },
            { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, label: 'Pesan Cepat' },
            { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>, label: 'Aman & Privat' },
            { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, label: 'Multi Lantai' },
          ].map(item => (
            <div key={item.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 flex items-center gap-3 border border-white/10 hover:bg-white/15 transition-colors duration-300">
              <span className="text-emerald-100">{item.icon}</span>
              <span className="text-white text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-zinc-50">
        <div className="w-full max-w-md animate-fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-glow">
              <span className="text-white text-lg font-display font-bold">K</span>
            </div>
            <span className="font-display font-bold text-xl text-zinc-800">
              Kantin<span className="text-gradient">Ku</span>
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-zinc-100/80 p-7 sm:p-8">
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-zinc-800 mb-1.5">Buat Akun</h2>
            <p className="text-zinc-500 text-sm mb-7">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                Masuk
              </Link>
            </p>

            {/* Error global */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200/60 rounded-xl text-sm text-red-700 flex items-center gap-3 animate-fade-up">
                <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Budi Santoso"
                    required
                    className="input pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.name[0]}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mahasiswa@kampus.id"
                    required
                    className="input pl-10"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.email[0]}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 8 karakter"
                    required
                    className="input pl-10"
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.password[0]}</p>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-zinc-600 mb-1.5">Konfirmasi Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Ulangi password"
                    required
                    className="input pl-10"
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><span>⚠</span> {errors.password_confirmation[0]}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 mt-2 text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Mendaftar...
                  </span>
                ) : 'Buat Akun'}
              </button>
            </form>
          </div>

          {/* Mobile-only bottom link */}
          <p className="lg:hidden text-center text-sm text-zinc-500 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}