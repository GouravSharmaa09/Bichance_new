import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100vw',
  height: '80vh',
  borderRadius: '0',
  border: 'none',
  boxShadow: 'none',
  background: '#fff',
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 }; // India

export default function MapSection() {
  const [center, setCenter] = useState(defaultCenter);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const apiKey = 'AIzaSyAh_IG7Mt61z6axZ_qVu40eHqrmMqgNZC4';

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setError('');
    if (!search) return;
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(search)}&key=${apiKey}`);
      const data = await res.json();
      if (data.status === 'OK') {
        setCenter(data.results[0].geometry.location);
      } else {
        setError('Location not found.');
      }
    } catch {
      setError('Error searching location.');
    }
  };

  if (!apiKey) {
    return <div className="text-center text-red-700 font-bold">Google Maps API key missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.</div>;
  }

  return (
    <div className="relative w-screen h-[80vh] m-0 p-0" style={{overflow:'hidden'}}>
      {/* Search bar over the map */}
      <form onSubmit={handleSearch} className="absolute z-10 top-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl flex flex-col items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your city or country..."
            className="w-full px-6 py-3 pr-12 rounded-full border-2 border-white bg-white/80 text-red-700 font-semibold text-lg shadow focus:outline-none focus:ring-2 focus:ring-red-300 transition-all mb-2"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-800 focus:outline-none"
            tabIndex={-1}
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </form>
      {error && <div className="absolute z-10 top-24 left-1/2 transform -translate-x-1/2 text-center text-red-600 font-bold mb-2 bg-white px-4 py-2 rounded shadow">{error}</div>}
      <LoadScript googleMapsApiKey={apiKey} loadingElement={<div className="text-white">Loading Map...</div>}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          options={{
            styles: [
              { elementType: 'geometry', stylers: [{ color: '#fff' }] },
              { elementType: 'labels.text.fill', stylers: [{ color: '#b91c1c' }] },
              { elementType: 'labels.text.stroke', stylers: [{ color: '#fff' }] },
              { featureType: 'water', stylers: [{ color: '#fca5a5' }] },
              { featureType: 'road', stylers: [{ color: '#f87171' }] },
            ]
          }}
        >
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
} 