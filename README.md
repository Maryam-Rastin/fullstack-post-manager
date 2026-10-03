# Full-Stack Post Manager

A full-stack post management application with a custom Express + TypeScript backend, PostgreSQL database, and a React frontend — built end-to-end rather than relying on a managed backend-as-a-service.

**Live demo:** [https://fullstack-post-manager.vercel.app/](https://fullstack-post-manager.vercel.app/)

## Overview

Full-Stack Post Manager is a complete post management app supporting create, read, update, delete, and search operations. Unlike a typical frontend-only project, this one implements its own REST API from scratch: a type-safe Express backend with PostgreSQL via Drizzle ORM, request validation with Zod, and a containerized local database setup with Docker.

The frontend is built with React and TypeScript, using the Context API with `useReducer` for state management — a discriminated-union action model rather than a single flat action shape — paired with small, reusable data-fetching hooks (`useQuery`, `useMutation`) instead of a heavier data-fetching library.

## Features

* Create, edit, and delete posts
* Debounced live search across posts
* Real-time UI feedback via toast notifications
* Type-safe REST API with schema validation on every request
* Centralized frontend state via Context + `useReducer`
* Fully containerized local database (PostgreSQL + Adminer via Docker Compose)
* Responsive, utility-first UI styling

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* DaisyUI

### State Management

* React Context API
* `useReducer` with discriminated-union action types

### Additional Libraries

* Axios
* React Toastify

### Backend

* Node.js
* Express 5
* TypeScript
* PostgreSQL
* Drizzle ORM
* Zod (schema validation via `drizzle-zod`)

### Tooling & Infrastructure

* Docker & Docker Compose (local database)
* Vercel (frontend and API hosting)
* Neon (serverless PostgreSQL)
* Nodemon
* ESLint

## Screenshots

![Screenshot](./Screenshot.png)

## Project Structure

```
fullstack-post-manager/
├── back/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── db/
│   │   │   ├── schema/       # Drizzle schema definitions
│   │   │   ├── drizzle/      # Generated migrations
│   │   │   └── migrate.ts
│   │   ├── routes/
│   │   ├── services/         # Business logic
│   │   ├── validator/        # Zod request validation
│   │   └── index.ts
│   ├── docker-compose.yml    # PostgreSQL + Adminer
│   ├── drizzle.config.ts
│   └── package.json
├── front/
│   ├── src/
│   │   ├── components/       # UI components (List, Item, Inputs)
│   │   ├── context/          # PostProvider (Context + useReducer)
│   │   ├── hook/             # useQuery, useMutation, useDebounce
│   │   ├── reducers/
│   │   ├── config/           # Axios client
│   │   └── helper/           # Action types & constants
│   └── package.json
└── README.md
```

## Installation

Clone the repository:

```
git clone https://github.com/Maryam-Rastin/fullstack-post-manager.git
cd fullstack-post-manager
```

### Backend setup

```
cd back
npm install
```

Copy `.env.example` to `.env` and set your own values:

```
POSTGRES_URL=postgresql://postgres:yourpassword@localhost:5432/postDB
```

Start PostgreSQL and Adminer with Docker:

```
docker compose up
```

Generate and run database migrations:

```
npm run generate
npm run migrate
```

Start the backend:

```
npm run dev
```

The API runs at `http://localhost:3001/api/`. Adminer (database UI) is available at `http://localhost:8080`.

### Frontend setup

In a separate terminal:

```
cd front
npm install
npm run dev
```

## Deployment

The app is deployed on **Vercel** as two projects from this one repository, with a **Neon** PostgreSQL database:

| Part | Vercel root directory | Notes |
| ---- | --------------------- | ----- |
| API (Express) | `back` | Exports the Express app; Vercel runs it as a serverless function |
| Frontend (Vite + React) | `front` | Built with `npm run build` |

Setup summary:

1. Import the repo into Vercel as the API project with **Root Directory** set to `back`.
2. Add a **Neon** database from the Vercel Marketplace and connect it to the API project with the prefix `POSTGRES`, which creates the `POSTGRES_URL` variable the backend reads.
3. Run the migrations once against the hosted database: put `POSTGRES_URL` in `back/.env` and run `npm run migrate`.
4. Redeploy the API, then check `/api/post` returns `[]`.
5. Import the repo again as the frontend project with **Root Directory** set to `front`, and add the environment variable `VITE_API_URL` with the value `https://<your-api>.vercel.app/api`.

Notes:

* `VITE_API_URL` is baked in at build time, so redeploy the frontend if the API URL changes. Without it, the frontend uses `http://localhost:3001/api/` for local development.
* The database runs on Neon's free tier, which can suspend when idle, so the first request after a quiet period may take a few seconds.
* The demo has no authentication, so anyone can add and delete posts.

## Learning Objectives

This project was built to strengthen skills in:

* Designing and building a REST API from scratch with Express and TypeScript
* Database schema design and migrations with Drizzle ORM
* Request validation with Zod
* Containerized local development with Docker and Docker Compose
* Type-safe state management using discriminated union action types
* Building small, reusable, generic data-fetching hooks
* Debugging real full-stack issues across the network, build tooling, and type system

## Future Improvements

* User authentication and authorization
* Pagination for the post list
* Image uploads for posts
* Automated tests for API endpoints
* Rate limiting

## What I Learned

Building the backend from scratch — rather than using a managed service — meant handling things I hadn't dealt with directly before: designing a Postgres schema, writing and running real migrations, validating incoming requests before they ever touch the database, and containerizing the whole local setup with Docker so it's reproducible. On the frontend, moving from a single flat action type to a proper discriminated union clarified how much stronger TypeScript's type checking becomes once each action case is modeled with its own exact shape, instead of one type trying to fit everything. I also got a lot of practice diagnosing real full-stack issues end to end — tracing a 400 response back to a validator, a blank screen back to a missing context provider, and a hook crash back to a duplicate package installation.

## Author

**Maryam Rastin**

GitHub: https://github.com/Maryam-Rastin

## License

This project is available under the MIT License.
