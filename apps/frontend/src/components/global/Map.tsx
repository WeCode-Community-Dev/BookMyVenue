"use client";

import "ol/ol.css";

import { Icon, Style } from "ol/style";
import React, { useEffect, useRef } from "react";

import Feature from "ol/Feature";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import View from "ol/View";
import { fromLonLat } from "ol/proj";

interface MapComponentProps {
    initialZoom?: number;
    centerCoordinates?: [number, number];
}

export default function MapComponent({
    initialZoom = 13,
    centerCoordinates = [
        0, 0
    ],
}: MapComponentProps) {
    const mapElement = useRef<HTMLDivElement>(null);
    const mapRef = useRef<OLMap | null>(null);

    useEffect(() => {
        const container = mapElement.current;

        // If container isn't mounted yet, return a no-op cleanup function
        if (!container) {
            return () => {
                console.log("hello");
            };
        }

        const osmLayer = new TileLayer({
            source: new OSM(),
        });

        const markerSource = new VectorSource();
        const markerLayer = new VectorLayer({
            source: markerSource,
        });

        const map = new OLMap({
            target: container,
            layers: [
                osmLayer, markerLayer
            ],
            view: new View({
                center: fromLonLat(centerCoordinates),
                zoom: initialZoom,
            }),
        });

        mapRef.current = map;

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

                    map.getView().animate({
                        center: userCoordinates,
                        zoom: 15,
                        duration: 1000,
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

        // Always return a cleanup function
        return () => {
            resizeObserver.disconnect();
            map.setTarget("");
        };
    }, [
        centerCoordinates, initialZoom
    ]);

    return (
        <div
            ref={mapElement}
            className="w-full h-full min-h-[200px] overflow-hidden"
        />
    );
}
