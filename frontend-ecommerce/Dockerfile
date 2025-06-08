# ---- Étape de Build ----
FROM node:20-slim AS builder

# Répertoire de travail
WORKDIR /app

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# 1. Copier uniquement package.json
COPY package.json ./

# 2. Installer toutes les dépendances
RUN npm install --no-audit

# 3. Copier le reste du projet
COPY . .

# 4. Construire l'application Next.js
RUN npm run build

# ---- Étape de Production ----
FROM node:20-slim AS runner

# Répertoire de travail
WORKDIR /app

# Variables d’environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# Copier uniquement ce qui est nécessaire à l'exécution
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Sécuriser les permissions
USER nextjs

# Exposer le port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
