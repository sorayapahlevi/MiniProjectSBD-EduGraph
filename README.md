# MiniProjectSBD-EduGraph

## Project Description

EduGraph is a student project that visualizes relationships between courses, skills, careers, alumni, faculty, and companies using a Neo4j graph database. The backend provides REST API endpoints for graph data, alumni management, and authentication, while the frontend renders an interactive network graph using React and Vite.

## Tech Stack

- Backend
  - Node.js
  - Express
  - Neo4j Driver
  - dotenv
  - cors
- Frontend
  - React
  - Vite
  - Tailwind CSS
  - react-force-graph-2d
  - axios
- Database
  - Neo4j

## Project Structure

- `backend/` - Express API server and seed script
- `frontend/` - React UI with Vite and Tailwind

## Setup & Run

### 1. Prerequisites

- Node.js 20+ and npm installed
- Neo4j database running locally or accessible remotely
- `.env` file in `backend/` with the following values:
  - `NEO4J_URI`
  - `NEO4J_USER`
  - `NEO4J_PASSWORD`
  - `PORT`

Example `.env`:

```env
NEO4J_URI=neo4j://127.0.0.1:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
PORT=3000
```

### 2. Backend

```bash
cd backend
npm install
npm run seed
npm run dev
```

- `npm run seed` clears the database and inserts dummy graph data
- `npm run dev` starts the backend server on the port from `.env`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend runs with Vite and connects to the backend API at `http://localhost:3000`

### 4. Build for Production

```bash
cd frontend
npm run build
```

## Notes

- If the graph does not display correctly, make sure the backend is running and seeded first.
- The frontend uses Tailwind CSS and dynamic graph rendering via `react-force-graph-2d`.