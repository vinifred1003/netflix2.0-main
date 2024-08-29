import './App.css';
import Row from './components/Row';
import Banner from './components/Banner';
import Nav from './components/Nav';
import { useEffect, useState } from 'react';

function App() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Nav />
      {/* Banner */}
      <Banner />
      {/* Categories - Rows */}
      {categories.map((category) => (
        <Row
          key={category.name}
          title={category.title}
          isLarge={category.isLarge}
          path={category.path}
        />
      ))}
    </div>
  );
}

export default App;
