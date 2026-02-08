
export type Role = 'user' | 'model';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  timestamp: Date;
  sources?: GroundingSource[];
  isStreaming?: boolean;
}

export interface InvestmentAccount {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}
