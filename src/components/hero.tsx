"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowRight, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/reveal";
import { fadeUp, staggerParent } from "@/lib/motion";

const MARQUEE = [
  "La Habana",
  "Viñales",
  "Varadero",
  "Cojímar",
  "Trinidad",
  "Matanzas",
  "Santiago de Cuba",
  "Cienfuegos"
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="grid-glow relative overflow-hidden text-white">
      {/* Orbes de luz */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <motion.div
          className="absolute left-[8%] top-[10%] h-72 w-72 rounded-full bg-verde-400/25 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[6%] top-[28%] h-80 w-80 rounded-full bg-verde-300/20 blur-3xl"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(8,19,13,0.6),transparent_55%)]" />
      </div>

      <div className="container relative z-10 flex min-h-[100dvh] flex-col justify-center pb-24 pt-28">
        <motion.div
          variants={staggerParent}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <motion.div variants={fadeUp}>
            <span className="eyebrow border border-white/15 bg-white/5 text-verde-200 backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-verde-300" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-verde-300" />
              </span>
              Acceso anticipado · Cuba, 2026
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-7 font-display text-balance text-[2.7rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
          >
            Te damos{" "}
            <span className="bg-gradient-to-r from-verde-200 via-verde-300 to-emerald-400 bg-clip-text text-transparent">
              la verde
            </span>
            .
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
          >
            La Verde te dice qué lugar necesitas para compartir, visitar o comprar, y
            cuál te queda cerca. Pregúntale con tus palabras y llévate la mejor opción.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#mapa"
              className="btn-pill bg-verde-400 text-verde-950 shadow-[0_18px_40px_-12px_rgba(53,175,109,0.6)] hover:bg-verde-300"
            >
              Explorar el mapa
              <span className="grid h-7 w-7 place-items-center rounded-full bg-verde-950/15 transition-transform duration-500 group-hover:translate-y-[1px]">
                <ArrowDown className="h-4 w-4" strokeWidth={2} />
              </span>
            </a>
            <a
              href="#busqueda"
              className="btn-pill border border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              Cómo funciona
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
          </motion.div>

          {/* Pilares */}
          <motion.div
            variants={fadeUp}
            className="mt-12 grid w-full max-w-2xl grid-cols-3 gap-2 divide-x divide-white/10"
          >
            {[
              {
                icon: Sparkles,
                phrase: "La mejor recomendación de lugares",
                tint: "text-emerald-300",
                glow: "bg-verde-400/25"
              },
              {
                icon: MapPin,
                phrase: "Todas las provincias de Cuba",
                tint: "text-verde-300",
                glow: "bg-verde-400/20"
              },
              {
                icon: ShieldCheck,
                phrase: "Indicaciones de calidad",
                tint: "text-verde-200",
                glow: "bg-emerald-400/20"
              }
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.phrase}
                  className="group relative flex flex-col items-center gap-2 px-2 text-center"
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -top-2 h-12 w-12 rounded-full ${p.glow} blur-2xl opacity-60`}
                  />
                  <span
                    className={`relative grid h-9 w-9 place-items-center rounded-full sm:h-11 sm:w-11 ${p.tint}`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
                  </span>
                  <p className="relative font-display text-[12px] leading-tight text-white/70 sm:text-[15px]">
                    {p.phrase}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Marquee inferior */}
      <div className="relative z-10 border-t border-white/10 bg-verde-950/40 py-4">
        <div className="flex overflow-hidden">
          <div className="flex shrink-0 animate-marquee gap-10 pr-10">
            {[...MARQUEE, ...MARQUEE].map((c, i) => (
              <span
                key={i}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-white/50"
              >
                <MapPin className="h-3.5 w-3.5 text-verde-300/70" strokeWidth={2} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}