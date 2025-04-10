const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

const users = {
  "admin": "adminsb",
  "Caique": "caiquesb",
  "Iuri": "iurisb",
  "Riquelme": "riquelmesb",
  "Leonardo": "leonardosb"
};

let submissions = {};

app.post('/checklist', (req, res) => {
  const { usuario, senha, moto, data, hora, checklist } = req.body;

  if (!users[usuario] || users[usuario] !== senha) {
    return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
  }

  const key = `${usuario}-${data}`;
  if (submissions[key] && usuario !== "admin") {
    return res.status(400).json({ message: 'Checklist já enviado hoje.' });
  }

  if (usuario !== "admin") submissions[key] = true;

  const texto = `Usuário: ${usuario}\nMoto: ${moto}\nData: ${data}\nHora: ${hora}\n\nChecklist:\n${checklist.join('\n')}\n\n---\n`;

  const filePath = path.join(__dirname, 'logui2.txt');
  fs.appendFile(filePath, texto, (err) => {
    if (err) return res.status(500).json({ message: 'Erro ao salvar checklist.' });
    res.json({ message: 'Checklist salvo com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
