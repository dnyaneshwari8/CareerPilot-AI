# CareerPilot AI

A modern full-stack career platform built with **React (Vite)** and **Django REST Framework**. Includes JWT auth, PDF resume management, and **AI-powered ATS analysis & skill gap coaching** via LLM prompts.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, React Router, Tailwind CSS, Axios, React Icons, React Hot Toast |
| Backend | Django, Django REST Framework, Simple JWT, PostgreSQL |
| Auth | JWT (access + refresh tokens with blacklist logout) |

## Project Structure

```
CareerPilot AI/
├── backend/
│   ├── config/          # Django settings & URLs
│   ├── accounts/        # User auth & profile APIs
│   ├── resumes/         # Resume upload & management APIs
│   ├── ai/              # LLM prompts, PDF extract, parse/analyze/skill-gap
│   ├── media/           # Uploaded resumes (gitignored)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI & layout
│       ├── pages/       # Route pages
│       ├── services/    # Axios API layer
│       ├── context/     # Auth context
│       └── utils/       # Validation & formatting
└── README.md
```

## Features

### Phase 2 — AI (LLM)
- **Resume parsing** — PDF → text → structured JSON (name, skills, education, experience, projects)
- **ATS analysis** — score 0–100, strengths, weaknesses, missing skills, recommendations, role fit
- **Skill gap** — compare skills vs target role (Backend, Full Stack, ML, Frontend, DevOps) + learning path
- Mock mode for demos without an API key (`AI_MOCK_MODE=True`)

### Phase 1

### Authentication
- User registration with strong password validation
- Login / logout (JWT blacklist)
- Profile view & edit
- Change password

### Resume Module
- PDF-only upload (drag & drop + click)
- Secure per-user storage
- View, download, delete resumes
- Dashboard stats

### UI
- Dark mode SaaS design with glassmorphism
- Responsive layout (mobile, tablet, desktop)
- Loading spinners, skeleton loaders, toast notifications

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (optional — SQLite fallback available)

### Backend Setup

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `backend/.env`:
- Set `USE_SQLITE=True` for quick local dev without PostgreSQL
- Or configure PostgreSQL credentials and set `USE_SQLITE=False`

```bash
python manage.py migrate
python manage.py createsuperuser   # optional
python manage.py runserver
```

API runs at **http://127.0.0.1:8000**

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at **http://localhost:5173**

## API Endpoints

### Auth (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register/` | Register new user |
| POST | `/login/` | Login & get tokens |
| POST | `/logout/` | Blacklist refresh token |
| GET/PATCH | `/profile/` | View/update profile |
| POST | `/change-password/` | Change password |
| POST | `/token/refresh/` | Refresh access token |

### Resumes (`/api/resumes/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user resumes |
| POST | `/upload/` | Upload PDF resume |
| GET | `/stats/` | Dashboard statistics |
| GET | `/<id>/` | Resume details |
| DELETE | `/<id>/` | Delete resume |
| GET | `/<id>/download/` | Download resume file |

### AI (`/api/ai/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/roles/` | Career roles for skill gap |
| POST | `/skill-gap/` | Skill gap analysis `{ resume_id, target_role }` |
| GET | `/resumes/<id>/` | Cached parse + analysis |
| POST | `/resumes/<id>/parse/` | LLM resume parsing |
| POST | `/resumes/<id>/analyze/` | ATS analysis |

**AI env vars** (`backend/.env`):
```env
GEMINI_API_KEY=your-gemini-key
GEMINI_MODEL=gemini-1.5-flash
AI_MOCK_MODE=False   # True = demo JSON without API calls
```

## Future Phases
- Interview preparation modules
- Personalized multi-week roadmaps
- Job description matching

## License

MIT — free to use for portfolios, internships, and hackathons.
