$# Dockerfile

# ---- Stage 1: Build ----
# Use an official Node.js runtime as a parent image.
# Alpine versions are smaller. Choose a version compatible with your Next.js app.
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Set a label for the stage
LABEL stage="builder"

# Copy package.json and package-lock.json (or yarn.lock)
# This allows Docker to cache dependencies unless these files change.
COPY package*.json ./
# If using Yarn:
# COPY yarn.lock ./
# COPY package.json ./

# Install dependencies
# Using 'npm ci' is generally recommended for CI/CD as it uses package-lock.json
# and provides faster, more reliable builds.
RUN npm ci
# If using Yarn:
# RUN yarn install --frozen-lockfile

# Copy the rest of your application code into the container
COPY . .

# (Optional) If you have build-time environment variables needed by Next.js
# ARG NEXT_PUBLIC_API_URL
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# You would pass these during the build command:
# docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t frontend-nextjs .

# Build the Next.js application for production
RUN npm run build
# If using Yarn:
# RUN yarn build

# ---- Stage 2: Production/Runner ----
# Use a lean Node.js image for the final application
FROM node:20-alpine AS runner

# Set the working directory
WORKDIR /app

# Set the environment to production
ENV NODE_ENV production

# Set a label for the stage
LABEL stage="runner"

# Create a non-root user and group for security
# Running applications as root is a security risk.
RUN addgroup -g 1001 -S nodejs
RUN adduser -s /bin/sh -S -G nodejs -u 1001 nextjs

# Copy only necessary files from the builder stage
# Copy 'public' folder
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Copy '.next' folder (standalone or static + server files)
# If using Next.js 12+ with output: 'standalone' in next.config.js:
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# For standard Next.js build (without standalone):
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Copy package.json to install only production dependencies for 'next start'
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
# If using Yarn:
# COPY --from=builder --chown=nextjs:nodejs /app/yarn.lock ./yarn.lock
# COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Install production dependencies only
# This is needed if you're using `next start` which requires `next` as a dependency.
# If you're using the standalone output, this step might not be strictly necessary
# as `standalone` bundles necessary node_modules.
RUN npm install --only=production --ignore-scripts --prefer-offline
# If using Yarn:
# RUN yarn install --production --frozen-lockfile

# Switch to the non-root user
USER nextjs

# Expose the port the app runs on (Next.js default is 3000)
EXPOSE 3000

# Environment variable for the port (optional, Next.js picks up PORT env var)
ENV PORT 3000

# Command to run the application
# For standard Next.js build (without standalone):
CMD ["npx", "next", "start"]
# If using Next.js 12+ with output: 'standalone' in next.config.js, the command would be:
# CMD ["node", "server.js"]

# (Optional) Healthcheck to ensure the application is running
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:3000/ || exit 1