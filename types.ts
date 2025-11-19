export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isThinking?: boolean; // If true, this is the raw "DeepSeek" style thought process
  thinkingDuration?: number;
  reviewStatus?: 'pending' | 'approved' | 'refined';
}

export interface NodeStatus {
  id: number;
  type: 'worker' | 'reviewer';
  status: 'idle' | 'analyzing' | 'generating' | 'reviewing';
  load: number; // 0-100
  specialization: string;
}

export enum ProcessingStage {
  IDLE = 'IDLE',
  DISTRIBUTING = 'DISTRIBUTING', // Sending to 30 nodes
  ANALYZING = 'ANALYZING',       // "Thinking" phase
  SYNTHESIZING = 'SYNTHESIZING', // Aggregating
  REVIEWING = 'REVIEWING',       // 3 Reviewer nodes
  COMPLETE = 'COMPLETE'
}

export interface OmniResponse {
  thoughtProcess: string;
  finalResponse: string;
}