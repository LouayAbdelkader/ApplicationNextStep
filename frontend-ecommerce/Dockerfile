# Dockerfile simple et sécurisé
FROM node:20-alpine AS builder

# Fix du cross-spawn vulnérable dans npm global
RUN npm install -g cross-spawn@7.0.6 && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/cross-spawn && \
    cp -r /usr/local/lib/node_modules/cross-spawn /usr/local/lib/node_modules/npm/node_modules/ && \
    sed -i 's/"7\.0\.3"/"7.0.6"/g' /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json && \
    sed -i 's/"7\.0\.3"/"7.0.6"/g' /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json

WORKDIR /app

# Copie package.json avec override cross-spawn 7.0.6
COPY package.json ./

# Installation propre
RUN npm install --no-audit --no-fund

# Copie du code et build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner
FROM node:20-alpine AS runner

# Fix du cross-spawn vulnérable dans npm global
RUN npm install -g cross-spawn@7.0.6 && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/cross-spawn && \
    cp -r /usr/local/lib/node_modules/cross-spawn /usr/local/lib/node_modules/npm/node_modules/

RUN apk add --no-cache dumb-init

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur sécurisé
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# Copie des fichiers
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
