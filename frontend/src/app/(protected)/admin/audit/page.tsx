'use client';
// Отключение кэширования
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useRouter } from 'next/navigation';
import AuditTable from '@/components/audit/AuditTable';
import AuditControls from '@/components/audit/AuditControls';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { auditApi } from '@/lib/api/audit';
import { AuditLog, AuditLimit } from '@/types/audit';

export default function AuditPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState<AuditLimit>(25);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Загрузка логов
  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const data = await auditApi.getLogs(page, limit);
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  // Перезагрузка логов при изменении страницы или лимита
  useEffect(() => {
    fetchLogs();
  }, [page, limit]);

  // Удаление лога
  const handleDeleteLog = async (id: number) => {
    setDeleteId(id); // Открыть модальное окно подтверждения
  };

  // Подтверждение удаления лога
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setIsLoading(true);
    try {
      await auditApi.deleteLog(deleteId);
      await fetchLogs(); // Обновить список
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
      setDeleteId(null); // Закрыть модальное окно
    }
  };

  // Очистка всех логов
  const handleClearAll = async () => {
    setShowClearConfirm(true); // Открыть модальное окно подтверждения
  };

  // Подтверждение очистки всех логов
  const handleConfirmClearAll = async () => {
    setIsLoading(true);
    try {
      await auditApi.deleteAllLogs();
      await fetchLogs(); // Обновить список
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
      setShowClearConfirm(false); // Закрыть модальное окно
    }
  };

  return (
    <Container>
      <AuditControls
        onClearAll={handleClearAll}
        onBack={() => router.push('/hash')}
      />
      <AuditTable
        logs={logs}
        total={total}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
        onDeleteLog={handleDeleteLog}
      />
      {isLoading && <Spinner fullScreen />}
      <ErrorModal
        open={!!error}
        error={error || ''}
        onClose={() => setError(null)}
      />
      <Modal
        open={!!deleteId}
        title="Подтверждение удаления"
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        confirmText="Удалить"
      >
        Вы действительно хотите удалить эту запись?
      </Modal>
      <Modal
        open={showClearConfirm}
        title="Подтверждение очистки"
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleConfirmClearAll}
        confirmText="Очистить"
      >
        Вы действительно хотите удалить все записи? Это действие нельзя отменить.
      </Modal>
    </Container>
  );
}