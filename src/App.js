// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [photos, setPhotos] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [error, setError] = useState(null);
//   const [ppage,setPpage]=useState(0);

//   // Memoized function to load more photos
//   const loadMorePhotos = useCallback(async () => {
//     if (loading) return; // Prevent multiple requests while loading
//     setLoading(true);
//     setError(null);

//     try {
//       if(ppage!=page){
//         setPpage(page);
//       const response = await axios.get(
//         `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=kgEg2qcnp8FKYjl47f9xyUjH5fmmucHUjypZ0X8sjeI`
//       );
//       setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
//       setPage((prevPage) => prevPage + 1);
//     }
//     else {
//       throw new Error("This page is already called!");
//     }
//     } catch (err) {
//       setError('Failed to load photos. Please try again.');
//     } finally {
//       setLoading(false); // Reset loading state here to ensure it happens in both success and failure cases
//     }
//   }, [page,loading]);

//   // useEffect to call loadMorePhotos once component is mounted
//   //useEffect(() => {
//     loadMorePhotos();
//  // }); // Only re-run if loadMorePhotos changes

//   useEffect(() => {
//     const handleScroll = () => {
//         if(window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight){
//           setTimeout(()=>{
//             loadMorePhotos(); 
//           },5000)

//       //    loadMorePhotos();
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <div className="App">
//       <h1>Infinite Scroll Photo Gallery</h1>

//       <div className="photo-gallery">
//         {photos.map((photo) => (
//           <div className="photo-card" key={photo.id}>
//             <img
//               src={photo.urls.small}
//               alt={`Photo by ${photo.user.name}`}
//               loading="lazy"
//             />
//             <div className="photo-caption">
//               <p>Photo by {photo.user.name}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {loading && <div className="loading">Loading...</div>}
//       {error && <div className="error">{error}</div>}
//     </div>
//   );
// }

// export default App;


















import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [ppage, setPpage] = useState(0); // To track the previous page

  // Memoized function to load more photos
  const loadMorePhotos = useCallback(async () => {
    if (loading) return; // Prevent multiple requests while loading
    setLoading(true);
    setError(null);

    try {
      if (ppage !== page) {
        setPpage(page); // Update the page number
        const response = await axios.get(
          `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=kgEg2qcnp8FKYjl47f9xyUjH5fmmucHUjypZ0X8sjeI`
        );
        setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
        setPage((prevPage) => prevPage + 1); // Increment page number for next request
      } else {
        throw new Error('This page is already called!');
      }
    } catch (err) {
      setError('Failed to load photos. Please try again.');
    } finally {
      setLoading(false); // Reset loading state here to ensure it happens in both success and failure cases
    }
  }, [page, loading, ppage]);

  // Call the function initially to load photos when the component mounts
  useEffect(() => {
    loadMorePhotos();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Throttle function to limit the number of scroll event calls
  const throttleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 5) {
      loadMorePhotos();
    }
  }, [loadMorePhotos]);

  // Set up the scroll event listener with a debounce or throttle mechanism
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      // Clear previous timeout to ensure debounce effect
      clearTimeout(timeout);
      timeout = setTimeout(throttleScroll, 200); // Set debounce to 200ms (adjust as needed)
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout); // Clean up timeout on component unmount
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
