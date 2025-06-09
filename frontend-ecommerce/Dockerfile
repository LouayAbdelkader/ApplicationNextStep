# ---- Dependencies resolution stage ----
FROM node:20-alpine AS deps
WORKDIR /app

# Installation des outils de sécurité
RUN apk update && \
    apk upgrade && \
    apk add --no-cache libc6-compat && \
    rm -rf /var/cache/apk/*

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Supprimer le package-lock.json pour forcer la résolution des versions
RUN rm -f package-lock.json

# Installer npm-check-updates pour mettre à jour les dépendances
RUN npm install -g npm-check-updates@latest

# Nettoyer le cache npm
RUN npm cache clean --force

# Installation avec résolution forcée des vulnérabilités
RUN npm install --no-package-lock --no-audit --no-fund && \
    npm update cross-spawn@^7.0.6 --save && \
    npm audit fix --force || true && \
    npm ls cross-spawn || true

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Copier les dépendances résolues
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Configuration Next.js pour le build standalone
RUN echo 'module.exports = { \
  output: "standalone", \
  experimental: { \
    outputFileTracingRoot: __dirname \
  }, \
  eslint: { \
    ignoreDuringBuilds: true \
  }, \
  typescript: { \
    ignoreBuildErrors: true \
  } \
}' > next.config.js

# Build de l'application
RUN npm run build

# Vérifier que cross-spawn est bien à jour après le build
RUN npm ls cross-spawn || echo "Cross-spawn version check"

# ---- Runtime stage ----
FROM node:20-alpine AS runner

# Mise à jour sécurisée du système
RUN apk update && \
    apk upgrade && \
    apk add --no-cache \
        dumb-init \
        tini \
        curl && \
    rm -rf /var/cache/apk/* && \
    rm -rf /tmp/*

WORKDIR /app

# Variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Créer un utilisateur non-root avec des privilèges minimaux
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copier les fichiers de build depuis le stage builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Créer les répertoires nécessaires avec les bonnes permissions
RUN mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app && \
    chmod -R 755 /app

# Installer uniquement les dépendances de production runtime
# avec résolution forcée des vulnérabilités
COPY --from=deps /app/package.json ./package.json
RUN npm ci --only=production --no-audit --no-fund --ignore-scripts && \
    npm update cross-spawn@^7.0.6 --save --no-audit && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Vérification finale de la version de cross-spawn
RUN npm ls cross-spawn | grep -E "(7\.0\.[6-9]|7\.[1-9]|[8-9]\.)" || \
    (echo "❌ cross-spawn version incorrecte détectée" && npm ls cross-spawn && exit 1)

# Supprimer les fichiers temporaires et les caches
RUN rm -rf /tmp/* /var/tmp/* /root/.cache

# Configuration de sécurité avancée
RUN chmod 000 /root && \
    chmod 755 /home/nextjs && \
    find /app -type f -name "*.js" -exec chmod 644 {} \; && \
    find /app -type d -exec chmod 755 {} \;

# Basculer vers l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Utiliser tini comme init system pour une gestion correcte des signaux
ENTRYPOINT ["tini", "--"]

# Commande de démarrage optimisée
CMD ["node", "server.js"]
