import { ShoppingBag } from 'lucide-react'

export const OrdersTab = () => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-500 animate-in fade-in">
    <ShoppingBag size={48} className="mb-4 opacity-50" />
    <p className="text-lg">История заказов пуста</p>
  </div>
)
