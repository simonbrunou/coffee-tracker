# Deployment Setup Guide

## Prerequisites

- A [Turso](https://turso.tech) account (free tier available)
- A [Vercel](https://vercel.com) account (free tier available)
- [Node.js](https://nodejs.org) 20+

---

## 1. Set Up Turso Database

### Install the Turso CLI

```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Create account and database

```bash
turso auth signup          # or: turso auth login
turso db create coffee-tracker
```

### Get your credentials

```bash
turso db show coffee-tracker --url
# → libsql://coffee-tracker-yourname.turso.io

turso db tokens create coffee-tracker
# → eyJhbGci...  (your auth token)
```

### Push the database schema

```bash
DATABASE_URL="libsql://coffee-tracker-yourname.turso.io" \
DATABASE_AUTH_TOKEN="your-token" \
npx prisma migrate deploy
```

---

## 2. Set Up Vercel

### Install the Vercel CLI

```bash
npm install -g vercel
```

### Link your project

```bash
vercel login
vercel link
```

When prompted, select your scope and either create a new project or link to an existing one.

### Get your project IDs

```bash
cat .vercel/project.json
```

This will show your `orgId` and `projectId`.

### Generate a Vercel token

Go to [vercel.com/account/tokens](https://vercel.com/account/tokens) and create a new token.

### Set environment variables on Vercel

```bash
# Generate a secure auth secret
npx auth secret
# Copy the generated AUTH_SECRET value

# Add each variable to Vercel
vercel env add DATABASE_URL          # paste your Turso URL
vercel env add DATABASE_AUTH_TOKEN   # paste your Turso token
vercel env add AUTH_SECRET           # paste the generated secret
```

---

## 3. Set Up GitHub Actions

Go to your repo on GitHub: **Settings → Secrets and variables → Actions**

Add these **repository secrets**:

| Secret                 | Value                                    |
| ---------------------- | ---------------------------------------- |
| `VERCEL_TOKEN`         | Token from vercel.com/account/tokens     |
| `VERCEL_ORG_ID`        | `orgId` from `.vercel/project.json`      |
| `VERCEL_PROJECT_ID`    | `projectId` from `.vercel/project.json`  |
| `DATABASE_URL`         | Your Turso database URL                  |
| `DATABASE_AUTH_TOKEN`  | Your Turso auth token                    |

---

## 4. Deploy

Once secrets are configured, the GitHub Actions pipeline handles everything:

- **Push to `main`** → auto-deploys to production
- **Open a PR** → creates a preview deployment with URL commented on the PR
- **Database migrations** → trigger manually from Actions tab (`db-migrate.yml`)

### First deploy (manual)

For your very first deployment, you can also deploy directly:

```bash
vercel --prod
```

---

## Local Development

```bash
cp .env.example .env          # uses local SQLite by default
npm install                   # auto-generates Prisma client
npx prisma migrate dev        # creates local database
npm run dev                   # starts dev server at localhost:3000
```
