# Demo Indhold til VIA Pædagoger Forum

## Status
Email verifikation er nu deaktiveret (`EMAIL_DEV_MODE=true`), men der er stadig fejl ved brugeroprettelse.

## Manuel oprettelse
For at tilføje demo indhold:

1. Gå til https://via-paedagoger.vercel.app
2. Klik "Opret konto"
3. Brug disse demo brugere:

### Demo Brugere:
- **sofie_a** - Sofie Andersen (2. semester, praktik bekymringer)
- **mikkel_h** - Mikkel Hansen (mandlig studerende)
- **emma_n** - Emma Nielsen (kritisk af uddannelsen)
- **jonas_p** - Jonas Pedersen (bekymret over løn)
- **katrine_j** - Katrine Jensen (praktik problemer)
- **maria_s** - Maria Sørensen (positiv historie)
- **frederik_l** - Frederik Larsen (eksamensstress)
- **kasper_m** - Kasper Madsen (mobning på studiet)

Password for alle: `Demo123!`

### Demo Opslag:

1. **"Er jeg den eneste der føler sig overvældet af praktikken?"** (sofie_a)
2. **"Hvorfor er pædagog-uddannelsen så upopulær blandt mænd?"** (mikkel_h)
3. **"Unpopular opinion: Pædagoguddannelsen er for nem"** (emma_n)
4. **"Pædagog-lønnen er en joke - jeg overvejer at droppe ud"** (jonas_p)
5. **"SOS: Praktikstedets pædagogik er HELT forkert!"** (katrine_j)
6. **"Dagens positive historie: Derfor ELSKER jeg at studere pædagogik! ❤️"** (maria_s)
7. **"Eksamensstress: Nogen der har styr på Vygotsky vs Piaget?"** (frederik_l)
8. **"Mobning på studiet - er VIA ligeglade?"** (kasper_m)

## Alternativ: Direkte database
Hvis manuel oprettelse ikke virker, kan du bruge database proxy:

```bash
fly proxy 5432 -a via-forum-api
```

Og så køre SQL direkte mod PostgreSQL.