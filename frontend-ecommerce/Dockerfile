# Étape builder
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copie uniquement package.json avec override incluse
COPY package.json ./

# 2. Ajout manuel du fix pour cross-spawn
# Remplacez dans le package.json :
#   "overrides": { "cross-spawn": "7.0.6" }

# 3. Installer sans package-lock pour éviter la résurgence de 7.0.3
RUN npm install --no-audit --no-fund --ignore-scripts

# 4. Copie le reste du projet
COPY . .

# 5. Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Étape runner
FROM node:20-alpine AS runner

# 6. Mise à jour et ajout de dumb-init
RUN apk update && apk upgrade && apk add --no-cache dumb-init && rm -rf /var/cache/apk/*

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# 7. Créer un utilisateur sécurisé
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# 8. Copie de l’app compilée
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder /app/package.json ./

# 9. Installation des dépendances sans vulnérabilités connues
RUN npm install --omit=dev --no-audit --no-fund --ignore-scripts && npm cache clean --force

# 10. Permissions et lancement
RUN chmod -R 755 /app && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
