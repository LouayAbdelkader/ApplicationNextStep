# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Vérifier que cross-spawn@7.0.6 est bien installé
RUN npm list cross-spawn | grep 'cross-spawn@7.0.6' || { echo "Erreur : cross-spawn@7.0.6 n'est pas installé. Version actuelle :" ; npm list cross-spawn; exit 1; }

COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Installer les dépendances système pour sharp
RUN apk add --no-cache vips-dev

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# Copier les fichiers standalone + static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ajuster les permissions pour l'utilisateur nextjs
RUN chown -R nextjs:nodejs /app

# Utiliser un utilisateur non-root
USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
