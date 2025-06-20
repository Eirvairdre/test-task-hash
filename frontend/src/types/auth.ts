export type UserRole = 'admin' | 'user';

export interface User {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
} 