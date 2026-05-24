import { useEffect, useState } from 'react'
import productService from '../../services/productService'
import cartService from '../../services/cartService'
import { useCart } from '../../context/CartContext'
import { Pagination } from '../../components/common'

export default function HomePage() {
  const { fetchCart } = useCart()
  const [floors,          setFloors]          = useState([])
  const [activeFloorId,   setActiveFloorId]   = useState(null)
  const [products,        setProducts]        = useState([])
  const [loadingFloors,   setLoadingFloors]   = useState(true)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [addingId,        setAddingId]        = useState(null)
  const [successMsg,      setSuccessMsg]      = useState('')
  const [errorMsg,        setErrorMsg]        = useState('')
  const [page,            setPage]            = useState(1)
  const [meta,            setMeta]            = useState(null)
  const [search,          setSearch]          = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset page when search changes
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    productService.getFloors()
      .then(({ data }) => {
        setFloors(data.data ?? [])
        if (data.data?.length > 0) setActiveFloorId(data.data[0].id)
      })
      .finally(() => setLoadingFloors(false))
  }, [])

  useEffect(() => {
    if (!activeFloorId) return
    setLoadingProducts(true)
    productService.getByFloor(activeFloorId, page, debouncedSearch)
      .then(({ data }) => {
        setProducts(data.products?.data ?? [])
        setMeta(data.products)
      })
      .catch(() => {
        setProducts([])
        setMeta(null)
      })
      .finally(() => setLoadingProducts(false))
  }, [activeFloorId, page, debouncedSearch])

  const handleFloorChange = (id) => {
    setActiveFloorId(id)
    setPage(1)
  }

  const handleAddToCart = async (product) => {
    setAddingId(product.id)
    setSuccessMsg('')
    setErrorMsg('')
    try {
      await cartService.addItem({ product_id: product.id, floor_id: activeFloorId, quantity: 1 })
      setSuccessMsg(`${product.name} ditambahkan ke keranjang!`)
      await fetchCart()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message ?? 'Gagal menambahkan produk.')
      setTimeout(() => setErrorMsg(''), 3000)
    } finally {
      setAddingId(null)
    }
  }

  if (loadingFloors) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-200 absolute inset-0" />
            <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-emerald-500 animate-spin absolute inset-0" />
          </div>
          <p className="text-sm text-zinc-400 font-medium">Memuat menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-800">
          Menu <span className="text-gradient">Kantin</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1.5">Pilih lantai, pesan, dan ambil tanpa antri</p>
      </div>

      {/* Floor tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide animate-fade-up delay-100">
        {floors.map((floor) => (
          <button
            key={floor.id}
            onClick={() => handleFloorChange(floor.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeFloorId === floor.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200'
                : 'bg-white text-zinc-500 border border-zinc-200/80 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
          >
            {floor.name}
          </button>
        ))}
      </div>


      {/* Feedback toasts */}
      {successMsg && (
        <div className="mb-5 px-4 py-3.5 bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-sm rounded-xl flex items-center gap-3 animate-fade-up font-medium">
          <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
          {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="mb-5 px-4 py-3.5 bg-red-50 border border-red-200/60 text-red-700 text-sm rounded-xl flex items-center gap-3 animate-fade-up font-medium">
          <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold flex-shrink-0">✕</span>
          {errorMsg}
        </div>
      )}

      {/* Main Content Area */}
      {(() => {
        const activeFloor = floors.find(f => f.id === activeFloorId)
        const isFloorActive = activeFloor?.is_active ?? true

        if (!isFloorActive) {
          return (
            <div className="flex flex-col items-center py-20 text-center animate-fade-up">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200/50 flex items-center justify-center mb-5 shadow-soft">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="font-display font-bold text-zinc-800 text-lg mb-1.5">Kantin sedang tutup</p>
              <p className="text-zinc-500 text-sm">Mohon maaf, lantai ini sedang tidak melayani pesanan.</p>
            </div>
          )
        }

        return (
          <>
            {/* Search Input */}
            <div className="mb-6 animate-fade-up delay-150">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-zinc-200/80 rounded-xl px-4 py-2.5 pl-10 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
                />
                <svg className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loadingProducts ? (
        /* Skeleton loading cards */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100/80 overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <div className="aspect-square skeleton-card rounded-none" />
              <div className="p-3.5 space-y-2.5">
                <div className="skeleton-text w-3/4" />
                <div className="skeleton-text w-1/2 h-3" />
                <div className="skeleton-text w-1/3 h-5 mt-3" />
                <div className="skeleton h-9 mt-3 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center animate-fade-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 border border-zinc-200/50 flex items-center justify-center mb-5 shadow-soft">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="font-display font-bold text-zinc-800 text-lg mb-1.5">Belum ada produk</p>
          <p className="text-zinc-500 text-sm">Lantai ini belum memiliki produk tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product, idx) => {
            const outOfStock = product.stock === 0
            return (
              <div key={product.id}
                className="group bg-white rounded-2xl border border-zinc-100/80 shadow-soft overflow-hidden
                           hover:shadow-lift hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col
                           animate-fade-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Image */}
                <div className="aspect-square bg-zinc-50 flex items-center justify-center relative overflow-hidden">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name}
                         className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="text-zinc-300 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Stock badge */}
                  <span className={`absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm
                    ${outOfStock ? 'bg-red-500/90 text-white'
                      : product.stock <= 3 ? 'bg-amber-500/90 text-white'
                      : 'bg-emerald-500/90 text-white'}`}>
                    {outOfStock ? 'Habis' : `Sisa ${product.stock}`}
                  </span>
                  {/* Category chip */}
                  <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/40 backdrop-blur-sm text-white text-[10px] font-medium capitalize">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3.5 flex flex-col flex-1">
                  <p className="font-semibold text-sm text-zinc-800 line-clamp-2 leading-snug">{product.name}</p>
                  <p className="font-display font-bold text-emerald-600 text-sm mt-2 mb-3">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={outOfStock || addingId === product.id}
                    className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 mt-auto
                      ${outOfStock
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm hover:shadow-glow active:scale-[0.97]'
                      }`}
                  >
                    {addingId === product.id ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Menambahkan...
                      </span>
                    ) : outOfStock ? 'Stok Habis' : '+ Keranjang'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
            {!loadingProducts && products.length > 0 && (
              <Pagination meta={meta} onPageChange={setPage} />
            )}
          </>
        )
      })()}
    </div>
  )
}