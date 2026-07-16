import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BuilderTask {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  linkedTo?: { type: 'document' | 'level'; id: string };
  aiRecommendationReason?: string;
}

export interface StartupProfile {
  founderName: string;
  startupName: string;
  startupLogo: string | null;
  stage: 'Idea' | 'Validating' | 'Building' | 'Launched' | 'Scaling';
  inviteCode: string | null;
  mentorOrg: string | null;
  vision: string;
  mission: string;
  problemStatement: string;
  solution: string;
  businessModel: string;
}

interface StartupState extends StartupProfile {
  currentJourneyLevel: number; // 1 to 15
  bookLinked: boolean;
  score: number; // 0-100
  builderTasks: BuilderTask[];
  // Actions
  updateProfile: (profile: Partial<StartupProfile>) => void;
  unlockNextLevel: () => void;
  updateTaskStatus: (id: string, status: BuilderTask['status']) => void;
  addTask: (task: BuilderTask) => void;
  setTasks: (tasks: BuilderTask[]) => void;
  recalculateScore: () => void;
  setBookLinked: (linked: boolean) => void;
  resetState: () => void;
}

const defaultProfile: StartupProfile = {
  founderName: 'Ajith',
  startupName: 'EcoSphere Solutions',
  startupLogo: null,
  stage: 'Validating',
  inviteCode: 'BG-MOCK-2026',
  mentorOrg: 'Beyond Guidance Partner Accelerator',
  vision: 'Empowering local communities to eliminate single-use plastic waste through circular economy packaging.',
  mission: 'To deploy 10,000 smart refill kiosks across urban centers by 2027.',
  problemStatement: 'Single-use plastic bottles create millions of tons of waste, and current recycling methods recover less than 9% of it, causing environmental degradation.',
  solution: 'A decentralized network of automated refill kiosks dispensing liquid cleaning and personal care products in reusable glass bottles.',
  businessModel: 'B2B subscription model for retail locations hosting the kiosks, with direct-to-consumer per-milliliter refill revenue.',
};

const initialTasks: BuilderTask[] = [
  {
    id: 'task-1',
    title: 'Define core startup vision and mission values',
    status: 'completed',
    linkedTo: { type: 'level', id: '1' },
    aiRecommendationReason: 'Completed as part of Level 1 verification.',
  },
  {
    id: 'task-2',
    title: 'Conduct customer validation interviews (min. 10)',
    status: 'in_progress',
    linkedTo: { type: 'level', id: '5' },
    aiRecommendationReason: 'Required to pass Level 5: Customer Validation. We suggest interviewing retail outlet managers.',
  },
  {
    id: 'task-3',
    title: 'Draft standard NDA for prospective partners',
    status: 'not_started',
    linkedTo: { type: 'document', id: 'nda' },
    aiRecommendationReason: 'Legal structures missing. Generate using the AI Document Generator to secure partner talks.',
  },
  {
    id: 'task-4',
    title: 'Scaffold initial financial runway forecast model',
    status: 'not_started',
    linkedTo: { type: 'document', id: 'financial-projection' },
    aiRecommendationReason: 'Required for Level 10 (Financial Planning). No financial documents have been uploaded yet.',
  }
];

export const useStartupStore = create<StartupState>()(
  persist(
    (set, get) => ({
      ...defaultProfile,
      currentJourneyLevel: 3, // Starts "alive" at Level 3 unlocked
      bookLinked: true,
      score: 45,
      builderTasks: initialTasks,

      updateProfile: (profile) => {
        set((state) => {
          const updated = { ...state, ...profile };
          return updated;
        });
        get().recalculateScore();
      },

      unlockNextLevel: () => {
        set((state) => {
          const nextLevel = Math.min(state.currentJourneyLevel + 1, 15);
          return { currentJourneyLevel: nextLevel };
        });
        get().recalculateScore();
      },

      updateTaskStatus: (id, status) => {
        set((state) => ({
          builderTasks: state.builderTasks.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        }));
        get().recalculateScore();
      },

      addTask: (task) => {
        set((state) => ({
          builderTasks: [...state.builderTasks.filter((t) => t.id !== task.id), task],
        }));
        get().recalculateScore();
      },

      setTasks: (tasks) => {
        set({ builderTasks: tasks });
        get().recalculateScore();
      },

      setBookLinked: (linked) => set({ bookLinked: linked }),

      recalculateScore: () => {
        const state = get();
        
        // 1. Profile completeness (up to 30 points)
        let profilePoints = 0;
        if (state.founderName) profilePoints += 5;
        if (state.startupName) profilePoints += 5;
        if (state.vision) profilePoints += 5;
        if (state.mission) profilePoints += 5;
        if (state.problemStatement) profilePoints += 5;
        if (state.solution) profilePoints += 5;

        // 2. Journey progress (up to 40 points)
        // Level 1-15 maps to 40 points scale
        const journeyPoints = Math.round((state.currentJourneyLevel / 15) * 40);

        // 3. Builder Task completion (up to 30 points)
        const completedTasksCount = state.builderTasks.filter(t => t.status === 'completed').length;
        const totalTasksCount = state.builderTasks.length || 1;
        const taskPoints = Math.round((completedTasksCount / totalTasksCount) * 30);

        const totalScore = Math.min(100, profilePoints + journeyPoints + taskPoints);
        set({ score: totalScore });
      },

      resetState: () => {
        set({
          ...defaultProfile,
          currentJourneyLevel: 3,
          bookLinked: true,
          score: 45,
          builderTasks: initialTasks,
        });
      },
    }),
    {
      name: 'im-entrepreneur-store',
      partialize: (state) => ({
        founderName: state.founderName,
        startupName: state.startupName,
        startupLogo: state.startupLogo,
        stage: state.stage,
        inviteCode: state.inviteCode,
        mentorOrg: state.mentorOrg,
        vision: state.vision,
        mission: state.mission,
        problemStatement: state.problemStatement,
        solution: state.solution,
        businessModel: state.businessModel,
        currentJourneyLevel: state.currentJourneyLevel,
        bookLinked: state.bookLinked,
        score: state.score,
        builderTasks: state.builderTasks,
      }),
    }
  )
);
