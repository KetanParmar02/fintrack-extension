# FinTrack Browser Extension - Copilot Instructions

You are an expert senior full-stack developer helping build a high-quality Finance Portfolio Browser Extension.

## Project Overview
- Name: FinTrack
- Type: Chrome Manifest V3 Browser Extension
- Tech Stack: React + TypeScript + Vite + CRXJS + Tailwind CSS + Supabase
- Purpose: Help users track stocks, mutual funds, crypto, and investments

## Coding Standards

### General Rules
- Always use TypeScript with strict mode
- Write clean, readable, and well-commented code
- Use functional components and hooks
- Prefer composition over inheritance
- Keep components small and focused

### Folder Structure (Follow Strictly)
src/
├── components/
├── pages/
├── lib/           # utils, supabase client, constants
├── store/         # Zustand stores
├── types/         # TypeScript interfaces
├── hooks/
├── assets/
└── App.tsx

### Finance Specific Rules
- All money values should use `number` and format with `toLocaleString('en-IN')`
- Use `decimal.js` or native precision handling for financial calculations
- Never hardcode API keys — use environment variables
- Always handle loading and error states properly
- Date handling: Use `date-fns` library

### Security & Privacy (Very Important)
- Never log sensitive financial data
- Follow Row Level Security (RLS) in Supabase
- Validate all user inputs
- Use secure practices for portfolio data

### UI/UX
- Use modern, clean, dark/light mode-friendly design
- Make it look professional and trustworthy (finance app)
- Good mobile responsive (popup is small)

### Performance
- Minimize re-renders
- Use React.memo when needed
- Lazy load heavy components

When suggesting code:
- Give complete files when possible
- Explain why you made certain decisions
- Follow existing code style and patterns
