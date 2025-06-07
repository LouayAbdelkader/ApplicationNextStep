# ---- Build stage ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# 1. Copier uniquement les fichiers nécessaires pour installer les dépendances
COPY package.json package-lock.json ./

# 2. Installer les dépendances nécessaires
RUN npm install

# 3. Ajouter les dépendances critiques manquantes (si pas dans package.json)
RUN npm install -D \
    @tailwindcss/postcss \
    @next/swc-linux-x64-gnu@15.3.3 \
    lightningcss@1.25.0 \
    @tailwindcss/oxide@4.0.0

# 4. Copier le reste du projet
COPY . .

# 5. Désactiver la télémétrie
ENV NEXT_TELEMETRY_DISABLED=1

# 6. Build Next.js
RUN npm run build

# ---- Production stage ----
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# 7. Installer la lib native pour image optimization
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

# 8. Configuration environnement production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 9. Créer un utilisateur non-root sécurisé
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# 10. Copier uniquement les fichiers nécessaires à l'exécution
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 11. Sécuriser les permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# 12. Lancer l'application
CMD ["node", "server.js"]
