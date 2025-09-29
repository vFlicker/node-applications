# CRUD API

This project is a simple RESTful API built with Node.js and TypeScript. It demonstrates a modular architecture with custom HTTP server, in-memory database, horizontal scaling support using Node.js cluster, session management, and flexible middleware system.

## Structure

- **src/application.ts** — Application bootstrap and server logic
- **src/main.ts** — Entry point, configures clustering and controllers
- **src/modules/user/** — User module (controller, service, DTOs, schemas, tests)
- **src/modules/auth/** — Authentication module (controller with session management)
- **src/shared/**
  - **config/** — Environment config and schema
  - **filters/** — Exception filters for error handling
  - **middlewares/** — Global and route-specific middleware (CORS, Auth, Logging)
  - **libs/**
    - **database/** — In-memory database and IPC for clustering
    - **dotenv-validator/** — Utilities to validate and parse environment variables according to typed schemas
    - **rest/** — Custom REST server, routing, error handling, session and cookie management
    - **tests/** — Shared test utilities and helpers
    - **validator/** — Data validation utilities

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

## Architecture Highlights

### Modular Design

The application follows a modular architecture with clear separation of concerns:

- **Controllers** handle HTTP requests and responses
- **Services** contain business logic
- **Middleware** handle cross-cutting concerns (auth, logging, CORS)
- **Filters** manage exception handling
- **Validators** ensure data integrity

### Custom REST Framework

The project implements a custom REST framework featuring:

- **Advanced Routing** — Pattern-based routing with parameter extraction
- **Middleware Chain** — Execution chain for both global and route-specific middleware
- **Client Abstraction** — High-level API for HTTP operations
- **Cookie Management** — Dedicated cookie handling with proper encapsulation
- **Session Management** — Server-side session handling with automatic persistence
