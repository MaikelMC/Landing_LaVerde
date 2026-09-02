"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { easeSpring } from "@/lib/motion";

const LINKS = [
  { href: "#mapa", label: "El Mapa" },
  { href: "#busqueda", label: "Búsqueda" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#diferente", label: "Por qué La Verde" }
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquea scroll del fondo cuando el overlay está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, open ? 120 : 0);
  };

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: easeSpring, delay: 0.2 }}
      >
        <nav
          className={cn(
            "flex w-full max-w-3xl items-center justify-between rounded-full py-2 pl-4 pr-2 transition-all duration-500",
            scrolled
              ? "bg-verde-950/80 text-white backdrop-blur-xl ring-1 ring-white/10 shadow-card"
              : "bg-verde-950/40 text-white ring-1 ring-white/10 backdrop-blur-md"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-verde-400 to-verde-600 shadow-soft transition-transform duration-500 group-hover:rotate-[8deg]">
              <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 3C20.4 3 11 12.4 11 24c0 17.4 21 36.4 21 36.4S53 41.4 53 24C53 12.4 43.6 3 32 3Z" fill="url(#nav-lv)"/>
                <path d="M32 10.4C23 15.7 16.4 22.4 16.4 30.2a15.6 15.6 0 0 0 31.2 0C47.6 22.4 41 15.7 32 10.4Z" fill="#06211A" opacity="0.3"/>
                <path d="M32 20.6c-5.6 4.4-8.6 8.6-8.6 14a8.6 8.6 0 0 0 17.2 0c0-5.4-3-9.6-8.6-14Z" fill="#0A5C31"/>
                <path d="M32 24.4c-3.6 2.8-5.4 5.5-5.4 9.2a5.4 5.4 0 0 0 10.8 0c0-3.7-1.8-6.4-5.4-9.2Z" fill="#7CE3A8"/>
                <path d="M32 18.5v20" stroke="#EAF7EF" strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
                <defs>
                  <linearGradient id="nav-lv" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#7CE3A8"/>
                    <stop offset="0.55" stopColor="#35AF6D"/>
                    <stop offset="1" stopColor="#0F7A41"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="font-display text-sm font-bold tracking-tight">
              La Verde
            </span>
          </a>

          <div className="flex items-center gap-1">
            <button
              onClick={() => go("#waitlist")}
              className="hidden rounded-full px-4 py-2 text-xs font-semibold text-white/80 transition-colors duration-300 hover:text-white sm:block"
            >
              Únete
            </button>
            <button
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((o) => !o)}
              className="relative grid h-10 w-10 place-items-center rounded-full bg-white/10 transition-colors duration-300 hover:bg-white/20"
            >
              <motion.span
                className="absolute h-0.5 w-4 rounded-full bg-white"
                animate={reduce ? undefined : open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                transition={{ duration: 0.35, ease: easeSpring }}
              />
              <motion.span
                className="absolute h-0.5 w-4 rounded-full bg-white"
                animate={reduce ? undefined : open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                transition={{ duration: 0.35, ease: easeSpring }}
              />
              <span className="sr-only">{open ? "Cerrar" : "Abrir"}</span>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Overlay glass a pantalla completa */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-verde-950/85 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeSpring }}
          >
            <nav className="flex flex-col items-center gap-2 px-6 text-center">
              {LINKS.map((link, i) => (
                <motion.button
                  key={link.href}
                  onClick={() => go(link.href)}
                  className="group relative py-2"
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                >
                  <span className="font-display text-3xl font-bold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-verde-300 sm:text-4xl">
                    {link.label}
                  </span>
                </motion.button>
              ))}
              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
              >
                <button
                  onClick={() => go("#waitlist")}
                  className="rounded-full bg-verde-400 px-7 py-3 text-sm font-bold text-verde-950 shadow-soft transition-transform duration-300 active:scale-[0.98]"
                >
                  Reservar mi cupo
                </button>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}