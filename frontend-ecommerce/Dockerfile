# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copier uniquement package.json
COPY package.json ./

# 2. Installer les dépendances sans lockfile (⚠️ plus de variabilité)
RUN npm install --no-audit --omit=dev

# 3. Copier le reste du code
COPY . .

# 4. Désactiver la télémétrie Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# 5. Compiler l'application (Next.js)
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner

WORKDIR /app

# Environnement
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Créer un utilisateur non-root
RUN addgroup -g 1001 nodejs && adduser -u 1001 -G nodejs -s /bin/sh -D nextjs

# Copier les fichiers nécessaires à l'exécution
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Sécuriser les droits
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
