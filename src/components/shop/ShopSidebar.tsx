'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter } from 'lucide-react'

export const ShopSidebar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')

  // Функция для ввода ТОЛЬКО цифр
  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const value = e.target.value
    // Регулярное выражение заменяет всё, что НЕ цифра (0-9), на пустую строку
    // Это автоматически убирает минусы, точки, запятые, буквы 'e' и пробелы
    const onlyNums = value.replace(/[^0-9]/g, '')
    setter(onlyNums)
  }

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (search) params.set('search', search)
    else params.delete('search')

    if (minPrice) params.set('minPrice', minPrice)
    else params.delete('minPrice')

    if (maxPrice) params.set('maxPrice', maxPrice)
    else params.delete('maxPrice')

    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 sticky top-24">
      <div className="flex items-center gap-2 mb-6 text-white font-serif text-xl border-b border-white/10 pb-4">
        <Filter size={20} className="text-amber-400" />
        Фильтры
      </div>

      <div className="space-y-6">
        {/* Поиск */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Поиск товара</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Свечи, карты..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-lg py-2 pl-3 pr-10 text-white focus:border-amber-400 outline-none transition-colors text-sm"
            />
            <Search className="absolute right-3 top-2.5 text-slate-500" size={14} />
          </div>
        </div>

        {/* Цена */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Цена (₽)</label>
          <div className="flex gap-2">
            <input
              type="text" /* Используем text, чтобы иметь полный контроль над вводом */
              inputMode="numeric" /* Открывает цифровую клавиатуру на мобильных */
              placeholder="От"
              value={minPrice}
              onChange={(e) => handleNumberChange(e, setMinPrice)}
              className="w-1/2 bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-amber-400 outline-none text-sm"
            />
            <input
              type="text"
              inputMode="numeric"
              placeholder="До"
              value={maxPrice}
              onChange={(e) => handleNumberChange(e, setMaxPrice)}
              className="w-1/2 bg-slate-950 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-amber-400 outline-none text-sm"
            />
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          Показать
        </button>

        <button
          onClick={() => {
            setSearch('')
            setMinPrice('')
            setMaxPrice('')
            router.push('/shop')
          }}
          className="w-full text-slate-500 hover:text-white text-xs transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
    </div>
  )
}
