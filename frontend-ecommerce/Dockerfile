# ---- Build stage ----
FROM node:20-bookworm AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --no-audit

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Runtime stage ----
FROM node:20-bookworm AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Créer utilisateur sécurisé
RUN addgroup --gid 1001 nodejs && \
    adduser --uid 1001 --disabled-password --gecos '' --ingroup nodejs nextjs

# Ajouter le dépôt de sécurité Debian et mettre à jour les paquets
RUN echo "deb http://deb.debian.org/debian-security bookworm-security main" > /etc/apt/sources.list.d/bookworm-security.list && \
    apt-get update && \
    apt-get upgrade -y && \
    apt-get remove -y man-db && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copie minimale pour prod
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
