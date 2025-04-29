export interface Topic {
  id: string;
  name: string;
  color: string;
  description: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  topicId: string;
  imageUrl?: string;
  timestamp: number;
}

export interface UserPreference {
  topicId: string;
  interactionCount: number;
  lastInteraction: number;
}

export interface UserState {
  preferences: UserPreference[];
  totalInteractions: number;
  bubbleScore: number; // 0-100, higher means more in a bubble
}
