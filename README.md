# UniCourse Realm

A POC for Hybrid UniCourse Server.

## For Deployers

### Getting Started

1. Ensure you have [Docker](https://www.docker.com/) installed.
2. Clone this repository.
3. Setup the environment variables in the `.env` file, see `.env.example` for reference.
4. Run `docker compose up -d` to start the server.

> When in production, we use `cloudflared` to proxy the traffic.
> You can configure it through the Cloudflare dashboard and decide which services to expose.

## For Developers

### Getting Started

1. Ensure you have [Docker](https://www.docker.com/) and [VSCode](https://code.visualstudio.com/) installed.
2. Clone this repository.
3. Open the repository in VSCode, when prompted to open in a container, click "Reopen in Container".
4. Wait for the container to build and start, it will take a while and install all the dependencies for you.

## Running the server

1. Open a terminal in VSCode.
2. Run `pnpm dev` to start the server in development mode.
