# Purpose: Build and run the DiscoveryOS Next.js frontend for Docker Compose demos.

FROM node:22-bookworm-slim AS runtime

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json ./apps/web/package.json
RUN npm ci

COPY apps/web ./apps/web

ARG NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --workspace=apps/web

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=apps/web", "--", "-H", "0.0.0.0"]
