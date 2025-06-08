# ---- Build stage ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copier package.json
COPY package.json ./

# Installer les dépendances avec versions récentes
RUN npm install --no-audit

# Copier le reste du projet
COPY . .

# Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js
RUN npm run build

# ---- Production stage ----
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# 🔥 Nettoyage des paquets à vulnérabilités connues
RUN apt-get update && \
    apt-get purge -y perl-base zlib1g && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copier uniquement les fichiers nécessaires à l’exécution
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
