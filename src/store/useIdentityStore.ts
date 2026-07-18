import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ──────────────────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────────────────

export type DiscoveryPhase =
  | 'not_started'
  | 'inspiration'
  | 'personality'
  | 'values'
  | 'passions'
  | 'skills'
  | 'lifeStory'
  | 'problems'
  | 'profileReveal'
  | 'roadmap'
  | 'completed';

export interface PersonalityDimension {
  /** e.g. "Problem Solving", "Leadership", "Risk Tolerance" */
  dimension: string;
  /** The selected answer label */
  answer: string;
  /** Numeric score 0-100 mapping the answer on the dimension spectrum */
  score: number;
}

export interface ValueItem {
  id: string;
  label: string;
  icon: string;
  description: string;
  rank: number; // 1 = highest priority
}

export interface PassionItem {
  id: string;
  industry: string;
  icon: string;
  excitementLevel: number; // 1-5
  reason?: string; // optional free text: "why does this excite you?"
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface SkillItem {
  id: string;
  name: string;
  icon: string;
  level: SkillLevel;
  portfolioUrl?: string;
}

export interface LifeStoryEntry {
  questionId: string;
  question: string;
  answer: string;
}

export interface ProblemEntry {
  id: string;
  domain: string; // "daily life", "college", "healthcare", "agriculture", "education", etc.
  description: string;
  passionScore: number; // 1-5 how much they care
  createdAt: number;
}

export interface EntrepreneurProfile {
  archetype: string; // e.g. "Healthcare Innovator", "EdTech Pioneer"
  tagline: string; // One-line description
  topTraits: string[]; // Top 3 personality traits
  topValues: string[]; // Top 3 values
  strengths: string[]; // Top 3-4 skills
  growthAreas: string[]; // 2-3 skills to develop
  primaryPassion: string; // Dominant industry
  problemFocus: string; // Most resonant problem domain
  suggestedRoadmapFocus: string; // e.g. "Healthcare systems research"
  generatedAt: number;
}

export interface HunchBookEntry {
  id: string;
  type: 'text' | 'voice' | 'photo' | 'sketch';
  content: string; // text content or transcription
  imageUrl?: string;
  tags: string[]; // AI-suggested tags
  aiTheme?: string; // AI-detected theme category
  createdAt: number;
}

// ──────────────────────────────────────────────────────────
// STORE INTERFACE
// ──────────────────────────────────────────────────────────

interface IdentityState {
  // Journey state
  discoveryPhase: DiscoveryPhase;
  discoveryStartedAt: number | null;
  discoveryCompletedAt: number | null;

  // Phase 2: Identity Discovery
  personality: PersonalityDimension[];
  values: ValueItem[];
  passions: PassionItem[];
  skills: SkillItem[];
  lifeStory: LifeStoryEntry[];

  // Phase 3: Problem Discovery
  problems: ProblemEntry[];

  // Phase 5: Entrepreneur Profile
  entrepreneurProfile: EntrepreneurProfile | null;

  // Phase 4: Hunch Book (accessible anytime)
  hunchBook: HunchBookEntry[];

  // ── Actions ──
  setDiscoveryPhase: (phase: DiscoveryPhase) => void;
  startDiscovery: () => void;
  completeDiscovery: () => void;

  // Personality
  setPersonality: (dimensions: PersonalityDimension[]) => void;
  addPersonalityAnswer: (dimension: PersonalityDimension) => void;

  // Values
  setValues: (values: ValueItem[]) => void;

  // Passions
  setPassions: (passions: PassionItem[]) => void;

  // Skills
  setSkills: (skills: SkillItem[]) => void;
  updateSkillLevel: (skillId: string, level: SkillLevel) => void;

  // Life Story
  addLifeStoryEntry: (entry: LifeStoryEntry) => void;
  setLifeStory: (entries: LifeStoryEntry[]) => void;

  // Problems
  addProblem: (problem: ProblemEntry) => void;
  setProblems: (problems: ProblemEntry[]) => void;
  removeProblem: (id: string) => void;

  // Entrepreneur Profile
  setEntrepreneurProfile: (profile: EntrepreneurProfile) => void;

  // Hunch Book
  addHunchEntry: (entry: HunchBookEntry) => void;
  removeHunchEntry: (id: string) => void;
  updateHunchTags: (id: string, tags: string[], aiTheme?: string) => void;

  // Reset
  resetIdentity: () => void;
}

// ──────────────────────────────────────────────────────────
// DEFAULTS
// ──────────────────────────────────────────────────────────

const initialState = {
  discoveryPhase: 'not_started' as DiscoveryPhase,
  discoveryStartedAt: null as number | null,
  discoveryCompletedAt: null as number | null,
  personality: [] as PersonalityDimension[],
  values: [] as ValueItem[],
  passions: [] as PassionItem[],
  skills: [] as SkillItem[],
  lifeStory: [] as LifeStoryEntry[],
  problems: [] as ProblemEntry[],
  entrepreneurProfile: null as EntrepreneurProfile | null,
  hunchBook: [] as HunchBookEntry[],
};

// ──────────────────────────────────────────────────────────
// STORE
// ──────────────────────────────────────────────────────────

export const useIdentityStore = create<IdentityState>()(
  persist(
    (set) => ({
      ...initialState,

      // ── Phase management ──
      setDiscoveryPhase: (phase) => set({ discoveryPhase: phase }),

      startDiscovery: () =>
        set({
          discoveryPhase: 'inspiration',
          discoveryStartedAt: Date.now(),
        }),

      completeDiscovery: () =>
        set({
          discoveryPhase: 'completed',
          discoveryCompletedAt: Date.now(),
        }),

      // ── Personality ──
      setPersonality: (dimensions) => set({ personality: dimensions }),

      addPersonalityAnswer: (dimension) =>
        set((state) => ({
          personality: [
            ...state.personality.filter((d) => d.dimension !== dimension.dimension),
            dimension,
          ],
        })),

      // ── Values ──
      setValues: (values) => set({ values }),

      // ── Passions ──
      setPassions: (passions) => set({ passions }),

      // ── Skills ──
      setSkills: (skills) => set({ skills }),

      updateSkillLevel: (skillId, level) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === skillId ? { ...s, level } : s
          ),
        })),

      // ── Life Story ──
      addLifeStoryEntry: (entry) =>
        set((state) => ({
          lifeStory: [
            ...state.lifeStory.filter((e) => e.questionId !== entry.questionId),
            entry,
          ],
        })),

      setLifeStory: (entries) => set({ lifeStory: entries }),

      // ── Problems ──
      addProblem: (problem) =>
        set((state) => ({
          problems: [...state.problems, problem],
        })),

      setProblems: (problems) => set({ problems }),

      removeProblem: (id) =>
        set((state) => ({
          problems: state.problems.filter((p) => p.id !== id),
        })),

      // ── Entrepreneur Profile ──
      setEntrepreneurProfile: (profile) =>
        set({ entrepreneurProfile: profile }),

      // ── Hunch Book ──
      addHunchEntry: (entry) =>
        set((state) => ({
          hunchBook: [entry, ...state.hunchBook],
        })),

      removeHunchEntry: (id) =>
        set((state) => ({
          hunchBook: state.hunchBook.filter((e) => e.id !== id),
        })),

      updateHunchTags: (id, tags, aiTheme) =>
        set((state) => ({
          hunchBook: state.hunchBook.map((e) =>
            e.id === id ? { ...e, tags, aiTheme: aiTheme ?? e.aiTheme } : e
          ),
        })),

      // ── Reset ──
      resetIdentity: () => set(initialState),
    }),
    {
      name: 'im-entrepreneur-identity',
    }
  )
);
