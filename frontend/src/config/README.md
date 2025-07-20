# Branding Konfiguration

## 🎨 Sådan ændrer du farver og branding

Alle farver, fonte og branding-indstillinger er samlet i én fil: `branding.ts`

### Hurtig guide

1. Åbn filen `branding.ts`
2. Rediger de ønskede værdier
3. Genstart udviklings-serveren eller byg projektet igen

### Eksempel: Ændre hovedfarven

```typescript
// I branding.ts, find primary farven:
primary: {
  500: '#0080ff', // Ændr denne til din ønskede farve
}
```

### Hvad kan justeres?

- **Farver**: Primary, secondary, gray, success, warning, error, info
- **Typografi**: Font familie og størrelser
- **Spacing**: Afstande mellem elementer
- **Border radius**: Hjørne-rundinger
- **Shadows**: Skygge-effekter
- **Site info**: Navn, kort navn, beskrivelse
- **Mascot farver**: Krop, ansigt, øjne, hue

### Vigtige filer der bruger branding

1. **branding.ts** - Hoved-konfiguration
2. **tailwind.config.js** - Bruger farverne i CSS
3. **Mascot.tsx** - Bruger mascot-farverne
4. **manifest.json** - PWA farver (skal opdateres manuelt)
5. **index.html** - Meta theme-color (skal opdateres manuelt)
6. **icon.svg** - App ikon (skal opdateres manuelt)

### Tips

- Test altid ændringer på både lys og mørk baggrund
- Sørg for god kontrast mellem tekst og baggrund
- Husk at opdatere både primary.500 (hovedfarve) og de andre nuancer
- Hvis du ændrer fonte, sørg for at de er tilgængelige i index.html

### Eksempel på komplet farve-ændring

Hvis du vil ændre fra VIA blå/grøn til f.eks. rød/orange:

```typescript
colors: {
  primary: {
    50: '#fef2f2',
    100: '#fee2e2',
    // ... andre nuancer
    500: '#ef4444', // Ny hovedfarve (rød)
    // ... flere nuancer
  },
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    // ... andre nuancer
    500: '#f97316', // Ny sekundær farve (orange)
    // ... flere nuancer
  }
}
```

Husk også at opdatere:
- `manifest.json`: theme_color
- `index.html`: meta theme-color
- `icon.svg`: Farver i SVG'en