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


### Example with Redis

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

### Get full terminal access with `sh`

- [Video Tutorial](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436674#overview)

This is extremely useful for debugging your container. Start with full terminal access. `sh` is a command processor or shell. This is like Bash or Powershell.

```
docker exec -it 8e4bed4263a7 sh
```

```
PS C:\Code\[user]\docker-study> docker exec -it 8e4bed4263a7 sh
# cd ~/
# ls
# cd /
# ls
bin  boot  data  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
# echo hi there
hi there
# export b=5
# echo $b
5
# redis-cli
127.0.0.1:6379>
```

💡Quick tip: If you're in the CLI and `CRTL+C` does not work, try `CTRL+D` and that should work.

`docker run -it [image] sh` will also open up a Shell and it is quite useful to poke around without some other process running. The downside is that you will not be running any other process. So the usual process that will run when you run the docker container will not run at all.

```
docker run -it busybox sh
```


## `Dockerfile`

```docker
# Step 1: Set the operating system
FROM alpine

# Step 2: Download and install dependencies
RUN apk add --update gcc
RUN apk add --update redis

# Step 3: Tell the image what to do when it starts as container
CMD ["redis-server"]
```

The easiest way to build a `Dockerfile` is to...

```
docker build .
```
However, it is better to tag your images...

```bash
# Convention: YOUR_DOCKER_ID/REPO:VERSION
docker build -t bugsbunny/redis:latest .

# Run it
docker run bugsbunny/redis:latest
# or
docker run bugsbunny/redis # latest version used by default
```

Technicaly, only the version is the tag. But the approach is referred to as "tagging your image".


#### The build cache, intermediate containers, and temporary images

- [Udemy Video](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436706#overview) breaks down the build process in detail while looking at an simple redis example using alpine.
    - It explains intermediate containers and temporary images that are created and removed during the build pocess. Also take a look [at this one](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436708#overview).
    - [Rebuilds and cache](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436712#overview) shows how when commands are added, the cache is still used to fetch previous images.

#### Examples
- [Mockoon](https://github.com/rob-bl8ke/docker-study/tree/main/mockoon) for details of how to build and run.

# References

## Images

- [busybox](https://hub.docker.com/_/busybox)
- [hello-world](https://hub.docker.com/_/hello-world)

## Useful Git Repositories

#### Yours
- [Spring Kafka and Avro Local Repository](https://github.com/rob-bl8ke/spring-kafka-avro-local) - A repository you maintain, that explores the ability to run Kafka and an Avro compatible schema registry locally on the development machine. The [`docker-compose.yml`](https://github.com/rob-bl8ke/spring-kafka-avro-local/blob/main/docker-compose.yml) file also loads akhq (a lightweight UI for Kafka), and Mockoon. The prototype contains detail as to how one might interact and use these instances once loaded.
- [Udemy Course: Build a Microservices app with .Net and NextJS from scratch](https://www.udemy.com/course/build-a-microservices-app-with-dotnet-and-nextjs-from-scratch/?couponCode=MT150725G1) - There's an example of a [`docker-compose.yml`](https://github.com/rob-bl8ke/car-auction/blob/main/docker-compose.yml) that uses Postgres, MongoDB, and RabbitMQ. This repository also has a README that details how to work with the instances.
- [Spring Boot Basic Authentication](https://github.com/rob-bl8ke/spring-basic-auth) repository has a [`compose.yml`](https://github.com/rob-bl8ke/spring-basic-auth/blob/main/compose.yaml) using MySQL.
- A Spring Boot PostgreSQL POC which has some information as to how to query the state of the database in VS Code... see [`docker-compose.yml`](https://github.com/rob-bl8ke/spring-kafka-postgres-testing/blob/main/docker-compose.yaml)

#### Other

- [poc-spring-boot-kafka](https://github.com/pgolpejas/poc-spring-boot-kafka) - Is a resource you discovered that uses Testcontainers and docker-compose to spin up Kafka (with the old ZooKeeper), RedPanda, Loki, Grafana, PostgresSQL, Prometheus, Tempo and uses a shared network.