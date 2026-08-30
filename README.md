# BITS Qiskit Fall Fest 2026 — Landing Page

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
