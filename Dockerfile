# Use the official Node.js image as a base
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# RUN npm run build - not yet

# Expose the port that Next.js listens on (usually 3000)
EXPOSE 1425

# Run the Next.js application
CMD ["npm", "run", "dev"]
