# BookMyVenue — Server Dockerfile
# =============================================================================

# Stage  Install dependencies 
FROM node:22-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# Stage 2: Build TypeScript 
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --from=deps /app/node_modules ./node_modules

COPY tsconfig.json ./
COPY src/ ./src/

RUN corepack enable && pnpm build

# Stage 3: Production runner 
FROM node:22-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup -u 1001

# Copy production dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && corepack enable \
    && pnpm install --frozen-lockfile --prod \
    && apk del .build-deps

# Copy built artifacts from build stage
COPY --from=build /app/dist ./dist

# Log directory — writable by non-root user
RUN mkdir -p logs && chown -R appuser:appgroup logs

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

USER appuser

CMD ["node", "dist/server.js"]
