
export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  data: string; // Base64 string
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
}

export interface NodeStatus {
  id: number;
  type: 'worker_logic' | 'worker_creative' | 'worker_consciousness' | 'reviewer_logic' | 'reviewer_narrative';
  status: 'idle' | 'analyzing' | 'dreaming' | 'flow' | 'reviewing';
  load: number; // 0-100
  specialization: string;
  currentTask?: string;
}

export enum ProcessingStage {
  IDLE = 'IDLE',
  DISTRIBUTING = 'DISTRIBUTING',   // Sending to 70 nodes
  ANALYZING = 'ANALYZING',         // Logic Swarm Active
  CREATING = 'CREATING',           // Genesis Swarm Active
  FLOWING = 'FLOWING',             // Consciousness Swarm Active
  SYNTHESIZING = 'SYNTHESIZING',   // Merging
  REVIEWING = 'REVIEWING',         // 6 Reviewer nodes
  COMPLETE = 'COMPLETE'
}

export interface OmniResponse {
  thoughtProcess: string;
  finalResponse: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  nodeId: string;
  message: string;
  level: 'info' | 'warn' | 'success' | 'error' | 'cosmic' | 'golden';
}
