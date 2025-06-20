import { ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void; // Колбэк при закрытии
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const Modal = ({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Отмена',
}: Props) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {cancelText}
        </Button>
        {onConfirm && (
          <Button onClick={onConfirm} color="primary" variant="contained">
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
