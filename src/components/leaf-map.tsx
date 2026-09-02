"use client";

import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Place } from "@/lib/places";

/**
 * Mapa estático de Santiago de Cuba — sin interacción (zoom, pan y drag
 * deshabilitados). Muestra solo los 5 negocios destacados como pin limpio.
 * Seleccionar un lugar desde el panel resalta su pin con un anillo.
 */

const SANTIAGO_CENTER: L.LatLngTuple = [20.02, -75.823];
const SANTIAGO_ZOOM = 14;

// Pin de ubicación premium (teardrop verde con punto blanco)
function makePin(selected: boolean) {
  const size = selected ? [28, 38] : [24, 32];
  const scale = selected ? 1 : 0.85;
  const el = document.createElement("div");
  el.style.cssText = `
    width:${size[0]}px; height:${size[1]}px;
    transform: scale(${scale});
    transform-origin: bottom center;
    filter: drop-shadow(0 3px 6px rgba(8,19,13,0.45));
    transition: transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s ease;
  `;
  el.innerHTML = `
    <svg viewBox="0 0 24 36" width="${size[0]}" height="${size[1]}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pg${selected ? "s" : "d"}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#52D28A"/>
          <stop offset="1" stop-color="#0F7A41"/>
        </linearGradient>
      </defs>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24C24 5.37 18.63 0 12 0z"
            fill="url(#pg${selected ? "s" : "d"})"/>
      <circle cx="12" cy="12" r="${selected ? 5 : 4}" fill="white"/>
      ${selected ? '<circle cx="12" cy="12" r="8" fill="none" stroke="rgba(53,175,109,0.4)" stroke-width="2"/>' : ""}
    </svg>
  `;
  return L.divIcon({
    html: el.outerHTML,
    iconSize: size as [number, number],
    iconAnchor: [size[0] / 2, size[1]] as [number, number],
    className: ""
  });
}

// Sincroniza el mapa con la selección (resalta pin sin mover la vista)
function SyncSelection({
  places,
  selectedId
}: {
  places: Place[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId || !map) return;
    const place = places.find((p) => p.id === selectedId);
    if (place) {
      // Centrar sutilmente en el pin seleccionado sin zoom
      map.panTo([place.lat, place.lng], { animate: true, duration: 0.6 });
    }
  }, [selectedId, places, map]);
  return null;
}

interface LeafMapProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (p: Place) => void;
}

export default function LeafMap({ places, selectedId, onSelect }: LeafMapProps) {
  const iconsById = useMemo(() => {
    const m: Record<string, L.DivIcon> = {};
    for (const p of places) m[p.id] = makePin(p.id === selectedId);
    return m;
  }, [places, selectedId]);

  return (
    <MapContainer
      center={SANTIAGO_CENTER}
      zoom={SANTIAGO_ZOOM}
      zoomControl={false}
      attributionControl
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      touchZoom={false}
      keyboard={false}
      zoomSnap={0}
      zoomDelta={0}
      className="z-0 h-full w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap
      />
      <SyncSelection places={places} selectedId={selectedId} />
      {places.map((p) => (
        <Marker
          key={p.id}
          position={[p.lat, p.lng]}
          icon={iconsById[p.id]}
          eventHandlers={{ click: () => onSelect(p) }}
        />
      ))}
    </MapContainer>
  );
}
