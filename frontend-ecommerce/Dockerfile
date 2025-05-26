# ---- Stage 1: Build ----
# Use an official Node.js runtime as a parent image.
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Set a label for the stage
LABEL stage="builder"

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of your application code into the container
COPY . .

# Build the Next.js application for production
RUN npm run build

# ---- Stage 2: Production/Runner ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV production
LABEL stage="runner"

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -s /bin/sh -S -G nodejs -u 1001 nextjs

# Copy necessary files from the builder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Install only production dependencies
RUN npm install --only=production --ignore-scripts --prefer-offline

# Switch to non-root user
USER nextjs

EXPOSE 3000
ENV PORT 3000

# Run the app
CMD ["npx", "next", "start"]
