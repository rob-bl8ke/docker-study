### Running the `Dockerfile`

Run the following command.

```bash
docker build -t mock-engine .
docker image ls # Find the image
docker run -p 8091:8080 mock-engine
```

Now, run a curl command. You can generate the curl command by going to Bruno, looking for the code button on the top right of the request window (hover over to get "Generate code"), and opening the window. Pick the curl option and paste the following into the terminal.

```bash
curl http://localhost:8091/hello
```