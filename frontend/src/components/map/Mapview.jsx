import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

function MapPanner({ center, zoom }) {
  const map = useMap()

  useEffect(() => {
    if (center) map.setView(center, zoom)
  }, [center, zoom, map])

  return null
}

function MapView({
  latitude,
  longitude,
  center = [10.8505, 76.2711],
  zoom = 7,
  height = '400px',
}) {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const hasCoords = !Number.isNaN(lat) && !Number.isNaN(lng)
  const mapCenter = hasCoords ? [lat, lng] : center
  const mapZoom = hasCoords ? 15 : zoom

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height, width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {hasCoords && (
        <>
          <MapPanner center={[lat, lng]} zoom={15} />
          <Marker position={[lat, lng]} />
        </>
      )}
    </MapContainer>
  )
}

export default MapView
