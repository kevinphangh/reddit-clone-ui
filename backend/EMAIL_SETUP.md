# Email Setup Guide

## Resend.com Setup

### 1. Opret Resend konto
1. Gå til [resend.com/signup](https://resend.com/signup)
2. Opret en gratis konto (100 emails/dag gratis)

### 2. Få API Key
1. Log ind på Resend dashboard
2. Gå til "API Keys" i venstre menu
3. Klik "Create API Key"
4. Navngiv den (f.eks. "VIA Forum Production")
5. Kopier API key'en (starter med `re_`)

### 3. Konfigurer Fly.io
Kør disse kommandoer med din API key:

```bash
# Skift til backend directory
cd backend

# Sæt email til production mode
fly secrets set EMAIL_DEV_MODE=false

# Konfigurer SMTP settings for Resend
fly secrets set SMTP_HOST=smtp.resend.com
fly secrets set SMTP_PORT=465
fly secrets set SMTP_USERNAME=resend
fly secrets set SMTP_PASSWORD=re_DIN_API_KEY_HER

# Sæt afsender email
fly secrets set FROM_EMAIL=onboarding@resend.dev

# Deploy ændringer
fly deploy
```

**Note**: Brug `onboarding@resend.dev` som FROM_EMAIL indtil du har verificeret dit eget domæne.

### 4. (Valgfrit) Verificer dit domæne
For at sende fra din egen email (f.eks. noreply@via-forum.dk):
1. Gå til "Domains" i Resend dashboard
2. Klik "Add Domain"
3. Følg instruktionerne for at tilføje DNS records
4. Når verificeret, opdater FROM_EMAIL:
   ```bash
   fly secrets set FROM_EMAIL=noreply@via-forum.dk
   ```

## Test Email Verifikation

1. Opret en ny bruger på https://via-forum.vercel.app/register
2. Check din email for verifikationslink
3. Klik på linket for at verificere din konto

## Fejlfinding

### Hvis emails ikke sendes:
1. Check Fly logs: `fly logs`
2. Verificer at EMAIL_DEV_MODE=false
3. Check at API key er korrekt
4. Se Resend dashboard for fejlbeskeder

### Hvis du ikke modtager emails:
1. Check spam/junk folder
2. Verificer email adressen er korrekt
3. Check Resend dashboard for delivery status