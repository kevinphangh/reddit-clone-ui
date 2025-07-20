# VIA Pædagoger Forum

Et moderne, fuldt funktionelt online forum specifikt for nuværende pædagogstuderende ved VIA University College. Bygget med React + TypeScript frontend og FastAPI Python backend med komplet API integration.

## 🎯 Formål

Dette forum er designet til at hjælpe nuværende pædagogstuderende med at:
- Dele erfaringer fra praksis og studieliv
- Få hjælp til studieopgaver og eksamen
- Stille spørgsmål og få svar fra andre studerende
- Diskutere pædagogiske metoder og udfordringer
- Navigere i hverdagens udfordringer under studiet

## ⚡ Funktioner

#### ✨ Komplet Forum Funktionalitet
- **Brugerautentificering**: Sikker registrering og login med JWT tokens
- **Diskussionstråde**: Opret, rediger og slet indlæg
- **Kommentarsystem**: Indlejrede kommentarer med svar-funktionalitet
- **Voting system**: Stem indlæg og kommentarer op eller ned
- **Brugerprofiler**: Se brugeres indlæg og kommentarer
- **Søgefunktion**: Find indhold hurtigt og nemt
- **Dynamisk medlemstal**: Live visning af antal registrerede brugere
- **Karakterbegrænsninger**: 100 tegn for titler, 5000 tegn for indhold
- **Brugerverifikation**: Bekræftelse efter registrering for sikker adgang

### 🎨 Minimalistisk Design
- **Centreret layout**: Indhold er perfekt centreret på siden
- **Dansk minimalistik**: Ren, skandinavisk æstetik med hvid, grå og blå
- **Responsive**: Fungerer perfekt på alle enheder
- **Tilgængeligt**: Tydelig navigation og brugervenligt interface
- **Konsekvent typografi**: Ensartet font og størrelser gennem hele interfacet

### 🔧 Production-Ready
- **Type-sikker**: 100% TypeScript med fuld type coverage
- **Performance optimeret**: Fast API calls og optimistic updates
- **Fejlhåndtering**: Robuste error boundaries og user feedback
- **Deployment klar**: Konfigureret til Vercel (frontend) og Fly.io (backend)

## 🏗️ Projekt Struktur

```
forum/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # UI komponenter
│   │   ├── pages/          # Side komponenter
│   │   ├── contexts/       # React Context providers
│   │   ├── lib/           # API client og utilities
│   │   ├── types/         # TypeScript definitioner
│   │   └── utils/         # Hjælpefunktioner
│   ├── public/            # Statiske filer
│   └── package.json
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core functionality og utilities
│   │   ├── db/           # Database konfiguration
│   │   ├── models/       # SQLAlchemy modeller
│   │   └── schemas/      # Pydantic schemas
│   ├── alembic/          # Database migrations
│   ├── requirements.txt
│   └── main.py
├── README.md
├── CLAUDE.md               # Deployment guide for Claude AI
└── LICENSE                 # Proprietary license
```

## 🛠️ Teknisk Stack

### Frontend
- **React 19** - Moderne frontend framework
- **TypeScript 5** - Type safety og bedre udviklingsoplevelse
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 7** - Client-side routing
- **Vite 7** - Lynhurtig build tool
- **Lucide React** - Moderne ikoner
- **date-fns** - Dato formatering

### Backend
- **FastAPI** - Moderne, hurtig Python web framework
- **SQLAlchemy** - ORM med async support
- **PostgreSQL** - Production database på Fly.io (med SQLite til udvikling)
- **Alembic** - Database migrations
- **JWT** - Sikker autentificering
- **Pydantic** - Data validation og serialization
- **Uvicorn** - ASGI server
- **psycopg2-binary** - PostgreSQL adapter

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- PostgreSQL (til production) eller SQLite (automatisk til udvikling)

### 1. Klon repositoriet
```bash
git clone https://github.com/kevinphangh/reddit-clone-ui.git
cd reddit-clone-ui
```

### 2. Backend Setup
```bash
cd backend

# Opret virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer dependencies
pip install -r requirements-dev.txt

# Kopier environment variabler
cp .env.example .env  # Rediger efter behov

# Initialiser database
python init_db.py

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend kører nu på `http://localhost:8000`

### 3. Frontend Setup
```bash
cd frontend

# Installer dependencies
npm install

# Start development server
npm run dev
```

Frontend kører nu på `http://localhost:3000`

### 4. Åbn din browser
Gå til `http://localhost:3000` og opret en bruger for at komme i gang!

## 🔧 Tilgængelige Scripts

### Frontend Commands
```bash
cd frontend
npm run dev          # Start udviklingsserver
npm run build        # Byg til produktion
npm run preview      # Preview produktionsbuild
npm run type-check   # TypeScript type-tjek
npm run lint         # Lint checking
```

### Backend Commands
```bash
cd backend
source venv/bin/activate

# Development
uvicorn main:app --reload               # Start med hot reload
python init_db.py                      # Initialiser database

# Database migrations
alembic revision --autogenerate -m "Description"  # Opret migration
alembic upgrade head                               # Kør migrations

# Production
uvicorn main:app --host 0.0.0.0 --port 8000      # Production server
```

## 🔗 API Endpoints

### Autentificering
- `POST /api/auth/register` - Registrer ny bruger
- `POST /api/auth/login` - Login bruger
- `GET /api/auth/me` - Hent bruger info

### Indlæg
- `GET /api/posts` - Hent alle indlæg
- `POST /api/posts` - Opret nyt indlæg
- `GET /api/posts/{id}` - Hent specifikt indlæg
- `PUT /api/posts/{id}` - Opdater indlæg
- `DELETE /api/posts/{id}` - Slet indlæg
- `POST /api/posts/{id}/vote` - Stem på indlæg

### Kommentarer
- `GET /api/comments/post/{post_id}` - Hent kommentarer til indlæg
- `POST /api/comments/post/{post_id}` - Opret ny kommentar
- `PUT /api/comments/{id}` - Opdater kommentar
- `DELETE /api/comments/{id}` - Slet kommentar
- `POST /api/comments/{id}/vote` - Stem på kommentar

### Brugere
- `GET /api/users/{username}` - Hent bruger profil
- `GET /api/users/{username}/posts` - Hent brugers indlæg
- `GET /api/users/{username}/comments` - Hent brugers kommentarer
- `GET /api/users/count` - Hent antal registrerede brugere

## 🚀 Deployment

### Live URLs
- **Frontend**: https://via-paedagoger.vercel.app
- **Backend API**: https://via-forum-api.fly.dev

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
# Opdater alias til korrekt domæne
vercel alias set [deployment-url] via-paedagoger.vercel.app
```

### Backend (Fly.io)
```bash
cd backend
~/.fly/bin/fly deploy
```

For detaljerede deployment instruktioner, se `CLAUDE.md`.

## 📊 Performance & Sikkerhed

### Performance
- ⚡ **Lynhurtig**: Optimeret med Vite og moderne React
- 📱 **Responsive**: Mobile-first design
- 🎯 **SEO-klar**: Semantisk HTML struktur
- 🔄 **Optimistic Updates**: Hurtig brugeroplevelse
- 💾 **LocalStorage Fallback**: Medlemstal gemmes lokalt når API er utilgængelig

### Sikkerhed
- 🔐 **JWT Authentication**: Sikre tokens med expiration
- 🛡️ **Input Validation**: Pydantic schemas validerer alle inputs
- 🔒 **CORS Protection**: Konfigureret til specifikke domæner (via-paedagoger.vercel.app)
- 🚫 **SQL Injection Protection**: SQLAlchemy ORM forebygger attacks
- 📏 **Karakterbegrænsninger**: Forebygger spam med validering på både frontend og backend

## 🧪 Testing

```bash
# Frontend testing (når implementeret)
cd frontend
npm run test

# Backend testing (når implementeret)
cd backend
pytest
```

## 🤝 Bidrag

1. Fork projektet
2. Opret feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ændringer (`git commit -m 'Add some AmazingFeature'`)
4. Push til branch (`git push origin feature/AmazingFeature`)
5. Åbn en Pull Request

## ⚠️ Vigtig Information

- **Målgruppe**: Specifikt for nuværende pædagogstuderende ved VIA
- **Status**: Production-ready med komplet API integration
- **Disclaimer**: Uafhængigt projekt, ikke officielt tilknyttet VIA University College

## 📄 Licens

PROPRIETARY LICENSE - Dette er proprietær software. Se LICENSE fil for detaljer.

---

*Bygget med ❤️ for VIA pædagogstuderende - Fra idé til fuldt funktionelt forum*