# Ivy Homes

A modern property discovery dashboard built with Next.js, React, TypeScript, and Tailwind CSS.

Ivy Homes helps users browse homes for sale, rental properties, and residential projects in one responsive interface. Users can filter the property catalogue, inspect detailed records, save favourites, and keep their session active across page refreshes.

## Live demo

[Open Ivy Homes](https://ivy-homes-silk.vercel.app)

The production app is deployed on Vercel from the `ivy-homes-app` directory.

## Features

- Secure sign-in with the Ivy Homes API
- Persistent sessions with automatic token renewal
- Homes for sale, rentals, and projects
- Locality, bedroom, furnishing, and price filters
- Property detail views
- Saved homes stored per account
- Collapsible desktop sidebar
- Responsive tablet and mobile layout
- Local JSON catalogue for fast browsing
- Clear loading, empty, error, and retry states

## Tech stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Ivy Homes API

## Project structure

```text
ivy-homes/
├── ivy-homes-app/
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   ├── data/             # Catalogue loading helpers
│   │   ├── globals.css       # Tailwind entry styles
│   │   ├── layout.tsx        # Root layout and metadata
│   │   └── page.tsx          # Main application screen
│   ├── public/
│   │   └── data/             # Local property catalogue
│   ├── next.config.ts
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── tailwind.config.ts
│   └── tsconfig.json
├── .env.example
└── .gitignore
```

## Getting started

### Requirements

- Node.js 18.18 or later
- npm

### Install dependencies

```bash
cd ivy-homes-app
npm install
```

### Configure environment variables

Create `ivy-homes-app/.env.local` from the example configuration:

```env
NEXT_PUBLIC_IVY_API_KEY=your_api_key
NEXT_PUBLIC_IVY_API_BASE_URL=https://solve.ivy.homes
NEXT_PUBLIC_IVY_DEMO_EMAIL=demo1@ivy.homes
NEXT_PUBLIC_IVY_DEMO_EMAIL_2=demo2@ivy.homes
NEXT_PUBLIC_IVY_DEMO_EMAIL_3=demo3@ivy.homes
NEXT_PUBLIC_IVY_DEMO_PASSWORD=your_demo_password
```

Do not commit `.env.local` or expose API credentials publicly.

### Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available scripts

Run these commands from `ivy-homes-app`:

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run the configured lint command
```

## Production deployment

When creating the Vercel project:

1. Select the `ivy-homes` repository.
2. Set the root directory to `ivy-homes-app`.
3. Keep the framework preset as Next.js.
4. Add the `NEXT_PUBLIC_*` variables listed above.
5. Deploy.

The current production deployment is available at [ivy-homes-silk.vercel.app](https://ivy-homes-silk.vercel.app).

## Data

The browser loads the catalogue from:

```text
ivy-homes-app/public/data/
```

The directory contains the listings, rentals, and projects JSON files used by the dashboard.

## Security

Keep API keys, passwords, and other private values in `.env.local`. Never commit files containing real credentials to the repository.

## Support

For help, check the setup instructions above, confirm that the required environment variables are configured, and restart the development server after making configuration changes.
