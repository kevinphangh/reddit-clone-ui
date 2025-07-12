# VIA Pædagoger Forum

Et online forum til VIA pædagogstuderende og færdiguddannede pædagoger, hvor de kan dele erfaringer, få hjælp og sparre med hinanden. Bygget med React, TypeScript og Tailwind CSS.

![VIA Pædagoger Forum Screenshot](https://via.placeholder.com/800x400?text=VIA+Pædagoger+Forum)

## 🎯 Formål

VIA Pædagoger Forum er designet til at:
- Skabe et fællesskab for pædagogstuderende og pædagoger
- Dele praktiske erfaringer og viden
- Få hjælp til studieopgaver og eksamen
- Diskutere pædagogiske metoder og teori
- Netværke og finde jobmuligheder

## 🚀 Funktioner

- **Fællesskaber**: Organiseret i relevante kategorier som Praktik, Studiehjælp, Job og karriere
- **Diskussionstråde**: Del spørgsmål, erfaringer og viden
- **Kommentarsystem**: Indlejrede kommentarer med svar-funktionalitet
- **Afstemningssystem**: Stem indlæg og kommentarer op eller ned
- **Dansk interface**: Fuldt oversat til dansk
- **Brugervenlig**: Intuitivt design baseret på velkendte forum-principper

## 🛠️ Teknisk Stack

- **Frontend Framework**: React 19
- **Type System**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 7
- **Build Tool**: Vite 7
- **Ikoner**: Lucide React
- **Dato formatering**: date-fns

## 📦 Installation

1. Klon repositoriet:
```bash
git clone https://github.com/kevinphangh/reddit-clone-ui.git
cd reddit-clone-ui
git checkout sandbox
```

2. Installer afhængigheder:
```bash
npm install
```

3. Start udviklingsserveren:
```bash
npm run dev
```

4. Åbn din browser på `http://localhost:3000`

## 🏗️ Projektstruktur

```
src/
├── components/          # Genbrugelige UI komponenter
│   ├── Header.tsx      # Hovednavigation
│   ├── Sidebar.tsx     # Sidepanel med fællesskabsinfo
│   ├── PostCard.tsx    # Indlægsvisning
│   ├── Comment.tsx     # Kommentarkomponent
│   └── ...
├── pages/              # Sidekomponenter
│   ├── HomePage.tsx    # Forside
│   ├── PostPage.tsx    # Enkelt indlæg
│   ├── SubmitPage.tsx  # Opret indlæg
│   └── ...
├── types/              # TypeScript type definitioner
├── utils/              # Hjælpefunktioner
├── data/               # Mock data med pædagogisk indhold
└── styles/             # Globale styles
```

## 🎨 Funktioner

### Fællesskaber
- **Praktik og erfaringer**: Del praktikoplevelser og få sparring
- **Studiehjælp**: Få hjælp til opgaver og eksamen
- **Job og karriere**: Diskuter karrieremuligheder og find job
- **Specialpædagogik**: Fokus på særlige behov
- **Børnehave/Vuggestue/SFO**: Aldersspecifikke diskussioner

### Indlægstyper
- Tekstindlæg med formatering
- Billeder og videoer
- Links til eksterne ressourcer
- Afstemninger (kommer snart)

### Interaktion
- Stem på indlæg og kommentarer
- Gem indlæg til senere
- Kommenter og svar på kommentarer
- Marker indhold som spoiler/NSFW
- Filtrer og sorter indhold

## 🔧 Tilgængelige Scripts

```bash
npm run dev          # Start udviklingsserver
npm run build        # Byg til produktion
npm run preview      # Preview produktionsbuild
npm run typecheck    # Kør TypeScript type-tjek
npm run lint         # Kør linting
```

## 🤝 Bidrag

Bidrag er velkomne! Fork projektet og opret en Pull Request med dine ændringer.

## 📄 Licens

Dette projekt er licenseret under MIT License - se LICENSE filen for detaljer.

## ⚠️ Ansvarsfraskrivelse

Dette er et uafhængigt projekt skabt til VIA pædagogstuderende og er ikke officielt tilknyttet VIA University College.