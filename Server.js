const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

let submissions = {}; // salva usuários que enviaram no dia

app.post('/checklist', (req, res) => {
  const data = req.body;
  const key = `${data.usuario}-${data.data}`;

  if (submissions[key]) {
    return res.status(400).json({ message: 'Checklist já enviado hoje.' });
  }

  submissions[key] = true;

  const texto = `Usuário: ${data.usuario}\nMoto: ${data.moto}\nData: ${data.data}\nHora: ${data.hora}\n\nChecklist:\n${data.checklist.join('\n')}\n\n---\n`;

  const filePath = path.join(__dirname, 'logui2.txt');
  fs.appendFile(filePath, texto, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar checklist.' });
    res.json({ message: 'Checklist salvo com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
