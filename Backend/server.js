const express = require('express');
const cors = require('cors');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = 3001;
const secretKey = process.env.SECRET_KEY || 'your-secret-key';
const API_KEY = process.env.API_KEY || 'your-api-key'; // Use environment variable
const DNS = "https://api.themoviedb.org/3";

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

  const usuarioLogado = dados.usuarios.find((usuario) => usuario.email === email && usuario.senha === senha);

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

// Fetch category data route
app.get('/api/:category', async (req, res) => {
  try {
    const category = categories.find(cat => cat.name === req.params.category);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const response = await fetch(DNS + category.path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from TMDb:', error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});