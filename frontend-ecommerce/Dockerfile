# ---- Build stage ----
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# 1. Copier uniquement package.json (comme demandé)
COPY package.json ./

# 2. Nettoyage + installation des dépendances
RUN rm -rf node_modules && npm install

# 3. Vérifier cross-spawn (fail si version 7.0.3 détectée)
RUN npm ls cross-spawn && \
    ! npm ls cross-spawn | grep '7.0.3' || (echo "❌ cross-spawn@7.0.3 détecté !" && exit 1)

# 4. Forcer les modules natifs requis (doivent correspondre à ta version de Next.js et OS)
RUN npm install \
    @next/swc-linux-x64-gnu@15.3.3 \
    lightningcss@1.25.0 \
    @tailwindcss/oxide@4.0.0 --save-exact

# 5. Copier le reste du code
COPY . .

# 6. Désactiver la télémétrie de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# 7. Build
RUN npm run build

# ---- Production stage ----
FROM node:20-bookworm-slim AS runner
WORKDIR /app

# 8. Lib nécessaire à sharp/image optimization
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# 9. Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# 10. Copier uniquement ce qui est requis pour exécuter Next.js
COPY --from=builder /app/.next/standalone ./  
COPY --from=builder /app/.next/static ./.next/static  
COPY --from=builder /app/public ./public

# 11. Permissions + utilisateur sécurisé
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
