<div align="center">

## Osdag Bridge Module Web-Based UI Development

Steel-concrete composite bridge design tool for highway structures.  
Built as part of the Osdag ecosystem for open steel design and graphics.

[![Next.js](https://img.shields.io/badge/Next.js-16.1-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Django](https://img.shields.io/badge/Django-4.2-092E20?style=flat&logo=django)](https://djangoproject.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 16+ (or SQLite for development)

---

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env        # Windows
cp .env.example .env          # Linux/Mac
```

Edit `.env` with your database credentials, then:

```bash
# Apply database migrations
python manage.py migrate

# Populate location data
python manage.py seed_data

# Start development server
python manage.py runserver
```

Backend available at `http://localhost:8000`

---

### Database Setup

**Option 1: Using seed command** (recommended)

```bash
python manage.py seed_data
```

**Option 2: Import from SQL file**

```bash
# PostgreSQL
psql -U postgres -d osdag_bridge < ../data/location_data.sql

# SQLite
sqlite3 db.sqlite3 < ../data/location_data.sql
```

---

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend available at `http://localhost:3000`

**Production build:**

```bash
npm run build
npm run start
```

---

### API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations/` | List all states |
| GET | `/api/locations/?state=Maharashtra` | List cities in a state |
| GET | `/api/location-data/?city=Pune` | Get environmental parameters |
| POST | `/api/validate/` | Validate geometric inputs |
| POST | `/api/calculate-geometry/` | Calculate girder configuration |
| GET | `/api/materials/{type}/` | Get available material grades |

---

### Project Structure

```
├── backend/
│   ├── bridge/                 # Django application
│   │   ├── management/         # Custom commands (seed_data)
│   │   ├── models.py           # Database models
│   │   ├── views.py            # API views
│   │   └── serializers.py      # DRF serializers
│   ├── config/                 # Django settings
│   └── requirements.txt
│p
└── frontend/
    ├── src/
    │   ├── app/                # Next.js pages
    │   ├── components/
    │   │   ├── ui/             # Reusable UI components
    │   │   └── bridge-design/  # Domain-specific components
    │   ├── lib/                # API utilities
    │   └── types/              # TypeScript definitions
    └── package.json
```

---

> **Note:** Developed as a screening task for the Osdag development team.

