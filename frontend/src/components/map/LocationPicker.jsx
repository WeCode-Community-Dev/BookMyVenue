import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'

function MapPanner({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 15)
  }, [position, map])
  return null
}

function MapClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function LocationPicker({
  address,
  initialLatitude,
  initialLongitude,
  onLocationChange,
}) {
  const [position, setPosition] = useState(null)

  const applyPosition = (lat, lng) => {
    const next = [Number(lat), Number(lng)]
    if (Number.isNaN(next[0]) || Number.isNaN(next[1])) return
    setPosition(next)
    onLocationChange?.(next[0], next[1])
  }

  useEffect(() => {
    const lat = Number(initialLatitude)
    const lng = Number(initialLongitude)
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      setPosition([lat, lng])
    }
  }, [initialLatitude, initialLongitude])

  useEffect(() => {
    if (!address || address.trim().length < 3) return

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        )
        const data = await res.json()
        if (data.length === 0) return
        const { lat, lon } = data[0]
        applyPosition(lat, lon)
      } catch (err) {
        console.error('Geocoding failed', err)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [address])

  const defaultCenter = position || [10.8505, 76.2711]

  return (
    <div className="location-picker">
      <MapContainer
        center={defaultCenter}
        zoom={position ? 15 : 7}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapPanner position={position} />
        <MapClickHandler onPick={applyPosition} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  )
}

export default LocationPicker
