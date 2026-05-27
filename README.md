# fintrack-extension

Finance Portfolio Browser Extension.

## Overview

This project is a Vite + React + TypeScript browser extension for FinTrack.

## Setup

1. Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

	VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

2. Install dependencies and run dev server:

```bash
npm install
npm run dev
```

Security note: The anon key is used client-side and will be bundled into the extension build. Do not commit real keys to the repository; restrict access via Supabase Row Level Security and least-privileged policies.
