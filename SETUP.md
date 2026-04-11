# Správce úkolů – Průvodce nastavením

## Požadované proměnné prostředí

Vytvořte soubor `.env.local` v kořeni projektu:

```
NEXT_PUBLIC_SUPABASE_URL=https://<váš-projekt>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<váš-anon-klíč>
```

> **Pozor:** Nikdy nepoužívejte `SUPABASE_SERVICE_ROLE_KEY` na straně klienta ani ji neukládejte do `.env.local`. Service role klíč slouží pouze pro důvěryhodné serverové procesy.

---

## 1. Nastavení Supabase

### a) Vytvořte nový projekt
1. Přihlaste se na [supabase.com](https://supabase.com) a klikněte na **New project**.
2. Zvolte název, heslo databáze a region (nejblíže vašim uživatelům).
3. Počkejte, než se projekt spustí (~1–2 min).

### b) Spusťte SQL schéma
1. V levém menu klikněte na **SQL Editor**.
2. Klikněte na **New query**.
3. Zkopírujte celý obsah souboru `supabase/schema.sql` a vložte do editoru.
4. Klikněte na **Run** (nebo Ctrl+Enter).

### c) Získejte přihlašovací údaje
1. Přejděte do **Settings → API**.
2. Zkopírujte **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Zkopírujte **anon public** klíč → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### d) Nastavte e-mail autentizaci
1. Přejděte do **Authentication → Providers**.
2. Ujistěte se, že **Email** je povoleno.
3. Volitelně v **Authentication → Email Templates** upravte e-maily.
4. Pro lokální vývoj vypněte **Email Confirmations** v **Authentication → Settings** (sekce *User Signups*).

---

## 2. Lokální spuštění

```bash
# Nainstalujte závislosti
npm install

# Spusťte vývojový server
npm run dev
```

Aplikace bude dostupná na [http://localhost:3000](http://localhost:3000).

---

## 3. Nasazení na Vercel

### a) Příprava repozitáře
```bash
git init
git add .
git commit -m "Initial commit"
# Vytvořte repozitář na GitHubu a pushněte
git remote add origin https://github.com/<váš-username>/<repo>.git
git push -u origin main
```

### b) Import projektu na Vercel
1. Přejděte na [vercel.com](https://vercel.com) a klikněte na **Add New → Project**.
2. Importujte svůj GitHub repozitář.
3. V kroku **Configure Project** nastavte proměnné prostředí:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Klikněte na **Deploy**.

### c) Aktualizace povolených origins (volitelné)
Po nasazení aktualizujte soubor `next.config.ts` – přidejte svou Vercel doménu do `allowedOrigins`:

```ts
serverActions: {
  allowedOrigins: ['localhost:3000', 'vas-projekt.vercel.app'],
},
```

### d) Nastavte Supabase Redirect URLs
1. V Supabase přejděte do **Authentication → URL Configuration**.
2. Do pole **Site URL** zadejte svou Vercel URL (např. `https://vas-projekt.vercel.app`).
3. Do **Redirect URLs** přidejte `https://vas-projekt.vercel.app/**`.

---

## Shrnutí souborů

| Soubor/složka | Účel |
|---|---|
| `app/(app)/` | Chráněné stránky aplikace (dashboard, úkoly) |
| `app/login/`, `app/register/` | Veřejné auth stránky |
| `actions/` | Next.js Server Actions (auth + CRUD úkolů) |
| `components/` | React komponenty (formuláře, navbar, dialogy) |
| `lib/supabase/` | Supabase klienti (browser + server) |
| `lib/types.ts` | Sdílené TypeScript typy |
| `middleware.ts` | Ochrana tras + refresh session |
| `supabase/schema.sql` | Celé SQL schéma (tabulky, RLS, trigger) |
