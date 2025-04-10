const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Permitir POST com JSON
app.use(express.json());

// Servir os arquivos HTML
app.use(express.static(__dirname));

// Caminho do arquivo
const filePath = path.join(__dirname, 'logui2.txt');

// Rota para receber o checklist
app.post('/checklist', (req, res) => {
  const { usuario, senha, moto, data, hora, checklist } = req.body;

  // Verificar se o usuário já enviou hoje
  const today = new Date().toISOString().split('T')[0];
  const entry = `[${data} ${hora}] ${usuario.toUpperCase()} - ${moto}\n${checklist.join('\n')}\n\n`;

  // Adiciona a entrada ao arquivo
  fs.appendFile(filePath, entry, (err) => {
    if (err) {
      console.error('Erro ao salvar checklist:', err);
      return res.status(500).json({ message: 'Erro ao salvar checklist.' });
    }
    res.json({ message: 'Checklist enviado com sucesso!' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
