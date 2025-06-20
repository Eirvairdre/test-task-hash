export interface AuditLog {
  id: number;
  user_id: number;
  email: string;
  action: string;
  details: string;
  is_error: boolean;
  created_at: string;
}

export interface AuditState {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  error: string | null;
}

export type AuditLimit = 10 | 25 | 50 | 100; 