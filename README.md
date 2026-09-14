# Ivy Homes Internship Assignment — September 2026 — Submission

This repository contains the Ivy Homes property search frontend and the required assignment submission.

## Project structure

```text
ivy-homes/
├── ivy-homes-app/       # Next.js + TypeScript website
│   ├── public/data/     # canonical downloaded assignment dataset
│   └── app/             # App Router pages, components, and styles
└── submission.json      # required answers and findings
```

There is only one copy of the dataset. The website loads `listings.json`, `rentals.json`, and `projects.json` from `ivy-homes-app/public/data/`.

## Run the website

```bash
cd ivy-homes-app
npm install
npm run dev
```

Open the local URL printed by Next.js, normally `http://localhost:3000`.

The app includes:

- real Ivy Homes login with persisted sessions and token renewal,
- complete listing, rental, and project browsing,
- locality, bedroom, furnishing, and price filters,
- property detail views,
- saved homes persisted per user,
- responsive desktop, tablet, and mobile layouts.

## Submission answers

The ten graded questions must **not** be submitted only in `README.md`. They belong in the root-level `submission.json` under the `answers` object. That file already contains:

1. total listing records,
2. unique properties,
3. active listings,
4. corrupt listing IDs,
5. assigned-locality monthly rent total,
6. average live 2BHK price per square foot,
7. costliest project,
8. listings posted in the seven-day reference window,
9. fake listing IDs,
10. projects with incorrect listing counts.

Documentation discrepancies belong in the root-level `submission.json` under `findings`. The README explains the investigation approach, while `submission.json` is the file the company grades.

The GitHub repository for this submission is:

`https://github.com/bishal454/ivy-homes`

The deployed app URL should be added to `candidate.demo_url` in `submission.json` after Vercel deployment.

## What was checked

- The API authentication flow requires `X-API-Key`, an access token, and a refresh token.
- The full local dataset loads in the browser: 5,100 listing records, 2,100 rentals, and 590 projects.
- Filters were tested with locality and bedroom combinations.
- Saved homes were tested from save to Saved view and browser refresh.
- The sidebar stays fixed on desktop and becomes responsive navigation on smaller screens.
- The production build completes with `npm run build`.

The frontend was built with Next.js, React, TypeScript, and assistance from an AI coding tool, as permitted by the assignment.

## Submission form details

The Google Form also asks for the candidate's phone number, GitHub repository URL, deployed app URL, AI tools used, and declaration. Those are form fields and are not part of `submission.json`. The repository URL above is the value to paste into the form. The AI tools used for this project include ChatGPT/Codex and GitHub Copilot.
