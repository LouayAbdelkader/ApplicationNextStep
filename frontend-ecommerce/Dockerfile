*# Étape 1 : build de l’application
FROM node:20-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour éviter un cache inutile
COPY package.json package-lock.json* ./

# Installer les dépendances de production
RUN npm install

# Copier le reste de l'application
COPY . .

# Build de l'application Next.js
RUN npm run build

# Étape 2 : image de production avec Next.js
FROM node:20-alpine AS runner

# Définir NODE_ENV en production
ENV NODE_ENV=production

# Créer et utiliser le dossier d'application
WORKDIR /app

# Copier uniquement les fichiers nécessaires du build
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port utilisé par Next.js
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
