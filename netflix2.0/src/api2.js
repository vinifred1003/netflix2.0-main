const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;
export let categories;
// Endpoint que faz uma solicitação para a porta 3001 e retorna os dados
app.get('/fetch-data', async (req, res) => {
  try {
    // Fazendo a solicitação para o servidor na porta 3001
    const response = await axios.get('http://localhost:3001/categories');

    categories = res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message);
    res.status(500).send('Erro ao buscar dados do servidor na porta 3001');
  }
});

// app.get('/fetch-data', async (req, res) => {
//   try {
//     // Fazendo a solicitação para o servidor na porta 3001
//     const response = await axios.get('http://localhost:3001/categories');

//     categories = res.json(response.data);
//   } catch (error) {
//     console.error('Erro ao buscar dados:', error.message);
//     res.status(500).send('Erro ao buscar dados do servidor na porta 3001');
//   }
// });
// Iniciando o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

