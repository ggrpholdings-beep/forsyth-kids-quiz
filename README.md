# ForsythKidsGuide Quiz

A personalized activity recommendation quiz for families in Forsyth County, GA.

## Quick Deploy to Vercel (15 minutes)

### Prerequisites
- A [GitHub](https://github.com) account (free)
- A [Vercel](https://vercel.com) account (free, sign up with GitHub)
- [Git](https://git-scm.com/downloads) installed on your computer
- [Node.js 18+](https://nodejs.org) installed on your computer

### Step 1: Set Up the Project Locally

```bash
# Unzip the project (you already did this if reading this file)
cd forsyth-kids-quiz

# Install dependencies
npm install

# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your real values:
# - MAILERLITE_API_KEY: from MailerLite Dashboard → Integrations → API
# - MAILERLITE_GROUP_ID: from MailerLite → Subscribers → Groups → Quiz Leads group ID
# - ADMIN_PASSWORD: any password you want for the admin dashboard
# - NEXT_PUBLIC_DIRECTORY_URL: https://forsythkidsguide.com

# Test locally
npm run dev
# Open http://localhost:3000 in your browser
```

### Step 2: Push to GitHub

```bash
git init
git add .
git commit -m "Initial quiz app"

# Create a new repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/forsyth-kids-quiz.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import" next to your `forsyth-kids-quiz` repo
3. In "Environment Variables", add these 4 variables:
   - `MAILERLITE_API_KEY` = your API key
   - `MAILERLITE_GROUP_ID` = your group ID
   - `ADMIN_PASSWORD` = your chosen password
   - `NEXT_PUBLIC_DIRECTORY_URL` = `https://forsythkidsguide.com`
4. Click "Deploy"
5. Your quiz is live at `forsyth-kids-quiz.vercel.app`!

### Step 4: Add Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add `quiz.forsythkidsguide.com`
3. Vercel will give you a CNAME record to add in SiteGround DNS
4. Add CNAME: `quiz` → `cname.vercel-dns.com`

## Project Structure

```
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout + meta tags
│   ├── globals.css           # Styles + animations
│   ├── quiz/page.tsx         # 6-question quiz flow
│   ├── results/page.tsx      # Personalized results page
│   ├── admin/
│   │   ├── page.tsx          # Analytics dashboard
│   │   └── activities/page.tsx  # Activity manager
│   └── api/
│       ├── submit/route.ts   # Email → MailerLite
│       ├── activities/route.ts  # Activities JSON
│       └── admin-auth/route.ts  # Admin login
├── components/
│   ├── QuizQuestion.tsx      # Question with tappable options
│   ├── ProgressBar.tsx       # Quiz progress indicator
│   ├── EmailGate.tsx         # Email capture form
│   └── ResultCard.tsx        # Individual result display
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── quiz-data.ts          # 6 questions + options
│   ├── scoring.ts            # Weighted scoring algorithm
│   ├── activities.ts         # Activity database (edit this!)
│   ├── mailerlite.ts         # MailerLite API client
│   └── analytics.ts          # Event tracking
└── .env.example              # Environment variable template
```

## Scoring Algorithm

Each activity gets an "organic score" (max 39 points):
- Age match: +10 points
- Personality match: +8 points
- Interest match: +8 points
- Schedule match: +5 points
- Budget match: +5 points
- Location match: +3 points

Paid listing tiers add a hidden bonus that affects RANKING but NOT the displayed match percentage:
- Spotlight ($199/mo): +15 bonus
- Premium ($99/mo): +8 bonus
- Enhanced ($49/mo): +3 bonus
- Free ($0): Does NOT appear in quiz results at all

## Updating Activities

Edit `lib/activities.ts` to:
- Add new businesses
- Change listing tiers (when businesses upgrade/downgrade)
- Update descriptions, contact info, etc.
- Swap sample data with real scraped data

Then push to GitHub — Vercel auto-redeploys.

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page with CTA |
| `/quiz` | 6-question quiz flow |
| `/results?age=...&...` | Personalized results (shareable URL!) |
| `/admin` | Analytics dashboard (password-protected) |
| `/admin/activities` | Activity list + tier overview |
