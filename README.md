# Nextpress **(WIP)**
Nextpress is a headless WordPress environment with an integrated Next.js frontend.

Instead of relying on the traditional WordPress REST API or WPGraphQL, Nextpress achieves high performance by fetching data directly from the WordPress MySQL database using a custom database driver.

The application orchestrated using Docker Compose behind an Nginx gateway routing traffic between the Next.js application and the WordPress Admin panel.


## Features
* **Direct Database Fetching:** The Next.js frontend connects directly to the MySQL database bypassing standard API overhead.

* **Modern Frontend Stack:** Built with Next.js 16.2.6, React 19.2.4, and Tailwind CSS v4.  

* **Automated Setup:** CLI automatically provisions and configures the DB, WordPress, Next.JS and Adminer.

* **Unified Gateway:** Nginx handles routing natively on port 8080, allowing frontend features, WordPress admin, and the database to share a single port.  

* **Built-in Database Management:** Includes Adminer accessible directly via the gateway.  

* **Seamless Development Environment:** Development environment that watches your Next.js code to offer native-like live updating and Hot Module Reloading.


## Prerequisites
* **Docker**

* **Docker Compose**

* **Node**

* **npm**


## Getting Started
1. **Clone the repository:** Clone the project to your local machine.

2. **Setup Environment Variables:** Copy the example configuration file to create your .env file. `cp .env.example .env`

3. **Install Root Dependencies:** Install dependencies `npm install`

4. **Start the application:** `npm run dev`/`npm run start`

5. **IF DEVELOPMENT ENVIRONMENT – Generate database types:** `npm run generate-db-types`

6. **IF PRODUCTION ENVIRONMENT – Stop the application:** `npm run stop`

7. **Remove containers:** `npm run remove`

Upon a successful deployment, the CLI will confirm the environment is active and if in a development environment; that file watching has started.


## Available Commands
* `npm run dev`: Starts the environment in development mode using NODE_ENV=development. Enables Next.js hot module reloading (HMR) and Docker file syncing.  

* `npm run start`: Builds and starts the production-ready environment (NODE_ENV=production).  

* `npm run stop`: Stops all running Nextpress containers without removing them.  

* `npm run remove`: Tears down the Docker Compose network and removes the containers.  

* `npm run wp -- <command>`: A wrapper to run WP-CLI commands inside the container without needing to manually docker exec (e.g., `npm run wp -- plugin list`).  

* `npm run generate-db-types`: Connects to the running database container and auto-generates TypeScript types (wpdb.d.ts) for use in the Next.js application. 


## Architecture & Services
### The application consists of the following Docker services defined in docker-compose.yml:
* **db:** MySQL 8.0 database holding the WordPress data.  

* **wordpress:** WordPress 6.9.4 core container.  

* **wp-cli:** Utility container that verifies the WP installation, creates the admin user, and configures permalinks on startup.  

* **next-js:** The Next.js 16 frontend application. It uses a multi-stage Dockerfile to serve optimized standalone builds in production or run an active dev server.

* **adminer:** A lightweight database management tool.  

* **gateway:** An Nginx Alpine container acting as a reverse proxy. It routes /wp-* requests to WordPress, /db-admin to Adminer, and defaults all other traffic to Next.js.  

* **ready-check:** A simple Alpine container that waits for the gateway to become healthy before printing access URLs.