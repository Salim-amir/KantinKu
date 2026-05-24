import { useState } from 'react'
import authService from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import { PageHeader, Alert } from '../../components/common'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'password'

  // Profile Form
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // Password Form
  const [pwdData, setPwdData] = useState({ current_password: '', password: '', password_confirmation: '' })
  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState({ type: '', text: '' })

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg({ type: '', text: '' })
    try {
      const { data } = await authService.updateProfile(profileData)
      updateUser(data.user) // Update context state
      setProfileMsg({ type: 'success', text: data.message })
      setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000)
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Gagal update profil' })
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setPwdLoading(true)
    setPwdMsg({ type: '', text: '' })
    try {
      const { data } = await authService.updatePassword(pwdData)
      setPwdMsg({ type: 'success', text: data.message })
      setPwdData({ current_password: '', password: '', password_confirmation: '' })
      setTimeout(() => setPwdMsg({ type: '', text: '' }), 3000)
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.message || 'Gagal ubah password' })
    } finally {
      setPwdLoading(false)
    }
  }

  return (
    <div className="page-container max-w-3xl mx-auto">
      <PageHeader title="Profil Saya" subtitle="Kelola informasi akun dan kata sandi" />

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {[
          { id: 'profile', label: 'Edit Profil' },
          { id: 'password', label: 'Ganti Password' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200'
                : 'bg-white border border-zinc-200/80 text-zinc-500 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/50'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card p-6 sm:p-8 animate-fade-up">
        {activeTab === 'profile' ? (
          <form onSubmit={handleProfileUpdate} className="space-y-5">
            <h3 className="text-lg font-display font-bold text-zinc-800 mb-4">Informasi Pribadi</h3>
            
            {profileMsg.text && (
              <Alert type={profileMsg.type} message={profileMsg.text} />
            )}

            <div>
              <label className="label">Nama Lengkap</label>
              <input
                type="text"
                value={profileData.name}
                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="input"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                required
                className="input"
              />
            </div>

            <button type="submit" disabled={profileLoading} className="btn-primary w-full py-3">
              {profileLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-5" autoComplete="off">
            <h3 className="text-lg font-display font-bold text-zinc-800 mb-4">Ganti Kata Sandi</h3>

            {pwdMsg.text && (
              <Alert type={pwdMsg.type} message={pwdMsg.text} />
            )}

            <div>
              <label className="label">Kata Sandi Saat Ini</label>
              <input
                type="password"
                value={pwdData.current_password}
                onChange={e => setPwdData({ ...pwdData, current_password: e.target.value })}
                required
                autoComplete="new-password"
                className="input"
              />
            </div>
            <div>
              <label className="label">Kata Sandi Baru</label>
              <input
                type="password"
                value={pwdData.password}
                onChange={e => setPwdData({ ...pwdData, password: e.target.value })}
                required
                minLength={8}
                autoComplete="new-password"
                className="input"
              />
            </div>
            <div>
              <label className="label">Konfirmasi Kata Sandi Baru</label>
              <input
                type="password"
                value={pwdData.password_confirmation}
                onChange={e => setPwdData({ ...pwdData, password_confirmation: e.target.value })}
                required
                minLength={8}
                autoComplete="new-password"
                className="input"
              />
            </div>

            <button type="submit" disabled={pwdLoading} className="btn-primary w-full py-3">
              {pwdLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
