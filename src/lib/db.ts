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
