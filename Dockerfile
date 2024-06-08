# Stage 1: Build the React app
FROM node:18 AS build

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the React app
RUN yarn build

# Stage 2: Serve the built React app using serve
FROM node:18-alpine

# Install serve globally
RUN yarn global add serve

# Set working directory
WORKDIR /app

# Copy the built app from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 5000
EXPOSE 3000

# Command to serve the built React app
CMD ["serve", "-s", "dist", "-l", "3000"]
