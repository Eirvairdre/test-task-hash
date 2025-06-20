'use client';
// Отключение кэширования
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Container } from '@mui/material';
import HashForm from '@/components/hash/HashForm';
import HashResult from '@/components/hash/HashResult';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { Spinner } from '@/components/ui/Spinner';
import { hashApi } from '@/lib/api/hash';
import { HashAlgorithm } from '@/types/hash';

export default function HashPage() {
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (str: string, algo: HashAlgorithm) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await hashApi.hashString({ str, algo });
      setResult(response.hash);
    } catch (err) {
      // Сохраняем ошибку для отображения
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <HashForm onSubmit={handleSubmit} isLoading={isLoading} />
      <HashResult hash={result} />
      {isLoading && <Spinner fullScreen />}
      <ErrorModal
        open={!!error}
        error={error || ''}
        onClose={() => setError(null)}
      />
    </Container>
  );
}
