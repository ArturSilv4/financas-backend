const express = require('express');
const cors = require('cors');
const db = require('./db');
const transactionsRoutes = require('./routes/transactions');

const app = express(); // <- isso tem que vir antes de qualquer uso do `app`

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Finanças está online ✅');
});

app.use('/transactions', transactionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
