import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-geosearch/dist/geosearch.css'
import L from 'leaflet'
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch'

// Fix the default icon path issues with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

export interface LocationAddressData {
  address_line1?: string
  address_line2?: string
  city?: string
  state?: string
  country?: string
  postal_code?: string
}

interface LocationPickerMapProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number, address?: LocationAddressData) => void
  height?: string
}

async function reverseGeocode(lat: number, lng: number): Promise<LocationAddressData | undefined> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: {
        'Accept-Language': 'en'
      }
    })
    const data = await res.json()
    if (data && data.address) {
      const a = data.address
      return {
        address_line1: a.road || a.pedestrian || a.path || a.suburb || '',
        address_line2: a.neighbourhood || a.village || '',
        city: a.city || a.town || a.county || '',
        state: a.state,
        country: a.country,
        postal_code: a.postcode
      }
    }
  } catch (err) {
    console.error('Reverse geocoding failed', err)
  }
  return undefined
}

export async function forwardGeocode(addressQuery: string): Promise<[number, number] | undefined> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressQuery)}&format=json&limit=1`, {
      headers: {
        'Accept-Language': 'en'
      }
    })
    const data = await res.json()
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    }
  } catch (err) {
    console.error('Forward geocoding failed', err)
  }
  return undefined
}

const DEFAULT_CENTER: [number, number] = [9.9312, 76.2673] // Kochi, Kerala
const DEFAULT_ZOOM = 12
const ZOOM_WHEN_SET = 15

function LocationMarker({ position, onChange }: { position: [number, number] | null, onChange: (lat: number, lng: number, address?: LocationAddressData) => void }) {
  useMapEvents({
    async click(e) {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      const addr = await reverseGeocode(lat, lng)
      onChange(lat, lng, addr)
    },
  })

  return position === null ? null : (
    <Marker position={position} />
  )
}

function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

function SearchField({ onChange }: { onChange: (lat: number, lng: number, address?: LocationAddressData) => void }) {
  const map = useMap()
  
  useEffect(() => {
    const provider = new OpenStreetMapProvider()
    
    // @ts-ignore
    const searchControl = new GeoSearchControl({
      provider: provider,
      style: 'bar',
      showMarker: false,
      retainZoomLevel: false,
      animateZoom: true,
      autoClose: true,
      searchLabel: 'Enter address, e.g. Kochi',
      keepResult: true,
    })

    map.addControl(searchControl)

    const handleLocation = async (result: any) => {
      if (result && result.location) {
        const lat = result.location.y
        const lng = result.location.x
        const addr = await reverseGeocode(lat, lng)
        onChange(lat, lng, addr)
      }
    }

    map.on('geosearch/showlocation', handleLocation)

    return () => {
      map.removeControl(searchControl)
      map.off('geosearch/showlocation', handleLocation)
    }
  }, [map, onChange])

  return null
}

export function LocationPickerMap({ latitude, longitude, onChange, height = '300px' }: LocationPickerMapProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER)
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)
  const [hasInitialPosition, setHasInitialPosition] = useState(false)

  useEffect(() => {
    if (latitude !== null && longitude !== null && !hasInitialPosition) {
      setCenter([latitude, longitude])
      setZoom(ZOOM_WHEN_SET)
      setHasInitialPosition(true)
    }
  }, [latitude, longitude, hasInitialPosition])

  const position: [number, number] | null = latitude !== null && longitude !== null ? [latitude, longitude] : null

  return (
    <div style={{ height, width: '100%', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e4e4e7', position: 'relative', zIndex: 0 }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} onChange={onChange} />
        <MapUpdater center={center} zoom={zoom} />
        <SearchField onChange={onChange} />
      </MapContainer>
    </div>
  )
}
