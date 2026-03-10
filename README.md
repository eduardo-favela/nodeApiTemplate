# Node.js API Template (SQL Server + Prisma)

This is a robust, production-ready backend template using Express.js and Prisma (configured for SQL Server). It is designed to be reusable for future projects, saving you the time of setting up boilerplate code.

## 🚀 Features

- **TypeScript Ready**: Strongly typed across all layers of the application for ultimate developer confidence!
- **Robust ORM**: Integrated with [Prisma](https://www.prisma.io/) tailored for SQL Server, providing a type-safe and intuitive database client.
- **Structured Architecture**: Follows a clean `Routes -> Controllers -> Commands` folder structure to keep logic separated and maintainable.
- **Authentication**: Built-in JSON Web Token (JWT) handling and a Master API Token strategy for machine-to-machine validation.
- **Input Validation**: Uses [Joi](https://joi.dev/) schemas to ensure incoming request bodies match expectations before hitting the database layer.
- **Security & Utilities**:
  - `helmet` for basic HTTP security headers.
  - `cors` for Cross-Origin Resource Sharing.
  - Custom cryptographic utilities (`scrypt` for password hashing, `aes-256-cbc` for encryption).
- **Developer Experience**:
  - Auto-reloading with `nodemon`.
  - HTTP request logging with `morgan`.
  - Centralized asynchronous error handling using `express-async-errors`.

## 📁 Folder Structure

```text
.
├── prisma/
│   └── schema.prisma        # Prisma schema and database connection config
├── src/
│   ├── commands/            # The deepest layer interacting directly with the DB (via Prisma)
│   ├── config/              # Configuration files (e.g., Prisma client initialization)
│   ├── controllers/         # Handles HTTP requests/responses, formats output 
│   ├── interfaces/          # TypeScript interfaces for general use (e.g., requests, responses)
│   ├── middlewares/         # Express middlewares (Auth guards, Joi validation)
│   ├── models/              # Database table definitions, DTOs, and Prisma exports
│   ├── routes/              # Express route definitions mapping endpoints to controllers
│   ├── schemas/             # Joi validation schemas
│   ├── utils/               # Helper utilities (JWT tokens, Password hashing)
│   ├── app.ts               # Express application setup and global middleware definitions
│   └── server.ts            # Entry point that starts the server
├── .env.example             # Example environment variables
├── nodemon.json             # Dev watcher configuration
└── package.json             # Project dependencies and scripts
```

## 🛠️ Getting Started

### 1. Installation

Clone the repository or copy the template, then install the dependencies:

```bash
npm install
```

### 2. Environment Configuration

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Ensure you update the `DATABASE_URL` with your SQL Server credentials:
```dotenv
DATABASE_URL="sqlserver://localhost:1433;database=my_db;user=sa;password=my_password;encrypt=true;trustServerCertificate=true;"
```

You should also set up your `JWT_SECRET` and `MASTER_API_TOKEN` for robust security.

### 3. Database Sync

To push the initial Prisma schema (like the `User` model) into your SQL Server database, run:

```bash
npx prisma db push
```

Alternatively, if you already have an existing database and want to pull models from it:

```bash
npx prisma db pull
npx prisma generate
```

### 4. Running the Development Server

Start the API in development mode (which uses `nodemon` for auto-restarts):

```bash
npm run dev
```

The server will start at `http://localhost:3000`. You can test the health endpoint at `GET http://localhost:3000/health`.

---

## 📘 How to create a new Endpoint

1. **Schema**: Create a Joi schema inside `src/schemas/`.
2. **Command**: Create the database interaction logic inside `src/commands/`.
3. **Controller**: Create the request handler inside `src/controllers/` tying the command results to an HTTP response.
4. **Route**: Define the route in `src/routes/`, applying the `validate` middleware and/or `authenticate` middleware as needed.
5. **Mount**: Mount the new route file inside `src/app.ts`.

---

## ♻️ Reusing this Template for a New Project

Whenever you want to start a new API using this template, follow these exact steps:

1. **Copy the Template**: Copy the entire folder content to your new project directory.
2. **Reset Git History**: Delete the `.git` folder in the new directory and run `git init` to start fresh.
3. **Update Metadata**: Open `package.json` and change the `"name"`, `"description"`, `"repository"`, and `"author"` fields to match your new project.
4. **Install Dependencies**: Run `npm install` inside the new folder.
5. **Set up Environment variables**: Duplicate `.env.example` to `.env` and fill in the new `DATABASE_URL`, `JWT_SECRET`, etc.
6. **Define the Database**: Edit `prisma/schema.prisma` to remove the example `User` model and add your new required tables.
7. **Sync the Database**: Run `npx prisma db push` (for prototyping) or `npx prisma migrate dev` (for production tracking).
8. **Clean Boilerplate Files**: Delete `user.routes.ts`, `user.controller.ts`, `user.command.ts`, and `user.schema.ts` from the `src/` folders to start with a blank canvas for your endpoints.
