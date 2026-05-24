import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin, isStudent, isLoggedIn } = useAuth()
  const { count } = useCart()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    await logout()
    navigate('/login')
  }

  const isActive = (path) =>
    location.pathname === path

  const navLinkClass = (path) =>
    `relative text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg
     ${isActive(path)
       ? 'text-emerald-600 bg-emerald-50'
       : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
     }`

  const mobileNavLink = (path) =>
    `block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
     ${isActive(path)
       ? 'text-emerald-600 bg-emerald-50'
       : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
     }`

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to={isAdmin() ? '/admin' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-sm group-hover:shadow-glow transition-shadow duration-300">
                <span className="text-white font-bold text-sm">K</span>
              </div>
              <span className="font-display font-bold text-lg text-zinc-800">
                Kantin<span className="text-gradient">Ku</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-1">
              {isLoggedIn() && isStudent() && (
                <>
                  <Link to="/"       className={navLinkClass('/')}>Produk</Link>
                  <Link to="/orders" className={navLinkClass('/orders')}>Pesanan</Link>
                </>
              )}
              {isLoggedIn() && isAdmin() && (
                <>
                  <Link to="/admin"          className={navLinkClass('/admin')}>Dashboard</Link>
                  <Link to="/admin/floors"   className={navLinkClass('/admin/floors')}>Lantai</Link>
                  <Link to="/admin/products" className={navLinkClass('/admin/products')}>Produk</Link>
                  <Link to="/admin/stock"    className={navLinkClass('/admin/stock')}>Stok</Link>
                  <Link to="/admin/orders"   className={navLinkClass('/admin/orders')}>Pesanan</Link>
                </>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Cart badge - desktop */}
              {isLoggedIn() && isStudent() && (
                <Link to="/cart" className="relative p-2.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  {count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm animate-scale-in">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </Link>
              )}

              {/* User area - desktop */}
              {isLoggedIn() ? (
                <div className="hidden md:flex items-center gap-2">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-zinc-700 max-w-[120px] truncate">{user?.name}</span>
                  </div>
                  <Link to="/profile" className="text-sm text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl transition-all duration-200 font-medium">
                    Profil
                  </Link>
                  <button onClick={() => setShowLogoutConfirm(true)}
                    className="text-sm text-zinc-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl transition-all duration-200 font-medium">
                    Keluar
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login"    className="text-sm text-zinc-600 hover:text-zinc-900 px-4 py-2 rounded-xl transition-all duration-200 font-medium">Masuk</Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2">Daftar</Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />

          {/* Drawer */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-zinc-100 shadow-lift animate-slide-down">
            {/* Header */}
            <div className="flex items-center justify-between px-4 h-16 border-b border-zinc-100/50">
              <Link to={isAdmin() ? '/admin' : '/'} className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="font-display font-bold text-lg text-zinc-800">
                  Kantin<span className="text-gradient">Ku</span>
                </span>
              </Link>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-zinc-500 hover:text-zinc-900 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="p-3 space-y-1">
              {isLoggedIn() && isStudent() && (
                <>
                  <Link to="/"       className={mobileNavLink('/')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>Produk</Link>
                  <Link to="/orders" className={mobileNavLink('/orders')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Pesanan</Link>
                </>
              )}
              {isLoggedIn() && isAdmin() && (
                <>
                  <Link to="/admin"          className={mobileNavLink('/admin')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>Dashboard</Link>
                  <Link to="/admin/floors"   className={mobileNavLink('/admin/floors')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>Lantai</Link>
                  <Link to="/admin/products" className={mobileNavLink('/admin/products')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>Produk</Link>
                  <Link to="/admin/stock"    className={mobileNavLink('/admin/stock')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>Stok</Link>
                  <Link to="/admin/orders"   className={mobileNavLink('/admin/orders')} onClick={() => setMobileOpen(false)}><svg className="w-5 h-5 mr-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Pesanan</Link>
                </>
              )}
            </nav>

            {/* User info in mobile */}
            {isLoggedIn() && (
              <div className="p-3 border-t border-zinc-100/50">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-zinc-800 truncate">{user?.name}</p>
                    <p className="text-xs text-zinc-400 capitalize">{user?.role}</p>
                  </div>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
                    Profil
                  </Link>
                  <button onClick={() => { setShowLogoutConfirm(true); setMobileOpen(false) }}
                    className="text-xs text-red-500 hover:text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                    Keluar
                  </button>
                </div>
              </div>
            )}

            {!isLoggedIn() && (
              <div className="p-3 border-t border-zinc-100/50 flex gap-2">
                <Link to="/login" className="btn-ghost flex-1 justify-center" onClick={() => setMobileOpen(false)}>Masuk</Link>
                <Link to="/register" className="btn-primary flex-1 justify-center" onClick={() => setMobileOpen(false)}>Daftar</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lift w-full max-w-sm p-6 sm:p-7 animate-scale-in text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl text-zinc-800 mb-2">Keluar dari KantinKu?</h3>
            <p className="text-zinc-500 text-sm mb-8">
              Sesi Anda akan diakhiri dan Anda harus masuk kembali untuk membuat pesanan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-200"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 shadow-sm hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}