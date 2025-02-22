# Use an official Node.js runtime as a parent image
FROM node:20
# Set the working directory in the container
WORKDIR /usr/src/app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
# Install application dependencies
RUN npm install
# Copy your application code into the container
COPY . .
# Define the command to run your application
CMD ["npm", "run", "start"]