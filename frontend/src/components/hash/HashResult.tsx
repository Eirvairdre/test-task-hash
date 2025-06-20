'use client';
import { useState } from 'react';
import { Box, Paper, Typography, IconButton, Snackbar } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

interface Props {
  hash: string | null;
}

export const HashResult = ({ hash }: Props) => {
  const [showCopied, setShowCopied] = useState(false);

  // Не рендерить, если нет хеша
  if (!hash) return null;

  // Копирование хеша в буфер обмена
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setShowCopied(true); // Показать уведомление
    } catch (error) {
      console.error('Ошибка при копировании:', error);
    }
  };

  return (
    <>
      <Paper sx={{ p: 2, mt: 2, maxWidth: 600, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body1"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: 'monospace',
              wordBreak: 'break-all',
            }}
          >
            {hash}
          </Typography>
          <IconButton onClick={handleCopy} size="small">
            <ContentCopy />
          </IconButton>
        </Box>
      </Paper>

      <Snackbar
        open={showCopied}
        autoHideDuration={2000}
        onClose={() => setShowCopied(false)}
        message="Скопировано в буфер обмена"
      />
    </>
  );
};

export default HashResult;
