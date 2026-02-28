# Waktunya Puasa

A Ramadan prayer times app for Selangor, Malaysia (zone SGR01). Displays live Imsak/Sahoor and Iftar (Maghrib) times with a countdown to the next prayer.
This project is fully integrated with OpenClaw 🦞 via my assistant called **Membot**. I can code it anywhere. Most of the PR is created and generated via Telegram while Tarawih (tolong jangan ditiru 🫣)

## Quick Start

```bash
pnpm install
pnpm dev        # Start dev server on port 3000
```

Visit `http://localhost:3000` to see the app.

## Commands

| Command        | Purpose                        |
| -------------- | ------------------------------ |
| `pnpm dev`     | Start dev server on port 3000  |
| `pnpm build`   | Build for production           |
| `pnpm preview` | Preview production build       |
| `pnpm test`    | Run tests with Vitest          |
| `pnpm lint`    | Lint with Biome                |
| `pnpm format`  | Format with Biome              |
| `pnpm check`   | Lint + format check with Biome |

## Tech Stack

- **Framework:** TanStack Start (SSR React)
- **Routing:** TanStack Router (file-based)
- **Data Fetching:** TanStack Query
- **Styling:** Tailwind CSS v4
- **Linting/Formatting:** Biome
- **Deployment:** Netlify

## Architecture

The app fetches weekly prayer timetables from the E-Solat API (`e-solat.gov.my`) and displays Imsak and Iftar times with a live countdown.

### Key Files

- `src/routes/__root.tsx` — Root layout with TanStack Query provider
- `src/routes/index.tsx` — Main route with server function and UI
- `src/styles.css` — Global styles, CSS variables, utilities

### Data Flow

1. Route loader calls `fetchPrayerTime()` server function
2. Response is normalized to handle variable field names
3. Client-side live clock updates every second with countdown

## Import Aliases

- `#/*` → `./src/*`
- `@/*` → `./src/*`

## Specs

Design and product requirements are in `specs/`.
