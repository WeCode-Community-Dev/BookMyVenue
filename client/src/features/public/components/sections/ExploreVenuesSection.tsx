import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, ArrowRight, Building2, Map } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useUIStore } from '@/store/ui.store';
import type { Venue } from '@/features/venues/types/venues.types';
import kochiImg from '@/features/public/assets/hero-venue-3.png';
import trivandrumImg from '@/features/public/assets/elite-travancore.png';
import alleppeyImg from '@/features/public/assets/hero-venue-2.png';
import munnarImg from '@/features/public/assets/hero-venue-4.png';
import ExploreVenuesSectionSkeleton from '../loaders/ExploreVenuesSectionSkeleton';

interface District {
  id: string;
  name: string;
  coordinates: [number, number];
  venueCount: number;
  featuredVenues: Venue[];
}

interface ExploreVenuesSectionProps {
  districts: District[];
  loading: boolean;
}

const DISTRICT_METADATA: Record<string, { description: string; image: string }> = {
  kochi: {
    description:
      'The queen of the Arabian Sea, featuring premium waterfront convention centers and heritage banquet halls.',
    image: kochiImg,
  },
  ernakulam: {
    description:
      'The commercial hub of Kerala, featuring premium waterfront convention centers, business hotels, and luxury banquet halls.',
    image: kochiImg,
  },
  trivandrum: {
    description:
      'The capital city, offering majestic royal halls, beachfront resorts, and state-of-the-art conference venues.',
    image: trivandrumImg,
  },
  thiruvananthapuram: {
    description:
      'The capital city, offering majestic royal halls, beachfront resorts, and state-of-the-art conference venues.',
    image: trivandrumImg,
  },
  alleppey: {
    description:
      'The Venice of the East, famous for scenic houseboat venues, lakeside lawns, and backwater resorts.',
    image: alleppeyImg,
  },
  alappuzha: {
    description:
      'The Venice of the East, famous for scenic houseboat venues, lakeside lawns, and backwater resorts.',
    image: alleppeyImg,
  },
  munnar: {
    description:
      'Breathtaking hill station offering mist-covered outdoor lawns, resort pavilions, and cozy tea-garden venues.',
    image: munnarImg,
  },
  idukki: {
    description:
      'Breathtaking hill station offering mist-covered outdoor lawns, resort pavilions, and cozy tea-garden venues.',
    image: munnarImg,
  },
};

const getDistrictMetadata = (districtId: string) => {
  const key = districtId.toLowerCase();
  return (
    DISTRICT_METADATA[key] || {
      description:
        'Explore handpicked premium venues, event spaces, and conference halls in this district.',
      image: kochiImg,
    }
  );
};

const getLeafletCoords = (coords?: [number, number]): [number, number] => {
  if (!coords || coords.length !== 2) return [9.9312, 76.2673]; // Kochi default lat, lng
  return [coords[1], coords[0]]; // Swap [lng, lat] to [lat, lng]
};

export default function ExploreVenuesSection({ districts, loading }: ExploreVenuesSectionProps) {
  const [activeId, setActiveId] = useState<string>('');
  const { themeMode } = useUIStore();

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const isPanningRef = useRef<boolean>(false);

  useEffect(() => {
    if (districts.length > 0 && !activeId) {
      setActiveId(districts[0].id);
    }
  }, [districts, activeId]);

  const activeDistrict = districts.find((d) => d.id === activeId);
  const districtVenues = activeDistrict?.featuredVenues || [];
  const activeMetadata = activeDistrict
    ? getDistrictMetadata(activeDistrict.id)
    : { description: '', image: kochiImg };

  // 1. Initialize Map
  useEffect(() => {
    if (loading || !mapRef.current || mapInstance.current) return;

    // Center on Kochi initially with zoom level 8 (covers Kerala region nicely)
    const initialCoords = districts[0]
      ? (getLeafletCoords(districts[0].coordinates) as L.LatLngExpression)
      : ([9.9312, 76.2673] as L.LatLngExpression);
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(initialCoords, 8);

    mapInstance.current = map;
    setMapReady(true);

    // Invalidate size to ensure it renders correctly after mounting
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    // Clean up on unmount
    return () => {
      map.remove();
      mapInstance.current = null;
      setMapReady(false);
    };
  }, [loading]);

  // 2. Synchronize Tile Layers based on Theme (Light/Dark mode tiles)
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    const map = mapInstance.current;

    if (tileLayerRef.current) {
      try {
        map.removeLayer(tileLayerRef.current);
      } catch (e) {}
    }

    // CartoDB tiles are highly premium and fit light/dark schemes perfectly
    const tileUrl =
      themeMode === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    return () => {
      if (map && mapInstance.current === map) {
        try {
          if (tileLayerRef.current) {
            map.removeLayer(tileLayerRef.current);
          }
        } catch (e) {}
      }
    };
  }, [themeMode, mapReady]);

  // 3. Dynamically Plot/Update Markers
  useEffect(() => {
    if (!mapInstance.current || !mapReady) return;

    const map = mapInstance.current;

    // Clear old markers
    markersRef.current.forEach((marker) => {
      try {
        map.removeLayer(marker);
      } catch (e) {}
    });
    markersRef.current = [];

    // Plot new markers
    districts.forEach((d) => {
      const isActive = activeId === d.id;

      // Calculate active count of venues from backend data
      const count = d.venueCount || 0;
      const leafletCoords = getLeafletCoords(d.coordinates);

      // Premium pulsing HTML/CSS divIcon
      const markerIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 bg-[#e21a47]/20 rounded-full animate-ping ${isActive ? 'opacity-100' : 'opacity-0'}"></div>
            <div class="relative flex items-center justify-center w-7 h-7 rounded-full border border-white dark:border-zinc-950 ${
              isActive
                ? 'bg-[#e21a47] text-white ring-4 ring-[#e21a47]/30 scale-110 shadow-lg'
                : 'bg-zinc-500 dark:bg-zinc-800 text-white hover:bg-[#e21a47] hover:scale-105'
            } transition-all duration-300">
              <span class="text-[9px] font-black">${count}</span>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(leafletCoords, { icon: markerIcon })
        .addTo(map)
        .on('click', () => {
          isPanningRef.current = true;
          setActiveId(d.id);
          map.flyTo(leafletCoords, 9, { duration: 1.2 });
          setTimeout(() => {
            isPanningRef.current = false;
          }, 1300);
        });

      // HTML Hover tooltip
      marker.bindTooltip(
        `
        <div class="px-2.5 py-1 font-sans text-xs font-bold text-zinc-900 dark:text-white bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl">
          ${d.name}: ${count} ${count === 1 ? 'venue' : 'venues'}
        </div>
      `,
        {
          direction: 'top',
          offset: [0, -10],
          opacity: 0.95,
        }
      );

      markersRef.current.push(marker);
    });

    return () => {
      if (map && mapInstance.current === map) {
        markersRef.current.forEach((marker) => {
          try {
            map.removeLayer(marker);
          } catch (e) {}
        });
      }
    };
  }, [districts, activeId, mapReady]);

  // 4. Pan map when activeId changes via side panel clicks
  useEffect(() => {
    if (!mapInstance.current || !mapReady || isPanningRef.current || !activeDistrict) return;
    const activeCoords = getLeafletCoords(activeDistrict.coordinates);
    mapInstance.current.flyTo(activeCoords, 9, { duration: 1.2 });
  }, [activeId, activeDistrict, mapReady]);

  if (loading) {
    return <ExploreVenuesSectionSkeleton />;
  }

  return (
    <section className="bg-transparent text-foreground py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header matching Featured style */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#e21a47] uppercase tracking-[0.25em]">
              Real-time Map
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e21a47]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mt-2 text-black dark:text-white leading-none">
            Explore <br />
            <span className="text-[#e21a47]">by District</span>
          </h2>
        </div>

        <div className="mt-8 mb-10 border-t border-[#e21a47]/5 dark:border-zinc-800" />

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column - Real Leaflet Map (7/12 width) */}
          <div className="lg:col-span-7 flex flex-col p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/40 dark:border-zinc-800/60 rounded-[32px] shadow-lg min-h-[460px] relative">
            <div className="flex justify-between items-center mb-4 z-20">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <Map className="w-3 h-3 text-[#e21a47]" />
                Interactive Map
              </span>

              {/* Map instructions */}
              <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                Scroll to Zoom &bull; Drag to Pan
              </span>
            </div>

            {/* Map Div wrapper */}
            <div className="flex-1 relative min-h-[320px] rounded-2xl overflow-hidden border border-[#e21a47]/10 dark:border-[#e21a47]/30 shadow-inner z-10">
              <div
                ref={mapRef}
                className="absolute inset-0 w-full h-full bg-zinc-100 dark:bg-zinc-900"
              />
            </div>

            {/* Simple Map Legend */}
            <div className="flex justify-center gap-4 mt-4 text-[10px] font-bold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase border-t border-zinc-200/50 dark:border-zinc-900 pt-4 z-20">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e21a47]" />
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-500 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700" />
                <span>Other Hubs</span>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Venue Directory List (5/12 width) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-card border border-zinc-200/40 dark:border-zinc-800/80 rounded-[32px] p-6 md:p-8 shadow-xl min-h-[460px] transition-all duration-300">
            {/* Header of details */}
            <div className="mb-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#e21a47] bg-[#e21a47]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                    {loading ? 'Loading...' : `${districtVenues.length} Spaces Available`}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-black dark:text-white mt-3 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#e21a47]" />
                    {activeDistrict?.name || ''}
                  </h3>
                </div>

                {/* District quick toggles */}
                <div className="flex flex-wrap gap-1 max-w-[200px] justify-end">
                  {districts.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveId(d.id)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                        activeId === d.id
                          ? 'bg-[#e21a47] text-white shadow-sm'
                          : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-foreground'
                      }`}
                    >
                      {d.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-400 mt-2 leading-relaxed">
                {activeMetadata.description}
              </p>
            </div>

            <div className="border-t border-[#e21a47]/5 dark:border-zinc-800 my-4" />

            {/* Venues scrollable area */}
            <div className="flex-1 overflow-y-auto max-h-[340px] pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
              {loading ? (
                // Skeleton list
                [1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/20 dark:border-zinc-800/40 animate-pulse"
                  >
                    <div className="w-20 h-20 rounded-xl bg-zinc-300 dark:bg-zinc-800" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-2/3" />
                      <div className="h-3 bg-zinc-300 dark:bg-zinc-800 rounded w-1/2" />
                      <div className="h-4 bg-zinc-300 dark:bg-zinc-800 rounded w-1/3 pt-1" />
                    </div>
                  </div>
                ))
              ) : districtVenues.length > 0 ? (
                districtVenues.map((venue) => (
                  <div
                    key={venue._id}
                    className="flex gap-4 p-3 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/40 dark:border-zinc-800/40 hover:border-[#e21a47]/30 dark:hover:border-[#e21a47]/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all duration-300 group shadow-sm"
                  >
                    {/* Left Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-200/10">
                      <img
                        src={venue.images?.[0] || activeMetadata.image}
                        alt={venue.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Right Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-foreground group-hover:text-[#e21a47] transition-colors line-clamp-1 leading-tight">
                          {venue.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400 mt-1">
                          <MapPin className="w-3 h-3 text-[#e21a47]" />
                          <span>{venue.address?.city || activeDistrict?.name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-200/30 dark:border-zinc-800/20">
                        <div className="flex items-center gap-3 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                          <span className="flex items-center gap-0.5">
                            <Users className="w-3 h-3 text-zinc-400" />
                            {venue.capacity} guests
                          </span>
                          <span className="text-zinc-300 dark:text-zinc-700">|</span>
                          <span className="text-[#e21a47] font-bold">
                            ₹{(venue.availability?.pricePerHour || 0).toLocaleString('en-IN')} / Hr
                          </span>
                        </div>
                        <Link
                          to={`/venues/${venue._id}`}
                          className="flex items-center justify-center w-7 h-7 rounded-full bg-white dark:bg-zinc-800 hover:bg-[#e21a47] hover:text-white border border-zinc-200 dark:border-zinc-800 text-[#e21a47] dark:text-zinc-300 transition-all duration-300 shadow-sm"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                // Empty state
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center border border-dashed border-zinc-200 dark:border-zinc-800/80 rounded-2xl bg-zinc-50/10 dark:bg-zinc-900/5 my-auto">
                  <Building2 className="w-10 h-10 text-zinc-400 stroke-[1.2] mb-3" />
                  <p className="text-xs font-bold text-foreground">No Venues Listed Yet</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-[200px] leading-relaxed">
                    We don't have spaces listed in {activeDistrict?.name || 'this district'} right
                    now.
                  </p>
                  <Link
                    to="/owner/register"
                    className="mt-4 inline-flex items-center gap-1 text-[10px] font-bold text-[#e21a47] hover:text-[#c81239] transition-colors uppercase tracking-wider"
                  >
                    <span>Become a Host</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
