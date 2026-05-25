import { useEffect, useState } from 'react'
import adminService from '../../services/adminService'
import { Spinner, EmptyState, Alert, Button, PageHeader } from '../../components/common'

const EMPTY_FORM = { name: '', description: '', is_active: true, qris_image: null }

export default function AdminFloorsPage() {
  const [floors, setFloors] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing,  setEditing]  = useState(null)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const loadFloors = () => {
    setLoading(true)
    adminService.getFloors()
      .then(({ data }) => setFloors(data.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadFloors() }, [])

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setShowForm(true); setError('') }
  const openEdit   = (f)  => {
    setEditing(f)
    setForm({ name: f.name, description: f.description ?? '', is_active: f.is_active, qris_image: null })
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
    fd.append('is_active',   form.is_active ? '1' : '0')
    if (form.qris_image instanceof File) {
      fd.append('qris_image', form.qris_image)
    }

    try {
      if (editing) {
        await adminService.updateFloor(editing.id, fd)
        setSuccess('Lantai berhasil diperbarui.')
      } else {
        await adminService.createFloor(fd)
        setSuccess('Lantai berhasil ditambahkan.')
      }
      setShowForm(false)
      loadFloors()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Gagal menyimpan lantai.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await adminService.deleteFloor(confirmDelete.id)
      setSuccess('Lantai berhasil dihapus.')
      loadFloors()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Gagal menghapus lantai.')
    } finally {
      setConfirmDelete(null)
    }
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
        title="Kelola Lantai / Kantin"
        subtitle={`${floors.length} lantai`}
        action={<Button onClick={openCreate}>+ Tambah Lantai</Button>}
      />

      {success && <div className="mb-4"><Alert type="success" message={success} /></div>}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lift w-full max-w-md p-6 sm:p-7 animate-scale-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-bold text-lg text-zinc-800">
                {editing ? 'Edit Lantai' : 'Tambah Lantai'}
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
                { label: 'Nama Lantai', name: 'name', type: 'text', required: true, placeholder: 'Contoh: Lantai 2' },
                { label: 'Deskripsi',   name: 'description', type: 'text', placeholder: 'Lokasi kantin' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="label">{f.label}</label>
                  <input name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                         required={f.required} placeholder={f.placeholder}
                         className="input" />
                </div>
              ))}
              <div>
                <label className="label">Gambar Kode QRIS (Opsional)</label>
                <div className="relative">
                  <input name="qris_image" type="file" accept="image/*" onChange={handleChange}
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
                <span className="text-sm font-medium text-zinc-600">Lantai Aktif</span>
              </label>
              <div className="flex gap-2.5 pt-2">
                <Button type="submit" loading={saving} className="flex-1">Simpan</Button>
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)} className="flex-1">Batal</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-lift w-full max-w-sm p-6 sm:p-7 animate-scale-in text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-lg text-zinc-800 mb-2">Hapus Lantai?</h3>
            <p className="text-sm text-zinc-500 mb-6">
              Apakah Anda yakin ingin menghapus <span className="font-bold text-zinc-700">{confirmDelete.name}</span>? Semua produk di lantai ini juga akan terhapus dari lantai ini.
            </p>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setConfirmDelete(null)} className="flex-1">Batal</Button>
              <Button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 border-transparent text-white">Hapus</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {floors.length === 0 ? (
        <EmptyState 
          icon={<svg className="w-12 h-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>} 
          title="Belum ada lantai" action={<Button onClick={openCreate}>+ Tambah Lantai</Button>} />
      ) : (
        <div className="card overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50/80 border-b border-zinc-100">
                <tr>
                  {['Lantai', 'Deskripsi', 'QRIS', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {floors.map((f) => (
                  <tr key={f.id} className="hover:bg-zinc-50/50 transition-colors duration-200">
                    <td className="px-5 py-4 font-medium text-zinc-800">{f.name}</td>
                    <td className="px-5 py-4 text-zinc-500">{f.description ?? '—'}</td>
                    <td className="px-5 py-4 text-zinc-500">
                      {f.qris_image_url ? (
                         <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">Terupload</span>
                      ) : (
                         <span className="text-xs bg-zinc-100 text-zinc-500 px-2 py-1 rounded-full font-bold">Belum Ada</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${f.is_active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-zinc-50 text-zinc-500 border border-zinc-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${f.is_active ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
                        {f.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(f)}
                          className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200">
                          Edit
                        </button>
                        <button onClick={() => setConfirmDelete(f)}
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
    </div>
  )
}
