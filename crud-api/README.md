# CRUD API

This project is a simple RESTful API built with Node.js and TypeScript. It demonstrates a modular architecture with custom HTTP server, in-memory database, and horizontal scaling support using Node.js cluster.

## Structure

- **src/application.ts** — Application bootstrap and server logic
- **src/main.ts** — Entry point, configures clustering and controllers
- **src/modules/user/** — User module (controller, service, DTOs, schemas, tests)
- **src/shared/**
  - **config/** — Environment config and schema
  - **libs/**
    - **database/** — In-memory database and IPC for clustering
    - **dotenv-validator/** — Utilities to validate and parse environment variables according to typed schemas
    - **rest/** — Custom REST server, routing, error handling
    - **tests/** — Shared test utilities and helpers
    - **validator/** — Data validation utilities

## Features

- REST API (CRUD)
- In-memory database with optional horizontal scaling (multi-process)
- Custom HTTP server and routing (no Express)
- Data validation and error handling
- Environment-based configuration
- Unit tests (Vitest)
- Linting and formatting (ESLint, Prettier)

## Usage

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

Run tests:

```bash
npm test
```

## Example API Requests

See `src/modules/user/user.http` for ready-to-use HTTP requests (for REST Client or similar tools).
