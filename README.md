# IntervuSetu

> **Bridging the Gap Between Academic Preparation and Industry Technical Interviews.**

IntervuSetu is an AI-powered interview preparation and assessment platform designed specifically for students and fresh graduates. By combining real-time voice conversational agents, intelligent question generation, and structured multi-metric rubric evaluations, IntervuSetu provides a realistic, low-anxiety environment for candidates to practice and master their technical, behavioral, and communication skills.

---

## 📌 Problem Statement

- **The Transition Gap**: Fresh graduates and engineering students frequently struggle when transitioning from theoretical academic knowledge to live, high-pressure job interviews.
- **Lack of Realistic Practice**: Existing preparation methods rely heavily on static question banks, mock interview peers with varying expertise, or expensive one-on-one coaching services.
- **Delayed & Subjective Feedback**: Traditional practice lacks structured, immediate, and actionable diagnostic feedback on communication clarity, technical depth, and problem-solving structure.

---

## 💡 Proposed Solution

**IntervuSetu** solves these challenges through:
1. **Interactive Voice Mock Interviews**: Simulating real human interviewer interactions using the Vapi Web SDK for ultra-low latency, natural voice conversations.
2. **Dynamic AI Question Generation**: Context-aware questions generated via the Google Gemini API tailored to chosen job domains, competencies, and candidate seniority.
3. **Comprehensive Rubric-Based Evaluations**: Immediate, actionable feedback scoring candidates on technical accuracy, clarity of thought, and structured problem-solving.
4. **Historical Analytics & Growth Tracking**: Progress tracking dashboards showing competency trends across interviews to guide focused revision.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React.js (v19) | Reactive, component-driven user interface |
| **Build Tool & Dev Server**| Vite (v6) | Instant HMR and optimized production bundles |
| **Language** | JavaScript (ES6+) | Standardized modern JavaScript across client and server |
| **Styling** | Vanilla CSS (Tokens) | Warm Ivory (`#F9EBD7`) & Emerald (`#046A38`) Minimal Editorial design |
| **Routing** | React Router DOM (v7) | Client-side routing, protected routes, and live interview rooms |
| **Icons** | Lucide React | Accessible, crisp UI icon system |
| **Voice Engine** | Vapi Web SDK (`@vapi-ai/web`) | Real-time bidirectional WebRTC voice streaming & turn-taking |
| **Backend API** | Node.js & Express.js | Scalable REST API, session state machines, and AI orchestration |
| **Database** | MongoDB Atlas & Mongoose | Four-tier relational document storage (User, Config, Question, Session) |
| **AI Question Engine** | Google Gemini API (`@google/genai`) | Context-aware structured question bank generation |
| **Authentication** | JWT & bcryptjs | Secure HTTP-only cookie-based student authentication |

---

## 🗺️ Planned Development Phases

- [x] **Phase 0: Environment & Architecture Initialization**  
  *Vite + React initialized, clean folder structure, CSS design tokens, React Router, and landing page.*
- [x] **Phase 1: Student Authentication & User Profiles**  
  * [x] **Backend & Database Foundation**: *Node.js + Express backend initialized, MongoDB Atlas connected, health endpoint `/api/health` active.*
  * [x] **Auth Engine & Schemas**: *User model, password hashing (bcryptjs), JWT token issuance/verification, Register, Login, and Profile APIs.*
  * [x] **Frontend Auth UI & Security**: *Student registration, login, HTTP-only cookie sessions, AuthContext, ProtectedRoute, and student dashboard.*
- [x] **Phase 2: Domain Taxonomy & Role Selection**  
  * [x] **Domain Catalog**: *5 primary domains (Software Engineering, Data Science & AI, Data Engineering, Cloud & DevOps, HR & Behavioral).*
  * [x] **Configuration Engine**: *Mongoose relationship schema (`InterviewConfig`), ownership validation, role-domain cascading state, and multi-tier experience/category/difficulty selectors.*
  * [x] **Configuration Studio UI**: *Responsive single-page configuration studio, interactive summary card, and dashboard configuration history.*
- [x] **Phase 3: AI Question Generation Engine**  
  * [x] **Google GenAI Backend Service**: *Official `@google/genai` integration, multi-model fallback (`gemini-3.5-flash`), zero-leak key protection.*
  * [x] **Structured Output & Schema Validation**: *10 contextual interview questions with competencies, expected key concepts, and evaluation rubrics.*
  * [x] **Mongoose Persistence & Isolation**: *`InterviewQuestion` schema with compound indexing and strict cross-student access guards.*
  * [x] **Question Bank UI**: *Interactive question-list view with editorial typography, collapsible rubrics, and regeneration actions.*
- [x] **Phase 4: Real-Time Voice Mock Interview with Vapi**  
  * [x] **Vapi Web SDK Integration**: *`@vapi-ai/web` service hook (`useVapi`), WebRTC audio streaming, event listeners (`call-start`, `speech-start`, `message`, `error`, `call-end`).*
  * [x] **Dynamic Assistant Context**: *Server-side assistant context synthesis with student name, role, difficulty, and Question Bank overrides.*
  * [x] **Voice Interview Room**: *Dedicated live room (`/interview/:configId/live`) with sound-wave speaking indicator, question progress tracker, mute toggle, and live transcript stream.*
  * [x] **Interview Session Persistence**: *`InterviewSession` schema, state machine (`in_progress` -> `completed`/`interrupted`), deduplicated transcript storage, and call metadata.*
  * [x] **Question Progression**: *Natural conversation progression tracking from live transcript events.*
- [ ] **Phase 5: AI Answer Evaluation & Multi-Metric Scoring**  
  *Multi-dimensional rubrics: technical correctness, communication clarity, problem-solving depth.*
- [ ] **Phase 6: Student Dashboard & Actionable Performance Reports**  
  *Scorecards, competency radar charts, strengths/weaknesses diagnostics, and study guides.*
- [ ] **Phase 7: Interview History, Analytics & Polish**  
  *Session history, progress tracking, accessibility compliance, and production readiness.*

---

## 📊 Development Status

> **Current Phase**: `Phase 4 — Real-Time Voice Mock Interview using Vapi (Completed & Verified)`  
> Candidates can now conduct live, voice-to-voice mock interviews with the **IntervuSetu AI Interviewer**. The assistant speaks first, asks the 10 tailored questions in exact sequence, handles follow-ups, and streams conversational transcripts back to the browser. Sessions and transcripts are automatically persisted in MongoDB Atlas with strict cross-student ownership verification.

---

## 🚀 Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher, tested on v24.x)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) (v10+ or v11+)
- MongoDB Atlas cluster URI
- Google Gemini API Key
- Vapi Public Key & Assistant ID

### Installation & Startup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atharva-jagdhane/intervu-setu.git
   cd intervu-setu
   ```

2. **Frontend Setup & Execution**:
   ```bash
   cp .env.example .env   # Configure VITE_VAPI_PUBLIC_KEY and VITE_VAPI_ASSISTANT_ID
   npm install
   npm run dev
   ```
   *Frontend starts at `http://localhost:5173/`.*

3. **Backend Setup & Execution**:
   ```bash
   cd server
   cp .env.example .env   # Configure MONGODB_URI, JWT_SECRET, and GEMINI_API_KEY
   npm install
   npm run dev
   ```
   *Backend starts at `http://localhost:5000/` (Health check: `http://localhost:5000/api/health`).*

---

## 🔒 Security & Privacy Practices

- All backend credentials, database connection strings, JWT secrets, and AI API keys (Gemini, Vapi private tokens) are strictly managed via server environment variables (`server/.env`).
- Environment configuration files (`.env`, `server/.env`) are excluded from Git via `.gitignore`.
- Only public, client-safe keys (`VITE_VAPI_PUBLIC_KEY`) are utilized on the frontend for WebRTC signaling.
- Zero raw audio files are stored in this milestone; conversations are persisted as sanitized text transcripts with timestamp indexing.

---

## 📄 License

This project is licensed under the ISC License.
