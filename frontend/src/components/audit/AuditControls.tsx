'use client';

import { Button, Box } from '@mui/material';
import { DeleteSweep } from '@mui/icons-material';

interface Props {
  onClearAll: () => void;
  onBack: () => void;
}

export const AuditControls = ({ onClearAll, onBack }: Props) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
      <Button variant="outlined" onClick={onBack}>
        К хэшам
      </Button>
      <Button
        variant="contained"
        color="error"
        startIcon={<DeleteSweep />}
        onClick={onClearAll}
      >
        Очистить все логи
      </Button>
    </Box>
  );
};

export default AuditControls; 