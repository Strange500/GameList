# Use the official Node.js image as the base image
FROM node:22 AS builder

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the entire application code
COPY . .

# Build the application
RUN pnpm build

# Use a smaller Node.js image for the production build
FROM node:22 AS runner

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
RUN npm install -g pnpm

# Install only production dependencies
RUN pnpm install --prod

# Expose the application port
EXPOSE 3000

# Set the command to start the Next.js app
CMD ["pnpm", "start"]