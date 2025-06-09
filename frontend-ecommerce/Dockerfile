# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Installer toutes les dépendances (dev incluses pour le build)
RUN npm ci --no-audit --no-fund --ignore-scripts && \
    npm update cross-spawn@^7.0.6 --no-audit

# Copier le code source
COPY . .

# Variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build de l'application
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner

# Installer les mises à jour de sécurité Alpine
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Créer un utilisateur non-root avec des privilèges minimaux
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Copier uniquement les fichiers de production nécessaires
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Installer uniquement les dépendances de production dans le runtime
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --no-audit --no-fund --ignore-scripts && \
    npm cache clean --force

# Définir les permissions strictes
RUN chmod -R 755 /app && \
    chown -R nextjs:nodejs /app && \
    rm -rf package*.json node_modules/.cache

# Basculer vers l'utilisateur non-root
USER nextjs

# Exposer le port
EXPOSE 3000

# Utiliser dumb-init pour une gestion correcte des signaux
ENTRYPOINT ["dumb-init", "--"]

# Commande de démarrage
CMD ["node", "server.js"]
