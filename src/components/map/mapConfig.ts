import MapLibreGL from "maplibre-gl";

export const DEFAULT_ZOOM = 13;
export const DEFAULT_CENTER: [number, number] = [75.3704, 11.8745]; // Kannur [lng, lat]

export const TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const ATTRIBUTION = "© OpenStreetMap contributors";

// Custom blank style configuration using OpenStreetMap raster tiles
export const OSM_STYLE: MapLibreGL.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: [TILE_URL],
      tileSize: 256,
      attribution: ATTRIBUTION
    }
  },
  layers: [
    {
      id: "osm-layer",
      type: "raster",
      source: "osm",
      minzoom: 0,
      maxzoom: 19
    }
  ]
};
