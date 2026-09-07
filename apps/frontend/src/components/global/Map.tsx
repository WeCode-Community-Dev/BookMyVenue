"use client";

import "ol/ol.css";

import { Icon, Style } from "ol/style";
import React, { useEffect, useRef, useState } from "react";

import Feature from "ol/Feature";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import XYZ from "ol/source/XYZ";
import { easeOut } from "ol/easing";
import { fromLonLat } from "ol/proj";

interface MapComponentProps {
    initialZoom?: number;
    centerCoordinates?: [number, number];
}
// m: Roadmap, y: Hybrid
type MapProvider = "osm" | "google";
type GoogleMapType = "m" | "y";
// Starts zoomed out for dramatic fly-in intro effect
export default function MapComponent({
    initialZoom = 2,
    centerCoordinates = [
        0, 0
    ],
}: MapComponentProps) {
    const mapElement = useRef<HTMLDivElement>(null);
    const mapRef = useRef<OLMap | null>(null);
    const osmLayerRef = useRef<TileLayer<OSM> | null>(null);
    const googleLayerRef = useRef<TileLayer<XYZ> | null>(null);

    const [
        provider, setProvider
    ] = useState<MapProvider>("osm");

    const [
        googleType, setGoogleType
    ] = useState<GoogleMapType>("y");

    useEffect(() => {
        const container = mapElement.current;

        if (!container) {
            return () => {
                // Container unmounted
            };
        }

        // 1. OpenStreetMap Layer
        const osmLayer = new TileLayer({
            source: new OSM(),
            visible: provider === "osm",
        });
        osmLayerRef.current = osmLayer;

        // 2. Google Maps XYZ Layer
        const googleLayer = new TileLayer({
            source: new XYZ({
                url: `https://mt1.google.com/vt/lyrs=${googleType}&x={x}&y={y}&z={z}`,
                maxZoom: 20,
            }),
            visible: provider === "google",
        });
        googleLayerRef.current = googleLayer;

        // 3. Vector Layer for Geolocation Marker
        const markerSource = new VectorSource();
        const markerLayer = new VectorLayer({
            source: markerSource,
        });

        // 4. Map Initialization (Starts with standard overview view)
        const map = new OLMap({
            target: container,
            layers: [
                osmLayer, googleLayer, markerLayer
            ],
            view: new View({
                center: fromLonLat(centerCoordinates),
                zoom: initialZoom,
            }),
        });

        mapRef.current = map;

        // 5. User Geolocation with Animated Cinematic Fly-In Zoom
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { longitude, latitude } = position.coords;
                    const userCoordinates = fromLonLat([
                        longitude, latitude
                    ]);

                    const svgMarker = `
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="#4285F4" fill-opacity="0.25"/>
                        <circle cx="16" cy="16" r="8" fill="#ffffff"/>
                        <circle cx="16" cy="16" r="6" fill="#4285F4"/>
                      </svg>
                    `;

                    const locationFeature = new Feature({
                        geometry: new Point(userCoordinates),
                    });

                    locationFeature.setStyle(
                        new Style({
                            image: new Icon({
                                src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarker)}`,
                                anchor: [
                                    0.5, 0.5
                                ],
                            }),
                        })
                    );

                    markerSource.addFeature(locationFeature);

                    // Smooth fly-in zoom animation sequence
                    map.getView().animate({
                        center: userCoordinates,
                        zoom: 15,
                        // 2.5 seconds smooth transition
                        duration: 2500,
                        easing: easeOut,
                    });
                },
                (error) => {
                    console.warn("Geolocation error:", error.message);
                }
            );
        }

        const resizeObserver = new ResizeObserver(() => {
            map.updateSize();
        });

        resizeObserver.observe(container);

        return () => {
            resizeObserver.disconnect();
            map.setTarget("");
        };
    }, [
        centerCoordinates, initialZoom
    ]);

    // Handle primary map provider toggle
    const handleProviderChange = (newProvider: MapProvider) => {
        setProvider(newProvider);
        if (osmLayerRef.current) {
            osmLayerRef.current.setVisible(newProvider === "osm");
        }

        if (googleLayerRef.current) {
            googleLayerRef.current.setVisible(newProvider === "google");
        }
    };

    // Handle Google sub-layer type change
    const handleGoogleTypeChange = (type: GoogleMapType) => {
        setGoogleType(type);
        if (googleLayerRef.current) {
            googleLayerRef.current.setSource(
                new XYZ({
                    url: `https://mt1.google.com/vt/lyrs=${type}&x={x}&y={y}&z={z}`,
                    maxZoom: 20,
                })
            );
        }
    };

    return (
        <div className="relative w-full h-full min-h-[200px]">
            {/* Map Canvas */}
            <div ref={mapElement} className="w-full h-full overflow-hidden" />

            {/* Floating Controls (Transparent Theme) */}
            <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-2">
                {/* Main Provider Selector */}
                <div className={
                    "flex bg-black/20 backdrop-blur-md p-1 rounded-lg " +
                    "border border-white/30 text-xs font-medium shadow-lg"
                }>
                    <button
                        type="button"
                        onClick={() => {
                            return handleProviderChange("osm");
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all ${provider === "osm"
                            ? "bg-white/40 text-white font-semibold border border-white/50 shadow-sm"
                            : "text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
                        }`}
                    >
                        OSM
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            return handleProviderChange("google");
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all ${provider === "google"
                            ? "bg-white/40 text-white font-semibold border border-white/50 shadow-sm"
                            : "text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
                        }`}
                    >
                        Google Maps
                    </button>
                </div>

                {/* Sub-Selector: Only Roadmap & Hybrid */}
                {provider === "google" && (
                    <div className={
                        "flex bg-black/20 backdrop-blur-md p-1 rounded-lg " +
                        "border border-white/30 text-xs font-medium gap-1 shadow-lg"
                    }>
                        <button
                            type="button"
                            onClick={() => {
                                return handleGoogleTypeChange("m");
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all ${googleType === "m"
                                ? "bg-white/40 text-white font-semibold border border-white/50 shadow-sm"
                                : "text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
                            }`}
                        >
                            Roadmap
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                return handleGoogleTypeChange("y");
                            }}
                            className={`px-2.5 py-1 rounded-md transition-all ${googleType === "y"
                                ? "bg-white/40 text-white font-semibold border border-white/50 shadow-sm"
                                : "text-white/80 hover:bg-white/20 hover:text-white bg-transparent"
                            }`}
                        >
                            Satellite
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
