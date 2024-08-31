const express = require('express');
const axios = require('axios');

const app = express();
export let categories;

fetch('http://localhost:3001/categories')
  .then(response => response.json())
  .then(data => {
    categories == data
  })
  .catch(error => {
    console.error('Erro ao buscar dados:', error);
  });

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'http://localhost:3001/selectedCategory',
  headers: {
    'Content-Type': 'text/plain'
  },
  data: data
};

axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });


export const getData = async (path) => {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/selectedCategory',
    headers: {
      'Content-Type': 'text/plain'
    },
    data: path
  };

  axios.request(config)
    .then((response) => {
      return response.data.json();
    })
    .catch((error) => {
      console.log(error);
    });
}






// Iniciando o servidor na porta 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

