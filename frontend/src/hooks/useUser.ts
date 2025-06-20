import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authApi.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        // Если пользователь не авторизован (401), API выбросит ошибку
        setUser(null);
        router.push('/login'); // Опционально: редирект на логин
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, isLoading };
} 