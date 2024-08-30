# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json yarn.lock ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 9000

# Define the command to run your application
CMD ["node", "server.js"]
