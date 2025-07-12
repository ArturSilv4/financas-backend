const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const transactionsRoutes = require("./routes/transactions");

dotenv.config();

app.get('/', (req, res) => {
  res.send('API de Finanças está online ✅');
});


const app = express();
app.use(cors());
app.use(express.json());

app.use("/transactions", transactionsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
