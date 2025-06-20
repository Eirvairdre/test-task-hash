'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { AuditLog, AuditLimit } from '@/types/audit';
import { formatDate } from '@/lib/utils/date';

interface Props {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: AuditLimit;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: AuditLimit) => void;
  onDeleteLog: (id: number) => void;
}

export const AuditTable = ({
  logs,
  total,
  page,
  limit,
  onPageChange,
  onLimitChange,
  onDeleteLog,
}: Props) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onLimitChange(Number(event.target.value) as AuditLimit);
    onPageChange(0); // Сброс на первую страницу
  };

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Время</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Действие</TableCell>
              <TableCell>Детали</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.created_at)}</TableCell>
                <TableCell>{log.email}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details}</TableCell>
                <TableCell>{log.is_error ? 'Ошибка' : 'Успех'}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteLog(log.id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={limit}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[10, 25, 50, 100]}
      />
    </Paper>
  );
};

export default AuditTable;
