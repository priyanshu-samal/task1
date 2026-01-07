# Deal Flow Management System

## Project Overview
This represents a sophisticated, full-stack investment pipeline management solution designed for Venture Capital and Private Equity firms. It replaces informal tracking methods with a rigid, role-based workflow that enforces the firm's decision-making hierarchy.

The system manages the entire lifecycle of a deal—from initial **Sourcing** and **Screening**, through **Due Diligence** and **Investment Committee (IC)** review, to final **Investment** or **Passing**.

## Key Features & Architecture

### 1. Role-Based Access Control (RBAC)
The application differentiates users not just by UI elements, but by strict backend business logic.

#### **Admin**
The administrative backbone of the firm.
*   **Capabilities**: Full access to the pipeline. Exclusive ability to **delete deals** and manage data integrity.
*   **Responsibility**: Overseeing system health and correcting errors.

![Admin View](frontend/public/images/admin.png)  
*(Admin view showing the exclusive "Delete Deal" capability)*

#### **Partner**
The ultimate decision-maker.
*   **Capabilities**: Can view all deals and memos.
*   **Exclusive Power**: Only Partners (and Admins) can move a deal into the final **Invested** or **Passed** stages.
*   **Responsibility**: Reviewing IC memos and making the final capital allocation calls.

![Partner View](frontend/public/images/partner.png)  
*(Partner view showing the ability to finalize deals)*

#### **Analyst**
The deal sourcer and researcher.
*   **Capabilities**: Creating new deals, moving them through early stages (Sourced -> Screen -> Diligence -> IC), and writing investment memos.
*   **Restrictions**: **Cannot** commit capital (move to "Invested") or unilaterally reject deals (move to "Passed"). The system enforces this via API restrictions.
*   **Responsibility**: Filling the top of the funnel and preparing materials for the IC.

![Analyst View](frontend/public/images/analyst.png)  
*(Analyst view showing restricted access to final stages)*

### 2. Interactive Deal Pipeline
*   **Kanban Interface**: A responsive, 6-column drag-and-drop board powered by `hello-pangea/dnd`.
*   **Smart Validation**: Backend logic prevents unauthorized stage transitions. if an Analyst tries to drag a deal to "Invested", the system rejects the move.
*   **Activity Logging**: A comprehensive audit trail tracks every movement (e.g., "Moved from Screen to IC by a@g.com").

### 3. Investment Memos
*   **Integrated Editor**: A dedicated interface for writing and reading deal memos (Summary, Market, Product, Risks) directly attached to each deal.
*   **Version History**: Tracks the evolution of the investment thesis.

### 4. Technical Stack
*   **Frontend**: React, TypeScript, Tailwind CSS (v4), Framer Motion, TanStack Query.
*   **Backend**: Python FastAPI, SQLModel (SQLAlchemy + Pydantic).
*   **Database**: PostgreSQL (via NeonDB).
*   **Authentication**: JWT (JSON Web Tokens) with Argon2 hashing.

## System Installation and Execution Guide

### Prerequisites
Ensure the following are installed on your system before proceeding:
1.  **Python 3.10+**: Required for the backend web server.
2.  **Node.js 18+**: Required for the frontend application.
3.  **PostgreSQL 14+**: The primary database. (Alternatively, a cloud provider like NeonDB).

### 1. Database Configuration
The system requires a PostgreSQL connection string.
1.  Create a file named `.env` in the `backend/` directory.
2.  Add your database credentials to the file:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/dealflow_db
    SECRET_KEY=your_secure_random_key_here
    ALGORITHM=HS256
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

### 2. Backend Initialization
1.  Open a terminal and navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    # Windows
    .\venv\Scripts\activate
    # Linux/Mac
    source venv/bin/activate
    ```
3.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Apply database migrations to create the schema:
    ```bash
    alembic upgrade head
    ```
5.  Seed the database with initial users:
    ```bash
    python -m backend.seed
    ```
6.  Start the backend API server:
    ```bash
    uvicorn backend.main:app --reload
    ```
    *The server will start at `http://127.0.0.1:8000`*

### 3. Frontend Initialization
1.  Open a new terminal window and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install the required JavaScript dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the application in your browser at: `http://127.0.0.1:5173`

## Demo Credentials
We have pre-configured 3 accounts to demonstrate the role-based hierarchy.

**Password for all accounts:** `12345678`

| Role | Email | Permissions |
| :--- | :--- | :--- |
| **Analyst** | `a@g.com` | Can Create/Move to IC. **Blocked** from Invest/Pass. |
| **Admin** | `ad@g.com` | Full Access + **Delete**. |
| **Partner** | `p@g.com` | Full Access + **Invest/Pass**. |

---
*Built with ❤️ for JanAssign.*
