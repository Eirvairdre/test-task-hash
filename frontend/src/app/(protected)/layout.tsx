'use client';
import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button, CircularProgress } from '@mui/material';
import { Brightness4, Brightness7, Logout } from '@mui/icons-material';
import { useTheme } from '@/components/providers/ThemeProvider';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import Link from 'next/link';

interface Props {
  children: ReactNode;
}

// Лэйаут для защищенных страниц
export default function ProtectedLayout({ children }: Props) {
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Выход из системы
  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/login');
    } catch (error) {
      // Логирование ошибки
      console.error('Ошибка при выходе:', error);
    }
  };

  // Пока данные пользователя загружаются, показываем спиннер
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Hash Service
          </Typography>

          {/* Кнопка Админ-панели для админов */}
          {user?.role === 'admin' && (
            <Button component={Link} href="/admin/audit" color="inherit">
              Аудит
            </Button>
          )}

          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        {children}
      </Box>
    </>
  );
}
