import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Circle, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { ensureLeafletIconFix } from '../lib/leafletIconFix'

ensureLeafletIconFix()

type Props = {
  latitude: number
  longitude: number
  label?: string
  sublabel?: string
  /** If true, shows an exact pin instead of an approximate circle. Default: false. */
  exact?: boolean
  height?: string
}

const APPROX_RADIUS_METERS = 350
const APPROX_ZOOM = 14
const EXACT_ZOOM = 15

export function VenueLocationMap({
  latitude,
  longitude,
  label,
  sublabel,
  exact = false,
  height = '300px',
}: Props) {
  // Leaflet needs a stable client-only render; SSR/hydration guards aren't
  // a concern here since this is a CSR app, but we still wait one tick so
  // the container has real dimensions before Leaflet measures it —
  // avoids the classic "gray tile" bug when a map mounts inside a
  // recently-revealed/animated parent.
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(t)
  }, [])

  const center: [number, number] = [latitude, longitude]

  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 dark:border-ink-800 bg-zinc-100 dark:bg-ink-800 z-0"
    >
      {ready && (
        <MapContainer
          center={center}
          zoom={exact ? EXACT_ZOOM : APPROX_ZOOM}
          scrollWheelZoom={false}
          dragging={true}
          doubleClickZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {exact ? (
            <Marker position={center} />
          ) : (
            <Circle
              center={center}
              radius={APPROX_RADIUS_METERS}
              pathOptions={{
                color: '#16a34a',
                fillColor: '#16a34a',
                fillOpacity: 0.15,
                weight: 1.5,
              }}
            />
          )}
        </MapContainer>
      )}

      {/* Label card, overlaid the same way the placeholder did */}
      {(label || sublabel) && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-[400]">
          <div className="pointer-events-auto rounded-xl bg-white dark:bg-ink-900 px-4 py-2 shadow text-center">
            {label && <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label}</p>}
            {sublabel && <p className="text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500">{sublabel}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
