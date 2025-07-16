const express = require("express");
const router = express.Router();
const db = require("../db");

router.get('/month', authMiddleware, async (req, res) => {
  const { year, month } = req.query;
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0); // Último dia do mês

  const transactions = await knex('transactions')
    .where({ user_id: req.user.id })
    .whereBetween('date', [
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    ])
    .orderBy('date', 'desc');

  res.json(transactions);
});

router.post("/", async (req, res) => {
  const { type, value, category, description, date } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO transactions (type, value, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [type, value, category, description, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { description, amount, type, date } = req.body;

  await knex('transactions')
    .where({ id, user_id: req.user.id })
    .update({ description, amount, type, date });

  res.json({ success: true });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM transactions WHERE id = $1", [id]);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
