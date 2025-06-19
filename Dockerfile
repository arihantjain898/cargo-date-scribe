
# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (production and dev) needed for building
RUN npm ci

COPY . .

# Build the frontend application. Output will be in /app/dist
RUN npm run build

# Stage 2: Serve the built application with Nginx
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Add a custom Nginx configuration to listen on port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run expects your application to listen on the port specified by the PORT environment variable.
# Nginx by default listens on port 80. We need to tell it to listen on $PORT (8080).
ENV PORT 8080
EXPOSE 8080

# Nginx command to run in the foreground
CMD ["nginx", "-g", "daemon off;"]
