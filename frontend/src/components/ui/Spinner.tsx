import { Box, CircularProgress } from '@mui/material';

interface Props {
  fullScreen?: boolean;
}

export const Spinner = ({ fullScreen = false }: Props) => {
  // Полноэкранный спиннер
  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Обычный (встроенный) спиннер
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <CircularProgress />
    </Box>
  );
};