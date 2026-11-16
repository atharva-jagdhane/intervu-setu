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
