export type HashAlgorithm = 'md5' | 'sha1' | 'sha256';

export interface HashRequest {
  str: string;
  algo: HashAlgorithm;
}

export interface HashResponse {
  hash: string;
}

export interface HashState {
  result: string | null;
  isLoading: boolean;
  error: string | null;
} 