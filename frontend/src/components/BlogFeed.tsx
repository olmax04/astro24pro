'use client'

import React, { useState } from 'react'
import { BlogCard, BlogPost } from './cards/BlogCard'

// Убедись, что эти ID в точности совпадают с value в Payload Config
const CATEGORIES = [
  { id: 'all', label: 'Все статьи' },
  { id: 'forecast', label: 'Прогнозы' }, // value: 'forecast' в Payload
  { id: 'education', label: 'Обучение' }, // value: 'education' в Payload
  { id: 'esoterics', label: 'Эзотерика' }, // value: 'esoterics' в Payload
]

interface BlogFeedProps {
  posts: BlogPost[]
}

export const BlogFeed = ({ posts }: BlogFeedProps) => {
  const [activeTab, setActiveTab] = useState('all')

  const filteredPosts = posts.filter((post) => {
    // Если выбрано "Все", показываем всё
    if (activeTab === 'all') return true

    // ВАЖНО: Сравниваем ID таба с categoryId поста
    // 'esoterics' === 'esoterics' -> true
    return post.categoryId === activeTab
  })

  return (
    <div>
      {/* Табы */}
      <div className="flex flex-wrap gap-4 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={`
              px-6 py-2 rounded-full text-sm uppercase tracking-wider border transition-all
              ${
                activeTab === cat.id
                  ? 'bg-amber-500 border-amber-500 text-slate-900 font-bold'
                  : 'border-slate-700 text-slate-400 hover:text-amber-100'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Сетка */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} data={post} />
        ))}
      </div>
    </div>
  )
}
