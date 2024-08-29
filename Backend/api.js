// const express = require('express');
// const fetch = require('node-fetch');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = 3001;

// const API_KEY = process.env.API_KEY;
// const DNS = "https://api.themoviedb.org/3";

// app.use(cors());

// const categories = [
//   {
//     name: "trending",
//     title: "Em Alta",
//     path: "/trending/all/week?api_key=" + API_KEY + "&language=pt-BR",
//     isLarge: true,
//   },
//   {
//     name: "netflixOriginals",
//     title: "Originais Netflix",
//     path: "/discover/tv?api_key=" + API_KEY + "&with_networks=213",
//     isLarge: false,
//   },
//   {
//     name: "topRated",
//     title: "Populares",
//     path: "/movie/top_rated?api_key=" + API_KEY + "&language=pt-BR",
//     isLarge: false,
//   },
//   {
//     name: "comedy",
//     title: "Comédias",
//     path: "/discover/tv?api_key=" + API_KEY + "&with_genres=35",
//     isLarge: false,
//   },
//   {
//     name: "romances",
//     title: "Romances",
//     path: "/discover/tv?api_key=" + API_KEY + "&with_genres=10749",
//     isLarge: false,
//   },
//   {
//     name: "documentaries",
//     title: "Documentários",
//     path: "/discover/tv?api_key=" + API_KEY + "&with_genres=99",
//     isLarge: false,
//   }
// ];

// // API route to fetch data based on a category path
// app.get('/api/:category', async (req, res) => {
//   try {
//     const category = categories.find(cat => cat.name === req.params.category);
//     if (!category) {
//       return res.status(404).send({ error: "Category not found" });
//     }

//     const response = await fetch(DNS + category.path);
//     const data = await response.json();
//     res.send(data);
//   } catch (error) {
//     console.error('Error fetching data from TMDb:', error);
//     res.status(500).send({ error: "Failed to fetch data" });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
