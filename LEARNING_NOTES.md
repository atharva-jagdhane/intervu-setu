# IntervuSetu — Engineering Learning Notes

> **Phase 0: Foundations of Modern Frontend Architecture**  
> Tailored for B.Tech Data Science students mastering full-stack web development.

---

## 1. What is React?

**React** is an open-source JavaScript library developed by Meta (Facebook) for building dynamic, high-performance user interfaces (UIs).

### Why do we use it instead of plain HTML/JS?
In traditional websites, whenever data changes, the browser must search the Document Object Model (DOM) and re-render large parts of the page. This is slow and difficult to maintain as applications grow.
- **Declarative**: You describe *what* the UI should look like for a given state, and React handles updating the screen.
- **Component-Driven**: You break complex interfaces into small, reusable, isolated building blocks (like LEGO bricks).
- **Virtual DOM (VDOM)**: React keeps a lightweight copy of the browser's DOM in memory. When data changes, React calculates the exact difference (called "diffing") and updates *only* the specific HTML elements that changed, ensuring fast rendering.

---

## 2. What is Vite?

**Vite** (French word for "quick", pronounced */veet/*) is a modern build tool and development server that provides an ultra-fast frontend development experience.

### Why Vite over legacy tools like Create React App (Webpack)?
- **Instant Server Start**: Traditional bundlers (like Webpack) bundle your entire codebase before starting the server. Vite uses **Native ES Modules (ESM)** in the browser to serve source code on demand, making startup nearly instant.
- **Lightning-Fast Hot Module Replacement (HMR)**: When you edit a CSS file or React component, Vite swaps only that exact module in the running browser without reloading the page or losing your application state.
- **Optimized Production Builds**: Under the hood, Vite uses `Rollup` to tree-shake (remove unused code), minify, and produce highly optimized production bundles.

---

## 3. What is npm?

**npm** (Node Package Manager) is the world's largest software registry and the default package manager for Node.js.

### Key concepts:
- **`package.json`**: The manifest file that lists your project's metadata, run scripts (`dev`, `build`), and direct dependencies (`react`, `react-router-dom`).
- **`package-lock.json`**: An auto-generated snapshot recording the exact version of every single installed package and sub-dependency. This ensures that every developer and server gets the exact same code.
- **`node_modules/`**: The local directory where all downloaded third-party code resides. This folder is huge and must **never** be committed to Git.

---

## 4. What is JSX?

**JSX** stands for **JavaScript XML**. It is a syntax extension for JavaScript that allows you to write HTML-like markup directly inside JavaScript files.

### Example:
```jsx
// This is JSX:
const greeting = <h1 className="title">Hello, Data Science!</h1>;

// Behind the scenes, the Vite compiler transforms it into pure JavaScript:
const greeting = React.createElement('h1', { className: 'title' }, 'Hello, Data Science!');
```

### Important JSX Rules:
1. **Return a single root element**: Wrap adjacent elements in a parent tag or React Fragment (`<> ... </>`).
2. **Use `className` instead of `class`**: `class` is a reserved keyword in JavaScript.
3. **Embed JavaScript expressions using curly braces `{}`**:
   ```jsx
   const studentName = "Atharva";
   return <p>Welcome, {studentName}!</p>;
   ```
4. **Self-close empty tags**: Tags like `<img>`, `<input>`, or `<br>` must end with `/>`.

---

## 5. What is a React Component?

A **React Component** is a reusable, self-contained JavaScript function that returns JSX to define how a piece of the user interface should appear and behave.

### Example:
```jsx
// Reusable Button Component (Child)
function ActionButton({ label, onClick }) {
  return (
    <button className="btn-primary" onClick={onClick}>
      {label}
    </button>
  );
}

// Parent Component
export default function Dashboard() {
  const handleStart = () => alert("Interview Started!");
  
  return (
    <div>
      <h2>Ready for your mock interview?</h2>
      <ActionButton label="Begin Session" onClick={handleStart} />
    </div>
  );
}
```

### Components have two types of data:
- **Props (Properties)**: Read-only inputs passed from a parent component to a child component (like arguments to a function).
- **State (`useState`)**: Internal data managed inside the component that can change over time. When state changes, the component automatically re-renders.

---

## 6. What is React Router?

**React Router DOM** is the standard library for client-side routing in React applications.

### Traditional Websites vs. Single Page Applications (SPAs):
- **Traditional Multi-Page Web**: Clicking a link triggers a full HTTP request to the server, resulting in a blank white flash while the browser loads the new HTML page.
- **React SPA with React Router**: The browser loads one single HTML page (`index.html`). When a user clicks a link (`<Link to="/interview">`), React Router intercepts the browser URL, updates the browser history without refreshing, and conditionally renders the matching component on the screen.

### Example:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/interview" element={<InterviewRoom />} />
  </Routes>
</BrowserRouter>
```

---

## 7. Purpose of Each Project Folder in IntervuSetu

Our directory structure is organized logically to separate concerns:

```text
intervu-setu/
├── src/
│   ├── assets/       # Static media (SVG icons, illustrations, sound effects)
│   ├── components/   # Reusable UI widgets (Navbar, Footer, Modal, Button, ScoreCard)
│   ├── pages/        # High-level route views (LandingPage, Dashboard, InterviewRoom)
│   ├── layouts/      # Persistent shell layouts (RootLayout with common header/footer)
│   ├── services/     # API clients (Gemini backend service, Vapi audio controller)
│   ├── hooks/        # Custom React hooks (useAuth, useVapiSession, useTimer)
│   ├── App.jsx       # Route declarations and global providers
│   ├── main.jsx      # Application entry point connecting React to index.html
│   └── index.css     # Global CSS design tokens, typography, and utility classes
├── public/           # Static assets served as-is without bundler processing
├── index.html        # Single root HTML host page
├── vite.config.js    # Vite compilation & dev server configuration
└── package.json      # Dependencies and execution scripts
```

---

## 8. How Does the Application Start?

Here is the exact lifecycle from typing `npm run dev` to seeing the screen:

```
1. npm run dev
      │
      ▼
2. Vite starts local HTTP server (http://localhost:5173)
      │
      ▼
3. Browser requests http://localhost:5173/ and receives index.html
      │
      ▼
4. index.html contains: <div id="root"></div> and <script src="/src/main.jsx">
      │
      ▼
5. main.jsx runs:
   ReactDOM.createRoot(document.getElementById('root')).render(<App />)
      │
      ▼
6. App.jsx loads React Router (<BrowserRouter>):
   Matches the current path ("/") -> Renders RootLayout -> Injects LandingPage into <Outlet />
      │
      ▼
7. React computes the Virtual DOM, converts it to real browser DOM elements, and displays the UI.
```

---

## 9. How Do Frontend Technologies Communicate?

In our complete **IntervuSetu** stack, data will flow across three communication paradigms:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Client)                         │
│                                                                        │
│   Component State ──► UI Display ──► User Action (Click / Speech)      │
└──────────────┬───────────────────────────┬─────────────────────────────┘
               │                           │
        1. REST API (HTTP)           2. WebSockets / WebRTC
     (JSON payloads via fetch)       (Real-time bidirectional audio)
               │                           │
               ▼                           ▼
┌──────────────────────────────┐    ┌─────────────────────────────┐
│    Node.js / Express Server  │    │        Vapi AI Cloud        │
│  - Verifies JWT tokens       │    │  - Streams microphone audio │
│  - Calls Google Gemini API   │    │  - Speech-To-Text (STT)     │
│  - Saves data into MongoDB   │    │  - Text-To-Speech (TTS)     │
└──────────────────────────────┘    └─────────────────────────────┘
```

1. **Component-to-Component (Internal)**: Components pass data downward via **Props** and notify parents of changes via **Callback functions**.
2. **Client-to-Backend (REST API)**: The frontend sends asynchronous HTTP requests (`GET`, `POST`) using `fetch()` or Axios to our Node.js server.
3. **Client-to-Voice AI (WebRTC/Vapi)**: The frontend opens a real-time, low-latency audio stream directly with Vapi for realistic voice conversations.

---

### Core Principles to Remember
- **Always separate concerns**: Presentation belongs in components; backend communication belongs in services.
- **Never store API keys on the frontend**: Anything in React is visible in the browser's developer tools. All Gemini and Vapi private tokens must stay on our Node.js server.
- **Immutability**: In React, never mutate state directly (`state.push(...)`); always create fresh copies (`setState([...state, newItem])`).


---

# Section 2: Backend Architecture & MongoDB Atlas Integration

> **Phase 1 Milestone**: Establishing the Server, Database Connection, and API Health Monitoring.

---

## 1. What is Node.js?

JavaScript was originally engineered solely to run inside web browsers (like Chrome, Firefox, or Safari) to make web pages interactive.

**Node.js** is a runtime environment that allows JavaScript to run **outside the browser**—directly on your computer's operating system or a cloud server.
- Built on Google Chrome's high-performance **V8 JavaScript Engine**.
- **Asynchronous & Non-Blocking**: Node.js handles thousands of concurrent connections using an **Event Loop** on a single thread without waiting for slow operations (like file reads or database queries) to finish before accepting new requests.
- Powers the backend of IntervuSetu: querying MongoDB, calling the Gemini AI API, managing JWT authentication, and serving REST endpoints.

---

## 2. What is Express.js?

While raw Node.js provides a built-in `http` module, building a complete web API with raw Node requires handling low-level byte streams, URL parsing, and complex conditionals manually.

**Express.js** is the standard, fast, unopinionated minimalist web framework for Node.js.
- **Routing**: Easily maps HTTP verbs and URL paths to controller logic:
  ```js
  app.get('/api/health', (req, res) => { ... });
  app.post('/api/auth/register', (req, res) => { ... });
  ```
- **Middleware Pipeline**: Functions that execute sequentially during the request-response cycle:
  - `cors()`: Enforces security policies determining which domains can make requests.
  - `express.json()`: Automatically parses incoming JSON request bodies into `req.body`.
  - Custom auth middleware: Verifies JWT tokens before allowing access to protected routes.

---

## 3. What is MongoDB Atlas?

**MongoDB** is an open-source, document-based NoSQL database. Instead of storing data in tables with rigid rows and columns (like SQL databases), MongoDB stores records as flexible, JSON-like **BSON** (Binary JSON) documents.

**MongoDB Atlas** is the fully managed, multi-cloud database service provided directly by MongoDB:
- **Zero Local Installation**: Runs on AWS/GCP/Azure in the cloud with automated backups, scaling, and monitoring.
- **Network Access Security**: Requires explicit IP address whitelisting (or `0.0.0.0/0` during development) and encrypted TLS/SSL connections.
- **Database Users & Roles**: Grants fine-grained read/write privileges authenticated via username and password.

---

## 4. What is Mongoose?

**Mongoose** is an **Object Data Modeling (ODM)** library for MongoDB and Node.js. It acts as an intelligent abstraction layer between JavaScript and MongoDB.

### Why do we use Mongoose?
1. **Schema Definition**: MongoDB is schemaless by default. Mongoose brings structure and type safety:
   ```js
   const UserSchema = new mongoose.Schema({
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     targetRole: { type: String, default: 'Software Engineer' }
   }, { timestamps: true });
   ```
2. **Built-in Validation**: Ensures required fields, regex patterns (like email formats), and min/max lengths are validated before saving.
3. **Connection Management**: Handles connection pooling, automatic reconnects, and timeouts (`serverSelectionTimeoutMS`).

---

## 5. What is a Database Connection String?

A **Connection String** is a standardized URI format that contains all the routing and credential parameters required for a client to locate and authenticate with a database.

```text
mongodb+srv://intervu-setu:<password>@cluster0.q4i9nf9.mongodb.net/intervusetu?retryWrites=true&w=majority
      │           │             │                    │                      │                   │
      │           │             │                    │                      │                   └─ Replication options
      │           │             │                    │                      └─ Database name
      │           │             │                    └─ Cluster hostname
      │           │             └─ User password
      │           └─ Database username
      └─ DNS SRV protocol (automatic replica set discovery)
```

- **`mongodb+srv://`**: Uses DNS Seedlist records to automatically discover the primary and secondary replica nodes in the Atlas cluster.
- **`intervusetu`**: The targeted database name inside the cluster. If omitted, MongoDB defaults to a `test` database.

---

## 6. What are Environment Variables (`.env`)?

Environment variables are dynamic values loaded into `process.env` at runtime rather than hardcoded in source code files.

### Why are they critical?
1. **Zero Credential Leaking**: Connection strings contain database passwords, and JWT secrets sign user sessions. If hardcoded, anyone viewing the Git repository can hijack your database.
2. **Environment Separation**: Different environments use different configurations (e.g. `PORT=5000` locally, dynamic port on cloud hosts).
3. **The Golden Rule**:
   - `server/.env`: Contains actual live secrets. **Always ignored by `.gitignore`**.
   - `server/.env.example`: Safe public template committed to GitHub containing placeholder keys only.

---

## 7. What are REST API Endpoints?

**REST** (Representational State Transfer) is an architectural pattern for web communication using standard HTTP methods:

| Method | Purpose | IntervuSetu Example |
| :--- | :--- | :--- |
| `GET` | Retrieve data | `GET /api/health` — Checks server and DB status |
| `POST` | Create new resource | `POST /api/auth/register` — Creates a student account |
| `PUT` / `PATCH` | Update existing resource | `PATCH /api/users/profile` — Updates target job role |
| `DELETE` | Remove a resource | `DELETE /api/sessions/:id` — Deletes an interview session |

### Anatomy of an API Response:
Endpoints return structured JSON payloads with meaningful HTTP status codes:
- **`200 OK`**: Request succeeded (e.g. Health status `healthy`).
- **`201 Created`**: Resource successfully saved to the database.
- **`400 Bad Request`**: Client sent invalid data (e.g. missing password).
- **`401 Unauthorized`**: Missing or expired JWT token.
- **`503 Service Unavailable`**: Server is running, but database connection is disconnected.

---

## 8. Frontend vs. Backend: Separation of Concerns

| Dimension | Frontend (Client) | Backend (Server) |
| :--- | :--- | :--- |
| **Location** | Runs inside user's browser | Runs on Node.js server/cloud |
| **Technologies** | React 19, Vite, CSS, React Router | Node.js, Express, Mongoose, JWT |
| **Responsibilities** | UI rendering, animations, user input, audio stream display | Business logic, authentication, database storage, AI orchestration |
| **Security Context** | **Untrusted**: Users can view all code and inspect network requests in DevTools | **Trusted**: Private environment where database passwords and Gemini API keys are hidden |
| **Communication** | Sends HTTP requests via `fetch()` | Listens on port `5000` and returns JSON responses |

---

## 9. How the Database Connection Works Step-by-Step

```text
1. Node.js executes server.js
      │
      ▼
2. dotenv.config() reads server/.env and populates process.env.MONGODB_URI
      │
      ▼
3. server.js invokes connectDB() from config/db.js
      │
      ▼
4. Mongoose initiates TLS/SSL handshake with MongoDB Atlas cloud cluster
   - Authenticates database user
   - Resolves replica set nodes (ac-q4vuwrw-shard-00-01, shard-00-02)
      │
      ▼
5. MongoDB Atlas verifies credentials & network IP whitelist (0.0.0.0/0)
      │
      ▼
6. Connection established: mongoose.connection.readyState = 1 (connected)
      │
      ▼
7. Express starts listening on port 5000
   - GET /api/health reports: { status: "healthy", database: { connected: true } }
```
