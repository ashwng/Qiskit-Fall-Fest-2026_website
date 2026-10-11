# BITS Qiskit Fall Fest 2026 — Landing Page

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Registration and referrals

`/referral` provides independent referrer signup, a personal code, and a shareable
`/registration?ref=CODE` link. Referrer signup does not create an attendee ticket.
Repeated signup with the same email returns the existing public code without
changing the saved profile. Completed attendee registrations count referrals in
the same database transaction as the attendee record.

Set `DATABASE_URL` in `.env.local` and run `npm run db:init` before using the forms.
For an existing installation, run this command to add the `referrers` table;
the migration preserves existing registrations and their referral codes.

After registering, attendees can use **Download Pass PDF** for a standalone A5
ticket without browser headers or URLs. The PDF is generated locally in the
browser, using the site's fonts and a vector Code 39 barcode. **Print pass**
remains available with a simplified, pass-only print layout.

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
