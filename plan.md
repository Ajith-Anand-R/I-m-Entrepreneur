# I'M ENTREPRENEUR — Phase-by-Phase Frontend Implementation Plan

This implementation plan translates the **I'm Entrepreneur** PWA frontend build specification into a highly structured, phase-by-phase architectural guide. This document is optimized for execution by agentic AI coders (e.g., Claude Code, Cursor, Bolt, Lovable), specifying structural choices, file dependencies, animation speeds, state machines, and the exact skills required at each step.

---

## 1. Project Overview & Scope
**I'm Entrepreneur** is a Progressive Web App (PWA) that acts as a "Startup Command Center." It brings together workspace management, curriculum learning, AI mentoring, auto-tracked goals, and a physical-to-digital milestone journal.

### Architecture Boundaries:
- **Client-Side Only**: All API connections, OCR operations, document analysis, and chat responses are **simulated** in local scripts (`src/lib/fake-ai.ts` and `src/lib/fake-analysis.ts`).
- **Data Persistence**: State must persist across refreshes using a unified combination of **Zustand** (for lightweight UI/app state stored in `localStorage`) and **Dexie.js / IndexedDB** (for heavy document files, detailed chat records, and scans).
- **Physical Book Ritual**: The core UX differentiator is the contrast between the high-efficiency indigo/slate SaaS interface and the warm, serif-typed, paper-textured **Founder Journey Book** screens.

---

## 2. Design Tokens & Styling Configuration

Configure Tailwind CSS (`tailwind.config.js`) to expose the custom color palette and typography rules to maintain visual excellence.

### Tailwind Theme Extensions:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#EEF1F8', // Subtle background, deactivated chips
          700: '#1B2E5C', // Dark elements, headers, tooltips, cards on dark
          900: '#0B1B3F', // Primary navy brand, navigation, path tracks, book cover
        },
        paper: '#FBF6EC', // Warm texturized paper background (Journey Book screens ONLY)
        surface: '#FFFFFF', // Clean dashboard/workspace/academy canvas background
        accent: {
          coral: '#F2545B',  // Blocked / Not Started states, warnings
          amber: '#F2A93B',  // In Progress states, level unlock guides
          teal: '#2BB8A6',   // Financial documents, funding metrics
          violet: '#7C5CF2', // AI-generated content (Sparkle badge/sparkle borders)
          green: '#2E9E5B',  // Verified task, completed levels, metrics
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Source Serif 4', 'Georgia', 'serif'], // Journey Book contexts
        sans: ['General Sans', 'Inter', 'system-ui', 'sans-serif'], // Standard App OS
        mono: ['IBM Plex Mono', 'Courier New', 'monospace'], // KPI trackers, scores, timestamps
      },
      transitionDuration: {
        book: '400ms', // Page flip velocity
        ui: '180ms',   // Regular menu elements
      }
    }
  }
}
```

---

## 3. Persistent Local Database & State Strategy

### Dexie.js Schema (`src/lib/db.ts`)
For document content storage, mock files, text logs, and chats.
```typescript
import Dexie, { type Table } from 'dexie';

export interface DocumentRecord {
  id: string;
  category: string; // Financial, Pitch deck, Research papers, Customer interviews, etc.
  title: string;
  tags: string[];
  fileUrl?: string;
  fileSize?: string;
  analyzedAt?: string;
  extractedSummary?: {
    problemStatement?: string;
    targetAudience?: string;
    competitors?: string;
    revenueModel?: string;
    stage?: string;
    tech?: string;
    team?: string;
    risks?: string;
    opportunities?: string;
  };
}

export interface ChatMessage {
  id: string;
  mentorId: string;
  sender: 'founder' | 'mentor';
  text: string;
  timestamp: number;
  linkedDocumentId?: string;
}

export interface BookSubmission {
  levelId: number;
  scannedText: string;
  capturedImageUrl?: string;
  status: 'pending' | 'needs_revision' | 'approved';
  aiFeedback?: string;
  submittedAt: string;
}

class StartupDB extends Dexie {
  documents!: Table<DocumentRecord>;
  chats!: Table<ChatMessage>;
  submissions!: Table<BookSubmission>;

  constructor() {
    super('StartupDB');
    this.version(1).stores({
      documents: 'id, category, analyzedAt',
      chats: 'id, mentorId, timestamp',
      submissions: 'levelId, status',
    });
  }
}

export const db = new StartupDB();
```

### Zustand Store (`src/store/useStartupStore.ts`)
Controls user parameters, overall settings, active level progress, and builder tasks.
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BuilderTask {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  linkedTo?: { type: 'document' | 'level'; id: string };
  aiRecommendationReason?: string;
}

interface StartupState {
  founderName: string;
  startupName: string;
  startupLogo: string | null;
  stage: 'Idea' | 'Validating' | 'Building' | 'Launched' | 'Scaling';
  inviteCode: string | null;
  mentorOrg: string | null;
  currentJourneyLevel: number; // 1 to 15
  bookLinked: boolean;
  score: number; // 0-100
  builderTasks: BuilderTask[];
  // Actions
  updateProfile: (profile: Partial<StartupState>) => void;
  unlockNextLevel: () => void;
  updateTaskStatus: (id: string, status: BuilderTask['status']) => void;
  addTask: (task: BuilderTask) => void;
  recalculateScore: () => void;
}
```

---

## 4. Phase-by-Phase Architectural Roadmap

### Phase 1: Environment Setup & Core Configs
*Setting up directory structures, compiling custom assets, and generating the tailwind tokens.*
- **Action Items**: Setup folder structures, import Web Fonts (Fraunces & Inter), write the `tailwind.config.js` and initialize Zustand/Dexie database wrappers. Hydrate stores with structured mock profiles.
- **Key Files**: `src/styles/index.css`, `src/lib/db.ts`, `src/store/useStartupStore.ts`, `src/mockData/fixtures.ts`.
- **Target Skills**: `ui-setup`, `ui-tokens`, `zustand-store-ts`.

### Phase 2: Core Layouts, Routing, & AppShell
*The container that switches between a mobile bottom bar and a desktop sidebar.*
- **Action Items**: Build the responsive responsive layout `AppShell`. Setup React Router DOM, dynamic top bars displaying the startup name/KPI score chips, notifications trays, and the persistent floating mentor dialogue action bubble.
- **Key Files**: `src/components/AppShell.tsx`, `src/components/NotificationPanel.tsx`, `src/App.tsx`.
- **Target Skills**: `ux-flow`, `ui-pattern`, `react-patterns`.

### Phase 3: Fake AI Services & Data Extractors
*The core simulation engine for OCR, file ingestion analysis, and mentor dialogue.*
- **Action Items**: Create the mock database engine `fake-analysis.ts` with randomized processing thresholds (1.5s delay to trigger OCR reading states). Build `fake-ai.ts` containing response banks for the 10 mentors mapping replies directly to metadata variables inside the workspace documents.
- **Key Files**: `src/lib/fake-analysis.ts`, `src/lib/fake-ai.ts`, `src/mockData/mentorsData.ts`.
- **Target Skills**: `react-patterns`, `concise-planning`.

### Phase 4: Startup Workspace & Knowledge Base (Module B & C)
*The digital vault for document indexing and inline metadata modification.*
- **Action Items**: Build the Documents list screen supporting categorical filter chips. Scaffold the drop-file container showing full status steps: `idle` ➔ `uploading` ➔ `processing` (AI reading state animation) ➔ `extracted_summary`. Create inline form interfaces supporting profile detail edits. Construct the Knowledge Base panel showing AI cards marked with violet borders.
- **Key Files**: `src/app/workspace/WorkspaceHome.tsx`, `src/app/workspace/DocumentsTab.tsx`, `src/app/workspace/KnowledgeBase.tsx`, `src/components/DocumentUploadCard.tsx`.
- **Target Skills**: `ui-component`, `ux-feedback`, `ux-copy`.

### Phase 5: Journey Book & Page-Turn Interactions (Module E)
*The core ritual elements showing the Duolingo winding path and paper-textured UI.*
- **Action Items**: Code the dynamic winding level path tracking completed (green check), current (pulsing yellow highlights), and locked nodes. Build level view transitions using Framer Motion mimicking page-turning animations. Setup camera/scanner simulators with screen overlays, scanning progress states, and actionable feedback boxes showing pass/fail conditions.
- **Key Files**: `src/app/journey/JourneyHome.tsx`, `src/app/journey/LevelDetail.tsx`, `src/app/journey/ScannerMock.tsx`, `src/components/UnlockCelebration.tsx`.
- **Target Skills**: `ui-motion` (or animation principles), `ui-page`, `ux-persuasion-engineer`.

### Phase 6: Interactive AI Mentors & Chat Hubs (Module D)
*The communication centers connecting to the 10 distinct vertical profiles.*
- **Action Items**: Build the Mentor selection dashboard highlighting active specialties. Construct chatbot screens showing current reference documents. Setup typing animation modules and allow founders to pin recommendations directly into Builder Tasks or export transcripts into Workspace archives.
- **Key Files**: `src/app/mentor/MentorHub.tsx`, `src/app/mentor/ChatContainer.tsx`, `src/components/TypingIndicator.tsx`.
- **Target Skills**: `ui-pattern`, `ux-copy`, `react-patterns`.

### Phase 7: Startup Builder & Dashboard analytics (Module A & F)
*The master dashboards showing startup scores and tasks.*
- **Action Items**: Code the interactive Startup Score ring. Implement Recharts panels showing metrics. Build the list widgets highlighting tasks based on data gaps in the profile database.
- **Key Files**: `src/app/dashboard/DashboardHome.tsx`, `src/app/builder/BuilderHome.tsx`, `src/components/ScoreChart.tsx`.
- **Target Skills**: `ui-component`, `react-component-performance`.

### Phase 8: Custom Document Generation (Module H)
*Form engines converting database schemas into physical designs.*
- **Action Items**: Construct selection panels listing document templates (e.g. BMC, SWOT, DPR). Code wizard panels highlighting inputs preloaded from database fields with custom badges. Build layouts rendering visual representations (SWOT grids, BMC blocks).
- **Key Files**: `src/app/generator/GeneratorHome.tsx`, `src/app/generator/DocWizard.tsx`, `src/components/DocumentPreviewFrame.tsx`.
- **Target Skills**: `ui-component`, `ui-review`.

### Phase 9: Academy, Community, & Meeting modules (Module G, I, J)
*Curriculum structures and auxiliary networks.*
- **Action Items**: Build the Academy screen showing modules, video elements, quizzes, and score cards. Code community bulletin boards. Create appointment lists showing action-point templates.
- **Key Files**: `src/app/academy/AcademyHome.tsx`, `src/app/community/Feed.tsx`, `src/app/meetings/MeetingsList.tsx`.
- **Target Skills**: `ui-page`, `ux-feedback`.

### Phase 10: PWA Offline Frameworks & Asset Compilation
*Local operational integrity guarantees.*
- **Action Items**: Configure `vite-plugin-pwa`. Design standalone Offline notification layouts. Capture `beforeinstallprompt` objects to display custom installation drawers.
- **Key Files**: `public/manifest.json`, `src/pwa/SWRegistrar.tsx`, `src/components/InstallPrompt.tsx`.
- **Target Skills**: `windows-shell-reliability`, `react-patterns`.

---

## 5. Specific Skill Mapping Directives

When building components and interactions, utilize the following specific skills for best results:

1. **Setup and Token Ingestion**:
   - Use `ui-setup` to establish Tailwind configurations.
   - Use `ui-tokens` to audit HEX structures and typography values.
2. **Component Scaffolding**:
   - Use `ui-component` and `ui-pattern` for common components (e.g., status chips, chat bubbles, document cards).
   - Use `react-patterns` to handle state callbacks and React Hooks safely.
3. **Animations and Celebrations**:
   - For page-turns and winding level maps, apply Framer Motion concepts using design motion principles (`prefers-reduced-motion` compliance).
4. **Copywriting and Conversational Tone**:
   - Use `ux-copy` to write mentor voices (formal vs. casual) and system messages (inviting, actionable empty states).
5. **Flow Audits and Accessibility**:
   - Use `ux-flow` and `ui-a11y` to check screen sequences, color contrasts, screen sizes, and keyboard accessibility.
6. **Debugging and Optimizing Performance**:
   - Use `systematic-debugging` and `react-component-performance` for slow states, data delays, and local storage limits.

---

## 6. Verification and Testing Guidelines

Ensure that the following operations are verified before completing the build:
1. **Zustand & IndexedDB Storage Sync**: Confirm that page reloads maintain user records, document extracts, active milestones, and chat lists.
2. **Interactive Mock OCR Sequences**: Upload a document, watch the "AI is reading..." loading state, verify that the Knowledge Base updates, and confirm the document tags.
3. **Founder Journey Gated Steps**: Verify that locked level nodes prevent access, current nodes display scanning prompts, failed scans show review alerts, and approved scans trigger the unlock celebration.
4. **Contextual Mentor Dialogue**: Confirm that mentors reference uploaded documents and display loading indicators.
5. **Form Preloading Operations**: Open the Pitch Deck wizard, confirm that inputs display auto-fill tags, and verify that the canvas output formats correctly.
6. **Offline Operations**: Toggle the network indicator in browser dev tools, verify that index screens load, and check that standard operations show the offline notice.
