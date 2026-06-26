'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

type Props = {
    onLocationSelect?: (lat: number, lng: number) => void;
};

export default function MapPicker({ onLocationSelect }: Props) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return;


        const map = new maplibregl.Map({
            container: mapContainer.current, // container id
            style: 'https://demotiles.maplibre.org/style.json', // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1 // starting zoom
        });



        map.addControl(new maplibregl.NavigationControl());

        map.on('load', () => {
            map.resize();
        });

        const resizeObserver = new ResizeObserver(() => {
            map.resize();
        });
        resizeObserver.observe(mapContainer.current);

        let marker: maplibregl.Marker | null = null;

        map.on('click', (e) => {
            const { lng, lat } = e.lngLat;

            if (marker) {
                marker.remove();
            }

            marker = new maplibregl.Marker()
                .setLngLat([lng, lat])
                .addTo(map);

            onLocationSelect?.(lat, lng);
        });

        mapRef.current = map;

        return () => {
            resizeObserver.disconnect();
            map.remove();
            mapRef.current = null;
        };
    }, [onLocationSelect]);

    return (
        <div
            ref={mapContainer}
            style={{
                width: '100%',
                height: '500px',
            }}
        />
    );
}