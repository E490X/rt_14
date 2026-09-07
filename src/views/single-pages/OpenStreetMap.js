import React, { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// ✅ Fix missing marker icons in React (Leaflet + Webpack/Vite issue)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
})

// 🌍 Component to change the map center when `center` prop changes
function ChangeMapView({ center }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom()) // keep current zoom
    }
  }, [center, map])
  return null
}

function OpenStreetMap({ center }) {
  if (!center) return <div>Loading...</div>

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom={true}
      className="map-container-multilocation-map"
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      <Marker position={center}>
        <Popup>Marker</Popup>
      </Marker>

      {/* Update view whenever center changes */}
      <ChangeMapView center={center} />
    </MapContainer>
  )
}

export default OpenStreetMap
