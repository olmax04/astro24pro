// src/components/profile/tabs/SettingsTab.tsx
'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera, Loader2, Save, User } from 'lucide-react'

interface SettingsTabProps {
  user: any
}

export const SettingsTab = ({ user }: SettingsTabProps) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    patronymic: user.patronymic || '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Отправляем только базовые поля
      const payload = {
        name: formData.name,
        surname: formData.surname,
        patronymic: formData.patronymic,
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Ошибка обновления')

      router.refresh()
      alert('Личные данные обновлены!')
    } catch (err) {
      alert('Ошибка при сохранении')
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/media', { method: 'POST', body: formData })
      if (!uploadRes.ok) throw new Error('Ошибка загрузки фото')
      const mediaData = await uploadRes.json()

      await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: mediaData.doc.id }),
      })

      router.refresh()
    } catch (err) {
      alert('Не удалось обновить фото')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="text-xl font-serif text-white mb-6">Личные данные</h2>

      {/* Аватар */}
      <div className="flex items-center gap-6 pb-6 border-b border-white/5 mb-8">
        <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden relative border-2 border-slate-700">
          {user.avatar?.url ? (
            <Image src={user.avatar.url} alt="Avatar" fill className="object-cover" />
          ) : (
            <User className="w-10 h-10 text-slate-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
        </div>
        <div>
          <h3 className="text-white font-medium mb-1">Сменить фото</h3>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 border border-white/10"
          >
            <Camera size={16} />
            Загрузить
          </button>
        </div>
      </div>

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup
            label="Имя"
            value={formData.name}
            onChange={(v: string) => setFormData({ ...formData, name: v })}
          />
          <InputGroup
            label="Фамилия"
            value={formData.surname}
            onChange={(v: string) => setFormData({ ...formData, surname: v })}
          />
          <InputGroup
            label="Отчество"
            value={formData.patronymic}
            onChange={(v: string) => setFormData({ ...formData, patronymic: v })}
          />
          <div className="flex flex-col gap-2">
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="bg-slate-950/50 border border-white/5 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
            Сохранить
          </button>
        </div>
      </form>
    </div>
  )
}

const InputGroup = ({ label, value, onChange }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-sm text-slate-400">{label}</label>
    <input
      type="text"
      className="bg-slate-950 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
)
