# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.

FROM node:23-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable





FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# 1. !!! ВОТ ЧЕГО НЕ ХВАТАЛО !!!
# Сначала устанавливаем зависимости. Без этого шага папки node_modules нет,
# и команда 'next build' не может найти файл запуска 'next'.
RUN pnpm install --frozen-lockfile --prod=false

# 2. Теперь копируем исходный код
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN groupadd -r -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nextjs

RUN mkdir -p /home/nextjs/.cache && \
    chown -R nextjs:nodejs /home/nextjs

ENV HOME=/home/nextjs    

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json

# COPY --from=builder --chown=nextjs:nodejs /app/src ./src

# # Копируем standalone сборку Next.js
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# # Копируем package.json
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./

# COPY --from=builder --chown=nextjs:nodejs /app/postcss.config.js ./postcss.config.js

# COPY ./next-env.d.ts ./next-env.d.ts

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Команда запуска
CMD ["node", "server.js"]