# BITS Qiskit Fall Fest 2026 — Landing Page

Landing page for QFF 2026, built with Next.js, TypeScript, and Tailwind CSS.
See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the full stack
rationale and the plan for the future course/video/attendance platform this
is designed to grow into.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build for production

```bash
npm run build
npm run start
```

## Replacing placeholder content

Every piece of Lorem Ipsum content lives in `src/data/`, not inside any
component. Edit the relevant file and the page updates automatically —
no component code needs to change:

| File | Controls |
|---|---|
| `src/data/event.ts` | Hero copy, tagline, event-detail cards |
| `src/data/hackathon.ts` | Hackathon intro + the six info cards |
| `src/data/schedule.ts` | Schedule timeline, grouped by `day` |
| `src/data/speakers.ts` | Speaker cards |
| `src/data/collaborations.ts` | Sponsor/partner logo wall |
| `src/data/team.ts` | Organizing team grid |
| `src/data/socials.ts` | Social link cards (footer + Socials section) |
| `src/data/nav.ts` | Nav bar + footer link labels/order |

Speaker, team member, and avatar images are currently generated
placeholders (`PlaceholderAvatar`, a deterministic gradient — no external
image requests). Once real photos exist, swap that component usage for
`next/image` in `SpeakersSection.tsx` / `TeamSection.tsx`.

## Deploy

Recommended: [Vercel](https://vercel.com) — connect the repo, no config
needed beyond setting `NEXT_PUBLIC_APP_URL` in the project's environment
variables (see `.env.example`). See `docs/ARCHITECTURE.md` §8 for the full
deployment diagram and reasoning.

## Project structure

```text
src/
  app/            Root layout (SEO metadata), page composition, global CSS
  components/
    layout/       Navbar, Footer
    sections/     One component per landing-page section
    ui/           Reusable primitives (cards, icons, scroll-reveal, etc.)
  data/           All placeholder content (edit here, not in components)
  types/          Shared TypeScript types
  lib/            Small utilities
```
