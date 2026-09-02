import { Building2, Sparkles, UserRound } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-verde-950 pb-10 pt-16 text-white/60">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-verde-400 to-verde-600">
                <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 3C20.4 3 11 12.4 11 24c0 17.4 21 36.4 21 36.4S53 41.4 53 24C53 12.4 43.6 3 32 3Z" fill="url(#ft-lv)"/>
                  <path d="M32 10.4C23 15.7 16.4 22.4 16.4 30.2a15.6 15.6 0 0 0 31.2 0C47.6 22.4 41 15.7 32 10.4Z" fill="#06211A" opacity="0.3"/>
                  <path d="M32 20.6c-5.6 4.4-8.6 8.6-8.6 14a8.6 8.6 0 0 0 17.2 0c0-5.4-3-9.6-8.6-14Z" fill="#0A5C31"/>
                  <path d="M32 24.4c-3.6 2.8-5.4 5.5-5.4 9.2a5.4 5.4 0 0 0 10.8 0c0-3.7-1.8-6.4-5.4-9.2Z" fill="#7CE3A8"/>
                  <path d="M32 18.5v20" stroke="#EAF7EF" strokeWidth="1.8" strokeLinecap="round" opacity="0.9"/>
                  <defs>
                    <linearGradient id="ft-lv" x1="12" y1="4" x2="52" y2="60" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#7CE3A8"/>
                      <stop offset="0.55" stopColor="#35AF6D"/>
                      <stop offset="1" stopColor="#0F7A41"/>
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              <span className="font-display text-base font-bold">La Verde</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Te pasamos la verde: el lugar correcto cerca de ti, para compartir,
              visitar o comprar. Señalado por gente local, impulsado por IA.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Producto
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["El Mapa", "#mapa"],
                ["Búsqueda", "#busqueda"],
                ["Cómo funciona", "#como-funciona"],
                ["Por qué La Verde", "#diferente"]
              ].map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-verde-300">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Creado por
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verde-300" strokeWidth={2} />
                <span>
                  <span className="font-semibold text-white/80">Maikel de Armas Mourlot</span>
                  <br />
                  creador de La Verde
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-verde-300" strokeWidth={2} />
                <a
                  href="https://kynari.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white/80 transition-colors hover:text-verde-200"
                >
                  Kynari
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 shrink-0 text-verde-300" strokeWidth={2} />
                Potencia tu vida con IA
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row">
          <p>© {new Date().getFullYear()} La Verde. Pasándote la verde en Cuba.</p>
          <p className="text-center sm:text-right">
            Lanzamiento anticipado 2026 ·{" "}
            <a href="#waitlist" className="text-verde-300 hover:text-verde-200">
              ¿Te damos la verde?
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}