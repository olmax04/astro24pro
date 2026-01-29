'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/payload-types' // Твои типы из Payload

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  status: 'loading' | 'loggedIn' | 'loggedOut'
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<'loading' | 'loggedIn' | 'loggedOut'>('loading')
  const router = useRouter()

  // 1. При загрузке страницы проверяем, есть ли живая сессия
  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch('/api/users/me') // Стандартный эндпоинт Payload
        const data = await res.json()
        if (data?.user) {
          setUser(data.user)
          setStatus('loggedIn')
        } else {
          setStatus('loggedOut')
        }
      } catch {
        setStatus('loggedOut')
      }
    }
    checkUser()
  }, [])

  // 2. Функция Логина
  const login = async (email: string, password: string) => {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) throw new Error('Неверный email или пароль')

    const data = await res.json()
    setUser(data.user)
    setStatus('loggedIn')
    router.push('/profile') // Редирект в личный кабинет
    router.refresh() // Обновляем серверные компоненты
  }

  // 3. Функция Логаута
  const logout = async () => {
    await fetch('/api/users/logout', { method: 'POST' })
    setUser(null)
    setStatus('loggedOut')
    router.push('/login')
    router.refresh()
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, status }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
