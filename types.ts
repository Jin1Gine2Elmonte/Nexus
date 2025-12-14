
export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  data: string; // Base64 string
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean; // If true, this is the raw "DeepSeek" style thought process
  thinkingDuration?: number;
  reviewStatus?: 'pending' | 'approved' | 'refined';
  attachments?: Attachment[];
  groundingMetadata?: {
    groundingChunks: GroundingChunk[];
  };
  audioData?: string; // Base64 encoded audio
}

export interface NodeStatus {
  id: number;
  type: 'worker_logic' | 'worker_creative' | 'worker_consciousness' | 'worker_narrator' | 'worker_sentinel' | 'worker_triad' | 'worker_archivist' | 'reviewer_logic' | 'reviewer_narrative';
  status: 'idle' | 'analyzing' | 'dreaming' | 'flow' | 'scanning' | 'synthesizing' | 'weaving' | 'reviewing' | 'archiving';
  load: number; // 0-100
  specialization: string;
  currentTask?: string;
}

export enum ProcessingStage {
  IDLE = 'IDLE',
  DISTRIBUTING = 'DISTRIBUTING',   // Sending to nodes
  ANALYZING = 'ANALYZING',         // Logic Swarm Active
  CREATING = 'CREATING',           // Genesis Swarm Active
  FLOWING = 'FLOWING',             // Consciousness Swarm Active
  ARCHIVING = 'ARCHIVING',         // Pale Archive Active
  WEAVING = 'WEAVING',             // Narrative Titans Active
  SYNTHESIZING = 'SYNTHESIZING',   // Merging
  REVIEWING = 'REVIEWING',         // Reviewer nodes
  COMPLETE = 'COMPLETE',
  SPEAKING = 'SPEAKING'            // Audio generation
}

export interface OmniResponse {
  thoughtProcess: string;
  finalResponse: string;
  groundingMetadata?: any;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  nodeId: string;
  message: string;
  level: 'info' | 'warn' | 'success' | 'error' | 'cosmic' | 'golden' | 'pale' | 'cyan';
}

export interface SyncStatus {
    isSynced: boolean;
    lastSyncTime: number | null;
    cloudProvider: 'none' | 'drive';
    isSyncing: boolean;
}
