# Docker Workshop

This repository contains the code and resources for the Docker Workshop.

In this hands-on session, you will learn how to leverage [Docker](https://www.docker.com/) to containerize a simple Node.js Chat App:

```mermaid
flowchart TD
    U1((User 1)) & U2((User 2)) & U3((User 3)) --> F
    F[Next.js Frontend] --> B
    B[Express.js Backend] --> DB[(MongoDB)]
```

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your machine. You can download it from [nodejs.org](https://nodejs.org/).
  > This workshop is designed to work on Node.js 22 LTS, and may not work on other versions.
- **Docker**: Ensure you have Docker installed on your machine. [Refer to the official Docker installation guide](https://docs.docker.com/get-docker/) for instructions.

## Getting Started

1. Clone this repository:

   ```sh
    git clone https://github.com/yourusername/docker-workshop.git
   ```

2. Authenticate with [GitHub Container Registry (ghcr)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) to push images:
   Replace `GITHUB_USERNAME` with your GitHub username and `GITHUB_TOKEN` with a personal access token that has `write:packages` scope.
   ```sh
   echo $GITHUB_TOKEN | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
   ```

## Part 1: Docker in Development

Docker can be used to spin up development services quickly.

Suppose you where working on the Express.js backend of the Chat App, which
depends on MongoDB.

You can use Docker to run MongoDB in a container on your local machine without installing it directly.

1. Run the MongoDB container:
   ```sh
   docker run  \
       --rm  \
       -p 27017:27017   \
       -e MONGO_INITDB_ROOT_USERNAME=admin \
       -e MONGO_INITDB_ROOT_PASSWORD=secret  \
       mongodb/mongodb-community-server:8.0.9-ubi9
   ```
2. In a new terminal, configure the backend to connect to the MongoDB instance by creating `.env` file in `backend` directory with the following content:

   ```
   MONGO_URL=mongodb://admin:secret@localhost:27017
   ```

3. Start the backend server, assuming you are already in the `backend` directory:
   ```sh
   npm install
   npm run dev
   ```

## Part 2: Building the Backend Container

Now that you have the backend working in development, let's containerize it.

1. Write a `Dockerfile` in the `backend` directory to build the `backend` container.

   - Compile the TypeScript code to JavaScript with `tsc`
   - Set the container command run the built JavaScript code with `node`

   > If you get stuck refer to the [solution](backend/Dockerfile.solution)

2. Build the Docker image, tagging it for publishing to [ghcr](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

   > Replace `GITHUB_USERNAME` with your GitHub username:

   ```sh
   docker build -t backend ghcr.io/GITHUB_USERNAME/chat-backend:latest
   ```

3. Push the image to GitHub Container Registry:

   > Replace `GITHUB_USERNAME` with your GitHub username:

   ```sh
   docker push ghcr.io/GITHUB_USERNAME/chat-backend:latest
   ```

## Part 3: Building the Frontend Container

Building the frontend container is similar to the backend:

1. Write a `Dockerfile` in the `frontend` directory to build the `frontend` container. Tips & tricks:

   - Do you need to keep the `node_modules` in the final image? What is minimal set of files you need to run the frontend?
   - Maybe [Next.js Docker documentation](https://nextjs.org/docs/deployment#docker) could help?
   - Try to use multi-stage builds `FROM ... AS ...` to keep the final image small.

     > If you get stuck refer to the [solution](frontend/Dockerfile.solution)

2. Build the Docker image, tagging it for publishing to [ghcr](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

   > Replace `GITHUB_USERNAME` with your GitHub username:

   ```sh
   docker build -t frontend ghcr.io/GITHUB_USERNAME/chat-frontend:latest
   ```

3. Push the image to GitHub Container Registry:

   > Replace `GITHUB_USERNAME` with your GitHub username:

   ```sh
   docker push ghcr.io/GITHUB_USERNAME/chat-frontend:latest
   ```

## Part 4: Ochestration with Docker Compose

Getting multiple containers to work together can be tricky, especially when they depend on each other.

```
docker run ... mongodb
docker run ... chat-backend
docker run ... chat-frontend
```

Docker Compose is a tool that allows you to define and run multi-container deployments easily.

1. Create a `.env` file in the define environment variables to be used in the `docker-compose.yml` file:

   ```env
   MONGO_USERNAME=admin
   MONGO_PASSWORD=secret
   ```

2. Write a `docker-compose.yml` file in the root directory of the repository to define the services:

   - `mongodb`: Use the official MongoDB image, similar to how you ran it in developmentj0.

     - Direct MongoDB to use `MONGO_USERNAME` & `MONGO_PASSWORD` to initialize the root user.
     - Map the port `27017` to your host machine.
     - Use a named volume to persist data across container restarts.

   - `backend`: Use the `ghcr.io/GITHUB_USERNAME/chat-backend:latest` image.

     - Use the [build](https://docs.docker.com/reference/compose-file/build/) specification to build the image from the `backend` directory.
     - Direct backend to to connect to the MongoDB instance with `MONGO_URL` environment variable.
     - Map the port `3001` to on your host machine to the backend container.
     - Add a `restart` policy to restart the container starts before MongoDB is ready.

   - `frontend`: Use the `ghcr.io/GITHUB_USERNAME/chat-frontend:latest` image.
     - Use the [build](https://docs.docker.com/reference/compose-file/build/) specification to build the image from the `frontend` directory.
     - Direct frontend to connect to the backend instance with `NEXT_PUBLIC_BACKEND_URL` environment variable.
     - Map the port `3000` on your host machine to the frontend container.

   > If you get stuck refer to the [solution](docker-compose.yml.solution)

3. Bring up the services with Docker Compose:

   ```sh
   docker compose up
   ```

4. Open your browser and navigate to `http://localhost:3000` to see the Chat App in action.

5. Clean up the resources when you are done:
   ```sh
   docker compose down -v
   ```

## Further Reading
Docker Compose is fine for development and testing, but in production would want to use [Kubernetes](https://kubernetes.io/) for orchestration.

Converting the `docker-compose.yml` file into Kubernetes manifests is left as a challenge for the reader.
