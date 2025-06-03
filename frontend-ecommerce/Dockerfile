# ---- Build stage ----
FROM node:20-bullseye AS builder
WORKDIR /app

# 1. Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# 2. Nettoyage + install
RUN rm -rf node_modules && npm install

# 3. Vérifier cross-spawn
RUN npm ls cross-spawn && \
    ! npm ls cross-spawn | grep '7.0.3' || (echo "❌ cross-spawn@7.0.3 détecté !" && exit 1)

# 4. Forcer l’installation des modules natifs nécessaires
# ⚠️ Ces packages doivent correspondre à l'OS et à Next.js 15
RUN npm install \
    @next/swc-linux-x64-gnu@15.3.3 \
    lightningcss@1.25.0 \
    @tailwindcss/oxide@4.0.0 --save-exact

# 5. Copier tout le code
COPY . .

# 6. Désactiver la télémétrie de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# 7. Build du projet
RUN npm run build

# ---- Production stage ----
FROM node:20-bullseye AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# Copier les fichiers nécessaires
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Appliquer les bonnes permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
