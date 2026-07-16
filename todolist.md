# I'M ENTREPRENEUR — Build Checklist (TodoList)

Use this checklist to track the implementation of the **I'm Entrepreneur** PWA frontend. Work through the phases sequentially to ensure dependencies are resolved correctly.

---

## Phase 1: Environment Setup & Core Configs
*Target Skills: `ui-setup`, `ui-tokens`, `zustand-store-ts`*

- [x] **1.1. Project Scaffolding**
  - [x] Run `npm init vite@latest ./ -- --template react-ts` or confirm environment.
  - [x] Install package dependencies: `npm install lucide-react framer-motion recharts dexie react-router-dom zustand lucide-react react-hook-form zod`.
  - [x] Install PWA developer assets: `npm install -D vite-plugin-pwa`.
- [x] **1.2. Tailwind Theme Wiring**
  - [x] Update `tailwind.config.js` to define color tokens (`--ink-900`, `--ink-700`, `--paper`, `--surface`, and `--accent-` variations).
  - [x] Configure serif (Fraunces / Source Serif 4), sans-serif (Inter / General Sans), and monospace (IBM Plex Mono) fonts.
  - [x] Set up the standard page transitions configuration in the tailwind utilities.
- [x] **1.3. Local Database & State Persistence Setup**
  - [x] Write `src/lib/db.ts` to export the Dexie instance, specifying tables for `documents`, `chats`, and `submissions`.
  - [x] Write `src/store/useStartupStore.ts` using Zustand `persist` to track basic user settings, levels, and tasks.
- [x] **1.4. Seed Mock Data Assets**
  - [x] Create `src/mockData/fixtures.ts` containing the initial founder settings, 10 mentor profiles, 15 learning levels, and 12 template profiles.

---

## Phase 2: Database & Utility Layers
*Target Skills: `react-patterns`, `concise-planning`*

- [x] **2.1. Mock OCR Utility (`src/lib/fake-analysis.ts`)**
  - [x] Implement analysis function with a 1.5s delay to trigger OCR loading indicators.
  - [x] Create mock parsing data matching categories (financials, pitch decks, customer notes) to return structured JSON summaries.
- [x] **2.2. Mock AI Conversation Engine (`src/lib/fake-ai.ts`)**
  - [x] Code persona-specific reply generators mapping responses directly to fields in the local database.
  - [x] Add random responses for cases where context documents are missing.

---

## Phase 3: Core Shell & Navigation UI
*Target Skills: `ux-flow`, `ui-pattern`, `react-patterns`*

- [ ] **3.1. Responsive App Shell (`src/components/AppShell.tsx`)**
  - [ ] Build layout displaying a bottom menu on mobile and a left sidebar on desktop.
  - [ ] Code a top bar showing the active company name, live startup score chip, notifications button, and profile menu.
- [ ] **3.2. Global Floating Chat Button**
  - [ ] Build a floating bubble on pages to open a modal with quick mentor commands.
- [ ] **3.3. Notification Panel Drawer (`src/components/NotificationPanel.tsx`)**
  - [ ] Create notification trays containing updates (documents analyzed, chat replies, milestones unlocked).

---

## Phase 4: Startup Workspace & Knowledge Base (Module B & C)
*Target Skills: `ui-component`, `ux-feedback`, `ux-copy`*

- [x] **4.1. Workspace Profile Dashboard (`src/app/workspace/WorkspaceHome.tsx`)**
  - [x] Build profiles cards supporting inline form edits.
- [x] **4.2. Team Section (`src/app/workspace/TeamTab.tsx`)**
  - [x] Design rosters displaying photos, roles, and quick-edit sliders.
- [x] **4.3. Documents Manager (`src/app/workspace/DocumentsTab.tsx`)**
  - [x] Implement file search, list views, and category filter chips.
- [x] **4.4. Upload Interaction Component (`src/components/DocumentUploadCard.tsx`)**
  - [x] Build progress steps: `idle` ➔ `uploading` ➔ `processing` (AI reading state animation) ➔ `extracted_summary`.
- [x] **4.5. Knowledge Base Summary (`src/app/workspace/KnowledgeBase.tsx`)**
  - [x] Render the AI's understanding of the startup with cards marked with violet left borders and sparkle badges.

---

## Phase 5: Dashboard & KPI Analytics (Module A)
*Target Skills: `ui-component`, `react-component-performance`*

- [x] **5.1. Dashboard Layout (`src/app/dashboard/DashboardHome.tsx`)**
  - [x] Build home screens displaying vision banners, quick task summaries, and shortcut items.
- [x] **5.2. Startup Score Ring (`src/components/ScoreChart.tsx`)**
  - [x] Render interactive rings showing sub-scores (financial readiness, validation, business design) on click.
- [x] **5.3. Financial/Funding Trackers**
  - [x] Design charts displaying runway, burn rate, and investment metrics.

---

## Phase 6: Founder Journey Book & Level Progressions (Module E)
*Target Skills: `ui-motion`, `ui-page`, `ux-persuasion-engineer`*

- [x] **6.1. Vertical Path Map (`src/app/journey/JourneyHome.tsx`)**
  - [x] Design a Duolingo-style path showing locked, current, and completed nodes.
- [x] **6.2. Paper-Textured Level Details (`src/app/journey/LevelDetail.tsx`)**
  - [x] Add animations mimicking page turns when viewing book chapters.
  - [x] Apply serif fonts, warm backgrounds (`--paper`), and interactive forms to the level panels.
- [x] **6.3. Mock Document Capture (`src/app/journey/ScannerMock.tsx`)**
  - [x] Create layout displaying cameras, scan frames, and text overlays.
- [x] **6.4. Milestone Celebration Sequence (`src/components/UnlockCelebration.tsx`)**
  - [x] Code custom animation sequences showing path line updates and locking animations when stages are passed.

---

## Phase 7: AI Mentor Hub & Contextual Chat (Module D)
*Target Skills: `ui-pattern`, `ux-copy`, `react-patterns`*

- [x] **7.1. Mentors Dashboard (`src/app/mentor/MentorHub.tsx`)**
  - [x] Design grids showing the 10 specialties.
- [x] **7.2. Interactive Chat Panels (`src/app/mentor/ChatContainer.tsx`)**
  - [x] Show context badges in chat headers indicating referenced workspace files.
  - [x] Implement simulated typing animations and add option tags to export logs to files.

---

## Phase 8: AI Startup Builder (Module F)
*Target Skills: `ui-component`, `react-patterns`*

- [x] **8.1. Action Planner Dashboard (`src/app/builder/BuilderHome.tsx`)**
  - [x] Design boards displaying status sections: Completed (green), In Progress (yellow), and Not Started (red).
- [x] **8.2. Recommendation Cards**
  - [x] Code banner blocks displaying recommendations based on missing data fields.

---

## Phase 9: AI Document Generator (Module H)
*Target Skills: `ui-component`, `ui-review`*

- [x] **9.1. Template Selectors (`src/app/generator/GeneratorHome.tsx`)**
  - [x] Design catalog views showing templates (e.g. BMC, SWOT, DPR).
- [x] **9.2. Wizard Stepper forms (`src/app/generator/DocWizard.tsx`)**
  - [x] Build wizard panels highlighting inputs preloaded from database fields with custom badges.
- [x] **9.3. Visual Representation Renderers (`src/components/DocumentPreviewFrame.tsx`)**
  - [x] Render templates as visual grids (e.g., SWOT matrix, BMC blocks) supporting PDF export.

---

## Phase 10: Academy, Community, & Meetings (Modules G, I, J)
*Target Skills: `ui-page`, `ux-feedback`*

- [x] **10.1. Learning Academy (`src/app/academy/AcademyHome.tsx`)**
  - [x] Design lesson listings, media players, and quizzes.
- [x] **10.2. Community Forums (`src/app/community/Feed.tsx`)**
  - [x] Build messaging threads and search panels.
- [x] **10.3. Meetings Schedules (`src/app/meetings/MeetingsList.tsx`)**
  - [x] Code appointment items showing agenda fields and action points.

---

## Phase 11: PWA Setup & Offline Capabilities
*Target Skills: `windows-shell-reliability`, `react-patterns`*

- [x] **11.1. Manifest and Service Workers Setup**
  - [x] Write `public/manifest.json` setting standard parameters, background colors, and app icons.
  - [x] Configure service workers in Vite to cache index routes and page shells.
- [x] **11.2. Offline Layout Fallbacks**
  - [x] Design warning panels displaying when connectivity is lost.
- [x] **11.3. App Installation Prompt**
  - [x] Create dynamic bottom drawers requesting layout installs on user click.

---

## Phase 12: Final Polish & Audits
*Target Skills: `ui-lint`, `ui-review`, `ux-audit`*

- [x] **12.1. Accessibility Audit**
  - [x] Check color contrast levels and verify keyboard navigation.
- [x] **12.2. Performance Optimization**
  - [x] Optimize loading speeds and verify state transitions.
