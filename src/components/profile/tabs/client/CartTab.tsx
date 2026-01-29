// src/components/profile/tabs/CartTab.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react'

interface CartTabProps {
  cart: any[]
  userId: string | number
}

export const CartTab = ({ cart, userId }: CartTabProps) => {
  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-in fade-in">
        <ShoppingCart size={48} className="mb-4 opacity-50" />
        <p className="text-lg mb-4">Ваша корзина пуста</p>
        <Link
          href="/shop"
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm"
        >
          Перейти в магазин
        </Link>
      </div>
    )
  }

  const totalAmount = cart.reduce((sum, item) => {
    const price = typeof item.product === 'object' ? item.product.price || 0 : 0
    return sum + price * item.quantity
  }, 0)

  const removeItem = async (productId: string) => {
    alert(`Логика удаления товара ${productId} (API call)`)
  }

  return (
    <div className="animate-in fade-in space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <h3 className="text-xl font-serif text-white">Ваши товары</h3>
        <span className="text-slate-400 text-sm">{cart.length} позиций</span>
      </div>

      <div className="space-y-4">
        {cart.map((item, index) => {
          const product = typeof item.product === 'object' ? item.product : null
          if (!product) return null

          const price = product.price || 0
          const title = product.title || 'Товар'
          const imageUrl = product.image?.url

          return (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/50 p-4 rounded-xl border border-white/5"
            >
              <div className="w-20 h-20 bg-slate-800 rounded-lg overflow-hidden relative flex-shrink-0">
                {imageUrl ? (
                  <Image src={imageUrl} alt={title} fill className="object-cover" />
                ) : (
                  <ShoppingCart className="w-8 h-8 text-slate-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="text-white font-medium mb-1">{title}</h4>
                <p className="text-sm text-slate-400">Количество: {item.quantity}</p>
              </div>
              <div className="text-amber-400 font-bold whitespace-nowrap">
                {price * item.quantity} ₽
              </div>
              <button
                onClick={() => removeItem(product.id)}
                className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col items-end gap-4 pt-6 border-t border-white/10">
        <div className="flex items-center gap-4 text-lg">
          <span className="text-slate-400">Итого:</span>
          <span className="text-2xl font-bold text-white">{totalAmount} ₽</span>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-all">
          Оформить заказ <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
