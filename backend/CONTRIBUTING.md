# Contributing

Thank you for your interest in contributing to this project! Please follow the guidelines below to set up your development environment properly.

## Neon Database Setup

If you're using Neon PostgreSQL for this project, follow these steps to set up your database.

### 1. Create a Neon Database

1. Visit [Neon](https://neon.tech/) and sign up using your preferred method (GitHub, Google, etc.). If the site is inaccessible, use a VPN.
2. Click on the **New Project** button to create a new Neon project.
3. Enter a **project name** and **database name**, then choose a cloud provider (e.g., AWS).
4. After creating the project, you'll be redirected to your **project dashboard**.
5. Click on the **Connect** button to retrieve your database connection details.
6. In the modal that appears, you will find the **branch, compute, database name, role, connection string, and connection pooling options**.
7. Click the dropdown beside the connection string to view your **Neon database URL**.
8. Click on **Show Password** to reveal the database password within the URL, then copy the full connection string.

### 2. Retrieve and Configure `DATABASE_URL`

1. In your **Neon dashboard**, click on the **Connect** button.
2. A modal will pop up with your **connection string**. Click **Show Password** before copying the provided URL.
3. Navigate to your project root and create a `.env` file inside the `src` folder (if it doesn't already exist).
4. Set the `DATABASE_URL` variable in your `.env` file:

   ```ini
   DATABASE_URL=postgresql://neon_user:neon_password@db.neon.tech:5432/neon_database?schema=public
   ```

## Prisma Migration and Prisma Studio

### 1. Install Prisma CLI

Before running migrations, install Prisma CLI and the Prisma client:

```bash
npm install prisma --save-dev
npm install @prisma/client
```

### 2. Initialize Prisma

If Prisma is not initialized in your project, run:

```bash
npx prisma init
```

This generates a `prisma/schema.prisma` file. The file should contain the following:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Running Migrations

To create and apply migrations, use the following commands:

- **Create a new migration for an initial schema:**
  ```bash
  npx prisma migrate dev --name init
  ```
- **Modify an existing schema and create a new migration:**
  ```bash
  npx prisma migrate dev --name update_schema
  ```
- **Sync database schema with your local Prisma schema:**
  ```bash
  npx prisma db pull
  ```
- **Format Prisma schema for consistency:**
  ```bash
  npx prisma format
  ```
- **Reset database (Warning: This will delete all data):**
  ```bash
  npx prisma migrate reset
  ```

### 4. Define Your Schema

If setting up a new database, define your **schema** in `prisma/schema.prisma` before running migrations. Example:

```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique
}
```

After defining the schema, generate the Prisma client:

```bash
npx prisma generate
```

Then, apply migrations:

```bash
npx prisma migrate dev --name init
```

### 5. Using Prisma Studio

To visually inspect and manage your database, run:

```bash
npx prisma studio
```

## Additional Notes

- **To generate the Prisma client after setting up a new database:**
  ```bash
  npx prisma generate
  ```
- **Always run the migration command after modifying the schema.**

By following these steps, your development environment will be correctly set up with Neon and Prisma. Happy coding! 🚀
