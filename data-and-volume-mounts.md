# Data

There are different kinds of data:

- Application Data (Code and environment)
- Temporary Application Data (eg. entered by user input)
- Permanent Application Data (eg. user accounts)

### Application Data

Written and provided by you the developer. Added to the image. Forms part of the initial data or state of the container after the build phase. This code is fixed and can't be changed once it has been built. Once the image is built, the layers are locked into that image.

### Temporary App Data

It is ok to lose this data when we shut down the container. This data is fetched and produced by the running container. It can be stored in memory or in retrieved from temporary files. The data is dynamic and changing but is cleared regularly to start clean from some initial system state.

Stored in containers as read write data when the container is running. Cleared when the container is stopped.

### Permanent App Data

Fetched and used in the running container. Stored in files or a database. Must not be lost if container stops / restarts.

Read and write and permanent. This data is stored in Containers and Volumes.

# Volumes and Bind Mounts

Volumes are managed by Docker and Bind Mounts are managed by you.

Volumes come in two types and both have their own use cases. This is an anonymous volume.

```
VOLUME [ "/app/feedback" ]
```

In this case Docker sets up some folder and path on your host machine (don't know where) as you have only supplied the container folder. The only way you can get access to this volume is with the `docker volume` command.

`docker volume --help`

### Anonymous Volumes
Use `docker volume ls` to display a list of volumes. Anonymous volumes have no name and when you remove your container you will find that the anonymous volume is also gone. This kind of volume does not exist once you remove your container.

### Named Volumes
Shares the property (with the anonymous volume) that you do not know where it is created on your machine. Docker handles all of it. Difference is the named volume will survive  once your docker container is removed.

The volumne folders will be available when you run the docker container again. You're not to edit these volume folders so it is only right that you don't know where they are.

You cannot create a named volume inside a docker file. You create a named volume when you run a container using the `-v` flag. This volume will not be destroyed if you remove the container.

```
docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback feedback-node:volumes
```
Named volumes are not attached to a container. You'll run the above command multiple times. The container will be different, but the accessed volume will be the same volume based on the way you reference it and because it already exists and is being managed by Docker.

We saw, that anonymous volumes are removed automatically, when a container is removed.

This happens when you start / run a container with the --rm option.

### Removing Anonymous Volumes

If you start a container without that option, the anonymous volume would NOT be removed, even if you remove the container (with `docker rm ...`).

Still, if you then re-create and re-run the container (i.e. you run docker run ... again), a new anonymous volume will be created. So even though the anonymous volume wasn't removed automatically, it'll also not be helpful because a different anonymous volume is attached the next time the container starts (i.e. you removed the old container and run a new one).

Now you just start piling up a bunch of unused anonymous volumes - you can clear them via `docker volume rm VOL_NAME` or `docker volume prune`.

### Bind Mounts

Changes that are made in `server.js` do not reflect in the container as it is written into the image. During development we change a lot and it is important that source code changes are reflected in the container. This is where bind mounts can help us.

Volumes are managed by Docker and we don't know where the location of these folders are. You decide where bind mounts are located. You can put your source code in a bind mount and make your container aware of it. Bind mounts are great for persistent and editable data.

[Here is some information as to how to get this to work with Winows with Docker Toolbox](https://headsigned.com/posts/mounting-docker-volumes-with-docker-toolbox-for-windows/)

`docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v "/C/Code/udemy/max-docker/data-volumes-03-adj-node-code:/app" feedback-node:volumes`

Use `docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v %cd%:/app feedback-node:volumes` when you are running the command from the windows command line.
Use `docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v ${PWD}:/app feedback-node:volumes` when you are running the command from PowerShell.
Use `docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v ${PWD}:/app feedback-node:volumes` when you are running the command from maxOS or Linux.
`docker logs`
`docker ps -a`
`docker rm feedback-app`
`docker run -d -p 3000:80 --name feedback-app -v feedback:/app/feedback -v $(pwd):/app feedback-node:volumes`

The reason why you get an error such as `Error: Cannot find module 'express'` is that when you mount the bind mount directory into the current container directory you overwrite everything in the container which means that the `node_ modules` are no longer present. Its as if the `npm i` never took place.

Need to tell Docker that certain files should not be overwritten in case of a clash. This can be achieved with another (anonymous) volume that we can add to a container. If we add one more volume we can bind the `app/node_modules` container directory as an anonymous volume. Docker evaluates all volumes and its simple rule is that the longest most specific path wins. So you can say that the anonymous volume `/app/node_modules` folder overwrites the non-existent `/app/node_modules` folder and hence the `node_modules` folder will survive and co-exist together with the bind mount that also works.

In order to get `docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v ${PWD}:/app -v /app/node_modules feedback-node:volumes` to work, the current directory must be the root directory of your local solution folder (the same folder the Dockerfile is in). Otherwise you must use and absolute path such as `docker run -d -p 3000:80 --rm --name feedback-app -v feedback:/app/feedback -v "/C/Code/udemy/max-docker/data-volumes-03-adj-node-code/app" -v /app/node_modules feedback-node:volumes`.
