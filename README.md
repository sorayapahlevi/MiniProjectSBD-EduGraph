# 🎓 EduGraph: Academic & Career Knowledge Graph

<div align="center">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" />
  <img src="https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
  <br />
  <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB" alt="Express.js" />
  <img src="https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white" alt="Neo4j" />
</div>

## 📖 Project Description

EduGraph is a student project designed to solve the "data silo" challenge commonly found in academic and institutional databases. Inspired by NASA's implementation of graph databases to unify fragmented technical expertise, EduGraph leverages a **Neo4j Graph Database** to build a highly interconnected Knowledge Graph. 

Instead of separating courses, skills, faculty research, and alumni career paths into disconnected tables, EduGraph treats these relationships as first-class citizens. The application allows users to visually navigate academic prerequisite chains, discover specific learning paths tailored to industry roles, and find faculty mentors based on career-relevant skills.

## 🏗️ Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer [Client Layer - Frontend]
        UI[React UI<br/>Vite + Tailwind CSS]
        GraphVis[react-force-graph<br/>Canvas 2D Engine]
        UI --- GraphVis
    end

    subgraph API Layer [API Layer - Backend]
        Router[Express Router<br/>REST Endpoints]
        Controllers[Controllers<br/>Cypher Logic]
        Driver[neo4j-driver]
        Router --> Controllers
        Controllers --> Driver
    end

    subgraph Data Layer [Data Layer - Database]
        Neo4j[(Neo4j Graph DB<br/>Nodes & Edges)]
    end

    %% Flow of data
    UI -->|HTTP GET/POST (Axios)| Router
    Driver -->|Bolt Protocol (Port 7687)| Neo4j
    Neo4j -->|Graph Result| Driver
    Router -->|JSON Response| UI
    
    %% External Simulation
    SSO[Simulasi SSO UI] -.->|Dummy Auth| UI

    classDef react fill:#087ea4,stroke:#fff,stroke-width:2px,color:#fff;
    classDef nodejs fill:#339933,stroke:#fff,stroke-width:2px,color:#fff;
    classDef neo4j fill:#018bff,stroke:#fff,stroke-width:2px,color:#fff;
    
    class UI,GraphVis react;
    class Router,Controllers,Driver nodejs;
    class Neo4j neo4j;
```

### Architecture Overview
1. **Client Layer (Frontend):** Built with React 19, Vite, and Tailwind CSS v4. It utilizes `react-force-graph` to render dynamic, interactive 2D network visualizations of the academic paths.
2. **API Layer (Backend):** A Node.js and Express server structured with a modular Router-Controller pattern. It handles data fetching and SSO simulation, translating client requests into raw Cypher queries via the `neo4j-driver`.
3. **Data Layer (Database):** A pure Neo4j graph database. It eliminates data fragmentation by storing entities (Courses, Skills, Careers, Faculty, Alumni) and their intricate relationships (e.g., `[:BUILDS_SKILL]`, `[:REQUIRED_FOR]`) directly as a unified graph.

## 🚀 Setup & Run

### 1. Prerequisites
- **Node.js** (v20+ recommended)
- **Neo4j Desktop** (running locally) or **Neo4j AuraDB** (cloud)
- Create a `.env` file inside the `backend/` directory with the following credentials:

```env
NEO4J_URI=bolt://127.0.0.1:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_database_password
PORT=3000
```

### 2. Backend Initialization
Open a terminal and navigate to the backend directory to install dependencies, seed the database with initial graph data, and start the server.

```bash
cd backend
npm install
npm run seed
npm run dev
```
*(Note: The `npm run seed` command will clear the current database and insert the default EduGraph nodes and relationships).*

### 3. Frontend Initialization
Open a new terminal window, navigate to the frontend directory, and start the Vite development server.

```bash
cd frontend
npm install
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 👥 Team Members

**Group 6**
* Soraya Azzizah Pahlevi (2406487001)
```
