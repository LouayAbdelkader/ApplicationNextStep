# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# 1. Copie des fichiers
COPY package.json package-lock.json ./

# 2. Empêche d’avoir des vieilles dépendances
RUN rm -rf node_modules && npm install

# 3. Vérification stricte que seule 7.0.6 est installée
RUN npm ls cross-spawn && \
    ! npm ls cross-spawn | grep '7.0.3' || (echo "❌ ERREUR : cross-spawn@7.0.3 détecté !" && exit 1)

# 4. Copie du reste de l’app
COPY . .

# 5. Build du frontend
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# 6. Dépendance système pour Sharp
RUN apk add --no-cache vips-dev

ENV NODE_ENV=production

# 7. Utilisateur non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs

# 8. Copie des fichiers nécessaires uniquement
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 9. Permissions correctes
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
