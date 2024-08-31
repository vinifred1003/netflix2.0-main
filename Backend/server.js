const express = require('express');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const axios = require('axios');

const app = express();
const PORT = 3001;
const secretKey = process.env.SECRET_KEY || 'your-secret-key';
const API_KEY = process.env.API_KEY || '47cba9dbaea0a23113695e7b28d62793';
const DNS = "https://api.themoviedb.org/3";
let usuarioLogado
// Configurations
app.use(cors());
app.use(express.json());
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: false,
}));

// Emulating database
const dados = {
  usuarios: [
    { id: '1', nome: 'Vinicius', email: 'vini@teste.com', senha: '1234', idade: '18' },
    { id: '2', nome: 'Joao', email: 'joao@teste.com', senha: '1234', idade: '17' },
  ]
};

// Function to generate session token
const generateToken = (userID) => {
  return jwt.sign({ userID }, secretKey, { expiresIn: '1h' });
};

// Token verification middleware
const verifyJWT = (req, res, next) => {
  const token = req.body.sessionID;
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });

    req.session.usuarioID = decoded.userID;
    next();
  });
};

// Find user by ID
const findUserByID = (userID) => {
  return dados.usuarios.find((usuario) => usuario.id === userID);
};

// Login route
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  usuarioLogado = dados.usuarios.find((usuario) => usuario.email === email && usuario.senha === senha);

  if (usuarioLogado) {
    req.session.isLogado = true;
    req.session.usuarioID = usuarioLogado.id;
    const token = generateToken(usuarioLogado.id);
    res.json({ sessionID: token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Test session route
app.post('/test', verifyJWT, (req, res) => {
  const usuario = findUserByID(req.session.usuarioID);
  res.send(usuario?.nome || 'User not found');
});

// TMDb API Categories
const categories = [
  {
    name: "trending",
    title: "Em Alta",
    path: `/trending/all/week?api_key=${API_KEY}&language=pt-BR`,
    isLarge: true,
  },
  {
    name: "netflixOriginals",
    title: "Originais Netflix",
    path: `/discover/tv?api_key=${API_KEY}&with_networks=213`,
    isLarge: false,
  },
  {
    name: "topRated",
    title: "Populares",
    path: `/movie/top_rated?api_key=${API_KEY}&language=pt-BR`,
    isLarge: false,
  },
  {
    name: "comedy",
    title: "Comédias",
    path: `/discover/tv?api_key=${API_KEY}&with_genres=35`,
    isLarge: false,
  },
  {
    name: "romances",
    title: "Romances",
    path: `/discover/tv?api_key=${API_KEY}&with_genres=10749`,
    isLarge: false,
  },
  {
    name: "documentaries",
    title: "Documentários",
    path: `/discover/tv?api_key=${API_KEY}&with_genres=99`,
    isLarge: false,
  }
];

// New endpoint to fetch categories
app.get('/categories', (req, res) => {
  res.json(categories);
});

// Route to get movies by category
app.get('/movies/categorySelected', async (req, res) => {
  const selectedCategory = req.params.category;
  const objectFinded = categories.find((element) => element.name === selectedCategory);

  if (!objectFinded) {
    return res.status(404).send('Category not found');
  }
  const url = `${DNS}${objectFinded.path}`;

  try {
    const response = await axios.get(url);
    if (usuarioLogado.idade < 18) {
      response.data.results.find((movie) => !movie.adult)
    } else {
      res.json(response.data);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data from external API');
  }
});

const getData = async (path) => {
  try {
    const URI = DNS + path;
    console.log('URL gerada:', URI);
    const result = await axios.get(URI);
    if (usuarioLogado) {
      if (usuarioLogado < 18)
        if (result.data.results) {
          result.data.results = result.data.results.filter((movie) => movie.adult === false);
          return result.data;
        }
        else {
          result.data
        }
    }



  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    throw error;
  }
};



app.post('/selectedCategory', async (req, res) => {
  const { pathChosed } = req.body;
  console.log('Corpo da requisição:', req.body); // Log do corpo da requisição
  console.log('Path escolhido:', pathChosed); // Log do path escolhido

  try {
    if (!pathChosed) {
      return res.status(400).json({ error: 'PathChosed não fornecido.' });
    }

    const data = await getData(pathChosed);
    console.log('Dados retornados para a rota /selectedCategory:', data); // Log dos dados retornados
    res.json(data);
  } catch (error) {
    console.error('Erro ao obter dados:', error);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});