export interface User {
  username: string;
  id: string;
}

export interface ScriptItem {
  id: string;
  title: string;
  code: string;
  createdAt: number;
  userId: string;
  tags?: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum AppView {
  HOME = 'HOME',
  GENERATOR = 'GENERATOR',
  LIBRARY = 'LIBRARY',
  LOGIN = 'LOGIN'
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}