import { useEffect, useState } from 'react'
import adminService from '../../services/adminService'
import { formatCurrency, Spinner, EmptyState, Alert, Button, PageHeader, Pagination } from '../../components/common'

const EMPTY_FORM = { name: '', description: '', price: '', category: '', is_active: true, image: null }

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null) // product object being edited
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [page,     setPage]     = useState(1)
  const [meta,     setMeta]     = useState(null)

  const loadProducts = (pageNum = page) => {
    setLoading(true)
    adminService.getProducts(pageNum)
      .then(({ data }) => {
        setProducts(data.data ?? [])
        setMeta(data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadProducts(page) }, [page])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); setError('') }
  const openEdit   = (p)  => {
    setEditing(p)
    setForm({ name: p.name, description: p.description ?? '', price: p.price, category: p.category ?? '', is_active: p.is_active, image: null })
    setShowForm(true)
    setError('')
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setSaving(true)
  setError('')

  const fd = new FormData()
  fd.append('name',        form.name)
  fd.append('description', form.description ?? '')
  fd.append('price',       form.price)
  fd.append('category',    form.category ?? '')
  fd.append('is_active',   form.is_active ? '1' : '0')
  if (form.image instanceof File) {
    fd.append('image', form.image)
  }

  try {
    if (editing) {
      await adminService.updateProduct(editing.id, fd)
      setSuccess('Produk berhasil diperbarui.')
    } else {
      await adminService.createProduct(fd)
      setSuccess('Produk berhasil ditambahkan.')
    }
    setShowForm(false)
    loadProducts()
    setTimeout(() => setSuccess(''), 3000)
  } catch (err) {
    setError(err.response?.data?.message ?? 'Gagal menyimpan produk.')
  } finally {
    setSaving(false)
  }
}

  const handleDelete = async (id) => {
    if (!confirm('Hapus produk ini?')) return
    await adminService.deleteProduct(id)
    loadProducts()
  }

  if (loading) return (
    <div className="page-container">
      <div className="mb-8">
        <div className="skeleton-text w-48 h-8 mb-2" />
        <div className="skeleton-text w-24 h-4" />
      </div>
      <div className="skeleton-card h-96 rounded-2xl" />
    </div>
  )

  return (
    <div className="page-container">
      <PageHeader
        title="Kelola Produk"
        subtitle={`${products.length} produk`}
        action={<Button onClick={openCreate}>+ Tambah Produk</Button>}
      />

      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lift w-full max-w-md p-6 sm:p-7 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-zinc-800">
                {editing ? 'Edit Produk' : 'Tambah Produk'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert type="error" message={error} />}
              {[
                { label: 'Nama Produk', name: 'name', type: 'text', required: true },
                { label: 'Deskripsi',   name: 'description', type: 'text' },
                { label: 'Harga (Rp)', name: 'price', type: 'number', required: true },
                { label: 'Kategori',   name: 'category', type: 'text', placeholder: 'snack / minuman / makanan' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                         required={f.required} placeholder={f.placeholder}
                         className="input" />
                </div>
              ))}
              <div>
                <label className="label">Gambar Produk</label>
                <div className="relative">
                  <input name="image" type="file" accept="image/*" onChange={handleChange}
                    className="input py-2 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 file:cursor-pointer file:transition-colors" />
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
                  ${form.is_active ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-300 group-hover:border-emerald-300'}`}>
                  {form.is_active && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} className="hidden" />
                <span className="text-sm font-medium text-zinc-600">Produk Aktif</span>
              </label>
              <div className="flex gap-2.5 pt-2">
                <Button type="submit" loading={saving} className="flex-1">Simpan</Button>
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product table */}
      {products.length === 0 ? (
        <EmptyState 
          icon={<svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>} 
          title="Belum ada produk" action={<Button onClick={openCreate}>+ Tambah Produk</Button>} />
      ) : (
        <div className="card overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50/80 border-b border-zinc-100">
                <tr>
                  {['Produk', 'Kategori', 'Harga', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors duration-200">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100/50 flex items-center justify-center text-zinc-300 flex-shrink-0 overflow-hidden">
                          {p.image_url ? <img src={p.image_url} className="w-full h-full object-contain p-1 rounded-xl" alt="" /> : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                        </div>
                        <span className="font-medium text-zinc-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-zinc-500 capitalize">{p.category ?? '—'}</td>
                    <td className="px-5 py-4 font-display font-semibold text-emerald-600">{formatCurrency(p.price)}</td>
                    <td className="px-5 py-4">
                      <span className={`badge ${p.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-zinc-50 text-zinc-500 border border-zinc-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(p)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && products.length > 0 && (
        <Pagination meta={meta} onPageChange={setPage} />
      )}
    </div>
  )
}
