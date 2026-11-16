# IntervuSetu

> **Bridging the Gap Between Student Preparation and Real-World Technical Interviews.**

IntervuSetu is an AI-powered interview preparation and assessment platform designed specifically for students and fresh graduates. By combining real-time voice conversational agents, intelligent question generation, and structured multi-metric rubric evaluations, IntervuSetu provides a realistic, low-anxiety environment for candidates to practice and refine their technical, behavioral, and communication skills.

---

## 📌 Problem Statement

- **The Transition Gap**: Fresh graduates and students frequently struggle when transitioning from theoretical academic knowledge to live, high-pressure job interviews.
- **Lack of Realistic Practice**: Existing preparation methods rely heavily on static question banks, mock interview peers with varying expertise, or expensive one-on-one coaching services.
- **Delayed & Subjective Feedback**: Traditional practice lacks structured, immediate, and actionable diagnostic feedback on communication clarity, technical depth, and problem-solving structure.

---

## 💡 Proposed Solution

**IntervuSetu** solves these challenges by providing:
1. **Interactive Voice Mock Interviews**: Simulating real human interview interactions using the Vapi Web SDK for ultra-low latency, natural voice conversations.
2. **Dynamic AI Question Generation**: Context-aware questions generated via the Google Gemini API tailored to chosen job domains, competencies, and candidate seniority.
3. **Comprehensive Rubric-Based Evaluations**: Immediate, actionable feedback scoring candidates on technical accuracy, clarity of thought, and structured problem-solving.
4. **Historical Analytics & Growth Tracking**: Progress tracking dashboards showing competency trends across interviews to guide focused revision.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js (Vite) | High-performance, reactive single-page client |
| **Language** | JavaScript (ES6+) | Standardized modern JavaScript across client and server |
| **Styling** | Vanilla CSS | Custom, responsive design system with clean SaaS tokens |
| **Routing** | React Router DOM | Client-side routing, protected routes, and navigation |
| **Icons** | Lucide React | Clean, consistent UI icon system |
| **Backend** | Node.js & Express.js | Scalable REST API, middleware, and AI orchestration |
| **Database** | MongoDB & Mongoose | Flexible document storage for users, sessions, and reports |
| **AI Evaluation** | Google Gemini API | Question synthesis, answer analysis, and feedback scoring |
| **Voice Engine** | Vapi Web SDK | Real-time bidirectional voice conversation and transcription |
| **Authentication** | JWT & bcryptjs | Stateless, secure authentication and password hashing |

---

## 🗺️ Planned Features & Roadmap

- [ ] **Student Authentication**: Secure sign-up, login, password encryption, and JWT authorization.
- [ ] **Student Dashboard**: Overview of practice sessions, key performance indicators, and recent activities.
- [ ] **Domain & Role Catalog**: Role-based selection (Software Engineer, Data Scientist, ML Engineer, Frontend Dev, Backend Dev, etc.).
- [ ] **AI Question Generation Engine**: Dynamic, role-specific question banks powered by Google Gemini.
- [ ] **Voice-Based Interview Engine**: Interactive voice interface powered by Vapi Web SDK with real-time audio visualizers and speech-to-text.
- [ ] **AI Evaluation & Scoring**: Multi-dimensional rubrics (technical correctness, communication, problem-solving, and keyword coverage).
- [ ] **Performance Reports**: Detailed scorecards with strength/weakness diagnostics and recommended resources.
- [ ] **History & Analytics**: Session replay, score trajectories, and performance metrics over time.

---

## 📊 Development Status

> **Current Phase**: `Phase 0 — Project & Repository Initialization`  
> Baseline repository configuration, Git workflow setup, and architectural foundations are being established. Core features are actively under development in planned sequential phases.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended, verified on v24.x)
- [Git](https://git-scm.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas connection string)
- API keys for Google Gemini and Vapi (required in subsequent phases)

### Repository Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/atharva-jagdhane/intervu-setu.git
   cd intervu-setu
   ```

2. **Project Architecture (Upcoming in Phase 0)**:
   ```text
   intervu-setu/
   ├── client/          # Vite + React Frontend
   ├── server/          # Node.js + Express Backend
   ├── .gitignore       # Version control ignore rules
   └── README.md        # Project documentation
   ```

---

## 🔒 Security & Privacy

- All sensitive credentials, including database connection strings, JWT secrets, and third-party API keys (Gemini, Vapi), are strictly managed via environment variables (`.env`).
- Environment configuration files (`.env`, `.env.*`) are permanently excluded from version control via `.gitignore`.
- Reference configuration templates will be provided in `.env.example` files without real secrets.

---

## 📄 License

This project is licensed under the ISC License.
