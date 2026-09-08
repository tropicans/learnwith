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

# Ensure static assets are synced to public before bundling
RUN cp -r assets public/assets 2>/dev/null || true

# Build Vinxi production bundle and run strict typecheck
RUN npm run build
RUN npm run typecheck

# Stage 2: Runner
FROM node:20-alpine AS runner

# Install tini for PID 1 signal forwarding and zombie process reaping (D-08)
RUN apk add --no-cache tini

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3173
ENV HOST=0.0.0.0

# Copy standalone server build output and static assets with node ownership (D-05, D-07)
COPY --chown=node:node --from=builder /app/.output ./.output
COPY --chown=node:node --from=builder /app/public ./public

# Native Node.js healthcheck (D-06)
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:' + (process.env.PORT || 3173) + '/').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Non-root unprivileged execution (D-05)
USER node

EXPOSE 3173

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", ".output/server/index.mjs"]
