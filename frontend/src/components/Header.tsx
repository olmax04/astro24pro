'use client'

import Link from 'next/link'
import Image from 'next/image' // Импортируем компонент картинки
import { useState } from 'react'
import { Menu, X, User, Globe, Loader2 } from 'lucide-react'
import { useAuth } from './providers/AuthProvider'

// Твои ссылки
const navLinks = [
  { name: 'Специалисты', href: '/specialists' },
  { name: 'Магазин', href: '/shop' },
  { name: 'Школа', href: '/school' },
  { name: 'Блог', href: '/news' },
  { name: 'О нас', href: '/about' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, status } = useAuth()

  // --- Хелперы для данных юзера ---

  // 1. Безопасное получение имени (если имени нет, пишем "Странник")
  // В Payload типы могут быть any, поэтому лучше проверить
  const userName = user?.name || user?.email?.split('@')[0] || 'Странник'

  // 2. Безопасное получение URL аватарки
  // В Payload upload-поле может быть ID (строка) или объектом. Нам нужен объект.
  const avatarUrl =
    user?.avatar && typeof user.avatar === 'object' && 'url' in user.avatar
      ? (user.avatar.url as string)
      : null

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Логотип */}
        <Link
          href="/"
          className="text-2xl font-serif font-bold text-indigo-400 tracking-widest uppercase hover:text-indigo-300 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          ASTRA
        </Link>

        {/* --- ДЕСКТОП --- */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-amber-200 uppercase tracking-wider transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="w-px h-6 bg-white/10"></div>

          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white transition-colors">
              <Globe size={20} strokeWidth={1.5} />
            </button>

            {/* Логика Авторизации */}
            {status === 'loading' ? (
              <Loader2 size={20} className="animate-spin text-slate-500" />
            ) : user ? (
              // --- ЕСЛИ АВТОРИЗОВАН ---
              <div className="flex items-center gap-3">
                {/* Приветствие (скрываем на маленьких экранах, если места мало) */}
                <div className="hidden lg:flex flex-col items-end mr-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    С возвращением,
                  </span>
                  <span className="text-sm font-bold text-amber-200 leading-none">{userName}</span>
                </div>

                {/* Кнопка-Аватарка */}
                <Link
                  href="/profile"
                  className="relative group block" // Класс group важен для ховера
                >
                  {/* Кружок с картинкой */}
                  <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden relative group-hover:border-amber-500 transition-colors z-10">
                    {avatarUrl ? (
                      <Image src={avatarUrl} alt={userName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                        <User size={20} className="text-amber-400" />
                      </div>
                    )}
                  </div>

                  {/* --- POPUP / TOOLTIP --- */}
                  <div className="absolute top-full right-0 mt-3 w-max px-3 py-1.5 bg-slate-900 text-slate-300 text-xs font-medium rounded-lg border border-white/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20">
                    Профиль
                    {/* Маленькая стрелочка сверху тултипа для красоты */}
                    <div className="absolute -top-1 right-4 w-2 h-2 bg-slate-900 border-t border-l border-white/10 rotate-45"></div>
                  </div>
                </Link>
              </div>
            ) : (
              // --- ЕСЛИ ГОСТЬ ---
              <Link
                href="/login"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <User size={20} strokeWidth={1.5} />
                <span className="text-sm font-medium">Войти</span>
              </Link>
            )}
          </div>
        </div>

        {/* Мобильная кнопка */}
        <button className="md:hidden text-slate-200" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* --- МОБИЛЬНОЕ МЕНЮ --- */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-950 border-b border-white/10 p-4 flex flex-col gap-4 h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-lg text-slate-200 py-2 border-b border-white/5"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          <div className="mt-auto pb-8 pt-4 border-t border-white/10">
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-4 bg-slate-900 p-3 rounded-xl border border-white/5"
                onClick={() => setIsOpen(false)}
              >
                {/* Аватар в мобилке */}
                <div className="w-12 h-12 rounded-full overflow-hidden relative bg-slate-800 flex-shrink-0">
                  {avatarUrl ? (
                    <Image src={avatarUrl} alt={userName} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={24} className="text-amber-400" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-400">Личный кабинет</div>
                  <div className="text-white font-bold">{userName}</div>
                </div>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex w-full justify-center gap-2 text-slate-900 items-center font-bold bg-amber-500 px-6 py-3 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <User size={20} /> Войти в аккаунт
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
