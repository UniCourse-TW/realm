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

## First Run

1. Open a terminal in VSCode.
2. Run `pnpm dev` to start the server in development mode.
3. Go to `http://localhost:3000/`, you should see there are 0 courses, 0 posts, and 1 user.
4. You should also see a panel with title "Welcome aboard", this panel only appears for your first account (specifically, if these only 1 user in DB).
5. Get started with entering usernames and roles, then you would be navigated to register page to complete the account information.
6. Voilà, your first account is ready!

In case the above approach doesn't work, you can follow these instructions to create your account in DB.

1. Go to `http://localhost:7474/`, which is the database management interface.
2. Login as `neo4j` with password `password`.
3. In the browser view, click on the `*` node labels to see the data in graph and see the invitation code owned by admin.
4. Then, you can use the invitation code to register your account in the realm website.
5. Next, you can give yourself roles `Verified`, `CoursePacker`, `Moderator` by running queries like:

```cypher
MATCH (u:User {username: "your_username"}) SET u:Verified
```

6. Remember to re-login to refresh the token.
7. Now you can import some course packs and start using UniCourse Realm!
