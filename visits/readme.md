# Motivation for `docker compose`

These two containers do not have any context of each other. They're totally isolated from each other. So...

```
docker run redis
```
and then...
```
docker build -t bugsbunny/visits:latest .
docker run bugsbunny/visits
```

... will result in an error in this situation.

A shared network is required. When you set up docker cli for networking its a real pain. You have to run a number of commands in sequence to get things to work and configure the network and have the instances talk to each other. It's better to use `docker compose`. It designed for precisely this situation.

# `docker compose`

[Series of videos for this example can be found here](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11436978#overview)

- `services` is like a top level container that will contain two services. These services are redis, and visits.
- `redis-server` is the name of the redis container and it will be pulled from an image.
- `node-app` is going to be built from the `Dockerfile`.
    - This is specified using the `build` property.
    - Ports are mapped as one would with a `docker run -p 3000:3000`.

💡When two containers are used running `docker compose` from the file, both services will be on the same internal network. The port mapping for `node-app` is simply to expose and external port into the top-level container environment.

Have a look at the `index.js` file. Usually, when building a node application you'd so something like:

```javascript
const client = redis.createClient({
        host: 'https://my-redis-server.com',
        port: 6379
    });
```

When using `docker compose`, one can simplify it to simply `redis-server`. `node.js` has no idea what `redis-server` is but will simply take it on good faith and try and connect to the server. Docker sees this and resolves it to the correct contained service. The port number is simply the default port for redis.

### Running it

Use `docker compose up` to run everything. If you want to rebuild everything, use `docker compose up --build`. Once up and running send some requests. The responses should show you that the number of visits has been incremented.

```
curl http://localhost:4001
```

- Use `docker compose -d` to run silently in the background.
- Use `docker ps` to see the containers running.
- Use `docker compose ps` to see information about what is running. It needs to be run in the same directory as your `docker-compose.yml` file.
- Stop the container by  running `docker compose down` in the same directory as the `docker-compose.yml` file.

## Maintenance

What happens when a service crashes? Uncomment the following lines and simulate a crash.

```javascript
const process = require("process");
...
process.exit(0); // 0 for OK... 1,2,3 for an error failure code.
```

Rebuild and run with the `--build` flag. Now do a `docker ps` to see that both processes are running. Try and make a request and you'll see something to the effect of...

```
node-app-1 exited with code 0
```

Do a `docker ps` to confirm that one of the services (node-app) no longer exists. Its crashed. What are our options?

💥 When exiting with a status 0 this states that we exited and everything is OK. When exiting with a non-zero, its due to a failure.

### Restart policies

[See the video on Udemy](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/learn/lecture/11437008#overview)

| Value | Description |
| --- | --- |
| no | Never attempt to start this container if it stops or crashes |
| always | If this container stops for no reason, always attempt to restart it |
| on-failure | Only restart if the container stops with an error code |
| unless-stopped | Always restart unless we (the developers) forcibly stop it |

To test different combinations of these restart policies, modify the `docker-compose.yml` file with whatever policy you'd like to explore. Note that if you change the exit code in `index.js`, the app will fail with an error code as explained above and you can try this out to test further combinations and behavior.

- If you're running a web server, you might want to always keep your container running.
- A worker process would want to run once, complete, and die. So here you'd often use on-failure.

# Running with Redis v4+

Here is the updated index.js file that will work with redis 4.7.0. As you can see, the change is in the `createClient`.

```javascript
const express = require("express");
const redis = require("redis");
 
const app = express();
const client = redis.createClient({
  url: "redis://redis-server:6379",
});
 
(async () => {
  await client.connect();
  await client.set("visits", 0);
})();
 
app.get("/", async (req, res) => {
  const visits = await client.get("visits");
  res.send("Number of visits " + visits);
  await client.set("visits", parseInt(visits) + 1);
});
 
app.listen(8081, () => {
  console.log("listening on port 8081");
});
```