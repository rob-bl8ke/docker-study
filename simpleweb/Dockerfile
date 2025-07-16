# Specify a base image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /usr/app

# Install some dependencies (don't copy index.js)
COPY package.json ./
RUN npm install

# Copy the rest of the application code
# this will not invalidate the cache for the npm install step
COPY ./*.js ./

# Default command
CMD ["npm", "start"]