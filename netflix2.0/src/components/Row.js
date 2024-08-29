import { useEffect, useState } from 'react';
import './Row.css';

export default function Row({ title, path, isLarge }) {
    const [filmes, setFilmes] = useState([]);
    const imageHost = 'https://image.tmdb.org/t/p/original/';

    const fetchData = async () => {
        try {
            // Fetch data from the backend, using the `path` as a parameter to identify the category
            const response = await fetch(`http://localhost:3001/api${path}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    }

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await fetchData();
            setFilmes(data?.results || []);
        };

        fetchMovies();
    }, [path]);

    return (
        <div className='row-container'>
            <h2 className='row-header'>{title}</h2>
            <div className='row-cards'>
                {filmes?.map((filme) => (
                    <img
                        className={`movie-card ${isLarge && "movie-card-large"}`}
                        key={filme.id}
                        src={imageHost + (isLarge ? filme.backdrop_path : filme.poster_path)}
                        alt={filme.name}
                    />
                ))}
            </div>
        </div>
    );
}
