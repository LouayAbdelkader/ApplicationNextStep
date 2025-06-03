# ---- Build stage ----
FROM node:20-bullseye AS builder
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json ./

# Supprimer node_modules au cas où
RUN rm -rf node_modules

# Forcer toutes les versions vers cross-spawn@7.0.6 (via override dans package.json déjà présent)
RUN npm install

# Vérification : s’assurer qu’il n’y a PAS de 7.0.3
RUN npm ls cross-spawn && \
    ! npm ls cross-spawn | grep '7.0.3' || (echo "❌ ERREUR : cross-spawn@7.0.3 détecté !" && exit 1)

# Pré-télécharger le SWC si Next.js va en avoir besoin
RUN npm install @next/swc-linux-x64-gnu --save-exact || true

# Copier le reste du code
COPY . .

# Désactiver la télémétrie de Next.js
ENV NEXT_TELEMETRY_DISABLED 1

# Lancer le build Next.js
RUN npm run build

# ---- Production stage ----
FROM node:20-bullseye AS runner
WORKDIR /app

# Installer les dépendances système nécessaires (sharp par exemple)
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

# Créer un utilisateur non-root
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# Copier uniquement les fichiers nécessaires
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Donner les droits à l'utilisateur non-root
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
