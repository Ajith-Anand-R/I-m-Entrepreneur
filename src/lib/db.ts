import Dexie, { type Table } from 'dexie';

export interface DocumentRecord {
  id: string;
  category: string; // Financial, Pitch deck, Research papers, Customer interviews, etc.
  title: string;
  tags: string[];
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

// ── Identity Discovery Tables ──────────────────────────────

export interface IdentityResponseRecord {
  id: string;
  chapter: 'personality' | 'values' | 'passions' | 'skills' | 'lifeStory' | 'problems';
  questionId: string;
  question: string;
  answer: string;
  aiReflection?: string;
  answeredAt: number;
}

export interface HunchBookRecord {
  id: string;
  type: 'text' | 'voice' | 'photo' | 'sketch';
  content: string;
  imageUrl?: string;
  tags: string[];
  aiTheme?: string;
  createdAt: number;
}

export interface ProblemLibraryRecord {
  id: string;
  domain: string;
  description: string;
  passionScore: number;
  relatedPassions: string[];
  createdAt: number;
}

class StartupDB extends Dexie {
  documents!: Table<DocumentRecord>;
  chats!: Table<ChatMessage>;
  submissions!: Table<BookSubmission>;
  identityResponses!: Table<IdentityResponseRecord>;
  hunchBookEntries!: Table<HunchBookRecord>;
  problemLibrary!: Table<ProblemLibraryRecord>;

  constructor() {
    super('StartupDB');
    this.version(1).stores({
      documents: 'id, category, analyzedAt',
      chats: 'id, mentorId, timestamp',
      submissions: 'levelId, status',
    });
    // v2: Identity Discovery tables
    this.version(2).stores({
      documents: 'id, category, analyzedAt',
      chats: 'id, mentorId, timestamp',
      submissions: 'levelId, status',
      identityResponses: 'id, chapter, questionId, answeredAt',
      hunchBookEntries: 'id, aiTheme, createdAt',
      problemLibrary: 'id, domain, passionScore, createdAt',
    });
  }
}

export const db = new StartupDB();
