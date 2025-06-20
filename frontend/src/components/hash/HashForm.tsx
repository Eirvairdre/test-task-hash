'use client';
import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { HashAlgorithm } from '@/types/hash';
import { validateHashString } from '@/lib/utils/validation';

interface Props {
  onSubmit: (str: string, algo: HashAlgorithm) => void;
  isLoading: boolean;
}

// Доступные алгоритмы
const algorithms: HashAlgorithm[] = ['md5', 'sha1', 'sha256'];

// Форма для хеширования
export const HashForm = ({ onSubmit, isLoading }: Props) => {
  const [str, setStr] = useState('');
  const [algo, setAlgo] = useState<HashAlgorithm>('sha256');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение
    const validationError = validateHashString(str);
    if (validationError) {
      setError(validationError); // Показать ошибку
      return;
    }
    setError(null); // Сбросить ошибку
    onSubmit(str, algo); // Вызвать колбэк
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto' }}>
      <FormControl fullWidth error={!!error} sx={{ mb: 2 }}>
        <TextField
          label="Строка для хеширования"
          value={str}
          onChange={(e) => setStr(e.target.value)}
          disabled={isLoading}
          error={!!error}
          helperText={error}
          multiline
          rows={4}
        />
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Алгоритм</InputLabel>
        <Select
          value={algo}
          label="Алгоритм"
          onChange={(e) => setAlgo(e.target.value as HashAlgorithm)}
          disabled={isLoading}
        >
          {algorithms.map((a) => (
            <MenuItem key={a} value={a}>
              {a.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>Выберите алгоритм хеширования</FormHelperText>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        // Деактивация кнопки при загрузке или пустом поле
        disabled={isLoading || !str.trim()}
      >
        Хешировать
      </Button>
    </Box>
  );
};

export default HashForm;
