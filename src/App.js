import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [ppage, setPpage] = useState(0); 

  const loadMorePhotos = useCallback(async () => {
    if (loading) return; 
    setLoading(true);
    setError(null);

    try {
      if (ppage !== page) {
        setPpage(page); 
        const response = await axios.get(
          `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=kgEg2qcnp8FKYjl47f9xyUjH5fmmucHUjypZ0X8sjeI`
        );
        setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
        setPage((prevPage) => prevPage + 1); 
      } else {
        throw new Error('This page is already called!');
      }
    } catch (err) {
      setError('Failed to load photos. Please try again.');
    } finally {
      setLoading(false); 
    }
  }, [page, loading, ppage]);


  useEffect(() => {
    loadMorePhotos();
  }, []); 


  const throttleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 5) {
      loadMorePhotos();
    }
  }, [loadMorePhotos]);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(throttleScroll, 200); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, [throttleScroll]);

  return (
    <div className="App">
      <h1>Infinite Scroll Photo Gallery</h1>

      <div className="photo-gallery">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img
              src={photo.urls.small}
              alt={`Photo by ${photo.user.name}`}
              loading="lazy"
            />
            <div className="photo-caption">
              <p>Photo by {photo.user.name}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="loading">Loading...</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default App;
