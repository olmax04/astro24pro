# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.

FROM node:23-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Создаем пользователя
RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nextjs

# Права на кэш
RUN mkdir .next
RUN chown nextjs:nodejs .next

# --- [1] Миграции ---
COPY --from=builder --chown=nextjs:nodejs /app/src/migrations ./src/migrations

# --- [2] Node modules (для работы CLI) ---
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# --- [3] ИСПРАВЛЕНИЕ: Копируем tsconfig.json ---
# Payload CLI требует этот файл для понимания путей, даже в продакшене
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# Копируем standalone сборку
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем package.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Команда запуска
CMD ["sh", "-c", "npm run migrate && node server.js"]