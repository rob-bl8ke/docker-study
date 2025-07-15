# Study Docker

Ensure that Docker is running and check the version.
```bash
docker version
```

Download the hello-world app to your image cache, create a container, and run it.

## Running Docker

- Source Tutorials: [Docker and Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436646#overview)

If the image does not exist on your computer it will be downloaded from Docker Hub. Here are some variations as to how this command can be run.

```bash
docker run hello-world
```

`echo hi there` is the command that gets executed when you run `busybox`.
```bash
docker run busybox echo hi there
```

This will print out the list of files and directories in the root folder of the container.

```bash
docker run busybox ls
```

These two commands (`ls` and `echo`) work on `busybox` because the programs exist inside the image. If you had to try these two commands with the `hello-world` you would get an error.

This [tutorial on Udemy](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436650#overview) explains the container lifecycle. It discusses `docker run` as the equivalent of `docker create` and `docker start`.

```
docker create hello-world
docker start -a [container-id]
```
The above commands accomplish the same thing as `docker run`. If the `-a` flag is omitted, Docker will not watch the output and print it to the terminal.

If you've forgotten to use the `-a` flag and you still would like to see the missed output, use the following commands to see the output.
- [Source video](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436660#overview)

```bash
docker create busybox echo hi there
docker start 7174462c205db6fd4db43bce34587373243c0eb4a997230fb9b703bab763a3fe
docker logs 7174462c205db6fd4db43bce34587373243c0eb4a997230fb9b703bab763a3fe
```

💥Running `docker start -a [container-id]` will run the container as it was originally run. If one wants to change the command, a new container will need to be created.


## List running containers

Running the following command (`docker run busybox ping google.com`) will begin pinging Google. In order to see this container running, open another terminal and run the following:

```
docker ps
```
Press CTRL + C to stop the container.

This command shows all the containers that have ever been created. These have all been started up and shut down on our behalf.

```
docker ps -a
docker ps --all
```

A common usage of this command to get an id of a running container.

## Stopping containers

Instead of using `CTRL+C` one can stop a container gracefully using a `SIGTERM` message to tell the system to shut down on its own time. This allows time for system cleanup before the process is destroyed.

```bash
docker create busybox ping google.com
docker start 1487118ae1d16ce24c661
docker logs 1487118ae1d16ce24c661
docker stop 1487118ae1d16ce24c661 # or docker kill
docker ps -a
docker logs 1487118ae1d16ce24c661
```

💥Use `docker kill` will terminate immediately without cleanup. This will happen anyway if the `docker stop` does not shut down within 10 seconds. This actually does occur with the ping command.

💡Prefer using `docker stop`.

## Cleaning up and reclaiming disk space

- Source Tutorials: [Docker and Kubernetes: The Complete Guide](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436656#overview)

The command below is a complete reclamation. It cleans everything. Next time you run these commands you'll have to download all images again. A good command to use when you're not going to use Docker for a couple of weeks.

```bash
# Removes stopped containers, netowrks, dangling images, and build cache.
docker system prune
```

## Multi-command Containers

- [Source Video - Connect to Redis CLI](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436668#overview)
- [Source Video - The `it` flag](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436670#overview). Explains the `STDIN`, `STDOUT`, and `STDERR`and how it relates to this flag.

In order to run the following commands, ensure that you have two terminals available. Split them in either VS Code or in your preferred terminal for easy viewing.

In the first terminal, run the redis container.
```
docker run redis
```

In the second terminal, to start up the redis-cli, one must use `docker exec`. Using `-it` allows us to provide input to the container. One needs the image id in order to run the command.

```bash
docker ps
docker exec -it 26aa8436ccaf redis-cli # -it is equivalent to -i -t
```
```
127.0.0.1:6379> set myvalue 5                                                                                                 
OK
127.0.0.1:6379> get myvalue
"5"
```
The above command will start up a terminal within redis-cli and now commands can be executed against the redis instance.


# References

## Images

- [busybox](https://hub.docker.com/_/busybox)
- [hello-world](https://hub.docker.com/_/hello-world)