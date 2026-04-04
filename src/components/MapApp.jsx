import React, { useState, useEffect, useCallback } from 'react';
import { Map, useMap, useMapsLibrary, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import CafeCard from './CafeCard';

export default function MapApp() {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const [placesService, setPlacesService] = useState(null);
  
  const [userLocation, setUserLocation] = useState({ lat: 25.033964, lng: 121.564468 });
  const [locationLoaded, setLocationLoaded] = useState(false);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchBtn, setShowSearchBtn] = useState(false);
  
  const [selectedCafe, setSelectedCafe] = useState(null);
  
  // 地圖類型切換狀態：'roadmap' 或 'satellite'
  const [mapTypeId, setMapTypeId] = useState('roadmap');

  useEffect(() => {
    if (!placesLib || !map) return;
    setPlacesService(new placesLib.PlacesService(map));
  }, [placesLib, map]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationLoaded(true);
        },
        () => {
          console.warn('用戶拒絕/無法定位，使用預設座標。');
          setLocationLoaded(true);
        },
        { timeout: 5000 }
      );
    } else {
      setLocationLoaded(true);
    }
  }, []);

  const searchCafes = useCallback((centerLocation) => {
    if (!placesService) return;
    setLoading(true);
    setShowSearchBtn(false);
    setSelectedCafe(null);

    const request = {
      location: centerLocation,
      radius: 5000,
      type: 'cafe'
    };

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        let sorted = results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        const topResults = sorted.slice(0, 15);
        
        const detailedPromises = topResults.map(place => {
          return new Promise(resolve => {
            placesService.getDetails({
              placeId: place.place_id,
              // 取得所有的照片陣列
              fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'editorial_summary', 'url', 'website', 'photos', 'formatted_address', 'geometry']
            }, (details, detailStatus) => {
              if (detailStatus === window.google.maps.places.PlacesServiceStatus.OK) {
                // 將所有獲得的圖片轉換為 URL 陣列 (最多取 5 張)
                let photoUrls = [];
                if (details.photos && details.photos.length > 0) {
                  photoUrls = details.photos.slice(0, 5).map(photo => photo.getUrl({ maxWidth: 400 }));
                }
                resolve({ ...place, ...details, photoUrls });
              } else {
                resolve(place);
              }
            });
          });
        });

        Promise.all(detailedPromises).then(detailedCafes => {
          setCafes(detailedCafes);
          setLoading(false);
        });
      } else {
        setCafes([]);
        setLoading(false);
      }
    });
  }, [placesService]);

  useEffect(() => {
    if (placesService && locationLoaded) {
      searchCafes(userLocation);
    }
  }, [placesService, locationLoaded, searchCafes]); 

  const handleDragEnd = () => {
    if (map) setShowSearchBtn(true);
  };

  const handlesearchInArea = () => {
    if (map) searchCafes(map.getCenter());
  };

  const onCafeClick = (cafe) => {
    setSelectedCafe(cafe);
    if (map && cafe.geometry?.location) {
      map.panTo(cafe.geometry.location);
    }
  };

  const toggleMapType = () => {
    setMapTypeId(prev => prev === 'roadmap' ? 'satellite' : 'roadmap');
  };

  const openStreetView = (location) => {
    if (map) {
      const panorama = map.getStreetView();
      panorama.setPosition(location);
      panorama.setVisible(true);
    }
  };

  return (
    <div className="app-container">
      {/* 寬螢幕為靜態側邊欄，窄螢幕為懸浮底部抽屜 */}
      <div className="glass-panel">
        <div className="panel-header">
          <h1 className="panel-title mobile-title">☕ 最強咖啡廳雷達 🚀</h1>
          <p className="panel-subtitle">精選 5 公里內最頂級的咖啡體驗</p>
        </div>
        <div className="cafe-list">
          {loading ? (
            <div className="loader">☕ 正在深度掃描最強咖啡廳...</div>
          ) : cafes.length === 0 ? (
            <div className="empty-state">此區域找不到推薦的咖啡廳</div>
          ) : (
            cafes.map((cafe, index) => (
              <CafeCard 
                key={cafe.place_id || index} 
                cafe={cafe} 
                onClick={() => onCafeClick(cafe)}
                isSelected={selectedCafe?.place_id === cafe.place_id}
              />
            ))
          )}
        </div>
      </div>

      <div className="map-area">
        {locationLoaded && (
          <Map
            defaultZoom={14}
            defaultCenter={userLocation}
            // 完整對標手機原生體驗，隱藏所有桌面版舊式按鈕 (小橘人、大色塊按鈕)
            disableDefaultUI={true}
            mapTypeId={mapTypeId}
            onDragend={handleDragEnd}
            onZoomChanged={handleDragEnd}
            colorScheme="DARK"
            mapId="COFFEE_MAP_ID"
            style={{ width: '100%', height: '100%' }}
          >
            {/* 使用者位置 */}
            <AdvancedMarker position={userLocation} title="您的目前位置" zIndex={100}>
              <Pin background="#3b82f6" borderColor="#1e40af" glyphColor="#fff" />
            </AdvancedMarker>

            {/* 咖啡廳圖釘 */}
            {cafes.map(cafe => {
              if (!cafe.geometry?.location) return null;
              return (
                <AdvancedMarker 
                  key={cafe.place_id} 
                  position={cafe.geometry.location} 
                  title={cafe.name}
                  onClick={() => onCafeClick(cafe)}
                  zIndex={selectedCafe?.place_id === cafe.place_id ? 50 : 10}
                >
                  <Pin 
                    background={selectedCafe?.place_id === cafe.place_id ? "#f59e0b" : "#fff"} 
                    borderColor="#b45309" 
                    glyphColor={selectedCafe?.place_id === cafe.place_id ? "#fff" : "#b45309"} 
                  />
                </AdvancedMarker>
              );
            })}

            {/* 強化版 InfoWindow (具備橫向輪播與街景觸發鈕) */}
            {selectedCafe && selectedCafe.geometry?.location && (
              <InfoWindow 
                position={selectedCafe.geometry.location}
                onCloseClick={() => setSelectedCafe(null)}
                pixelOffset={[0, -30]}
              >
                <div style={{ color: '#000', maxWidth: '280px', width: '280px', fontFamily: 'sans-serif' }}>
                  
                  {/* 照片輪播牆 (Carousel) */}
                  {selectedCafe.photoUrls && selectedCafe.photoUrls.length > 0 && (
                    <div className="carousel-container">
                      {selectedCafe.photoUrls.map((url, i) => (
                        <img 
                          key={i}
                          src={url} 
                          alt={`${selectedCafe.name} - ${i}`} 
                          className="carousel-img"
                        />
                      ))}
                    </div>
                  )}

                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>{selectedCafe.name}</h3>
                  <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '6px', fontWeight: 'bold' }}>
                    ★ {selectedCafe.rating || '無評分'} ({selectedCafe.user_ratings_total || 0}則評論)
                  </div>
                  {selectedCafe.formatted_address && (
                    <div style={{ fontSize: '12px', marginBottom: '10px', color: '#444', lineHeight: '1.4', fontWeight: '500' }}>
                      📍 {selectedCafe.formatted_address}
                    </div>
                  )}

                  {/* 取代拖拉小橘人，點擊直接進入街景 */}
                  <button 
                    onClick={() => openStreetView(selectedCafe.geometry.location)}
                    style={{ background: '#f59e0b', color: 'white', width: '100%', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '10px' }}
                  >
                    🚶‍♂️ 查看實景 (進入街景)
                  </button>

                  {selectedCafe.reviews && selectedCafe.reviews.length > 0 && (
                    <div style={{ fontSize: '12px', fontStyle: 'italic', background: '#f5f5f5', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #ccc', marginTop: '4px' }}>
                      "{selectedCafe.reviews[0].text.substring(0, 60)}..."
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}

          </Map>
        )}
        
        {/* 手機版 原生感獨立對齊圖層按鈕 (地圖切換) */}
        <button className="native-layer-btn" onClick={toggleMapType} title="切換地圖檢視">
          {mapTypeId === 'roadmap' ? '🗺️' : '🛰️'}
        </button>

        {/* 重新搜尋此區域按鈕 */}
        {showSearchBtn && (
          <div className="search-btn-container">
            <button onClick={handlesearchInArea} className="search-area-btn">
              <span>↻ 搜尋這個區域的咖啡廳</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
