# ─────────────────────────────────────────────────────────────────
# Stage 1: Install dependencies
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# Install based on which lock file exists
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "No lockfile found." && npm install; \
  fi

# ─────────────────────────────────────────────────────────────────
# Stage 2: Build the application
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Inject env vars passed via docker build args
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV NEXT_TELEMETRY_DISABLED=1

# Ensure next.config.js has output: 'standalone' — we override it if not set
RUN node -e "const fs = require('fs'); \
  ['./next.config.js', './next.config.mjs', './next.config.ts'].forEach(p => { \
    if (!fs.existsSync(p)) return; \
    let file = fs.readFileSync(p, 'utf8'); \
    if (file.includes('standalone')) return; \
    const patterns = [ \
      /(module\.exports\s*=\s*{)/, \
      /(export\s+default\s*{)/, \
      /(const\s+nextConfig(?:\s*:\s*\w+)?\s*=\s*{)/ \
    ]; \
    for (const pattern of patterns) { \
      if (pattern.test(file)) { \
        fs.writeFileSync(p, file.replace(pattern, '\$1 output: \"standalone\",')); \
        console.log('Patched ' + p + ' to use standalone output'); \
        return; \
      } \
    } \
    console.log('Could not find config object to patch in ' + p); \
  })"

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else npm run build; \
  fi

# ─────────────────────────────────────────────────────────────────
# Stage 3: Production runner — minimal image
# ─────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
