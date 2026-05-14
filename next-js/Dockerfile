FROM node:24-alpine AS base
    RUN apk add --no-cache libc6-compat
    WORKDIR /app
    
    ENV NEXT_TELEMETRY_DISABLED 1

FROM base AS deps
    COPY package*.json ./
    RUN npm ci

FROM base AS builder
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    RUN npm run build

FROM base AS runner
    ENV NODE_ENV production
    
    RUN addgroup --system --gid 1001 nodejs && \
        adduser --system --uid 1001 nextjs

    COPY --from=builder /app/public ./public
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    USER nextjs

    ENV HOSTNAME "0.0.0.0"

    EXPOSE 3000
    ENV PORT 3000

# --- Final Production Stage ---
FROM runner AS production
    CMD ["node", "server.js"]

# --- Final Development Stage ---
FROM base AS development
    ENV NODE_ENV=development
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    EXPOSE 3000
    CMD ["npm", "run", "dev"]