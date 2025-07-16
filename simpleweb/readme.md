
# Building the `Dockerfile`
To run the app, basic steps are:
- Install node (if not installed).
- Install npm (if not installed).
- Install all dependencies before running the app, use `npm install`.
- Run a command to start up the server, use `npm start`.

When working with `Dockerfile` one will:
- Specify the base image
- Run some commands to install additional programs (node, npm).
- Specify a command to run on container start-up (npm start).

## Evolution behind creating the `Dockerfile`
Follow these steps from the [Udemy Course Section](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436944#overview) its based on. Let's start with this starting code and do a `docker build .` and see what error is generated.

```docker
# Specify a base image
FROM alpine

# Install some dependencies
RUN npm install

# Default command
CMD ["npm", "start"]
```
The error looks something like this:

```
...
 => ERROR [2/2] RUN npm install                                                                                                                                                                                                                                                              0.3s
------
 > [2/2] RUN npm install:
0.225 /bin/sh: npm: not found
...
ERROR: failed to build: failed to solve: process "/bin/sh -c npm install" did not complete successfully: exit code: 127
```

We don't have the default programs required to intall npm. The alpine image doesn't have too many programs installed. There are two options:
- Find another base image
- Continue with alpine, but build up from scratch.

Let's make our lives easier and go find another base image. There's an [official node image](https://hub.docker.com/_/node) on Docker Hub. [Here's the video that demonstrates how to set this up](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/35328728#overview).

```docker
# Specify a base image
FROM node:14-alpine

# Install some dependencies
RUN npm install

# Default command
CMD ["npm", "start"]
```
💥 Note - Getting an alpine version means that you're getting a very stripped down version of an image. Good for small image footprints.

This won't work because `package.json` and `index.js` have not been moved to the image. Let's add them. This should take place before trying to do a `npm install`.

```docker
# Specify a base image
FROM node:14-alpine

# Copy from yours to the container (relative to the build context)
COPY ./ ./

# Install some dependencies
RUN npm install

# Default command
CMD ["npm", "start"]
```

Run `docker build .`, this should show that all 3 steps have been completed successfully and that an image has been created with a SHA. Nice, but a SHA isn't pretty so lets tag the image.
```bash
# Tag will be automatically set to "latest"
docker build -t bugsbunny/simpleweb .
```
Now run the image using...
```
docker run bugsbunny/simpleweb
```
Run a `curl http://localhost:8095`. Note that curl fails to connect. Let's fix it...

```
docker run  -p 8095:8080 bugsbunny/simpleweb
```
Now the curl command will work. Let's debug it...

```
docker run  -it bugsbunny/simpleweb sh
```
When we run the `ls` command we see everything has been added to the root folder which is not really what we want. Very dirty and we could accidentally overwrite stuff by doing this. Let's rather copy all of these files into a folder. Although it doesn't always matter in the Linux world where you put stuff, the `usr` folder is a safe place to put your application.

```docker
# Specify a base image
FROM node:14-alpine

WORKDIR /usr/app

# Copy from yours to the container (WORKDIR)
COPY ./ ./

# Install some dependencies
RUN npm install

# Default command
CMD ["npm", "start"]
```
Everything should still run as it has been running after you rebuild the image. Note however that if you run using a shell (`docker run -it bugsbunny/simpleweb sh`), the shell will open automatically into the `WORKDIR`. Let's start the container normally using `docker run  -p 8095:8080 bugsbunny/simpleweb`, open up another terminal, and explore it in the following manner...
```bash
# Look for the running container... get the container id
docker ps

# Open a shell into the container... note how it opens in WORKDIR
# and all your files have been added there.
docker exec -it f0161b1510cf sh
```
Simply type "exit" at the prompt when you're done to exit the container.

Changing the source code will not change the way the container behaves. An image is a snapshot, and therefore changes to source code will not show up. Also, at this point, if a change is made to the source code, Docker will have to build everything (including the dependencies). This happens because `npm install` occurs after we've copied the files. This can be fixed by copying the files in two seperate steps as show below. This will ensure that the cache is not invalidated if the code is changed. Changes to the `package.json` file will ofcourse invalidate the cache for the dependency building step.

```docker
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
```
