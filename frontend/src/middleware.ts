import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Получаем токен из куки (Payload ставит его автоматически)
  const token = request.cookies.get('payload-token')?.value

  // --- НАСТРОЙКИ ПУТЕЙ ---

  // Страницы, доступные ТОЛЬКО авторизованным (Личный кабинет)
  const isProtectedRoute = pathname.startsWith('/profile') || pathname.startsWith('/account')

  // Страницы, доступные ТОЛЬКО гостям (Страница входа/регистрации)
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  // --- ЛОГИКА ---

  // Сценарий 1: Гость пытается зайти в профиль -> Редирект на Логин
  if (isProtectedRoute && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    // Можно добавить параметр, чтобы вернуть юзера назад после входа
    // url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // Сценарий 2: Авторизованный юзер пытается зайти на логин -> Редирект в Профиль
  // (Зачем ему логиниться, если он уже вошел?)
  if (isAuthRoute && token) {
    const url = request.nextUrl.clone()
    url.pathname = '/profile'
    return NextResponse.redirect(url)
  }

  // Если всё ок — пропускаем дальше
  return NextResponse.next()
}

// --- КОНФИГУРАЦИЯ (Matcher) ---
// Это важно! Мы говорим Next.js запускать этот код ТОЛЬКО на нужных страницах,
// чтобы не тормозить загрузку картинок, фавиконок и API.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin (Payload Admin panel - у него своя защита)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|admin).*)',
  ],
}
