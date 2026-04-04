import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapApp from './components/MapApp';

// 使用 Vite 環境變數，如果抓不到就預設使用提供的測試 KEY
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyDOCIIhEFerfu065cs_nMHKfiyf6_rqO6s";

function App() {
  return (
    <APIProvider apiKey={API_KEY}>
      <MapApp />
    </APIProvider>
  );
}

export default App;
