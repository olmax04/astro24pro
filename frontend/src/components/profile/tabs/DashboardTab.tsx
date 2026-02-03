import { LayoutDashboard } from 'lucide-react'

export const DashboardTab = () => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-in fade-in">
    <LayoutDashboard size={48} className="mb-4 opacity-50" />
    <p className="text-lg">Добро пожаловать в личный кабинет!</p>
  </div>
)
