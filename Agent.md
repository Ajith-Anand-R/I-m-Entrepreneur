# I'M ENTREPRENEUR — PWA Frontend Build Spec (v2)
*A complete, standalone prompt you can hand to any AI code tool (Claude Code, Bolt, v0, Lovable, Cursor) to scaffold the entire frontend. Frontend-only — no real backend. All data is mocked/local so the app is fully clickable and demo-ready.*

> **What changed from v1:** the earlier spec was based on a marketing poster (15 "phases," free-roam navigation, 14 generic AI mentors, heavy XP/badges gamification). The actual project proposal is more specific and slightly different in structure. This version replaces v1 and is built directly from that proposal. Three things worth flagging before you build:
> 1. The proposal's own title is **"I AM Entrepreneurship,"** parent org **Beyond Guidance**. You separately told me to name the app **"I'm Entrepreneur"** — I've kept that name throughout. Say the word if you'd rather match the proposal's title exactly.
> 2. The proposal describes a separate **Beyond Guidance Admin Panel** (multi-startup monitoring dashboard for mentors) and a multi-tenant backend. That's a different web app for a different user (mentors, not founders) — it's **out of scope** for this founder-facing PWA. It's listed in §11 only so it isn't forgotten later.
> 3. The proposal's Founder Journey is a **sequential, gated 15-level path** (finish a level's activity → AI reviews it → next level unlocks), not a freely-browsable set of phases. That's a meaningfully different UX (Duolingo-style path, not a tab index) and this spec builds it that way.

---

## 1. What we're building

A **Progressive Web App** — the founder-facing product of **I'm Entrepreneur**, an AI-powered Startup Operating System. One founder, one startup, one workspace: instead of splitting work across ChatGPT, YouTube, Notion, Drive, Canva, government sites, WhatsApp groups and spreadsheets, everything lives here.

Four pillars, straight from the proposal:
1. **Startup Workspace** — the startup's complete digital database (profile, team, documents, everything).
2. **AI Mentor** — not a generic chatbot. It reads every document the founder uploads and answers using that specific startup's context.
3. **Startup Learning Academy** — a structured entrepreneurship curriculum, not just a video library.
4. **Founder Journey Book** (physical + digital) — a printed book the founder writes in, scans, and gets AI feedback on, gating a 15-level progression.

Two supporting systems tie it together: an **AI Startup Builder** (auto-tracked task list with AI-recommended next steps) and a **Startup Dashboard** (single-glance view of everything above).

This build is **frontend only**:
- No real backend, no real AI calls, no real auth server, no real OCR.
- Simulate AI document analysis: "uploading," then a fake "AI is reading your documents…" progress state, then a populated **Startup Knowledge Base** built from pre-written mock extraction results.
- Simulate AI mentor chat with a typed-out response bank per persona, referencing the mock Knowledge Base so replies look startup-specific ("Based on the financial model you uploaded…").
- Simulate the book scan → AI review → level unlock loop with a processing animation and a pre-written feedback card.
- Persist all state (workspace data, uploaded docs, chat history, level progress, generated documents) in `localStorage` / IndexedDB so it survives refresh.
- Everything must be navigable end-to-end with realistic mock data — no dead links.

---

## 2. Design direction

Keep the existing brand instinct — deep navy/indigo as the primary color, clean white app surfaces, a warm paper tone reserved for the physical-book moments — but the personality shifts slightly from "notebook app" to **"startup command center with one very personal ritual (the book) at its core."** Most of the app (Workspace, Mentor, Dashboard, Builder) should feel precise, structured, data-forward. The Founder Journey Book is the one place that gets warmth, paper texture, and a page-turn flourish — that contrast is the point: everywhere else is the OS, this one place is the ritual.

**Color tokens**
| Token | Hex | Use |
|---|---|---|
| `--ink-900` | `#0B1B3F` | Primary navy — headers, nav, book cover, level path track |
| `--ink-700` | `#1B2E5C` | Secondary surfaces, cards on dark |
| `--paper` | `#FBF6EC` | Warm paper background — Founder Journey Book screens only |
| `--surface` | `#FFFFFF` | Standard app screen background (Workspace, Mentor, Dashboard, Builder, Academy) |
| `--accent-coral` | `#F2545B` | Not-started / blocked task states, overdue flags |
| `--accent-amber` | `#F2A93B` | In-progress states, level-unlock highlight |
| `--accent-teal` | `#2BB8A6` | Funding/financial content |
| `--accent-violet` | `#7C5CF2` | AI-generated content marker (mentor replies, AI summaries, AI-drafted documents) |
| `--accent-green` | `#2E9E5B` | Completed states, AI-validated content |
| `--ink-50` | `#EEF1F8` | Subtle backgrounds, disabled states |

**Typography**
- Display/serif (Founder Journey Book screens only): *Fraunces* or *Source Serif 4* — never used outside the book context.
- UI sans (everything else: nav, Workspace, Dashboard, Mentor, Builder, Academy): *General Sans* or *Inter*.
- Monospace utility (KPIs, startup score, timestamps, task counts): *IBM Plex Mono* at small sizes.

**Layout concept**
- Mobile-first, single-column, bottom tab bar as primary nav (5 items, see §4).
- **Startup Knowledge Base** cards (what the AI has learned about the startup) get a distinct violet-accented "AI-generated" treatment — a thin left border + small sparkle glyph — reused anywhere AI-derived content appears (mentor replies, generated documents, AI Builder recommendations), so the founder always knows what came from AI vs. what they entered themselves.
- **Founder Journey level map**: a vertical winding path (Duolingo-style), not a tab strip. Each level is a node on the path: locked (greyed, lock icon), current (pulsing highlight), completed (checkmark + small badge of what was learned). Tapping a locked node explains what unlocks it, tapping the current node opens the level.

**Signature element**
The **level-unlock moment**: after AI review of a scanned/uploaded page, a short, real celebration (path animates, next node's lock visibly opens, brief haptic-style pulse) — reserved for this one moment so it means something. No confetti anywhere else in the app.

**Motion rules**
- Page-turn (book contexts): 400ms, eased, only for entering/exiting Founder Journey level detail screens.
- Standard nav transitions: 150–200ms slide/fade, no bounce.
- Level-unlock: the one full celebratory moment in the app (§ above).
- Respect `prefers-reduced-motion` everywhere.

---

## 3. Tech stack (frontend only)

- **Framework:** React + Vite (or Next.js static export) + TypeScript
- **Styling:** Tailwind CSS, tokens from §2 wired into `tailwind.config`
- **Routing:** React Router / Next.js App Router
- **State:** Zustand (or Context + useReducer), persisted slices to `localStorage`
- **Local data layer:** IndexedDB (`idb` or `Dexie.js`) for uploaded documents, chat histories, generated documents, scanned book pages — this stands in for the real Startup Workspace database
- **Animation:** Framer Motion — level-unlock sequence, page-turn, chat typing indicator
- **Charts:** Recharts — Startup Score, funding readiness, dashboard KPIs
- **Forms:** React Hook Form + Zod — document upload metadata, document generator wizards, workspace profile editing
- **PWA:** `vite-plugin-pwa` (Workbox) — manifest, service worker, offline fallback
- **Icons:** Lucide React
- **Mock AI layer:** `lib/fake-ai.ts` — typed response bank per mentor persona that references fields from the mock Startup Knowledge Base, so replies read as startup-specific, not generic
- **Mock OCR/analysis layer:** `lib/fake-analysis.ts` — takes any "uploaded" file and returns a pre-written structured extraction (problem statement, target audience, competitors, revenue model, stage, tech, team, risks, opportunities) after a fake delay

No real API keys, no payment gateway, no real file parsing.

---

## 4. Information architecture / navigation

**Bottom tab bar (mobile, primary):**
1. **Dashboard** — Startup Dashboard (home)
2. **Workspace** — startup profile, documents, team
3. **Journey** — Founder Journey Book / level path (center tab, visually distinct)
4. **Mentor** — AI Mentor hub + Knowledge Base
5. **More** — Learning Academy, AI Startup Builder, Document Generator, Community, Meetings, Settings

**Desktop (≥1024px):** persistent left sidebar with all of the above as direct top-level links (Academy, Builder, Generator, Community, Meetings no longer buried once there's room).

**Global persistent elements:**
- Top bar: startup name/logo (if set) + startup score chip, notification bell, profile avatar.
- Floating "Ask your Mentor" bubble on every screen except onboarding/auth — opens the mentor picker pre-scoped to whatever screen the founder is on (e.g. tapped from a document → opens Mentor already referencing that document).

---

## 5. Full screen list

### A. Onboarding & Auth
1. **Splash** — logo mark animation.
2. **Sign up / Log in** — email or phone, mock OTP verification (auto-accepts any 4-digit code after ~1s fake "verifying" state).
3. **Invite code (optional step)** — "Joining through Beyond Guidance? Enter your invite code" / "Continue independently" — sets a cosmetic `mentorOrg` field on the profile; does not unlock any admin feature (there isn't one in this app).
4. **Startup setup wizard** — startup name, one-line problem/solution, stage (Idea / Validating / Building / Launched / Scaling), team size — this seeds the Startup Workspace profile so the app isn't empty on first open.
5. **Founder Journey Book activation** — "Have your physical book? Enter the code on the inside cover / Scan the QR / I'll go digital-only" — determines whether Journey shows a "link your book" prompt later.

### B. Startup Dashboard (Home)
6. **Dashboard Home** — editable vision/mission strip, **Startup Score** ring (mocked composite of workspace completeness + journey progress + document readiness), goals & tasks summary (pulled from AI Startup Builder), funding readiness meter, team snapshot, recent documents, upcoming meetings, latest AI recommendation card (violet-accented), "Continue your journey" card linking straight to the current level.
7. **Notifications** — grouped Today / This week: AI review ready, new mentor reply, document analysis complete, level unlocked, meeting reminder, funding match.
8. **Startup Score detail** — breakdown by category (Workspace completeness, Validation, Business Model, Financial Readiness, Funding Readiness, Team) each with a one-line "why" and a CTA to the relevant screen.

### C. Startup Workspace
9. **Workspace Home** — startup profile card (name, logo placeholder, vision, mission, stage, problem statement, solution, business model one-liner — all editable inline), quick links to Team, Documents, Knowledge Base.
10. **Startup Profile editor** — structured form for vision, mission, problem statement, solution, business model summary (this is the canonical source the AI Mentor "already knows").
11. **Team screen** — list of team members (name, role, bio), add/edit team member sheet.
12. **Documents Home** — the startup's complete digital database, organized by category exactly as listed in the proposal: Financial documents, DPR, Pitch deck, Research papers, Customer interviews, Meeting notes, Funding documents, Prototype documents, Images, Videos, Reports. Grid/list toggle, category filter chips, upload button.
13. **Document upload flow** — pick/mock-select a file → metadata step (title, category, tags) → **"AI is reading your document…"** processing screen → completion state showing what the AI extracted, with a direct link into the Knowledge Base to see how it updated.
14. **Document viewer** — inline preview, rename/move/delete/share-sheet, "Ask the Mentor about this document" CTA.

### D. AI Mentor
15. **Startup Knowledge Base** — the AI's structured understanding of the startup, rendered as clean summary cards (violet "AI-generated" treatment from §2): Problem Statement, Target Audience, Competitors, Revenue Model, Business Stage, Technology, Team, Risks, Opportunities — each card shows which uploaded document(s) it was derived from, and updates (visibly, with a small "updated" flash) whenever a new document is analyzed.
16. **Mentor Hub** — grid of the 10 mentor personas from the proposal: Startup Mentor, Funding Mentor, Marketing Mentor, Sales Mentor, Product Mentor, Technical Mentor, Legal Mentor, Finance Mentor, Investor Mentor, Government Scheme Mentor. Each card: icon, accent color, one-line specialty.
17. **Mentor chat (template, reused × 10)** — standard chat UI; header shows mentor name + a small "knows about: [Pitch Deck, Financial Model]" chip strip so it's visually obvious this isn't a blank ChatGPT session; suggested starter prompts relevant to that persona; typing indicator while the mock response streams in; option to save a reply into Workspace Documents or pin it to a Builder task.

### E. Founder Journey Book
18. **Journey Home / Level Map** — vertical winding path, 15 nodes (Vision, Mission, Problem Discovery, Idea Discovery, Customer Validation, Market Research, Business Model, Prototype, Branding, Financial Planning, Funding, Pitch Preparation, Launch, Growth, Scale), each node locked / current / completed as described in §2.
19. **Level detail (template, reused × 15)** — page-turn transition in, paper background, short "learn" content for that level's concept, then the level's activity (structured prompt matching the proposal, e.g. Level 1: "Write your own startup vision"; Level 5: upload/summarize customer interview responses; Level 11: shows AI-recommended funding opportunities relevant to the startup's stage).
20. **Scan / upload your page** — camera viewfinder mock with page-alignment guide (or a "type it instead" fallback), capture, then **"AI is reading your page…"** processing animation.
21. **AI Review & feedback** — side-by-side of the captured page and the digitized text, a short structured AI verdict (e.g. Level 3: "Is this problem meaningful?" → AI's reasoning), then the **level-unlock celebration** (signature motion moment) if the review passes, or specific, actionable feedback + "revise and resubmit" if it doesn't — every level must support both outcomes, don't only build the happy path.
22. **Journey history / journal** — a scrollable log of every completed level with the founder's submission + the AI's feedback, so the book has a visible "spine" of progress over time.

### F. AI Startup Builder
23. **Builder Home** — auto-tracked checklist of major startup workstreams (Idea Validation, Customer Interviews, Prototype, Funding Preparation, and others derived from Workspace + Journey state), each with a status chip: **Completed** (green) / **In Progress** (amber) / **Not Started** (coral). A pinned "AI recommends next" card at the top explaining *why* that task is next (referencing Knowledge Base gaps), not just what it is.
24. **Task detail sheet** — what the task involves, which Workspace document or Journey level it's tied to, mark-as-started/complete controls.

### G. Startup Learning Academy
25. **Academy Home** — curriculum overview mapped to the proposal's topic list (Entrepreneur mindset, Finding startup ideas, Problem identification, Customer validation, Market research, Design Thinking, Product Development, Business Model Canvas, Lean Startup, MVP Development, Branding, Marketing, Sales, Company Registration, Startup India, DPIIT, Government Schemes, Funding, Pitch Deck, Investor Preparation, Team Building, Scaling), grouped into modules, with continue-watching row.
26. **Course/module detail** — lesson list, each lesson tagged with what it includes (video, notes, activity, assignment, quiz, mini-game, case study) matching the proposal exactly — don't build lesson types the proposal didn't ask for.
27. **Video lesson player** — mock player chrome, notes panel.
28. **Activity / assignment screen** — structured input matching the lesson (short-answer, worksheet-style — not just multiple choice).
29. **Quiz screen** — multiple-choice, immediate feedback, score summary.
30. **Progress tracking screen** — per-module completion, overall academy progress bar.

### H. AI Document Generator
31. **Generator Home** — grid exactly matching the proposal's list: DPR, Business Plan, Pitch Deck, Financial Projection, Lean Canvas, Business Model Canvas, SWOT Analysis, Market Research, Investor Email, Founder Agreement, NDA, Grant Proposal.
32. **Generator wizard (template, reused per document type)** — multi-step form pre-filled where possible from the Startup Knowledge Base (so it doesn't ask the founder to re-type things the AI already knows — surface that explicitly: "Pre-filled from your Knowledge Base" tag on those fields), ends with a fake "AI is drafting your [Pitch Deck]…" progress state.
33. **Generated document preview** — real layout per document type (Business Model Canvas as an actual 9-box canvas, SWOT as a real 2×2, not plain paragraphs), Edit / Regenerate section / Export (PDF) / Save to Workspace Documents.

### I. Community
34. **Community feed** — questions, progress updates, mixed post types, filter chips.
35. **Post detail / thread** — comments, reply box.
36. **Co-founder / mentor connect** — browsable profile cards (skills, looking-for tags), connect-request state.
37. **Challenges & events** — list of community challenges and startup events, detail + RSVP.

### J. Meetings
38. **Meetings list** — upcoming + past, each tagged to a mentor session, team meeting, or investor call.
39. **Meeting detail / notes** — agenda, notes (editable), action items — this is what feeds the "Meeting notes" category back in Workspace Documents.

### K. Profile & Settings
40. **Profile** — founder name, startup name/logo, mentorship org badge if an invite code was used (§A.3), summary stats (journey level, tasks completed, documents uploaded).
41. **Settings** — theme, notification preferences, account, data export, help/support, about.
42. **Empty & offline states** — every list screen above needs a real designed empty state (not a blank white flash) and the app needs a genuine offline screen (§7) — build these as first-class screens, not afterthoughts.

---

## 6. Shared component library

- `AppShell` (top bar + bottom tab / sidebar switcher by breakpoint)
- `LevelPath` / `LevelNode` (the Duolingo-style winding path + node states: locked/current/completed)
- `PageTurnTransition` (Framer Motion wrapper, Journey-only)
- `KnowledgeBaseCard` (violet "AI-generated" treatment, reused for Knowledge Base, mentor replies, AI Builder recommendations, pre-filled generator fields)
- `StartupScoreRing`, `SparklineChart`, `RadarBreakdown` (Recharts wrappers)
- `TaskStatusChip` (Completed / In Progress / Not Started)
- `DocumentUploadCard` (idle → uploading → "AI is reading…" → analyzed states)
- `MentorCard`, `ChatBubble`, `TypingIndicator`, `KnowsAboutChip` (the "knows about: [doc, doc]" strip in mentor chat headers)
- `WizardStepper` (document generator + activity forms), with a `PrefilledFieldBadge` for Knowledge-Base-sourced fields
- `DocumentPreviewFrame` (renders BMC / SWOT / Lean Canvas / Pitch Deck in real layout)
- `UnlockCelebration` (the one signature full-motion moment, Journey level-unlock only)
- `EmptyState`, `OfflineBanner` / `OfflineScreen`, `Skeleton` loaders per card/list type above

---

## 7. PWA requirements

- Full `manifest.json`: name "I'm Entrepreneur," short_name "IamEntrepreneur," theme_color `#0B1B3F`, background_color `#FBF6EC`, display `standalone`, icons at 192/512 (maskable variant included), orientation `portrait`.
- Service worker (Workbox via `vite-plugin-pwa`): precache app shell; runtime-cache mock assets with cache-first strategy; navigation fallback to a real **Offline screen** — since everything is local by design, the Offline screen should still show the cached Dashboard/Workspace/Journey, not just an error message.
- Custom **Install prompt** UI: intercept `beforeinstallprompt`, show a bottom sheet ("Add I'm Entrepreneur to your home screen") instead of the browser's native banner, dismissible with "maybe later."
- Verify full usability with the network off — this is a genuine feature of the demo, not just a checkbox, since there's no real backend to lose anyway.

---

## 8. Writing / copy rules

- Name things by what the founder controls: "Save to Workspace," never "Persist document."
- Every AI-derived piece of content is visually and textually marked as AI-generated (the `KnowledgeBaseCard` treatment) — never blend AI output with founder-entered data without distinguishing them.
- Each of the 10 mentors has a distinct domain voice matching its name — the Legal Mentor talks registration and compliance, the Finance Mentor talks runway and unit economics, the Government Scheme Mentor talks DPIIT/Startup India specifics — not one assistant voice copy-pasted ten times.
- The AI Review on a Journey level should give real, specific-sounding feedback tied to what was submitted, and must have a believable "needs revision" version, not just an approval — a founder journey where AI always says yes teaches the founder nothing and isn't credible in a demo.
- Empty states are invitations, not apologies: "No documents yet — upload your first Pitch Deck and let the AI Mentor get to know your startup," CTA included.

---

## 9. Mock data shape

```
mockData/
  user.ts                 // founder profile, mentorOrg (optional), auth state
  startupProfile.ts        // name, logo, vision, mission, stage, problem, solution, business model
  team.ts
  documents.ts             // category, title, tags, analyzedAt, extractedSummary
  knowledgeBase.ts         // problemStatement, targetAudience, competitors, revenueModel, stage, tech, team, risks, opportunities — each with sourceDocumentIds[]
  mentors.ts               // 10 personas: id, name, specialty, color, responseBank[]
  journeyLevels.ts          // 15 levels: id, title, learnContent, activityPrompt, unlockState, submission?, aiFeedback?
  builderTasks.ts           // id, title, status, linkedTo (documentId | levelId), aiRecommendationReason
  academyModules.ts         // topic list from §5.G, lessons[] with type tags
  documentGenerators.ts     // 12 types, field schema per type, which fields are Knowledge-Base-prefillable
  communityPosts.ts
  meetings.ts
  reports.ts                // dashboard-level AI recommendation feed
```
Hydrate the Zustand store from `localStorage`/IndexedDB first, falling back to these fixtures on first launch, so the demo starts "alive" (a partially-built Workspace, a couple of analyzed documents, Level 3 unlocked) rather than completely empty.

---

## 10. Suggested folder structure

```
src/
  app/                 // routes/screens, one folder per module in §5 (A–K)
  components/          // shared library from §6
  store/               // zustand slices
  mockData/
  lib/                 // fake-ai.ts, fake-analysis.ts (doc-upload "OCR"), pdf-export.ts
  styles/              // tailwind config, tokens
  pwa/                 // manifest, sw registration, install-prompt logic
```

---

## 11. Explicitly out of scope for this build

- **Beyond Guidance Admin Panel** — multi-startup monitoring dashboard for mentors (separate web app, different user type, needs a real multi-tenant backend to mean anything).
- Real authentication, real file storage/OCR, real AI inference, real payments — all mocked per §1/§3.
- Multi-founder / multi-startup accounts inside this app — one founder, one startup workspace, matching the MVP module list in the proposal.

## How to use this doc

Paste this entire file into your code-generation tool as the build prompt. Build module by module in the order listed in §5 (A → K) so there's always a navigable app at each stage. The Startup Workspace (B) and Knowledge Base (D.15) should exist before the Mentor chat and Document Generator, since both of those are supposed to visibly *use* Workspace/Knowledge Base data — build them out of order and the "AI already knows your startup" effect, which is the whole differentiator, won't come through.