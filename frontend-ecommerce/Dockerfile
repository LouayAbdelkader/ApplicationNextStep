# ---- Build stage ----
FROM node:20-bullseye AS builder
WORKDIR /app

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Nettoyage + installation complète
RUN rm -rf node_modules && npm install

# Vérification : cross-spawn@7.0.6 uniquement
RUN npm ls cross-spawn && \
    ! npm ls cross-spawn | grep '7.0.3' || (echo "❌ cross-spawn@7.0.3 détecté !" && exit 1)

# ➕ Forcer l'installation des binaires natifs requis (sans modifier ton package.json)
RUN npm install @next/swc-linux-x64-gnu@15.3.3 --save-exact && \
    npm install lightningcss@1.25.0 --save-exact

# Copier le code source
COPY . .

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Build Next.js
RUN npm run build

# ---- Production stage ----
FROM node:20-bullseye AS runner
WORKDIR /app

# Installer libvips pour Sharp
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# Copier uniquement le nécessaire
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Changer les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
