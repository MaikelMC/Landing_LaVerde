"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { PROVINCIAS } from "@/lib/provincias";

interface ProvinciaSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  tone?: "sand" | "white";
}

type Coords = { left: number; width: number } & ({ top: number } | { bottom: number });

const PANEL_MAX_H = 288;

export default function ProvinciaSelect({
  value,
  onChange,
  placeholder,
  ariaLabel,
  tone = "sand"
}: ProvinciaSelectProps) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  function measure() {
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - r.bottom;
    const spaceAbove = r.top;
    const base = { left: r.left, width: r.width };
    if (spaceBelow < PANEL_MAX_H + 16 && spaceAbove > spaceBelow) {
      setCoords({ ...base, bottom: window.innerHeight - r.top + 8 });
    } else {
      setCoords({ ...base, top: r.bottom + 8 });
    }
  }

  function openPanel() {
    setOpen(true);
    requestAnimationFrame(() => measure());
  }

  function toggle() {
    if (open) setOpen(false);
    else openPanel();
  }

  function select(p: string) {
    onChange(p);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onViewportChange() {
      measure();
    }
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function initialActive() {
    return value ? PROVINCIAS.indexOf(value as (typeof PROVINCIAS)[number]) : 0;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setActive(initialActive());
        openPanel();
        return;
      }
      setActive((i) => Math.min(i + 1, PROVINCIAS.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (open) setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open && active >= 0) {
        select(PROVINCIAS[active]);
      } else {
        setActive(initialActive());
        openPanel();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  const toneCls =
    tone === "sand"
      ? "bg-sand/60 focus-within:bg-sand"
      : "bg-white/80 focus-within:bg-white";

  const panelStyle: React.CSSProperties = {
    position: "fixed",
    left: coords?.left,
    width: coords?.width,
    maxHeight: PANEL_MAX_H,
    ...(coords && "top" in coords ? { top: coords.top } : { bottom: coords?.bottom })
  };

  return (
    <>
      <div
        ref={rootRef}
        className="relative"
        onKeyDown={onKeyDown}
      >
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={ariaLabel}
          onClick={toggle}
          className={cn(
            "flex w-full items-center gap-2 rounded-2xl px-3.5 py-3 text-left text-sm transition-colors",
            toneCls,
            open && "ring-1 ring-verde-500/40"
          )}
        >
          <MapPin
            className={cn(
              "h-4 w-4 shrink-0",
              value ? "text-verde-600" : "text-verde-600/60"
            )}
            strokeWidth={2}
          />
          <span
            className={cn(
              "flex-1 truncate font-medium",
              value ? "text-ink" : "text-ink-soft/40"
            )}
          >
            {value || placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-ink-soft/40 transition-transform duration-300",
              open && "rotate-180"
            )}
            strokeWidth={2}
          />
        </button>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && coords && (
              <motion.ul
                ref={panelRef}
                role="listbox"
                style={panelStyle}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="z-50 overflow-y-auto rounded-2xl border border-sand-deep bg-white p-1.5 shadow-card-hover"
              >
                {PROVINCIAS.map((p, i) => {
                  const selected = p === value;
                  return (
                    <li key={p}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => select(p)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          i === active ? "bg-sand" : "bg-transparent",
                          selected ? "font-semibold text-verde-700" : "text-ink"
                        )}
                      >
                        <span className="flex-1 truncate">{p}</span>
                        {selected && (
                          <Check className="h-4 w-4 text-verde-600" strokeWidth={2.5} />
                        )}
                      </button>
                    </li>
                  );
                })}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}