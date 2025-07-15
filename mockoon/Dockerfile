# Use the official Node.js image as the base image
FROM node:latest

# Install Mockoon
RUN npm install -g @mockoon/cli@latest

# Copy package.json and package-lock.json (or yarn.lock) into the working directory
COPY data/mockoon-env.json ./data

# Your app binds to port 8080 so you'll use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 8080

# RUN npm install

# Define the command to run your app using CMD which defines your runtime
ENTRYPOINT ["mockoon-cli", "start", "--port", "8080", "--data", "data", "-t"]