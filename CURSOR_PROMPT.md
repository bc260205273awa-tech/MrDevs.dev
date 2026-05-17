# 🚀 MrDevs — Cursor Setup Prompt

## Paste this into Cursor's AI Chat (Ctrl+L or Cmd+L):

---

> Please do the following in order using the terminal:
>
> 1. Run `npm install` to install all project dependencies
> 2. Run `git init` to initialize a git repository
> 3. Run `git add .` to stage all files
> 4. Run `git commit -m "feat: initial mrdevs.dev agency website 🚀"` to make the first commit
> 5. Start the development server with `npm run dev`
>
> Then tell me what I need to do to push this to my GitHub account.

---

## Or run manually in the terminal (Ctrl+`):

```bash
# Step 1 — Install dependencies
npm install

# Step 2 — Initialize git
git init
git add .
git commit -m "feat: initial mrdevs.dev agency website 🚀"

# Step 3 — Start dev server (verify everything works)
npm run dev
```

Open **http://localhost:3000** and check your site.

---

## Push to GitHub

### Option A — GitHub CLI (recommended, install from https://cli.github.com)
```bash
gh auth login
gh repo create mrdevs --public --source=. --remote=origin --push
```

### Option B — Manual (create repo on github.com first)
```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/mrdevs.git
git branch -M main
git push -u origin main
```

---

## Deploy to Vercel (connect mrdevs.dev domain)

```bash
npx vercel
```

Then in the Vercel dashboard:
1. Go to your project → **Settings** → **Domains**
2. Add `mrdevs.dev` and `www.mrdevs.dev`
3. Update your **Name.com** DNS with Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

---

## Before going live — update these placeholders:

| File | Line | What to update |
|------|------|----------------|
| `components/Contact.tsx` | `href="mailto:hello@mrdevs.dev"` | Your real email |
| `components/Contact.tsx` | `href="https://wa.me/92XXXXXXXXXX"` | Your WhatsApp number |
| `components/Footer.tsx` | Social `href` values | Your real social profiles |
| `components/Hero.tsx` | Stats (50+, 30+, 3+) | Your real numbers |
| `app/layout.tsx` | `metadataBase` | Confirm `mrdevs.dev` is correct ✓ |

---

Built with Next.js 14 · TypeScript · Tailwind CSS · Syne + Manrope fonts
