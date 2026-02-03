'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  User,
  Settings,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Briefcase,
  Package,
} from 'lucide-react'
import { useAuth } from '../providers/AuthProvider'

// Импортируем табы
import { SettingsTab } from './tabs/SettingsTab'
import { CartTab } from './tabs/client/CartTab'
import { DashboardTab } from './tabs/DashboardTab'
import { OrdersTab } from './tabs/client/OrdersTab'
import { SpecialistTab } from './tabs/specialist/SpecialistTab'
import { ProductsTab } from './tabs/specialist/ProductsTab' // <--- Новый импорт

type TabType = 'dashboard' | 'orders' | 'cart' | 'settings' | 'specialist' | 'products'

interface ProfileTabsProps {
  user: any
}

export const ProfileTabs = ({ user: initialUser }: ProfileTabsProps) => {
  const defaultTab = initialUser.role === 'specialist' ? 'specialist' : 'dashboard'
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const cartItemCount =
    initialUser.cart?.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0) || 0

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Верхний блок (без изменений) */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* ... (код шапки профиля из предыдущих ответов) ... */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-800 border-2 border-amber-500/30 flex items-center justify-center overflow-hidden relative">
            {initialUser.avatar?.url ? (
              <Image src={initialUser.avatar.url} alt="Avatar" fill className="object-cover" />
            ) : (
              <User size={40} className="text-amber-500" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {initialUser.name} {initialUser.surname}
            </h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-amber-500 uppercase tracking-wider border border-white/5">
                {initialUser.role === 'client' ? 'Клиент' : 'Специалист'}
              </span>
              <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-400 border border-white/5">
                ID: {String(initialUser.id)}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
        >
          <LogOut size={18} />
          <span>Выйти</span>
        </button>
      </div>

      {/* 2. Навигация */}
      <div className="border-b border-white/10 overflow-x-auto pb-1 scrollbar-hide">
        <nav className="flex items-center gap-2 min-w-max">
          {/* Спец. табы */}
          {initialUser.role === 'specialist' && (
            <>
              <TabButton
                icon={<Briefcase size={18} />}
                label="Анкета"
                isActive={activeTab === 'specialist'}
                onClick={() => setActiveTab('specialist')}
              />
              <TabButton
                icon={<Package size={18} />}
                label="Мои товары"
                isActive={activeTab === 'products'} // <--- Кнопка товаров
                onClick={() => setActiveTab('products')}
              />
            </>
          )}

          <TabButton
            icon={<LayoutDashboard size={18} />}
            label="Обзор"
            isActive={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
          />

          {/* Клиентские табы */}
          {initialUser.role === 'client' && (
            <>
              <TabButton
                icon={<ShoppingCart size={18} />}
                label="Корзина"
                isActive={activeTab === 'cart'}
                onClick={() => setActiveTab('cart')}
                badge={cartItemCount > 0 ? cartItemCount : undefined}
              />
              <TabButton
                icon={<ShoppingBag size={18} />}
                label="Заказы"
                isActive={activeTab === 'orders'}
                onClick={() => setActiveTab('orders')}
              />
            </>
          )}

          <TabButton
            icon={<Settings size={18} />}
            label="Настройки"
            isActive={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
          />
        </nav>
      </div>

      {/* 3. Контент */}
      <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[400px]">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'cart' && <CartTab cart={initialUser.cart} userId={initialUser.id} />}
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'settings' && <SettingsTab user={initialUser} />}
        {activeTab === 'specialist' && <SpecialistTab user={initialUser} />}
        {activeTab === 'products' && <ProductsTab user={initialUser} />}
      </div>
    </div>
  )
}

const TabButton = ({ icon, label, isActive, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-6 py-3 rounded-t-lg border-b-2 transition-all text-sm font-medium whitespace-nowrap relative
      ${
        isActive
          ? 'border-amber-500 text-amber-500 bg-amber-500/5'
          : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
      }
    `}
  >
    {icon}
    {label}
    {badge && (
      <span className="ml-1 bg-amber-500 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
        {badge}
      </span>
    )}
  </button>
)
