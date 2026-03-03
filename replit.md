# Agility Assessment

## Overview
A web application for tracking and managing agility maturity across organizations. Users can perform assessments across multiple levels (Team, ART, Program, Portfolio, Organizational), visualize results via radar charts, and maintain a Problem Register to track identified gaps.

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS 4, React Router 7
- **Backend/Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite 7
- **Charts**: Chart.js with react-chartjs-2

## Environment Variables
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous API key

## Project Structure
- `src/` — Application source code
- `src/lib/supabase.ts` — Supabase client initialization (falls back to localStorage if secrets missing)
- `src/components/` — React components including RadarChart
- `supabase/migrations/` — Database migration SQL files

## Running
- Dev server: `npm run dev` (Vite on port 5000)
- Build: `npm run build`
