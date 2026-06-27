import { MapContainer, TileLayer } from 'react-leaflet'

function MapView({ center = [10.8505, 76.2711], zoom = 7 }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
    </MapContainer>
  )
}

export default MapView