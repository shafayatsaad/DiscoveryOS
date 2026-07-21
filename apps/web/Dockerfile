# syntax=docker/dockerfile:1
# Purpose: Build a small standalone Next.js runtime image for DiscoveryOS.

FROM node:22-alpine AS deps

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci --workspace=apps/web --include-workspace-root

FROM deps AS dev

WORKDIR /app
COPY apps/web ./apps/web

EXPOSE 3000

CMD ["npm", "run", "dev", "--workspace=apps/web", "--", "--hostname", "0.0.0.0", "--port", "3000"]

FROM node:22-alpine AS builder

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json /app/package-lock.json ./
COPY --from=deps /app/apps ./apps
COPY apps/web ./apps/web

ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ARG NEXT_PUBLIC_DEVELOPER_MODE=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_DEVELOPER_MODE=$NEXT_PUBLIC_DEVELOPER_MODE

RUN npm run build --workspace=apps/web

FROM node:22-alpine AS runner

ENV HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production \
    PORT=3000

WORKDIR /app

RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
