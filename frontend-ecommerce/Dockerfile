# Étape builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --ignore-scripts
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Étape runner
FROM node:20-alpine AS runner
RUN apk update && apk upgrade && apk add --no-cache dumb-init && rm -rf /var/cache/apk/*
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copier package.json ET package-lock.json
COPY --from=builder /app/package.json /app/package-lock.json ./
# Installer les dépendances de production
RUN npm ci --only=production --no-audit --no-fund --ignore-scripts && npm cache clean --force
RUN chmod -R 755 /app && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
