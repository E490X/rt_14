import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to fit bounds based on markers
function FitBounds({ markers }) {
  const map = useMap();

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map(m => [m.position.lat, m.position.lng])
      );
      map.invalidateSize(); // ✅ important when inside Modal
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [markers, map]);

  return null;
}

function MultiLocationMap({ markers }) {
  console.log(markers);
  return (
    <MapContainer
      center={[0, 0]} // temporary; FitBounds will override
      zoom={10}
      className="map-container-multilocation-map"
      style={{ height: '400px', width: '100%' }} // ✅ fixed height
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {markers.map((mark, index) => (
        <Marker
          key={index}
          position={[mark.position.lat, mark.position.lng]}
        />
      ))}

      <FitBounds markers={markers} />
    </MapContainer>
  );
}

export default MultiLocationMap;
