# Build stage: Why: Isolates the build environment to ensure consistent, 
# reproducible builds regardless of the developer's local setup.
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage: Why: Uses a lightweight Nginx server to serve 
# static assets as efficiently as possible in a production environment.
FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
