# Catalog Backend

## Description

The Catalog Project Backend serves as the foundation for a comprehensive catalog system, providing essential functionality for managing users and catalogs. Built with Express.js and Prisma ORM, this backend offers a robust API that allows clients to perform various actions, including user management (such as user creation, editing, login, logout, and registration) and catalog management (including catalog creation, editing, deletion, and retrieval).
Certainly! Here's a brief explanation about the branches `main` and `prod`:

## Branches

### `main`

It contains the latest stable version of the codebase, which undergoes regular development, testing, and integration. Developers actively contribute to this branch, implementing new features, fixing bugs, and improving the overall functionality of the backend.

### `prod`

This branch is reserved for deploying stable releases to the live production environment. It mirrors the `main` branch but is specifically designated for production-ready code. Developers typically do not directly interact with the `prod` branch during regular development.

### Purpose

- **`main`**: Acts as the main development branch for ongoing work and feature implementation.
- **`prod`**: Represents the stable production environment, ensuring reliable and consistent operation without requiring direct involvement from developers.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)

## Prerequisites

- Node.js version : v20.11.0

## Installation

Use npm to install all the required dependencies. Run the following command in your terminal:

```bash
npm install
```

Certainly! Here's a configuration section based on the provided points:

## Configuration

To set up the Catalog Project Backend, follow these configuration steps:

1. **Database Connection**:

   - Connect your PostgreSQL or Supabase PostgreSQL database by creating environment variables:
     - `DATABASE_URL`: Specifies the connection URL for your database.
     - `DIRECT_URL`: Provides an alternative connection URL if needed.

2. **Database Migration**:

   - Run the following command to apply database migrations using Prisma:
     ```bash
     npx prisma migrate dev
     ```

3. **JWT Token Security**:

   - Secure your JWT tokens by creating an environment variable named `API_SECRET`.

4. **Google Service Account Credentials**:

   - Obtain the Google service account credentials and save them into an environment variable named `CREDENTIALS` in your `.env` file.

5. **File Upload Configuration** (Optional):
   - If your backend handles file uploads, specify the folder where uploaded files are stored in `src/utils/utils.js`. You can either specify the folder path directly in the code or use an environment variable to dynamically configure the folder location.

## Usage

To start the project locally, simply run the following command:

```bash
npm run dev
```

This command will start the development server and launch the project in your default web browser.
