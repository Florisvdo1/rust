# RUST — Deployment Guide

## Local Development

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```

## Supabase Setup

1. Create a new Supabase project at https://app.supabase.com
2. Run SQL files in order in the SQL editor:
   - `supabase/schema.sql` — tables and indexes
   - `supabase/rls.sql` — row level security policies
   - `supabase/storage.sql` — storage buckets
3. Copy Project URL and Anon Key to your .env

## GitHub

```bash
git remote add origin https://github.com/Florisvdo1/rust.git
git push -u origin main
```

## Vercel Deployment

1. Connect GitHub repo at https://vercel.com
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Or deploy via CLI:

```bash
vercel --prod
```

Production domains: rust.mobi / www.rust.mobi

## Netlify Deployment

```bash
npm run build
# Deploy dist/ folder to Netlify
# Or link repo at https://netlify.com
```

Set same environment variables in Netlify dashboard.

## Environment Variables (Vercel/Netlify)

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Never commit real values. Use .env locally.

## Auth Email Configuration

### Supabase Dashboard — Required after every new deploy

1. **Auth → URL Configuration**
   - Site URL: `https://www.rust.mobi`
   - Redirect URLs (add all four):
     ```
     https://www.rust.mobi/verify
     https://www.rust.mobi/reset-password
     https://rust.mobi/verify
     https://rust.mobi/reset-password
     ```

2. **Auth → Email Templates**

   **Confirm signup** subject: `Bevestig je RUST account`
   Body (HTML):
   ```html
   <p>Hallo,</p>
   <p>Klik op de knop hieronder om je e-mailadres te bevestigen en je RUST account te activeren.</p>
   <p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#2d3a4a;color:white;border-radius:12px;text-decoration:none;font-weight:700;">Account bevestigen</a></p>
   <p style="color:#888;font-size:12px;">Link verloopt over 24 uur. Als je geen account hebt aangemaakt, kun je deze mail negeren.</p>
   ```

   **Reset password** subject: `Herstel je RUST wachtwoord`
   Body (HTML):
   ```html
   <p>Hallo,</p>
   <p>Klik op de knop hieronder om een nieuw wachtwoord in te stellen voor je RUST account.</p>
   <p><a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 28px;background:#2d3a4a;color:white;border-radius:12px;text-decoration:none;font-weight:700;">Nieuw wachtwoord instellen</a></p>
   <p style="color:#888;font-size:12px;">Link verloopt over 1 uur. Als je geen wachtwoordherstel hebt aangevraagd, kun je deze mail negeren.</p>
   ```

### Custom SMTP — Optional (for `floris@oever.art` sender)

**Option A — Resend (recommended)**
1. Create account at https://resend.com
2. Add and verify domain `oever.art`
3. Supabase → Settings → Auth → SMTP Settings:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: `[your Resend API key]`
   - Sender email: `floris@oever.art`
   - Sender name: `RUST`

**Option B — Direct SMTP (oever.art host)**
- Use credentials from your domain host's SMTP settings
- Common ports: 465 (SSL) or 587 (STARTTLS)

**DNS records for oever.art (required for deliverability)**

| Type | Name | Value |
|---|---|---|
| TXT | `@` | `v=spf1 include:_spf.resend.com ~all` |
| TXT | `resend._domainkey` | DKIM value from Resend dashboard |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:floris@oever.art` |

Without custom SMTP, all emails send from `noreply@mail.supabase.io` — all flows work, only the From address differs.
