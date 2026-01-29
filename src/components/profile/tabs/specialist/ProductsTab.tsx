// src/components/profile/tabs/ProductsTab.tsx
'use client'

import React from 'react'
import { Plus, Package, Edit, Trash2 } from 'lucide-react'

interface ProductsTabProps {
  user: any // Здесь в идеале должен быть массив товаров
}

export const ProductsTab = ({ user }: ProductsTabProps) => {
  const handleAddProduct = () => {
    // router.push('/products/new')
    alert('Логика создания товара')
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="text-xl font-serif text-white">Мои товары</h2>
          <p className="text-sm text-slate-400">Управляйте своим магазином</p>
        </div>
        <button
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-bold rounded-lg transition-colors"
        >
          <Plus size={16} />
          Добавить товар
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Кнопка добавления (карточкой) */}
        <div
          onClick={handleAddProduct}
          className="min-h-[150px] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-8 text-slate-500 hover:bg-white/5 hover:border-amber-500/50 transition-colors cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mb-3 group-hover:bg-slate-800 transition-colors">
            <Plus size={24} className="text-slate-400 group-hover:text-amber-500" />
          </div>
          <span className="text-sm font-medium">Создать новый товар</span>
        </div>

        {/* Пример существующего товара */}
        <ProductCardStub title="Магическая свеча" price={1500} />
        <ProductCardStub title="Расклад Таро (PDF)" price={3000} />
      </div>
    </div>
  )
}

// Заглушка карточки товара
const ProductCardStub = ({ title, price }: { title: string; price: number }) => (
  <div className="bg-slate-950/50 rounded-xl border border-white/5 overflow-hidden hover:border-amber-500/30 transition-all flex flex-col">
    <div className="h-32 bg-slate-800 flex items-center justify-center relative">
      <Package className="text-slate-600 w-10 h-10" />
      <div className="absolute top-2 right-2 flex gap-1">
        <button className="p-1.5 bg-slate-900/80 rounded-md text-slate-400 hover:text-white">
          <Edit size={14} />
        </button>
        <button className="p-1.5 bg-slate-900/80 rounded-md text-red-400 hover:text-red-300">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
    <div className="p-4">
      <h4 className="text-white font-medium mb-1">{title}</h4>
      <p className="text-amber-400 font-bold text-sm">{price} ₽</p>
    </div>
  </div>
)
