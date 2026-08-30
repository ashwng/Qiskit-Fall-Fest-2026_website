# QFF 2026 — Architecture

This document is the Step 1 / Step 6 deliverable from the project brief: the
stack decision, the reasoning behind it, the future database shape, and how
the system is expected to scale. The landing page is the only thing actually
implemented; everything past "Current Implementation" is a plan, not code.

## 1. Stack decision

```text
Frontend:       Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4
Backend:        Next.js Route Handlers (no separate server)
Database:       PostgreSQL (not yet provisioned — see §4)
ORM:            Prisma (added with the first database-backed feature)
Hosting:        Vercel (app) — see §7
Video:          External provider (Cloudflare Stream or Mux) — see §5
Authentication: NextAuth.js / Auth.js (added with registration) — see §6
QR Attendance:  Server-validated, short-lived signed tokens — see §5
Styling:        Tailwind CSS v4 + self-hosted fonts (@fontsource)
```

**Why Next.js.** The eventual platform needs a mix of static/public pages
(landing page, speaker bios, schedule) and authenticated, dynamic pages
(profile, course player, admin). Next.js's App Router lets both live in one
codebase: the landing page ships as static HTML with no server work per
request, while future authenticated routes can opt into server rendering or
API routes in the same project. For ~200 concurrent users this avoids paying
for a second service (a separate API server) that would only add deployment
and networking complexity without a corresponding benefit at this scale.

**Why no separate Express/Nest backend (yet).** Route Handlers are just
serverless/edge functions with the same request lifecycle as any other
Node HTTP framework — there's no missing capability for this scale. A
separate backend would mean a second deploy pipeline, second set of env
vars, and CORS to manage, for zero real gain until there's a concrete driver
(e.g. a background job worker that must run outside the request/response
cycle). If that need appears later, it can be added as an isolated service
without touching the frontend.

**Why PostgreSQL.** The future data model (users, courses, attendance,
registrations) is fundamentally relational with real foreign-key
relationships (a user has many registrations, a course has many modules,
each module has many lessons, attendance records reference both a user and
a session). Postgres handles this natively, is well-supported by every
major host, and has no reason to be replaced by a NoSQL store here — nothing
in the requirements needs schema-less flexibility or massive horizontal
write scale.

**Why Prisma.** Strong TypeScript inference end-to-end (schema → query
results → component props) without hand-written types, a readable
migration history, and it's the ORM with the least friction inside a
Next.js Route Handler. The landing page does not use a database yet, so
Prisma is not installed in the current codebase — it's a one-command
addition (`npm install prisma @prisma/client`) when the first DB-backed
feature (registration) is built.

## 2. What was actually built

Only the landing page — no auth, no database calls, no video, no QR, no
admin, per the brief. See `README.md` for how to run it and
`src/data/*.ts` for where to edit placeholder content.

## 3. Project structure

```text
src/
  app/
    layout.tsx        Root layout, SEO metadata (title, OG, Twitter)
    page.tsx           Composes all sections in order
    globals.css        Design tokens, fonts, reduced-motion handling
  components/
    layout/            Navbar, Footer
    sections/           One component per landing-page section
    ui/                Reusable primitives (Section, SectionHeading, cards,
                       icons, scroll-reveal, placeholder avatar)
  data/                 All placeholder content — event.ts, schedule.ts,
                       speakers.ts, collaborations.ts, team.ts, socials.ts,
                       hackathon.ts, nav.ts
  types/                Shared TypeScript interfaces, shaped to match the
                       future database entities in §4
  lib/                  Small utilities (className merge)
```

Nothing in `components/` imports Lorem Ipsum text directly — every string
that will eventually be real content comes from `src/data/`. To replace
placeholder content, edit the relevant file in `src/data/` only.

## 4. Future database design (not implemented yet)

```text
User            id, email, name, role (student | admin), createdAt
Registration    id, userId → User, eventId → Event, createdAt
Event           id, name, startsAt, endsAt, venue
Course          id, title, description
CourseModule    id, courseId → Course, title, order
Lesson          id, moduleId → CourseModule, title, order
Video           id, lessonId → Lesson, provider, providerAssetId, durationSec
CourseProgress  id, userId → User, lessonId → Lesson, completedAt
Speaker         id, name, designation, organization, bio, imageUrl
ScheduleItem    id, eventId → Event, time, title, description, track
Hackathon       id, eventId → Event, title, description
TeamMember      id, name, role, team, imageUrl
Collaboration   id, name, tier, logoUrl
QRAttendanceSession   id, eventId → Event, createdBy → User, expiresAt, token
AttendanceRecord      id, sessionId → QRAttendanceSession, userId → User,
                       scannedAt   (unique on sessionId+userId — prevents duplicates)
Announcement    id, title, body, publishedAt
```

Relationships in one sentence each: a `User` has many `Registration`s,
`CourseProgress` rows, and `AttendanceRecord`s; a `Course` has many
`CourseModule`s, each with many `Lesson`s, each with one `Video`; an `Event`
has many `ScheduleItem`s and owns the `Hackathon` and any
`QRAttendanceSession`s created for it. Nothing here is over-normalized —
this is close to the minimum schema that supports every listed future
feature.

## 5. Video and QR attendance (design only — not built)

**Video.** Large binary video should never touch the Next.js app server or
Postgres. The plan: upload to an external provider (Cloudflare Stream or
Mux — both handle transcoding, adaptive bitrate, and CDN delivery), store
only the returned `providerAssetId` in the `Video` row, and render the
provider's hosted player (or a thin wrapper around their player SDK) on the
lesson page. The app server's only job is issuing a short-lived signed
playback URL/token per request — it never proxies the actual video bytes.

**QR attendance.** The flow from the brief, with the abuse-resistance layer
made explicit:

```text
Admin creates a QRAttendanceSession (server-side, tied to an Event)
        ↓
Server generates a short-lived signed token (e.g. JWT, 30–60s expiry)
   encoding sessionId + issuedAt, and renders it as a QR code that
   auto-refreshes client-side before it expires
        ↓
Student scans QR with an authenticated session (they must already be
   logged in — the QR alone proves nothing)
        ↓
Server validates: token signature, token not expired, session still open
        ↓
Server checks AttendanceRecord unique constraint (sessionId, userId) —
   a second scan by the same user is a no-op, not a duplicate row
        ↓
Attendance recorded; admin's dashboard subscribes to/polls the count
```

The short expiry plus continuous rotation is what makes a photographed QR
code useless a minute later — this is the standard mitigation for
"someone screenshots the code and shares it" abuse, and it requires no
new infrastructure beyond signing tokens the app already has an auth
system to issue.

## 6. Auth and security posture (design only — not built)

Authentication isn't implemented in this landing page, but the codebase
doesn't fight it either: Route Handlers are the natural place to add
Auth.js session checks, and any future authenticated page is just a Server
Component that reads the session before rendering. Server-side
authorization checks (never trusting a client-sent role) apply to every
future write endpoint, especially QR session creation and attendance
scanning. Nothing beyond standard Next.js CSRF-safe patterns (same-site
cookies, server-validated mutations) is needed at this scale — no bespoke
security infrastructure is justified for ~200 users.

## 7. Scaling to ~200 concurrent users, and beyond

At 200 concurrent users, the landing page itself is nearly free to serve:
it's fully static (every current page has zero server-side data
dependency), so it's generated once at build time and served from a CDN
edge — Vercel's CDN in this recommendation. Static assets (fonts, the SVG
signature graphic) are cached indefinitely with hashed filenames.

When the platform grows a database:

- **Page visitors (200 concurrent browsing):** still mostly static/cached;
  only authenticated pages (profile, course player) hit the server, and
  those are simple, indexed row lookups — trivial load for Postgres.
- **Course video (200 concurrent watchers):** this traffic never reaches
  the app server at all — see §5. The app issues a small signed URL per
  viewer; the video bytes are served by the CDN in front of the video
  provider. This is the single most important scaling decision in this
  document: it decouples "how many people can watch video" from "how big
  is my app server."
- **Database connections:** a managed Postgres instance (e.g. Vercel
  Postgres/Neon/Supabase) with connection pooling (PgBouncer, which these
  providers include) comfortably handles far more than 200 concurrent
  users doing normal CRUD — this is a small fraction of what a single
  small Postgres instance supports.
- **QR attendance bursts:** the realistic worst case is ~200 students
  scanning within a short window at the start of a session. That's 200
  simple, indexed writes (one unique-constraint insert each) — well within
  what a single Postgres instance handles without special-casing.
- **Caching/CDN:** static pages and assets are cached at the edge;
  dynamic, authenticated responses are not cached and don't need to be at
  this scale.

**Beyond 200 users**, the same architecture scales by: moving to a larger
managed Postgres tier (vertical scaling covers a lot of headroom before any
architectural change is needed), adding read replicas only if read load
specifically becomes the bottleneck, and keeping video and static assets on
the CDN/video-provider path so app-server load stays flat regardless of
viewer count. Splitting into microservices is deliberately out of scope —
nothing in this brief's requirements needs it, and doing so earlier would
add operational cost without a corresponding capability the monolith
lacks.

## 8. Deployment

```text
Browser → Vercel Edge CDN → Next.js Application (Vercel) → PostgreSQL (managed)
                                                    └──────→ Video provider CDN
```

**Hosting: Vercel.** It's the reference host for Next.js (App Router
features, image optimization, and edge caching work with zero extra
config), and its free/hobby tier is already sufficient for a 200-concurrent
landing page. **Database:** any managed Postgres with pooling (Neon,
Supabase, or Vercel Postgres) — pick based on which one the team already
has an account with; none of them requires infrastructure work beyond
setting `DATABASE_URL`. **Video:** Cloudflare Stream or Mux, added only
when the course feature is actually built.

## 9. What is deliberately NOT implemented yet

Per the brief: authentication, course system, video playback, QR
attendance, admin dashboard, payments, database integration. This document
exists so those features can be added without re-architecting anything
already shipped — the data layer, component structure, and route
conventions already assume they're coming.
