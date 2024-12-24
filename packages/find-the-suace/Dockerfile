# Use an official Node.js runtime as a parent image
FROM node:20

# Install PostgreSQL client
RUN apt-get update && apt-get install -y

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the app's code into the container
COPY . .

# Expose port 3001
EXPOSE 3001

# Run the Prisma migrations and start the development server
CMD ["sh", "-c", "npx prisma migrate deploy && yarn dev"]
