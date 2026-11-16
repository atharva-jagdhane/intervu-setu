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
| **Styling** | Vanilla CSS (CSS Tokens) | Custom, responsive design system with clean SaaS tokens |
| **Routing** | React Router DOM (v7) | Client-side routing, protected routes, and navigation |
| **Icons** | Lucide React | Accessible, crisp UI icon system |
| **Backend API** | Node.js & Express.js | Scalable REST API, middleware, and AI orchestration (Upcoming) |
| **Database** | MongoDB & Mongoose | Document storage for users, sessions, and reports (Upcoming) |
| **AI Evaluation** | Google Gemini API | Question synthesis, answer analysis, and scoring (Upcoming) |
| **Voice Engine** | Vapi Web SDK | Real-time bidirectional voice conversation & STT (Upcoming) |
| **Authentication** | JWT & bcryptjs | Stateless, secure authentication & password hashing (Upcoming) |

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
  * [x] **Configuration Studio UI**: *Responsive configuration studio page, interactive summary card, and dashboard configuration history.*
- [x] **Phase 3: AI Question Generation Engine**  
  * [x] **Google GenAI Backend Service**: *Official `@google/genai` integration, multi-model fallback (`gemini-3.5-flash`), zero-leak key protection.*
  * [x] **Structured Output & Schema Validation**: *10 contextual interview questions with competencies, expected key concepts, and evaluation rubrics.*
  * [x] **Mongoose Persistence & Isolation**: *`InterviewQuestion` schema with compound indexing and strict cross-student access guards.*
  * [x] **Question Bank UI**: *Interactive question-list view with loading indicators, empty states, and regeneration actions.*
- [ ] **Phase 4: Real-Time Voice Interview Engine**  
  *Vapi Web SDK integration, audio streaming, turn indicators, and live transcript visualizer.*
- [ ] **Phase 5: AI Answer Evaluation & Multi-Metric Scoring**  
  *Multi-dimensional rubrics: technical correctness, communication clarity, problem-solving depth.*
- [ ] **Phase 6: Student Dashboard & Actionable Performance Reports**  
  *Scorecards, competency radar charts, strengths/weaknesses diagnostics, and study guides.*
- [ ] **Phase 7: Interview History, Analytics & Polish**  
  *Session history, progress tracking, accessibility compliance, and production readiness.*

---

## 📊 Development Status

> **Current Phase**: `Phase 3 — AI Question Generation Engine (Completed & Verified)`  
> Google Gemini API generates 10 tailored interview questions per configuration with competencies, expected concepts, and evaluation criteria. Responses are strictly schema-validated, stored in MongoDB Atlas, and viewable in the Question Bank UI. Ready for Phase 4 (Real-Time Voice-Based Interview Engine with Vapi).

---

## 🚀 Running the Project Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher, tested on v24.x)
- [Git](https://git-scm.com/)
- [npm](https://www.npmjs.com/) (v10+ or v11+)
- MongoDB Atlas cluster URI

### Installation & Startup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atharva-jagdhane/intervu-setu.git
   cd intervu-setu
   ```

2. **Frontend Setup & Execution**:
   ```bash
   npm install
   npm run dev
   ```
   *Frontend starts at `http://localhost:5173/`.*

3. **Backend Setup & Execution**:
   ```bash
   cd server
   npm install
   cp .env.example .env   # Configure your MONGODB_URI and JWT_SECRET
   npm run dev
   ```
   *Backend starts at `http://localhost:5000/` (Health check: `http://localhost:5000/api/health`).*

---

## 🔒 Security & Privacy Practices

- All backend credentials, database connection strings, JWT secrets, and AI API keys (Gemini, Vapi) are strictly managed via environment variables (`.env`).
- Environment configuration files (`.env`, `.env.*`) are excluded from Git via `.gitignore`.
- Zero private keys or backend credentials are ever exposed in client-side code.

---

## 📄 License

This project is licensed under the ISC License.
