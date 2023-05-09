const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;
const hostname = '127.0.0.1';

// Endpoint para ler informações de um usuário específico com base em seu ID
app.get('/catalogoOwners', (req, res) => {
  const db = new sqlite3.Database('bancoPan.db');
  const id = req.params.id;

  db.all(`SELECT * FROM Catalogo_Dados_Owners_Stewards WHERE field6 = '03/01/2021'`, (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Erro ao buscar usuário');
    } else if (!row) {
      res.status(404).send('Usuário não encontrado');
    } else {
      res.json(row);
    }
  });

  db.close();
});



// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta http://${hostname}:${PORT}`);
});
