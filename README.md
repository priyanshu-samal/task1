# Deal Flow Management System

## Project Overview
This project is a full-stack web application designed for Venture Capital (VC) and Private Equity (PE) firms to manage their investment pipeline. It tracks deal opportunities from "Sourced" to "Invested" (or "Passed") through a drag-and-drop Kanban board interface, assigns different access levels based on employee hierarchy, and includes structured memo editing for investment analysis.

**[Add Application Screenshot Here: e.g., A screenshot of the Kanban Board or Dashboard]**

## Key Features

### 1. Role-Based Access Control (RBAC)
The application enforces strict permissions across three user roles:

*   **Admin** (`admin@example.com`):
    *   Full system access.
    *   **Exclusive capability**: Deleting deals.
    *   Can perform all Analyst and Partner actions.
*   **Partner** (`partner@example.com`):
    *   The "Decision Maker."
    *   Can view and manage the entire pipeline.
    *   **Authorized to**: Move deals into final stages ("Invested" or "Passed").
*   **Analyst** (`analyst@example.com`):
    *   The "Sourced & Screen" lead.
    *   Can create new deals and manage early-stage pipeline (Sourced -> Screen -> Diligence -> IC).
    *   **Restricted**: Cannot move deals to "Invested" or "Passed".
    *   **Restricted**: Cannot delete deals.

**[Add Role Diagram Screenshot Here: e.g., A diagram showing the hierarchy or permission table]**

### 2. Deal Pipeline (Kanban)
*   **Responsive Layout**: A 6-column grid board (Sourced, Screen, Diligence, IC, Invested, Passed).
*   **Drag-and-Drop**: Intuitive interface for moving deals between stages.
*   **Smart Validation**: Backend logic prevents unauthorized users (Analysts) from moving deals to prohibited columns.
*   **Activity Logging**: Every move is recorded in the activity log (e.g., "Moved from Screen to IC by analyst@example.com").

### 3. Investment Memos
*   **Structured Editor**: Dedicated editing interface for creating investment memos.
*   **Version History**: Tracks changes to deal analysis over time.

### 4. Modern UI/UX
*   **Premium Design**: Features a glassmorphism aesthetic with gradient backgrounds and cleaner typography (Outfit font).
*   **Animations**: Smooth transitions powered by `framer-motion`.
*   **User Feedback**: Instant alerts and toasts for restricted actions or errors.

**[Add Login Page Screenshot Here]**

## Technical Architecture

### Tech Stack
*   **Frontend**: React (Vite), TypeScript, Tailwind CSS (v4), Framer Motion, TanStack Query, React Router.
*   **Backend**: FastAPI, SQLModel, PostgreSQL (NeonDB), Pydantic.
*   **Database Management**: Alembic for migrations.
*   **Authentication**: JWT (JSON Web Tokens) with Argon2 password hashing.

### Folder Structure
*   `frontend/`: React application source code.
    *   `src/components/`: Reusable UI components (KanbanBoard, MemoEditor).
    *   `src/pages/`: Main views (Login, DealPipeline, DealDetail).
    *   `src/context/`: Authentication state management.
*   `backend/`: FastAPI server functionality.
    *   `routers/`: API endpoints (`auth.py`, `deals.py`, `memos.py`).
    *   `models.py`: Database schema definitions (User, Deal, Activity).
    *   `alembic/`: Database migration scripts.

## Setup Instructions

### Prerequisites
*   Node.js (v18+)
*   Python (v3.9+)
*   PostgreSQL Database URL

### 1. Backend Setup
1.  Navigate to the `backend` directory.
2.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  Configure `.env`:
    *   Set `DATABASE_URL` (PostgreSQL connection string).
    *   Set `SECRET_KEY` and other auth variables.
4.  Run Migrations:
    ```bash
    alembic upgrade head
    ```
5.  Seed Data (Default Users):
    ```bash
    python -m backend.seed
    ```
6.  Start Server:
    ```bash
    uvicorn backend.main:app --reload
    ```

### 2. Frontend Setup
1.  Navigate to the `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start Dev Server:
    ```bash
    npm run dev
    ```
4.  Open browser at `http://localhost:5173`.

## Default Credentials
Use these accounts to test the different roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **Partner** | `partner@example.com` | `password` |
| **Analyst** | `analyst@example.com` | `password` |

---
**Project Status**: Complete & Verified.
