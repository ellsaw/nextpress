# Nextpress
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
1. **Run the install script:** `npx nextpress-init`

4. **Start the application:** `npx np run dev`/`npx np run start`

Upon a successful deployment, the CLI will confirm the environment is active and if in a development environment; that file watching has started.


## Available Commands
* `npx np run dev`: Starts the environment in development mode using NODE_ENV=development. Enables Next.js hot module reloading (HMR) and Docker file syncing.

* `npx np run start`: Builds and starts the production-ready environment (NODE_ENV=production).

* `npx np down`: Tears down the Docker Compose network and removes the containers. Used with a production environment.

* `npx np log`: Runs logging of the current running Nextpress environment. Used with a production environment.

* `npx np install`: Installation script for the Nextpress environment.

* `npx np wp-cli <command>`: Runs a Wordpress CLI command.


## Architecture & Services
### The application consists of the following Docker services: (Docker services and the nginx configuration can be extended or overwritted with the various .extend files.)
* **db:** MySQL 8.0 database holding the WordPress data.

* **wordpress:** WordPress 6.9.4 core container.

* **wp-cli:** Utility container that verifies the WP installation, creates the admin user, and configures permalinks on startup.

* **next-js:** The Next.js 16 frontend application. It uses a multi-stage Dockerfile to serve optimized standalone builds in production or run an active dev server.

* **adminer:** A lightweight database management tool.

* **gateway:** An Nginx Alpine container acting as a reverse proxy. It routes /wp-* requests to WordPress, /db-admin to Adminer, and defaults all other traffic to Next.js.

* **ready-check:** A simple Alpine container that waits for the gateway to become healthy before printing access URLs.
