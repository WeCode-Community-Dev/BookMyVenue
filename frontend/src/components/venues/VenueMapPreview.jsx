import { MapPin } from "lucide-react"

export default function VenueMapPreview({ address, mapsUrl }) {
  const map = (
    <div className="relative mt-4 h-64 overflow-hidden rounded-lg border border-border bg-[#d8e4d0]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 400 256"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <rect width="400" height="256" fill="#d8e4d0" />
        <rect x="0" y="108" width="400" height="18" fill="#f5f5f0" />
        <rect x="0" y="168" width="400" height="14" fill="#f5f5f0" />
        <rect x="148" y="0" width="16" height="256" fill="#f5f5f0" />
        <rect x="248" y="0" width="12" height="256" fill="#f5f5f0" />
        <rect x="32" y="32" width="96" height="64" fill="#c5d9bc" rx="4" />
        <rect x="280" y="48" width="88" height="72" fill="#c5d9bc" rx="4" />
        <rect x="56" y="188" width="112" height="48" fill="#c5d9bc" rx="4" />
        <path
          d="M0 80 Q120 60 200 90 T400 70"
          fill="none"
          stroke="#a8c4e8"
          strokeWidth="10"
          opacity="0.7"
        />
      </svg>

      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-full">
        <MapPin size={36} className="text-primary drop-shadow-md" fill="currentColor" />
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10">
        <p className="text-sm font-medium text-white">{address}</p>
        {mapsUrl && <p className="mt-1 text-xs text-white/80">Click to open directions</p>}
      </div>
    </div>
  )

  if (!mapsUrl) {
    return map
  }

  return (
    <a
      href={mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition hover:opacity-95"
      aria-label="Open location in maps"
    >
      {map}
    </a>
  )
}
