"use client";

import type { Place } from "@/lib/places";
import { categoryMeta } from "@/lib/places";
import { cn } from "@/lib/utils";

/**
 * Mapa estilizado de la ciudad de Santiago de Cuba — sin motor de mapas ni
 * tiles externos (siempre renderiza, estética de marca "ethereal green glass").
 *
 * - Fondo: plano artístico del casco urbano con la bahía al sureste.
 * - Calles: red de avenidas y trazado del casco dibujados, no fotos satélite.
 * - Pins: punto en posición geográfica + tarjeta de etiqueta en parrilla
 *   separada, unida por una fina línea al punto real (nada se solapa).
 * - El pin activo (desde el panel lateral) se resalta.
 */

type Item = {
  place: Place;
  label: string; // nombre corto que cabe en la tarjeta
  anchor: { x: number; y: number }; // posición geográfica (punto real)
  card: { x: number; y: number; w: number }; // posición de la tarjeta
  dir: "left" | "right" | "top" | "bottom"; // lado por donde sale la línea
};

// Vista y 5 eslabones de la vitrina. viewBox = 1000 x 620.
const ITEMS: (Omit<Item, "place"> & { id: string })[] = [
  {
    id: "primos-twice",
    label: "Primos Twice",
    anchor: { x: 470, y: 292 },
    card: { x: 252, y: 288, w: 196 },
    dir: "right"
  },
  {
    id: "casa-de-la-trova",
    label: "Casa de la Trova",
    anchor: { x: 418, y: 228 },
    card: { x: 136, y: 152, w: 208 },
    dir: "bottom"
  },
  {
    id: "hotel-casa-granda",
    label: "Hotel Casa Granda",
    anchor: { x: 402, y: 344 },
    card: { x: 528, y: 330, w: 208 },
    dir: "left"
  },
  {
    id: "melia-santiago",
    label: "Meliá Santiago",
    anchor: { x: 540, y: 438 },
    card: { x: 236, y: 452, w: 212 },
    dir: "right"
  },
  {
    id: "club-led-sports",
    label: "Club LED Sports",
    anchor: { x: 668, y: 220 },
    card: { x: 700, y: 156, w: 204 },
    dir: "left"
  }
];

const CARD_H = 46;

interface StaticMapProps {
  places: Place[];
  selectedId: string | null;
  onSelect: (p: Place) => void;
}

export default function StaticMap({ places, selectedId, onSelect }: StaticMapProps) {
  const items: Item[] = ITEMS.map((it) => ({
    ...it,
    place: places.find((p) => p.id === it.id) ?? places[0]
  })).filter((it) => places.some((p) => p.id === it.id));

  if (items.length === 0) return null;

// Punto de la tarjeta por donde sale la línea hacia el ancla
  const cardEdge = (it: Item) => {
    const c = it.card;
    switch (it.dir) {
      case "right":
        return { x: c.x + c.w + 6, y: c.y };
      case "left":
        return { x: c.x - 6, y: c.y };
      case "top":
        return { x: c.x + c.w / 2, y: c.y - CARD_H / 2 - 6 };
      case "bottom":
        return { x: c.x + c.w / 2, y: c.y + CARD_H / 2 + 6 };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-verde-950">
      <svg
        viewBox="0 0 1000 620"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Mapa estilizado de Santiago de Cuba con lugares recomendados por La Verde"
      >
        <defs>
          <linearGradient id="sc-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0A3B2A" />
            <stop offset="0.55" stopColor="#073124" />
            <stop offset="1" stopColor="#052017" />
          </linearGradient>
          <linearGradient id="sc-bay" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0E6B43" />
            <stop offset="1" stopColor="#083A23" />
          </linearGradient>
          <radialGradient id="sc-glow" cx="0.5" cy="0.42" r="0.6">
            <stop offset="0" stopColor="#35AF6D" stopOpacity="0.22" />
            <stop offset="1" stopColor="#35AF6D" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sc-dot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#52D28A" />
            <stop offset="1" stopColor="#0F7A41" />
          </linearGradient>
        </defs>

        <rect width="1000" height="620" fill="url(#sc-bg)" />
        <rect width="1000" height="620" fill="url(#sc-glow)" />

        {/* ── Bahía de Santiago (sureste) ─────────────────────── */}
        <path
          d="M 640 -40 L 640 250 C 640 320 700 360 780 380 L 1040 430 L 1040 -40 Z"
          fill="url(#sc-bay)"
          opacity="0.92"
        />
        <path
          d="M 640 -40 L 640 250 C 640 320 700 360 780 380 L 1040 430"
          fill="none"
          stroke="#7CE3A8"
          strokeOpacity="0.35"
          strokeWidth="1.6"
        />
        <text x="850" y="300" fill="#9FDDB9" fillOpacity="0.55" fontSize="14" fontFamily="JetBrains Mono, monospace" letterSpacing="2">
          BAHÍA
        </text>
        <text x="850" y="318" fill="#9FDDB9" fillOpacity="0.45" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="3">
          DE SANTIAGO
        </text>

        {/* ── Trazado del casco (calles visibles) ────────────── */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={150 + i * 22}
            y1={80}
            x2={150 + i * 22}
            y2={480}
            stroke="#7CE3A8"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 18 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={150}
            y1={80 + i * 22}
            x2={520}
            y2={80 + i * 22}
            stroke="#7CE3A8"
            strokeOpacity="0.07"
            strokeWidth="1"
          />
        ))}

        {/* Avenida central (Av. de los Libertadores / Deseo) */}
        <path d="M 180 40 L 470 300 L 470 480" fill="none" stroke="#7CE3A8" strokeOpacity="0.22" strokeWidth="3" strokeLinecap="round" />
        {/* Enramadas / Escalera */}
        <path d="M 60 330 L 520 330" fill="none" stroke="#7CE3A8" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />
        {/* Calle Heredia */}
        <path d="M 60 250 L 560 250" fill="none" stroke="#7CE3A8" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        {/* Av. de las Américas (sur) */}
        <path d="M 200 470 L 620 460" fill="none" stroke="#7CE3A8" strokeOpacity="0.14" strokeWidth="2" strokeLinecap="round" />
        {/* Av. Jesús Menéndez (frente a la bahía) */}
        <path d="M 520 300 L 700 350" fill="none" stroke="#7CE3A8" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />
        {/* Av. Manduley (Vista Alegre) */}
        <path d="M 560 120 L 700 240" fill="none" stroke="#7CE3A8" strokeOpacity="0.12" strokeWidth="2" strokeLinecap="round" />

        {/* Centro / Plaza Céspedes */}
        <circle cx="470" cy="292" r="26" fill="#35AF6D" fillOpacity="0.10" />
        <circle cx="470" cy="292" r="3" fill="#7CE3A8" fillOpacity="0.5" />

        {/* ── Barrios (etiquetas) ───────────────────────────── */}
        <text x="120" y="470" fill="#9FDDB9" fillOpacity="0.5" fontSize="15" fontFamily="Space Grotesk, sans-serif" fontWeight="700">
          VISTA ALEGRE
        </text>
        <text x="335" y="196" fill="#9FDDB9" fillOpacity="0.45" fontSize="13" fontFamily="Space Grotesk, sans-serif" fontWeight="700" letterSpacing="1">
          CASCO HISTÓRICO
        </text>
        <text x="150" y="545" fill="#9FDDB9" fillOpacity="0.4" fontSize="13" fontFamily="Space Grotesk, sans-serif" fontWeight="600" letterSpacing="1">
          SUEÑO
        </text>
        <text x="700" y="470" fill="#9FDDB9" fillOpacity="0.35" fontSize="12" fontFamily="Space Grotesk, sans-serif" fontWeight="600" letterSpacing="1">
          PUERTO
        </text>

        {/* ── Líneas de ancla a los puntos reales ───────────── */}
        {items.map((it) => {
          const a = it.anchor;
          const e = cardEdge(it);
          const mid = { x: (a.x + e.x) / 2, y: (a.y + e.y) / 2 };
          return (
            <path
              key={`ln-${it.place.id}`}
              d={`M ${e.x} ${e.y} C ${mid.x} ${e.y}, ${mid.x} ${a.y}, ${a.x} ${a.y}`}
              fill="none"
              stroke="#7CE3A8"
              strokeOpacity={it.place.id === selectedId ? 0.9 : 0.4}
              strokeWidth={it.place.id === selectedId ? 1.8 : 1.3}
              strokeDasharray="2 5"
              strokeLinecap="round"
            />
          );
        })}

        {/* ── Puntos geográficos reales ─────────────────────── */}
        {items.map((it) => (
          <circle
            key={`dot-${it.place.id}`}
            cx={it.anchor.x}
            cy={it.anchor.y}
            r={it.place.id === selectedId ? 7 : 5}
            fill="url(#sc-dot)"
            stroke="#FFFFFF"
            strokeWidth={2}
            className="laverde-dot"
          />
        ))}

        {/* ── Tarjetas de etiqueta (parrilla sin solape) ─────── */}
        {items.map((it) => {
          const active = it.place.id === selectedId;
          const meta = categoryMeta(it.place.category);
          return (
            <g
              key={`card-${it.place.id}`}
              onClick={() => it.place && onSelect(it.place)}
              className={cn("laverde-card", active && "laverde-card-active")}
            >
              <rect
                x={it.card.x}
                y={it.card.y - CARD_H / 2}
                width={it.card.w}
                height={CARD_H}
                rx={CARD_H / 2}
                fill={active ? "#FBF9F4" : "#F6F3EC"}
                fillOpacity={active ? 1 : 0.96}
                stroke={active ? "#35AF6D" : "#0E1513"}
                strokeOpacity={active ? 0.6 : 0.12}
                strokeWidth={active ? 1.8 : 1}
              />
              <rect
                x={it.card.x + 6}
                y={it.card.y - CARD_H / 2 + 6}
                width={CARD_H - 12}
                height={CARD_H - 12}
                rx={(CARD_H - 12) / 2}
                fill="#35AF6D"
                fillOpacity="0.16"
              />
              <text x={it.card.x + (CARD_H - 12) / 2 + 6} y={it.card.y + 5} textAnchor="middle" fontSize="16">
                {meta.emoji}
              </text>
              <text
                x={it.card.x + CARD_H}
                y={it.card.y - 3}
                fontSize="14"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
                fill={active ? "#0F7A41" : "#08130D"}
              >
                {it.label}
              </text>
              <text
                x={it.card.x + CARD_H}
                y={it.card.y + 13}
                fontSize="10.5"
                fontWeight="500"
                fill="#1B2A21"
                fillOpacity="0.55"
              >
                {meta.label}
              </text>
            </g>
          );
        })}
      </svg>

      <style jsx>{`
        .laverde-card {
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
        }
        .laverde-card:hover {
          transform: translateY(-2px);
          filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.28));
        }
        .laverde-dot {
          transition: r 0.25s ease;
        }
      `}</style>
    </div>
  );
}
