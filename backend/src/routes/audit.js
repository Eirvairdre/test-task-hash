const express = require('express');
const { requireAdmin } = require('../middlewares/auth');
const AuditLog = require('../models/auditLog');

const router = express.Router();

// Получить аудит-логи с пагинацией (только для админа)
router.get('/', requireAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const logs = await AuditLog.getAll({ limit, offset });
  const total = await AuditLog.count();
  res.json({ logs, total, page, pages: Math.ceil(total / limit) });
});

// Удалить один лог по id (только для админа)
router.delete('/:id', requireAdmin, async (req, res) => {
  await AuditLog.deleteById(req.params.id);
  res.json({ ok: true });
});

// Очистить все логи (только для админа, с подтверждением)
router.delete('/', requireAdmin, async (req, res) => {
  if (req.query.confirm !== 'yes') {
    return res.status(400).json({ error: 'Требуется подтверждение ?confirm=yes' });
  }
  await AuditLog.deleteAll();
  res.json({ ok: true });
});

module.exports = router; 