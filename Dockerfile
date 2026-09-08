# Multi-stage production build for LearnWith TanStack Start application
# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root manifest and locks
COPY package*.json ./

# Copy package manifests for CommonJS isolated directories
COPY tests/package.json ./tests/
COPY assets/package.json ./assets/

# Clean install dependencies
RUN npm ci

# Copy application source code
COPY . .

# Build Vinxi production bundle and run strict typecheck
RUN npm run build
RUN npm run typecheck

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3173
ENV HOST=0.0.0.0

# Copy standalone server build output and static assets
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/public ./public

EXPOSE 3173

CMD ["node", ".output/server/index.mjs"]
