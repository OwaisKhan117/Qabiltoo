# ─── Qabiltoo — production image (web app + realtime service) ───
# Build:  docker build -t qabiltoo .
# Run:    docker run -p 3000:3000 -p 3003:3003 qabiltoo

# ── Stage 1: base ────────────────────────────────────────────────
FROM oven/bun:1 AS base
WORKDIR /app

# ── Stage 2: dependencies + build ───────────────────────────────
FROM base AS build

# Install web app dependencies (root)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Install realtime service dependencies
COPY mini-services/qabiltoo-realtime/package.json mini-services/qabiltoo-realtime/bun.lock ./mini-services/qabiltoo-realtime/
RUN cd mini-services/qabiltoo-realtime && bun install --frozen-lockfile

# Copy the rest of the source
COPY . .

# Realtime socket URL baked at build time (override with --build-arg if self-hosting behind a proxy)
ARG NEXT_PUBLIC_SOCKET_URL=http://localhost:3003
ENV NEXT_PUBLIC_SOCKET_URL=$NEXT_PUBLIC_SOCKET_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/app/db/custom.db

RUN bunx prisma generate && bun run build

# ── Stage 3: runtime ─────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/db/custom.db
ENV NEXT_TELEMETRY_DISABLED=1

# Next.js standalone server (includes static assets copied by the build script)
COPY --from=build /app/.next/standalone ./

# Prisma client + schema (engine binaries are traced into standalone, this is a safety net)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/prisma ./prisma

# Realtime service with its own dependencies
COPY --from=build /app/mini-services ./mini-services

# Pre-seeded SQLite database so the demo works out of the box
COPY --from=build /app/db ./db

COPY --from=build /app/docker-start.sh /app/docker-start.sh
RUN chmod +x /app/docker-start.sh

EXPOSE 3000 3003

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD bun -e "fetch('http://127.0.0.1:3000/').then(r=>{if(!r.ok)throw 0})" || exit 1

CMD ["/app/docker-start.sh"]
