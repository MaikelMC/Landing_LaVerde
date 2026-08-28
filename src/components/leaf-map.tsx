"use client";

import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/lib/places";
import { CATEGORY_META } from "@/lib/places";

// Bounding box de Cuba para el encuadre inicial y la delimitación de la vista
const CUBA_BOUNDS: L.LatLngBoundsExpression = [
  [19.8, -85.0],
  [23.3, -74.0]
];

// Pin premium personalizado (centrado en la coordenada para no desbordar al mar)
function makePin(selected: boolean) {
  const el = document.createElement("div");
  el.style.cssText = `
    width:34px;height:34px;border-radius:9999px;
    background:linear-gradient(135deg, #35AF6D, #0F7A41);
    border:3px solid #ffffff;
    box-shadow:0 8px 18px rgba(8,19,13,0.35);
    display:grid;place-items:center;
    ${selected ? "outline:5px solid rgba(53,175,109,0.30);outline-offset:2px;" : ""}
  `;
  const dot = document.createElement("div");
  dot.style.cssText = "width:10px;height:10px;border-radius:9999px;background:#fff;";
  el.appendChild(dot);
  return L.divIcon({ html: el.outerHTML, iconSize: [34, 34], iconAnchor: [17, 17], className: "" });
}

// Pin de cluster (agrupa puntos que se solapan en zoom bajo)
function makeClusterIcon(count: number) {
  const el = document.createElement("div");
  el.style.cssText = `display:grid;place-items:center;width:46px;height:46px;border-radius:9999px;background:linear-gradient(135deg,#35AF6D,#0F7A41);color:#fff;font-weight:700;font-size:16px;border:3px solid #fff;box-shadow:0 8px 18px rgba(8,19,13,0.35);`;
  el.textContent = String(count);
  return L.divIcon({ html: el.outerHTML, iconSize: [46, 46], iconAnchor: [23, 23], className: "" });
}

// Componente que reacciona a la selección: vuela al lugar
function FlyToSelection({
  places,
  selectedId
}: {
  places: Place[];
  selectedId: string | null;
}) {
  const map = useMap();
  const prev = useRef<string | null>(null);
  useEffect(() => {
    if (selectedId && selectedId !== prev.current) {
      const place = places.find((p) => p.id === selectedId);
      if (place) {
        map.flyTo([place.lat, place.lng], 14, { duration: 1.4, easeLinearity: 0.2 });
      }
    }
    prev.current = selectedId;
  }, [selectedId, places, map]);
  return null;
}

// La rueda del ratón sobre el mapa no debe secuestrar el scroll de la página.
// El zoom con rueda se desactiva por defecto y solo se activa al hacer clic o
// dar foco al mapa. Además se reduce su sensibilidad para que no "brinque".
function ScrollZoomOnFocus() {
  const map = useMap();

  useEffect(() => {
    const wheel = map.scrollWheelZoom as L.Handler & {
      options: { wheelPxPerZoomLevel: number; wheelDebounceTime: number };
    };
    if (wheel?.options) {
      wheel.options.wheelPxPerZoomLevel = 170;
      wheel.options.wheelDebounceTime = 90;
    }
    map.scrollWheelZoom.disable();

    const enable = () => map.scrollWheelZoom.enable();
    const onBlur = () => map.scrollWheelZoom.disable();
    map.on("focus", enable);
    map.on("click", enable);
    map.on("blur", onBlur);
    return () => {
      map.off("focus", enable);
      map.off("click", enable);
      map.off("blur", onBlur);
      map.scrollWheelZoom.disable();
    };
  }, [map]);

  return null;
}

// Encuadra Cuba al cargar
function InitialFit() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.fitBounds(CUBA_BOUNDS, { padding: [24, 24] });
  }, [map]);
  return null;
}

// Sincroniza el zoom del mapa con el estado para recalcular los clusters
function MapSync({
  onMap,
  onZoom
}: {
  onMap: (m: L.Map) => void;
  onZoom: (z: number) => void;
}) {
  const map = useMap();
  useEffect(() => {
    onMap(map);
    const handler = () => onZoom(map.getZoom());
    map.on("zoomend", handler);
    return () => {
      map.off("zoomend", handler);
    };
  }, [map, onMap, onZoom]);
  return null;
}

type ClusterItem =
  | { type: "pin"; key: string; place: Place; pos: [number, number] }
  | {
      type: "cluster";
      key: string;
      count: number;
      places: Place[];
      pos: [number, number];
    };

// Agrupa los puntos que caen en la misma celda según el zoom (declutter)
function buildItems(places: Place[], zoom: number): ClusterItem[] {
  if (zoom >= 13) {
    return places.map((p) => ({
      type: "pin",
      key: p.id,
      place: p,
      pos: [p.lat, p.lng]
    }));
  }

  const cellSize = 0.6 / Math.pow(2, zoom - 7);
  const groups = new Map<string, Place[]>();
  for (const p of places) {
    const k = `${Math.floor(p.lat / cellSize)}_${Math.floor(p.lng / cellSize)}`;
    const g = groups.get(k);
    if (g) g.push(p);
    else groups.set(k, [p]);
  }

  const out: ClusterItem[] = [];
  for (const [, arr] of groups) {
    if (arr.length === 1) {
      out.push({
        type: "pin",
        key: arr[0].id,
        place: arr[0],
        pos: [arr[0].lat, arr[0].lng]
      });
    } else {
      const lat = arr.reduce((s, p) => s + p.lat, 0) / arr.length;
      const lng = arr.reduce((s, p) => s + p.lng, 0) / arr.length;
      out.push({
        type: "cluster",
        key: `c_${lat.toFixed(4)}_${lng.toFixed(4)}`,
        count: arr.length,
        places: arr,
        pos: [lat, lng]
      });
    }
  }
  return out;
}

interface LeafMapProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (p: Place) => void;
}

export default function LeafMap({ places, selectedId, onSelect }: LeafMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const [zoom, setZoom] = useState(7);

  const iconsById = useMemo(() => {
    const m: Record<string, L.DivIcon> = {};
    for (const p of places) m[p.id] = makePin(p.id === selectedId);
    return m;
  }, [places, selectedId]);

  const items = useMemo(() => buildItems(places, zoom), [places, zoom]);

  return (
    <MapContainer
      center={[22.0, -79.5]}
      zoom={7}
      minZoom={6}
      maxZoom={17}
      zoomControl={false}
      preferCanvas
      scrollWheelZoom={false}
      maxBounds={CUBA_BOUNDS}
      maxBoundsViscosity={0.9}
      className="z-0 h-full w-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap
      />
      <InitialFit />
      <FlyToSelection places={places} selectedId={selectedId} />
      <ScrollZoomOnFocus />
      <MapSync onMap={(m) => (mapRef.current = m)} onZoom={setZoom} />
      <ZoomControl position="bottomright" />
      {items.map((item) =>
        item.type === "pin" ? (
          <Marker
            key={item.key}
            position={item.pos}
            icon={iconsById[item.place.id]}
            eventHandlers={{ click: () => onSelect(item.place) }}
          >
            <Popup closeButton={false} minWidth={220}>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wide text-verde-300">
                  {CATEGORY_META[item.place.category].emoji}{" "}
                  {CATEGORY_META[item.place.category].label} ·{" "}
                  {item.place.priceLabel}
                </div>
                <div className="mt-1 font-display text-base font-bold text-white">
                  {item.place.name}
                </div>
                <div className="text-xs text-white/60">
                  {item.place.city}, {item.place.province}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item.place);
                  }}
                  className="mt-2 w-full rounded-full bg-verde-400 py-1.5 text-xs font-bold text-verde-950"
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ) : (
          <Marker
            key={item.key}
            position={item.pos}
            icon={makeClusterIcon(item.count)}
            eventHandlers={{
              click: () => {
                const m = mapRef.current;
                if (!m) return;
                m.flyToBounds(
                  L.latLngBounds(
                    item.places.map((p) => [p.lat, p.lng] as [number, number])
                  ),
                  { padding: [70, 70], maxZoom: 15, duration: 1 }
                );
              }
            }}
          />
        )
      )}
    </MapContainer>
  );
}
