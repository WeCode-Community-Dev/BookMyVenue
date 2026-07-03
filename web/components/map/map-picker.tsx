'use client';

import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Input } from '../ui/input';
import { getLocationFromQuery } from '@/services/mapservice';

type Props = {
    onLocationSelect?: (lat: number, lng: number) => void;
    selectedLocation: { lat: number, lng: number } | null;
};

export default function MapPicker({ onLocationSelect, selectedLocation }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markerRef = useRef<maplibregl.Marker | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const onLocationSelectRef = useRef(onLocationSelect);
    onLocationSelectRef.current = onLocationSelect;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ lng: number, lat: number, name: string }[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLabel, setSelectedLabel] = useState('');

    const selectLocation = useCallback((lat: number, lng: number, label?: string) => {
        const map = mapRef.current;
        if (!map) return;

        if (markerRef.current) {
            markerRef.current.remove();
        }

        markerRef.current = new maplibregl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);

        map.flyTo({ center: [lng, lat], zoom: 15 });
        onLocationSelectRef.current?.(lat, lng);

        if (label) {
            setSelectedLabel(label);
        }
    }, []);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://tiles.openfreemap.org/styles/liberty',
            center: [selectedLocation?.lng ?? 0, selectedLocation?.lat ?? 0],
            zoom: selectedLocation ? 15 : 1,
        });
        if(!selectedLocation){
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                map.jumpTo({
                    center: [coords.longitude, coords.latitude],
                    zoom: 15,
                });
                // currentLocationMarker = new maplibregl.Marker()
                //     .setLngLat([coords.longitude, coords.latitude])
                //     .addTo(map)
            });
        }

        map.addControl(new maplibregl.NavigationControl());

        map.on('load', () => {
            map.resize();
        });

        const resizeObserver = new ResizeObserver(() => {
            map.resize();
        });
        resizeObserver.observe(mapContainer.current);

        if (selectedLocation?.lat && selectedLocation?.lng) {
            markerRef.current = new maplibregl.Marker()
                .setLngLat([selectedLocation.lng, selectedLocation.lat])
                .addTo(map);
        }

        map.on('click', (e) => {
            const { lng, lat } = e.lngLat;
            selectLocation(lat, lng);
        });

        mapRef.current = map;

        return () => {
            resizeObserver.disconnect();
            markerRef.current?.remove();
            markerRef.current = null;
            map.remove();
            mapRef.current = null;
        };
    }, [selectLocation]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        const timeoutId = setTimeout(() => {
            getLocationFromQuery(searchQuery).then((locations) => {
                setIsSearching(false);
                if (locations) {
                    setSearchResults(locations);
                    setIsOpen(true);
                } else {
                    setSearchResults([]);
                }
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    function handleSelectResult(result: { lng: number, lat: number, name: string }) {
        selectLocation(result.lat, result.lng, result.name);
        setSearchResults([]);
        setSearchQuery('');
        setIsOpen(false);
    }

    const showResults = isOpen && searchQuery.trim().length > 0;

    return (
        <div className="relative">
            <div ref={searchContainerRef} className="absolute top-3 left-3 right-3 z-10">
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search for a location"
                        value={isOpen ? searchQuery : selectedLabel || searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        className="bg-background pl-9 shadow-elevation-1"
                    />
                    {showResults ? (
                        <ul
                            role="listbox"
                            className="absolute top-full z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-outline-variant/40 bg-background shadow-elevation-1"
                        >
                            {isSearching ? (
                                <li className="px-3 py-2 text-sm text-on-surface-variant">
                                    Searching...
                                </li>
                            ) : searchResults.length === 0 ? (
                                <li className="px-3 py-2 text-sm text-on-surface-variant">
                                    No locations found
                                </li>
                            ) : (
                                searchResults.map((result, index) => (
                                    <li key={`${result.lat}-${result.lng}-${index}`}>
                                        <button
                                            type="button"
                                            role="option"
                                            onClick={() => handleSelectResult(result)}
                                            className="flex w-full items-center px-3 py-2 text-left text-sm transition-colors hover:bg-surface-container-low"
                                        >
                                            {result.name}
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    ) : null}
                </div>
            </div>
            <div
                ref={mapContainer}
                className="h-[500px] w-full rounded-lg"
            />
        </div>
    );
}
