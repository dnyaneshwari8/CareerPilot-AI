# CareerPilot AI

A modern full-stack career platform built with **React (Vite)** and **Django REST Framework**. Phase 1 includes JWT authentication and PDF resume management with a production-quality SaaS UI.

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

## Features (Phase 1)

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

## Future Phases

The codebase is structured for upcoming AI features:
- ATS resume scoring
- Skill gap analysis
- Personalized career roadmaps
- Interview preparation modules

## License

MIT — free to use for portfolios, internships, and hackathons.
