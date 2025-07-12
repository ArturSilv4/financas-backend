const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  const { month, year } = req.query;
  try {
    const result = await db.query(
      "SELECT * FROM transactions WHERE EXTRACT(MONTH FROM date) = $1 AND EXTRACT(YEAR FROM date) = $2 ORDER BY date DESC",
      [month, year]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { type, value, category, description, date } = req.body;
  try {
    const result = await db.query(
      "UPDATE transactions SET type = $1, value = $2, category = $3, description = $4, date = $5 WHERE id = $6 RETURNING *",
      [type, value, category, description, date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
