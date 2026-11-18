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


---

# Section 3: Student Authentication & Secure Session Engineering

> **Phase 1 Milestone**: End-to-End Authentication System (Mongoose, bcryptjs, JWT, HTTP-Only Cookies, React Context, and Protected Routes).

---

## 1. Mongoose Schemas & Schema Transforms

A **Mongoose Schema** maps directly to a MongoDB collection and defines the shape of the documents within that collection.

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  education: { type: String, default: 'B.Tech' },
  targetRole: { type: String, default: 'Software Engineer' }
}, { timestamps: true });
```

### Defense-in-Depth: The `toJSON` Transform
Never allow passwords or hashes to leave the server. In Mongoose, we override `toJSON` on the schema:
```javascript
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  delete userObject.__v;
  return userObject;
};
```
Whenever Express serializes the document (`res.json({ user })`), Mongoose automatically strips `passwordHash` before sending it over the network.

---

## 2. Password Hashing & Why Plaintext is Forbidden

Storing plaintext passwords is an engineering crime:
- If an attacker breaches the database, every student's password is immediately exposed.
- Because people reuse passwords across email, banking, and social media, a single leak compromises users everywhere.

### What is a Hash Function?
A cryptographic hash function is a **one-way mathematical operation**:
$$\text{Input: Password} \longrightarrow \text{Hash Function} \longrightarrow \text{Output: Fixed-Length Hash}$$
- **Deterministic**: The same password always generates the same output.
- **One-Way**: It is computationally infeasible to reverse the hash back into the original password.

### What is a Salt?
If two users choose the password `"Password123"`, a simple MD5/SHA256 hash would produce identical hashes. Attackers use precomputed tables of millions of passwords (called **Rainbow Tables**) to crack them instantly.  
A **Salt** is a unique, cryptographically random string generated and prepended to the password before hashing. Every user gets a different salt, ensuring identical passwords yield completely distinct hashes.

---

## 3. What is `bcryptjs`?

**bcrypt** is an adaptive, slow hash function based on the Blowfish cipher:
- **Work Factor / Salt Rounds**: Determines how many iterations are performed ($2^{\text{rounds}}$). In IntervuSetu, we use **12 salt rounds** ($2^{12} = 4,096$ hashing loops).
- **Brute-Force Resistance**: If an attacker attempts billions of guesses per second with GPUs, bcrypt's computational cost slows them down to a crawl.
- **Comparison**: `bcrypt.compare(candidatePassword, storedHash)` extracts the salt from the stored hash, hashes the candidate password, and verifies equivalence in constant time.

---

## 4. JWT Authentication (JSON Web Tokens)

A **JSON Web Token** is a compact, URL-safe means of representing claims between two parties. It allows the server to verify who you are without querying a server-side session table on every single request (**Stateless Authentication**).

```text
  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODkwIiwiaWF0IjoxNzg0...-rF5aZ8
  └───────────────┬───────────────────┘ └──────────────────┬────────────────┘ └───┬───┘
               Header                                   Payload                Signature
         (Algorithm & Type)                    (Claims: User ID, Expiry)    (HMACSHA256)
```

1. **Header**: Specifies the hashing algorithm (`HS256`).
2. **Payload**: Contains non-sensitive claims (e.g. `{ id: user._id, exp: 1785000000 }`).
3. **Signature**: Cryptographic seal created using `JWT_SECRET`:
   $$\text{Signature} = \text{HMACSHA256}(\text{base64UrlEncode(Header)} + "." + \text{base64UrlEncode(Payload)}, \text{JWT\_SECRET})$$

If a hacker tampers with the payload (e.g., changes their user ID to an admin's ID), the signature verification fails because only our backend knows the `JWT_SECRET`.

---

## 5. HTTP-Only Cookies vs. LocalStorage

A critical security decision in modern full-stack development is **where to store tokens**:

| Property | `localStorage` | HTTP-Only Cookies (IntervuSetu Choice) |
| :--- | :--- | :--- |
| **JavaScript Access** | ✅ Accessible via `window.localStorage` | ❌ **Completely inaccessible to JavaScript** |
| **XSS Vulnerability** | ⚠️ **Catastrophic**: Any malicious script/XSS can steal your tokens | 🛡️ **Immune**: Malicious scripts cannot read `document.cookie` |
| **Transmission** | Must be manually attached to HTTP headers | Automatically attached by the browser on requests |
| **CSRF Defense** | Naturally immune to CSRF | Protected by `sameSite: 'lax'` and CORS whitelist |

### Our Cookie Configuration in Express:
```javascript
res.cookie('token', token, {
  httpOnly: true,                               // Prevents client JavaScript from reading the cookie
  secure: process.env.NODE_ENV === 'production',// Enforces HTTPS in production
  sameSite: 'lax',                              // Prevents Cross-Site Request Forgery (CSRF)
  maxAge: 7 * 24 * 60 * 60 * 1000               // 7-day expiration
});
```

---

## 6. Express Middleware Pattern (`protect`)

Middleware functions have access to `(req, res, next)` and execute in a chain:

```text
Incoming Request ──► CORS Middleware ──► JSON Parser ──► Cookie Parser ──► Auth Protect ──► Controller
                                                                               │
                                                                 Valid JWT?   ├── No  ──► 401 Unauthorized
                                                                               └── Yes ──► req.user = user ──► next()
```

If the token is missing, expired, or invalid, the middleware halts execution immediately.

---

## 7. React Context (`AuthContext`) & Custom Hook (`useAuth`)

In React, passing user authentication data from component to component through props is called **Prop Drilling**, which becomes unmanageable as the component tree expands.

**React Context** provides a centralized global store:
1. **`AuthProvider`**: Holds `user`, `loading`, `login()`, `register()`, and `logout()`.
2. **Session Persistence**: On component mount (`useEffect`), it calls `api.getMe()`. If the user has a valid HTTP-only cookie, the browser automatically sends it, and the backend returns the authenticated profile.
3. **`useAuth` Hook**: A custom hook wrapping `useContext(AuthContext)` for one-line access in any component:
   ```javascript
   const { user, logout } = useAuth();
   ```

---

## 8. Protected Routes in React Router DOM

A **Protected Route** is a higher-order wrapper component that guards private pages (like the student dashboard or interview room):

```jsx
<Route
  path="dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
```

### How `ProtectedRoute` Operates:
1. **While initializing (`loading === true`)**: Renders a loading spinner so the user isn't prematurely kicked out while `api.getMe()` is resolving.
2. **If unauthenticated (`!user`)**: Redirects to `/login` using `<Navigate to="/login" state={{ from: location }} replace />`.  
   *(Notice: `state={{ from: location }}` remembers what page the student was trying to visit, so after logging in, they are redirected right back to it!)*
3. **If authenticated (`user !== null`)**: Renders `<DashboardPage />`.

---

## 9. Complete Authentication Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Client)                         │
│                                                                        │
│   Register/Login Form ──► api.login() ──► credentials: 'include'       │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                   1. POST /api/auth/login { email, password }
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       Express Backend (Server)                         │
│                                                                        │
│   1. Validates email & password format                                 │
│   2. User.findOne({ email })                                           │
│   3. bcrypt.compare(password, user.passwordHash)                       │
│   4. jwt.sign({ id: user._id }, JWT_SECRET)                            │
│   5. res.cookie('token', token, { httpOnly: true })                    │
│   6. Returns HTTP 200 { success: true, user } (zero passwordHash)      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                    2. Browser stores token in HTTP-only jar
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      Subsequent Protected Calls                        │
│                                                                        │
│   Browser automatically attaches 'Cookie: token=...'                   │
│   Backend 'protect' middleware decodes JWT and populates req.user      │
└────────────────────────────────────────────────────────────────────────┘
```


---

# Section 4: Domain Taxonomy & Configuration Modeling (Phase 2)

> **Phase 2 Milestone**: Multi-field State Management, Mongoose Schema References, and Ownership Authorization.

---

## 1. Mongoose Relationships & `ObjectId` References

In relational databases (like PostgreSQL), relationships between tables are maintained using **Foreign Keys**. In MongoDB, documents reference each other using **`mongoose.Schema.Types.ObjectId`**:

```javascript
const interviewConfigSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // References the 'User' collection
    required: true,
    index: true  // Creates a B-Tree index for ultra-fast queries by student
  },
  domain: { type: String, required: true },
  role: { type: String, required: true },
  experienceLevel: { type: String, enum: ['Internship', 'Fresher / Entry-level', 'Junior Engineer'] },
  category: { type: String, enum: ['Technical', 'HR', 'Behavioral', 'Mixed'] },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] }
}, { timestamps: true });
```

### Why Reference Instead of Embedding?
- **Embedding**: Storing all configurations directly inside the `User` document array (`user.configs = [...]`). This leads to unbounded document growth (MongoDB has a 16MB document limit) and slow user profile queries.
- **Referencing (Normalized)**: Each `InterviewConfig` is its own document with an `ObjectId` link (`studentId`). This allows students to create hundreds of practice sessions without bloating their auth profile.

---

## 2. CRUD Operations in Mongoose

**CRUD** stands for the four foundational operations of persistent storage:

| Operation | HTTP Verb | Mongoose Method | IntervuSetu Use Case |
| :--- | :--- | :--- | :--- |
| **Create** | `POST` | `InterviewConfig.create(payload)` | Student locks in a new interview setup |
| **Read** | `GET` | `InterviewConfig.find({ studentId })`<br>`InterviewConfig.findById(id)` | Loading past setups on the Dashboard |
| **Update** | `PATCH`/`PUT` | `InterviewConfig.findByIdAndUpdate(id, update)` | Updating session status (`configured` ➔ `in-progress`) |
| **Delete** | `DELETE` | `InterviewConfig.findByIdAndDelete(id)` | Student archives or deletes a session |

### Authorization & Multi-Tenancy Protection
In production SaaS platforms, preventing users from accessing each other's data is paramount:
```javascript
// Strict ownership check before returning configuration
if (!config.studentId.equals(req.user._id)) {
  return res.status(403).json({
    success: false,
    message: 'Access denied: You do not have permission to view this configuration.'
  });
}
```

---

## 3. React State Management in Complex Configuration Forms

In `InterviewConfigPage.jsx`, the user configures 5 interconnected dimensions:
1. `selectedDomain`
2. `selectedRole`
3. `selectedExperience`
4. `selectedCategory`
5. `selectedDifficulty`

### Handling Dependent / Cascading State:
When a student switches domains (e.g. from *Software Engineering* to *Data Science & AI*), the previously selected role (*Frontend Developer*) is no longer valid.
```javascript
const handleDomainChange = (domain) => {
  setSelectedDomain(domain);
  const availableRoles = domainMetadata[domain]?.roles || [];
  // Automatically snap to the first valid role in the newly selected domain:
  if (!availableRoles.includes(selectedRole)) {
    setSelectedRole(availableRoles[0] || '');
  }
};
```
This guarantees that invalid domain-role combinations are prevented on the UI level before the form is ever submitted.

---

## 4. Multi-Layer Form Validation

Reliable software validates data at **both layers**:
1. **Frontend Validation**: Instant, friendly user feedback preventing invalid HTTP calls.
2. **Backend Validation**: Never trust client input. The Express controller enforces taxonomy matching, enum verification, and field presence. If a malicious user uses Postman to bypass the UI, the backend returns `400 Bad Request`.

---

## 5. End-to-End Configuration Data Flow

```text
1. Student selects parameters in React UI
      │
      ▼
2. api.createInterviewConfig(payload)
   - Sends POST /api/interview/config with credentials: 'include'
      │
      ▼
3. Express Server:
   - CORS verifies origin
   - cookieParser parses HTTP-only JWT cookie
   - authMiddleware ('protect') validates JWT and attaches req.user
      │
      ▼
4. interviewController.createConfig:
   - Validates domain & role against TAXONOMY lookup
   - Verifies experienceLevel, category, and difficulty enums
   - Writes to MongoDB: { studentId: req.user._id, domain, role, ... }
      │
      ▼
5. MongoDB Atlas writes BSON document and indexes studentId
      │
      ▼
6. Server returns HTTP 201 { success: true, config }
      │
      ▼
7. React UI renders Success Box with Config ID and adds to Dashboard history
```


---

# Section 5: AI Question Generation Engine with Google Gemini (Phase 3)

> **Phase 3 Milestone**: Integrating Large Language Models (LLMs), Structured Output Generation, Backend Service Architecture, and Zero-Trust AI Validation.

---

## 1. What is an LLM (Large Language Model)?

A **Large Language Model (LLM)** is a deep learning neural network based on the **Transformer Architecture** (specifically the **Self-Attention Mechanism** introduced by Google in 2017).

- **Tokenization**: Text is converted into numerical tokens (words or sub-words).
- **Probability Distribution**: At its core, an LLM predicts the next most probable token given the preceding sequence of tokens:
  $$P(w_t \mid w_1, w_2, \dots, w_{t-1})$$
- **Temperature Parameter**:
  - `temperature: 0.0`: Completely deterministic, selecting the highest-probability token every time (best for math or exact code).
  - `temperature: 0.7` (Used in IntervuSetu): Introduces creative variance so every interview session generates fresh, dynamic questions while adhering to strict constraints.

---

## 2. How the Google Gemini API Integration Works

In IntervuSetu, we use Google's current official GenAI SDK: `@google/genai`.

```javascript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const response = await ai.models.generateContent({
  model: 'gemini-3.5-flash',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    temperature: 0.7
  }
});
```

### Why Call Gemini from the Backend (Node.js) instead of Frontend (React)?
1. **API Key Protection**: If called from React, your `GEMINI_API_KEY` would be visible in DevTools Network tab. Attackers could steal your key and exhaust your quota.
2. **Rate Limiting & Caching**: The server controls request volume, enforces per-user quotas, and saves questions to MongoDB so repeated visits do not incur unnecessary Gemini API costs.
3. **Graceful Model Fallbacks**: If a high-demand spike (HTTP 503) occurs on `gemini-3.5-flash`, our backend catches the error and automatically tries `gemini-3.1-flash-lite` or `gemini-2.5-flash-lite` transparently to the user.

---

## 3. Prompt Engineering for Interview Simulation

**Prompt Engineering** is the practice of crafting precise, contextual instructions that guide an LLM to generate optimal outputs.

In `server/services/geminiService.js`, our prompt uses three key techniques:
1. **Role Framing (Persona)**:  
   *"You are a Principal Engineering Lead and Technical Interviewer at a premier technology company."* Sets the professional tone and standards.
2. **Contextual Grounding**:  
   We inject the candidate's exact profile from their saved `InterviewConfig`:
   - Role: `${config.role}`
   - Domain: `${config.domain}`
   - Experience Level: `${config.experienceLevel}`
   - Category: `${config.category}`
   - Difficulty: `${config.difficulty}`
3. **Explicit Category Breakdown**:  
   If category is **Mixed**, the prompt explicitly instructs: *"Generate 6 technical questions, 2 behavioral questions, and 2 situational/system questions."*

---

## 4. Structured JSON Generation & Zero-Trust AI Validation

LLMs are generative text models, which means they can occasionally output markdown fences, commentary, or omitted keys.

### The Zero-Trust Validation Rule:
**Never save raw AI responses directly to your database.** Always parse, sanitize, and validate the schema.

```text
Gemini Raw Output ──► Strip Markdown (```json) ──► JSON.parse() ──► validateQuestions() ──► MongoDB Atlas
                                                                          │
                                                         Missing fields?  ├── Yes ──► Fallback default / Throw
                                                                          └── No  ──► Clean Array of 10 Objects
```

### Validation Checks in `geminiService.js`:
- Verifies that the parsed JSON is an array (or unwraps `{ questions: [...] }`).
- Ensures `questionText` is a non-empty string with meaningful length ($> 10$ characters).
- Enforces array types for `expectedKeyConcepts` and `evaluationCriteria`.
- Validates difficulty level against allowed enums (`Easy`, `Medium`, `Hard`).
- Rejects responses with fewer than 5 valid questions.

---

## 5. Backend Services Architectural Pattern

In our project structure, we maintain clean separation of concerns:

```text
Route Handler (/routes/interviewRoutes.js)
      │
      ▼
Controller (/controllers/interviewController.js)
  - Checks HTTP request, cookies, and user authorization
      │
      ▼
Service Layer (/services/geminiService.js)
  - Talks to Google Gemini GenAI SDK
  - Builds prompts, calls models, validates JSON schema
      │
      ▼
Mongoose Model (/models/InterviewQuestion.js)
  - Writes validated documents to MongoDB Atlas
```

**Why this matters**: If Google updates their SDK or if we switch from Gemini to an open-source model like Gemma, **only `geminiService.js` needs to change**. The controllers, routes, database schemas, and frontend stay 100% untouched.

---

## 6. Mongoose Data Relationships: Three-Tier Hierarchy

```
User (Student Profile)
   │
   └── 1:Many ──► InterviewConfig (Session Settings: Role, Level, Category)
                     │
                     └── 1:Many ──► InterviewQuestion (10 Generated Questions)
```

- Each `InterviewQuestion` stores both `configId` and `studentId` with a compound B-Tree index:
  ```javascript
  interviewQuestionSchema.index({ configId: 1, questionNumber: 1 });
  ```
- **Strict Authorization**: Whenever a student requests questions (`GET /api/interview/:configId/questions`), the controller verifies that `config.studentId.equals(req.user._id)`. This prevents Student A from ever reading or regenerating questions belonging to Student B.


---

# Phase 4: Real-Time Voice Mock Interview Architecture & WebRTC

> Engineering documentation tailored for students mastering real-time voice streaming, AI turn-taking, and stateful WebRTC workflows.

---

## 1. WebRTC Fundamentals (Web Real-Time Communication)

**WebRTC** is a browser-native standard that enables peer-to-peer audio, video, and data communication without plugins or third-party client software.

### The Core WebRTC Pipeline:
1. **Signaling**: The discovery phase where two peers exchange network addresses (IP, ports) and media capabilities before direct connection is established. This occurs over WebSocket or HTTP.
2. **SDP (Session Description Protocol)**: A text-based format describing multimedia communication parameters (codecs, audio sample rates, encryption keys, and bandwidth limits).
3. **ICE (Interactive Connectivity Establishment)**: A framework that finds the fastest and most direct path to connect peers through firewalls and NAT routers.
   - **STUN (Session Traversal Utilities for NAT)**: A lightweight server that tells the browser its external public IP address.
   - **TURN (Traversal Using Relays around NAT)**: A relay server used as a fallback when symmetric NAT or strict enterprise firewalls prevent direct peer-to-peer transmission.
4. **SRTP (Secure Real-Time Transport Protocol)**: Encrypted streaming audio/video packets transmitted via UDP to ensure ultra-low latency ($\approx 100\text{--}250\text{ ms}$).

```
[Student Browser] ──(Microphone Audio / SRTP)──► [Vapi WebRTC Gateway / Daily.co]
         ▲                                                       │
         │                                                       ▼
         │                                            [Speech-to-Text (STT)]
         │                                                       │
         │                                                       ▼
         │                                            [LLM Orchestration]
         │                                                       │
         │                                                       ▼
         │                                            [Text-to-Speech (TTS)]
         │                                                       │
         └────────(Synthesized Voice Audio)──────────────────────┘
```

---

## 2. Vapi Web SDK Architecture

The **Vapi Web SDK (`@vapi-ai/web`)** abstracts complex WebRTC peer-connection negotiation, audio hardware resampling, and socket signaling into a clean event-driven interface.

### Under the Hood:
- Vapi leverages **Daily.co** WebRTC client infrastructure for high-availability call transport.
- When calling `vapi.start(assistantId, assistantOverrides)`:
  1. The client SDK contacts the Vapi platform with the `publicKey`.
  2. The server spins up an ephemeral WebRTC room with Opus 48kHz audio encoding.
  3. The browser receives the remote WebRTC transport URL and establishes an encrypted real-time audio session.
  4. The client's microphone audio track is attached to the peer connection and streamed continuously.

---

## 3. Browser Microphone Permissions & Device Constraints

Microphone access in modern browsers is guarded by strict Web API security policies:

### How Microphone Capture Works:
```javascript
// Browser Native API under the hood
const stream = await navigator.mediaDevices.getUserMedia({
  audio: {
    echoCancellation: true,  // Prevents acoustic feedback loops
    noiseSuppression: true,  // Filters ambient background noise
    autoGainControl: true    // Normalizes candidate voice volume
  }
});
```

### Critical Security Constraints:
1. **Explicit User Gesture Requirement**: Browsers prohibit automatic microphone capture on page load. A user click or tap on an active element (`"Start Real-Time Interview"`) is strictly required.
2. **HTTPS / Secure Context**: `navigator.mediaDevices` is disabled on insecure HTTP connections (except for `localhost` and `127.0.0.1` during local development).
3. **Error Handling (`NotAllowedError`)**: When a candidate clicks "Block" or denies microphone permission, the browser rejects the promise with a `NotAllowedError`. IntervuSetu catches this event and displays an actionable banner instructing the student on how to enable microphone permissions in their browser settings.

---

## 4. Real-Time Event Lifecycle & State Transitions

The Vapi SDK operates as an event emitter. IntervuSetu's custom `useVapi` hook converts these low-level socket and WebRTC events into reactive React state:

| Event Name | Trigger | Frontend Action in IntervuSetu |
| :--- | :--- | :--- |
| `call-start` | WebRTC audio channel established | Transition state to `active`; start session stopwatch timer. |
| `speech-start` | Vapi voice engine begins streaming synthesized audio | Set `isSpeaking = true`; trigger the emerald sound-wave pulse indicator. |
| `speech-end` | Vapi voice engine completes an utterance | Set `isSpeaking = false`; return to "Listening" state. |
| `message` | Partial or final transcript received | Process speech text; update live conversation stream; trigger question progression. |
| `error` | Microphone blocked, socket drop, or network failure | Map error codes to human-readable guidance; set state to `error`. |
| `call-end` | Call terminated by candidate or interviewer | Mark session as `ended`; sync final duration and transcript metadata to MongoDB. |

---

## 5. Live Transcript Processing & Deduplication Strategy

Voice conversational engines generate two distinct types of speech messages:

1. **Partial Transcripts (`transcriptType === 'partial'`)**:
   - Sent while the speaker is mid-sentence as a stream of tokens.
   - Displayed in IntervuSetu as a live, subtle italicized utterance bubble (`(speaking...)`) for immediate visual feedback.
2. **Final Transcripts (`transcriptType === 'final'`)**:
   - Dispatched when the speaker pauses or completes their thought, verified by the Automatic Speech Recognition (ASR) engine.
   - Committed to the persistent transcript array and synced to the backend database.

### The Idempotency & Deduplication Algorithm:
Because WebRTC networks and reconnections can occasionally resend packets or re-evaluate utterances, IntervuSetu enforces dual-layer deduplication:
```javascript
// Server-Side Deduplication in sessionController.js:
const existingSignatures = new Set(
  session.transcript.map(t => `${t.speaker}|${t.text.trim()}|${t.messageId || ''}`)
);

for (const entry of entries) {
  const signature = `${entry.speaker}|${entry.text.trim()}|${entry.messageId || ''}`;
  if (!existingSignatures.has(signature)) {
    session.transcript.push(entry);
    existingSignatures.add(signature);
  }
}
```

---

## 6. Four-Tier Database Hierarchy & Session Persistence

With Phase 4, IntervuSetu expands to a four-tier relational document architecture in MongoDB Atlas:

```text
User (Student Profile)
  │
  └── 1:Many ──► InterviewConfig (Domain, Role, Experience, Difficulty)
                    │
                    ├── 1:Many ──► InterviewQuestion (10 AI-Generated Questions)
                    │
                    └── 1:Many ──► InterviewSession (Live Voice Calls)
                                      ├── status: 'in_progress' | 'completed' | 'interrupted'
                                      ├── startedAt & endedAt (Timestamps)
                                      ├── metadata (Call duration, question count)
                                      └── transcript: [ { speaker, text, timestamp } ]
```

### State Machine Lifecycle of an `InterviewSession`:
```text
[Candidate clicks 'Start Interview']
         │
         ▼
[status: 'in_progress'] ──► Appending live transcript entries incrementally
         │
         ├── Candidate finishes all questions / ends call ──► [status: 'completed']
         └── Network drop / Browser tab closed early       ──► [status: 'interrupted']
```

---

## 7. Public vs. Private API Key Cryptography & Full-Stack Security

Understanding the boundary between public and private keys is foundational to production cloud architecture:

### 1. Public Key (`VITE_VAPI_PUBLIC_KEY`):
- Embedded in the frontend client bundle.
- **Permitted Scope**: Restricted to client-side WebRTC room join tokens and audio device binding.
- **Safety**: Cannot be used to delete assistants, view billing details, read past call logs, or provision resources.

### 2. Private Secret Keys (`GEMINI_API_KEY`, `JWT_SECRET`):
- Kept strictly on the backend Node.js server inside `server/.env`.
- **Never bundled into the client** or sent across public HTTP headers.
- **Authorization Enforcement**: The client cannot request a voice interview session without presenting a valid, signed HTTP-only JWT cookie (`req.cookies.token`).
- **Server-Side Context Generation**: The backend validates that `config.studentId.equals(req.user._id)` before synthesizing the dynamic assistant overrides, ensuring no student can eavesdrop on or hijack another student's interview session.
