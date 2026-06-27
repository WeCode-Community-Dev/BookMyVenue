import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

// This child component handles panning the map when coordinates change
function MapPanner({ position }) {
  const map = useMap()
  useEffect(() => {
    if (position) map.setView(position, 13)
  }, [position])
  return null
}

function LocationPicker({ address, onLocationChange }) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    const timer = setTimeout(async() => {
   if (address.length < 3) return
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&limit=1`)
    const data = await res.json();
    if (data.length === 0) return
const { lat, lon } = data[0]
setPosition([lat, lon])
onLocationChange(lat, lon);

  }, 600)

   return () => clearTimeout(timer)

 
  }, [address])

  return (
    <MapContainer center={[10.8505, 76.2711]} zoom={7} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
       <MapPanner position={position} />
      {position && <Marker position={position} />}
    </MapContainer>
  )
}

export default LocationPicker