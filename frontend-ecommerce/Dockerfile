# ==================================
# Stage 1: Installation & Build 🏗️
# ==================================
FROM node:20-alpine AS builder

# Définir l'environnement
ENV NODE_ENV=production

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package.json package-lock.json* ./

# Installer toutes les dépendances (y compris devDependencies pour le build)
RUN npm install

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
# (Assurez-vous que `output: 'standalone',` est dans next.config.mjs)
RUN npm run build

# ==================================
# Stage 2: Production 🚀
# ==================================
FROM node:20-alpine

# Définir l'environnement
ENV NODE_ENV=production

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de sortie 'standalone' depuis le stage précédent
COPY --from=builder /app/.next/standalone ./

# Copier les fichiers statiques (/_next/static/*)
COPY --from=builder /app/.next/static ./.next/static

# Copier les fichiers publics (/public/*)
COPY --from=builder /app/public ./public

# Exposer le port sur lequel Next.js écoute (par défaut 3000)
EXPOSE 3000

# Commande pour démarrer le serveur Next.js en mode standalone
CMD ["node", "server.js"]