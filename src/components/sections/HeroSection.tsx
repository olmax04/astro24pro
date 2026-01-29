// components/HeroSection.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '@/components/providers/AuthProvider' // <--- 1. Импортируем хук

import bgImage from '@/images/hero-bg.png'

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null)

  // 2. Получаем пользователя
  const { user } = useAuth()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section
      ref={ref}
      className="relative h-screen flex items-center justify-center text-center px-4 overflow-hidden"
    >
      {/* --- ПАРАЛЛАКС ФОН --- */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: backgroundY,
          height: '140%',
          top: '-20%',
        }}
      >
        <Image
          src={bgImage}
          alt="Astrology Background"
          fill
          priority
          className="object-cover opacity-60"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/50 to-slate-950 z-5 pointer-events-none"></div>

      {/* --- КОНТЕНТ HERO --- */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-6 mt-20"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-amber-300 uppercase tracking-[0.3em] text-sm block font-medium"
        >
          Ваш путь к звездам
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl font-serif text-white leading-tight drop-shadow-lg text-center"
        >
          Откройте тайны своей судьбы <br /> с лучшими тарологами
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed text-center"
        >
          Профессиональные консультации, обучение астрологии и магические атрибуты в одном
          мистическом пространстве.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
        >
          {/* Кнопка 1: Найти специалиста */}
          <Link
            href="/specialists"
            className="
              relative px-8 py-4 rounded-full font-bold text-slate-950 transition-all
              bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500
              hover:from-amber-200 hover:via-amber-300 hover:to-amber-400
              shadow-[0_0_20px_rgba(251,191,36,0.4)] hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]
              active:scale-95
            "
          >
            Найти специалиста
          </Link>

          {/* Кнопка 2: Динамическая (Регистрация / Профиль) */}
          {user ? (
            // ВАРИАНТ ДЛЯ АВТОРИЗОВАННОГО:
            <Link
              href="/profile"
              className="
                px-8 py-4 rounded-full font-medium text-white transition-all
                border border-amber-200/30 bg-amber-500/10 backdrop-blur-sm
                hover:bg-amber-500/20 hover:border-amber-200/60
              "
            >
              Перейти в профиль
            </Link>
          ) : (
            // ВАРИАНТ ДЛЯ ГОСТЯ:
            <Link
              href="/register" // Или оставь "/school", если регистрация через школу
              className="
                px-8 py-4 rounded-full font-medium text-white transition-all
                border border-amber-200/30 bg-white/5 backdrop-blur-sm
                hover:bg-white/10 hover:border-amber-200/60
              "
            >
              Зарегистрироваться
            </Link>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
