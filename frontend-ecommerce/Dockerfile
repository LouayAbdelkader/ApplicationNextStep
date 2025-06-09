# Dockerfile simple et sécurisé
FROM node:20-alpine AS builder

# Fix du cross-spawn vulnérable dans npm global
RUN npm install -g cross-spawn@7.0.6 && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/cross-spawn && \
    cp -r /usr/local/lib/node_modules/cross-spawn /usr/local/lib/node_modules/npm/node_modules/ && \
    sed -i 's/"7\.0\.3"/"7.0.6"/g' /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json && \
    sed -i 's/"7\.0\.3"/"7.0.6"/g' /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json

WORKDIR /app

# Copie package.json avec override cross-spawn 7.0.6
COPY package.json ./

# Installation propre
RUN npm install --no-audit --no-fund

# Vérification des versions de cross-spawn
RUN echo "=== VÉRIFICATION CROSS-SPAWN ===" && \
    echo "Version dans node_modules du projet:" && \
    find node_modules -name "cross-spawn" -type d -exec sh -c 'echo "  $1: $(cat $1/package.json | grep "\"version\":" | cut -d"\"" -f4)"' _ {} \; && \
    echo "Version dans npm global:" && \
    cat /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json | grep '"version":' && \
    echo "=== FIN VÉRIFICATION ==="

# Copie du code et build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Runner
FROM node:20-alpine AS runner

# Fix du cross-spawn vulnérable dans npm global
RUN npm install -g cross-spawn@7.0.6 && \
    rm -rf /usr/local/lib/node_modules/npm/node_modules/cross-spawn && \
    cp -r /usr/local/lib/node_modules/cross-spawn /usr/local/lib/node_modules/npm/node_modules/

RUN apk add --no-cache dumb-init

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Utilisateur sécurisé
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# Copie des fichiers
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Vérification finale cross-spawn dans l'image de production
RUN echo "=== VÉRIFICATION FINALE CROSS-SPAWN ===" && \
    echo "Dans npm global:" && \
    cat /usr/local/lib/node_modules/npm/node_modules/cross-spawn/package.json | grep '"version":' && \
    echo "Dans l'application:" && \
    find . -name "cross-spawn" -type d 2>/dev/null | head -5 | while read dir; do \
        if [ -f "$dir/package.json" ]; then \
            echo "  $dir: $(cat $dir/package.json | grep "\"version\":" | cut -d"\"" -f4)"; \
        fi; \
    done && \
    echo "=== FIN VÉRIFICATION ==="

USER nextjs
EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
