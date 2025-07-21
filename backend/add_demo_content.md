# Tilføj Demo Indhold til Forum

For at tilføje demo indhold til forummet, har du følgende muligheder:

## Option 1: Midlertidigt deaktiver email verifikation

1. SSH ind på Fly.io:
```bash
fly ssh console
```

2. Kør følgende for at deaktivere email verifikation midlertidigt:
```bash
export EMAIL_DEV_MODE=true
```

3. Genstart serveren

## Option 2: Brug rigtige email adresser

Opret brugere med rigtige email adresser du har adgang til, så du kan verificere dem.

## Option 3: Direkte database adgang

Brug Fly.io's database proxy:
```bash
fly proxy 5432 -a via-forum-api
```

Derefter kan du bruge en PostgreSQL klient til at indsætte data direkte.

## Demo Indhold

Her er nogle eksempler på realistiske opslag du kan oprette:

### Brugere:
- sofie_a (Sofie Andersen) - 2. semester, praktik bekymringer
- mikkel_h (Mikkel Hansen) - Mandlig studerende, fordomme
- emma_n (Emma Nielsen) - Kritisk af uddannelsens niveau
- jonas_p (Jonas Pedersen) - Bekymret over løn
- katrine_j (Katrine Jensen) - Praktikplads problemer

### Opslag:

**"Føler mig overvældet i min første praktik"** - Om praktikchok og utilstrækkelighed

**"Hvorfor er pædagog så upopulært blandt mænd?"** - Om kønsfordomme i faget

**"Unpopular opinion: Uddannelsen er for nem"** - Kontroversielt om akademisk niveau

**"Startløn 28.000 - kan man leve af det?"** - Om løn og fremtid

**"Min praktikplads bruger forældet pædagogik"** - Om teori vs praksis

Disse opslag afspejler reelle bekymringer blandt pædagogstuderende og vil gøre forummet mere levende og relevant.