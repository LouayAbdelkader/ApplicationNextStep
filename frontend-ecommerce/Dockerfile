# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app
# Copier les fichiers de dépendances
COPY package.json package-lock.json ./
# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm ci --no-audit --no-fund --ignore-scripts
# Copier le code source
COPY . .
# Définir les variables d'environnement pour le build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Construire l'application
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
# Mettre à jour les packages Alpine pour la sécurité
RUN apk update && \
    apk upgrade && \
    apk add --no-cache dumb-init && \
    rm -rf /var/cache/apk/*
WORKDIR /app
# Définir les variables d'environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs
# Copier les fichiers nécessaires pour la production
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Installer uniquement les dépendances de production
COPY --from=builder /app/package.json ./
RUN npm ci --only=production --no-audit --no-fund --ignore-scripts && \
    npm cache clean --force
# Définir des permissions strictes
RUN chmod -R 755 /app && \
    chown -R nextjs:nodejs /app && \
    rm -rf package.json node_modules/.cache
# Passer à l'utilisateur non-root
USER nextjs
# Exposer le port
EXPOSE 3000
# Utiliser dumb-init pour gérer les signaux
ENTRYPOINT ["dumb-init", "--"]
# Commande de démarrage
CMD ["node", "server.js"]
