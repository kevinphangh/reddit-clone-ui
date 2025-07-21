# VIA Pædagoger Forum

Et moderne online forum for pædagogstuderende ved VIA University College. Bygget med React + TypeScript frontend og FastAPI Python backend.

🌐 **Live**: [via-paedagoger.vercel.app](https://via-paedagoger.vercel.app)

## 🎯 Formål

Dette forum er designet til at hjælpe pædagogstuderende med at:
- Dele erfaringer fra praksis og studieliv
- Få hjælp til studieopgaver og eksamen
- Diskutere pædagogiske metoder
- Skabe fællesskab på tværs af campusser

## ✨ Funktioner

### Forum Funktionalitet
- **Email Verifikation**: Nye brugere skal bekræfte email
- **Diskussionstråde**: Opret og del indlæg
- **Kommentarsystem**: Indlejrede kommentarer
- **Voting System**: Stem indlæg op eller ned
- **Brugerprofiler**: Se brugerens aktivitet
- **Søgefunktion**: Find indhold hurtigt

### Design & UX
- **Dansk Minimalistisk**: Ren, simpel æstetik
- **Unity Symbol**: To overlappende cirkler symboliserer sammenhold
- **Rose/Beige Farver**: Varme, indbydende toner
- **Responsive**: Fungerer på alle enheder
- **Tilgængeligt**: Tydelig navigation

## 🛠️ Teknisk Stack

### Frontend
- **React 19** med TypeScript 5
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Router** - Navigation

### Backend
- **FastAPI** - Python web framework
- **PostgreSQL** - Database (Fly.io)
- **SQLAlchemy** - ORM
- **JWT** - Authentication
- **Resend** - Email service

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL (production) eller SQLite (udvikling)

### Quick Start

1. **Klon repository**
```bash
git clone https://github.com/kevinphangh/reddit-clone-ui.git
cd reddit-clone-ui
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt
cp .env.example .env
python init_db.py
uvicorn main:app --reload
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Åbn browser**
Gå til `http://localhost:3000`

## 🎨 Design System

### Farvepalette
- **Primary**: Rose/beige (#ffb69e, #ffe3d8)
- **Secondary**: Blød koral (#f07c75)
- **Neutral**: Grå skala

### Konfiguration
- Farver: `/frontend/src/config/branding.ts`
- Tailwind: `/frontend/tailwind.config.js`
- Symbol: `/frontend/src/components/UnitySymbol.tsx`

## 📧 Email Opsætning

Bruger Resend.com til email verifikation:

1. Opret konto på [resend.com](https://resend.com)
2. Få API key
3. Konfigurer i Fly.io:
```bash
fly secrets set EMAIL_DEV_MODE=false
fly secrets set SMTP_PASSWORD=re_DIN_API_KEY
fly secrets set FROM_EMAIL=onboarding@resend.dev
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Fly.io)
```bash
cd backend
/home/keph/.fly/bin/flyctl deploy
```

### Live URLs
- Frontend: https://via-paedagoger.vercel.app
- API: https://via-forum-api.fly.dev

## 📊 API Endpoints

### Auth
- `POST /api/auth/register` - Registrer bruger
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verificer email

### Posts
- `GET /api/posts/` - Hent alle indlæg
- `POST /api/posts/` - Opret indlæg
- `POST /api/posts/{id}/vote` - Stem på indlæg

### Comments
- `POST /api/comments/post/{post_id}` - Kommentér
- `POST /api/comments/{id}/vote` - Stem på kommentar

### Users
- `GET /api/users/{username}` - Bruger profil
- `GET /api/users/count` - Antal brugere

## 🔧 Development

### Frontend Commands
```bash
npm run dev        # Development server
npm run build      # Production build
npm run lint       # Linting
npm run type-check # TypeScript check
```

### Backend Commands
```bash
uvicorn main:app --reload  # Dev server
alembic upgrade head       # Run migrations
```

## 🏗️ Projekt Struktur

```
forum/
├── frontend/
│   ├── src/
│   │   ├── components/     # UI komponenter
│   │   ├── pages/         # Sider
│   │   ├── contexts/      # React contexts
│   │   ├── config/        # Konfiguration
│   │   └── utils/         # Hjælpefunktioner
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── api/          # Endpoints
│   │   ├── models/       # Database modeller
│   │   ├── schemas/      # Pydantic schemas
│   │   └── services/     # Business logic
│   └── main.py
└── CLAUDE.md             # Deployment guide
```

## 🛡️ Sikkerhed

- JWT authentication med token expiration
- Email verifikation påkrævet
- Input validation med Pydantic
- CORS beskyttelse
- SQL injection beskyttelse via ORM

## 🤝 Bidrag

1. Fork projektet
2. Opret feature branch
3. Commit ændringer
4. Push til branch
5. Åbn Pull Request

## 📄 Licens

Proprietary - Se LICENSE fil for detaljer

## 🙏 Credits

Bygget med kærlighed til VIA pædagogstuderende.

---

*For detaljeret deployment guide, se [CLAUDE.md](./CLAUDE.md)*