const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Usuários e senhas simples
const users = {
  "caiquesb": "caiquesb",
  "iurisb": "iurisb",
  "riquelmesb": "riquelmesb",
  "leonardosb": "leonardosb",
  "adminsb": "adminsb"
};

// Dados dos checklists (em memória, você pode salvar em um arquivo ou banco real depois)
let checklists = {};

// Carregar dados dos checklists de um arquivo JSON
fs.readFile('checklists.json', 'utf8', (err, data) => {
  if (!err) checklists = JSON.parse(data);
});

// Rota para login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (users[username] === password) {
    return res.json({ success: true, user: username });
  } else {
    return res.json({ success: false, message: 'Usuário ou senha incorretos' });
  }
});

// Rota para enviar checklist
app.post('/submit-checklist', (req, res) => {
  const { username, checklist } = req.body;

  // Verifica se o usuário já enviou hoje
  if (checklists[username] && checklists[username].date === new Date().toLocaleDateString()) {
    return res.json({ success: false, message: 'Você já enviou o checklist hoje.' });
  }

  // Salva o checklist
  checklists[username] = { checklist, date: new Date().toLocaleDateString() };
  fs.writeFile('checklists.json', JSON.stringify(checklists, null, 2), (err) => {
    if (err) return res.json({ success: false, message: 'Erro ao salvar o checklist' });
    return res.json({ success: true, message: 'Checklist enviado com sucesso!' });
  });
});

// Rota para obter todos os checklists (admin)
app.get('/admin/checklists', (req, res) => {
  res.json(checklists);
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
