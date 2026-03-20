# Mohamed Hiba Personal Website

This repository contains Mohamed Hiba's production portfolio website, the custom admin experience used to edit it, and the Supabase backend that stores the live published content.

The site is intentionally not a generic portfolio template. It uses a minimal editorial layout, grounded project writing, a protected admin page, and a small backend that keeps the public site and admin in sync.

## Live system

- Production domain: `https://mohamedhiba.com`
- Secondary domain: `https://www.mohamedhiba.com`
- Netlify site name: `mohamedhiba`
- Netlify site URL: `https://mohamedhiba.netlify.app`
- Supabase project ref: `rvbfbeezjffdcdbhtdrb`
- Supabase project URL: `https://rvbfbeezjffdcdbhtdrb.supabase.co`
- Supabase Edge Function: `portfolio-content`
- GitHub repository: `https://github.com/mohamedhiba/personal-website`

## What this project includes

- A Vite + React + TypeScript single-page portfolio
- A custom editorial frontend instead of a boxed card-based layout
- A protected admin screen for editing the site without touching code
- A Supabase Edge Function that handles public reads, admin login, and publishing
- Netlify production hosting
- Namecheap custom domain configuration
- GitHub CI that runs lint and build on pushes and pull requests

## High-level architecture

The system has four moving parts:

1. Frontend application
   - Lives in `src/`
   - Renders the public portfolio
   - Exposes the admin page at `/?admin=1`

2. Admin editor
   - Also lives in the frontend app
   - Loads the currently published content from Supabase
   - Lets you edit text, sections, projects, contact links, and extra repos
   - Saves drafts locally in the browser until you click `Publish changes`

3. Supabase backend
   - Uses one Edge Function: `portfolio-content`
   - Handles three actions:
     - `get-public`
     - `login`
     - `save`
   - Stores the published content JSON in Supabase Storage

4. Hosting and delivery
   - Netlify serves the built frontend
   - Namecheap DNS points the domain to Netlify
   - GitHub stores the source of truth for the codebase

## Repository structure

```text
site/
├── .env.example
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── favicon.svg
│   ├── mohamed-hiba-avatar.jpg
│   └── mohamed-hiba-resume.pdf
├── src/
│   ├── AdminPanel.css
│   ├── AdminPanel.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── Reveal.tsx
│   ├── content.ts
│   ├── index.css
│   ├── main.tsx
│   ├── portfolioApi.ts
│   ├── usePortfolioContent.ts
│   └── vite-env.d.ts
├── supabase/
│   └── functions/
│       └── portfolio-content/
│           └── index.ts
├── index.html
├── netlify.toml
├── package.json
└── README.md
```

## Important files and what they do

### Frontend

- `src/App.tsx`
  - Entry point for both the public site and the admin route
  - Switches to admin mode when the URL includes `?admin=1`
  - Handles admin session storage in `sessionStorage`

- `src/AdminPanel.tsx`
  - Main content editor UI
  - Supports editing:
    - hero copy
    - utility links
    - signal strip
    - projects
    - practice section
    - custom sections
    - experience
    - contact details
    - extra repo links
  - Supports export/import of JSON content

- `src/usePortfolioContent.ts`
  - Loads the published content from Supabase
  - Maintains local draft state for admin editing
  - Publishes edited content through the backend

- `src/portfolioApi.ts`
  - Thin client for calling the Supabase Edge Function
  - Handles:
    - public content fetch
    - admin login
    - publish/save

- `src/content.ts`
  - Defines the full `PortfolioContent` schema
  - Contains default bootstrap content used for seeding and resets

- `src/App.css`
  - Public website layout and motion

- `src/AdminPanel.css`
  - Admin interface layout and login styling

- `src/index.css`
  - Global design tokens and base styling

- `src/Reveal.tsx`
  - Small reveal-on-scroll animation wrapper

### Public assets

- `public/mohamed-hiba-resume.pdf`
  - Resume file linked from the site
  - Replace this file when you want the site to download a new resume

- `public/mohamed-hiba-avatar.jpg`
  - Public portrait used in the hero area

- `public/favicon.svg`
  - Browser tab icon
  - Currently a simple `M` monogram

### Backend

- `supabase/functions/portfolio-content/index.ts`
  - Protected content API
  - Validates admin login
  - Issues a signed session token
  - Writes published content into Supabase Storage
  - Reads the live JSON for the public site

### Deployment and infra

- `netlify.toml`
  - Tells Netlify how to build the project
  - Publishes the `dist/` directory
  - Includes a redirect so the single-page app works correctly

- `.github/workflows/ci.yml`
  - Runs `npm ci`, `npm run lint`, and `npm run build` on GitHub

## Local development

### Requirements

- Node.js 22 or newer recommended
- npm
- Netlify CLI only if you want to deploy manually from your machine
- Supabase CLI only if you want to redeploy the Edge Function from your machine

### Install

```bash
npm install
```

### Start the site locally

```bash
npm run dev
```

Then open:

- Public site: `http://localhost:5173/`
- Admin page: `http://localhost:5173/?admin=1`

### Quality checks

```bash
npm run lint
npm run build
```

## Admin workflow

### How the admin works

- The admin page lives at `/?admin=1`
- You log in with a username and password validated by Supabase
- The editor loads the currently published content from the backend
- Your edits become a local draft first
- Nothing goes live until you click `Publish changes`

### What the admin can edit

- Site name and role
- Hero eyebrow, headline, and paragraphs
- Hero facts
- Top utility links
- Signal strip
- Selected projects
- Practice copy and tool columns
- Custom editorial sections
- Experience entries
- Contact copy
- Extra repo links

### Export and import

The admin supports content export/import as JSON.

Use export if you want:

- a backup of the current draft
- to move draft content between browsers or machines
- to preserve a snapshot before a major rewrite

Use import if you want:

- to restore a saved content snapshot
- to move a draft from one browser to another

## Updating the website content

### 1. Update text using the admin panel

This is the easiest path for most changes.

1. Open `https://mohamedhiba.com/?admin=1` or your local `/?admin=1`
2. Sign in
3. Edit the content you want
4. Click `Publish changes`

### 2. Update the resume PDF

Replace:

```text
public/mohamed-hiba-resume.pdf
```

Then rebuild and redeploy:

```bash
npm run build
netlify deploy --prod --dir=dist --message "Update resume"
```

If Netlify is later connected directly to GitHub, a normal git push will be enough.

### 3. Update the avatar

Replace:

```text
public/mohamed-hiba-avatar.jpg
```

Then rebuild and redeploy.

### 4. Change the favicon

Edit:

```text
public/favicon.svg
```

Then redeploy. Browsers cache favicons aggressively, so you may need a hard refresh or a new tab to see the update.

### 5. Change the default seed content in code

Edit:

```text
src/content.ts
```

This matters when:

- you reset the admin to defaults
- you want the repository defaults to match the current public content
- you want a new starting point for future edits

## Supabase backend details

### What the Edge Function does

The `portfolio-content` function accepts a JSON payload with an `action`.

Supported actions:

- `get-public`
  - returns the currently published portfolio JSON

- `login`
  - verifies the admin username/password
  - returns a signed session token and expiry time

- `save`
  - requires a valid admin bearer token
  - writes the new portfolio JSON to Supabase Storage

### Where published content lives

- Storage bucket: `site-content`
- Storage object path: `portfolio-content.json`

### Required Supabase secrets

These secrets must exist in the deployed Edge Function environment:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Important:

- Do not commit real secret values to GitHub
- Do not place real admin credentials in `.env.example`
- Keep the real values only in Supabase secrets

### How to redeploy the Edge Function

From the project root:

```bash
supabase functions deploy portfolio-content --project-ref rvbfbeezjffdcdbhtdrb --no-verify-jwt --use-api
```

### How to rotate the admin credentials

1. Choose a new username and/or password
2. Update the Supabase function secrets
3. Deploy or restart the function if needed
4. Test login from `/?admin=1`

Example shape:

```bash
supabase secrets set \
  --project-ref rvbfbeezjffdcdbhtdrb \
  ADMIN_USERNAME='new-username' \
  ADMIN_PASSWORD='new-password' \
  ADMIN_SESSION_SECRET='new-long-random-secret'
```

Do not store the old or new credentials in this repository.

## Netlify deployment

### Current production setup

- Netlify site name: `mohamedhiba`
- Custom domain: `mohamedhiba.com`
- Domain alias: `www.mohamedhiba.com`

### Manual deploy command

```bash
npm run build
netlify deploy --prod --dir=dist --message "Describe this deploy"
```

### Netlify build config

The site uses:

- build command: `npm run build`
- publish directory: `dist`

These are defined in `netlify.toml`.

### Domain and DNS

Namecheap is the registrar and DNS provider.

Current intended DNS setup:

- Apex/root:
  - `ALIAS` `@` -> `apex-loadbalancer.netlify.com`

- WWW:
  - `CNAME` `www` -> `mohamedhiba.netlify.app`

Netlify may take some time to finish SSL provisioning after DNS changes.

### Recommended future improvement

Right now the site can be deployed manually with Netlify CLI.

For a more hands-off setup, connect the GitHub repository to the Netlify site so pushes to `main` automatically deploy production.

## GitHub workflow

This repository includes a CI workflow that runs on pushes and pull requests.

It currently checks:

- dependency install
- lint
- production build

This gives you early warnings if a change breaks the site before you deploy it.

## First-time setup on a new machine

1. Clone the private GitHub repository
2. Run `npm install`
3. Run `npm run dev`
4. Log into Netlify CLI if you want to deploy manually
5. Log into Supabase CLI if you want to redeploy the backend function

## Safe maintenance workflow

Recommended day-to-day process:

1. Pull the latest repository changes
2. Make edits locally
3. Run `npm run lint`
4. Run `npm run build`
5. Commit the changes
6. Push to GitHub
7. Deploy to Netlify if the change affects production assets

If the change is content-only and the admin panel can handle it, you may not need local code changes at all.

## Troubleshooting

### Admin login does not work

Check:

- the Supabase function is still deployed
- the admin secrets still exist in Supabase
- the password was not rotated without updating your saved credentials

### Public site loads old content

Check:

- whether you clicked `Publish changes` in the admin
- whether the Edge Function is reading the expected JSON
- whether your browser is caching aggressively

### Resume download is outdated

Check:

- that `public/mohamed-hiba-resume.pdf` was replaced
- that the site was rebuilt and redeployed
- that the browser is not caching the old PDF

### Custom domain works over HTTP but HTTPS looks wrong

Check:

- Namecheap DNS records
- Netlify domain management
- whether SSL provisioning is still in progress

### `www` and apex behave differently

Check both records separately:

- apex/root should point to Netlify's apex load balancer
- `www` should CNAME to `mohamedhiba.netlify.app`

## Security notes

- This repository should stay private
- Never commit real credentials
- Never commit Supabase service-role keys
- Never commit local `.env` files with secrets
- Keep the admin password only in Supabase secrets and your own password manager

## Known limitations

- Resume updates still require replacing a file and redeploying
- Netlify deploys are currently manual unless Git-based deployment is connected later
- The admin is protected by credentials, but there is only one admin account right now
- The content model is optimized for this portfolio, not for multi-user CMS behavior

## Good next upgrades

- Add admin support for resume uploads instead of manual file replacement
- Connect GitHub to Netlify for automatic production deploys
- Add staging/preview deploy guidance
- Add analytics
- Add a richer backend content history or revision log
- Add admin password rotation notes to a private runbook outside the repo

## Commands reference

### Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Preview local production build

```bash
npm run preview
```

### Manual production deploy

```bash
netlify deploy --prod --dir=dist --message "Deploy message"
```

### Redeploy Supabase function

```bash
supabase functions deploy portfolio-content --project-ref rvbfbeezjffdcdbhtdrb --no-verify-jwt --use-api
```

## Final note

The important mindset for maintaining this project is:

- GitHub is the source of truth for code
- Supabase is the source of truth for published content
- Netlify is the delivery layer
- Namecheap only handles the domain and DNS

If you keep those responsibilities clear, the site stays easy to reason about and easy to maintain.
