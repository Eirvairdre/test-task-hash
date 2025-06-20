'use client';

import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { authApi } from '@/lib/api/auth';

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Hash Service
          </Typography>
          <Typography variant="body1" gutterBottom>
            Войдите, чтобы продолжить
          </Typography>
          <Button
            variant="contained"
            size="large"
            // Редирект на Яндекс для аутентификации
            onClick={() => authApi.loginWithYandex()}
          >
            Войти через Яндекс
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
