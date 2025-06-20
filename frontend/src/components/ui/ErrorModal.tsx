import { Modal } from './Modal';
import { Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  error: string;
}

// Модальное окно для вывода ошибок
export const ErrorModal = ({ open, onClose, error }: Props) => {
  return (
    <Modal
      open={open}
      title="Ошибка"
      onClose={onClose}
      confirmText="Закрыть"
      onConfirm={onClose}
    >
      <Typography color="error">{error}</Typography>
    </Modal>
  );
};
