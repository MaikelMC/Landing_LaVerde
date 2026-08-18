"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  MousePointerClick,
  PartyPopper,
  Phone,
  RotateCcw,
  Store,
  User,
  Users
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ProvinciaSelect from "@/components/provincia-select";

type Tipo = "usuario" | "negocio";
type Status = "idle" | "loading" | "success" | "error";

const JOIN_KEY = "la-verde-ya-quiero";

const OPCIONES_TIPO: {
  value: Tipo;
  label: string;
  hint: string;
  icon: typeof User;
}[] = [
  {
    value: "usuario",
    label: "Quiero usarla",
    hint: "busco lugares cerca",
    icon: User
  },
  {
    value: "negocio",
    label: "Tengo un negocio",
    hint: "quiero pertenecer",
    icon: Store
  }
];

interface WaitlistFormProps {
  tipo: Tipo;
  onTipoChange: (tipo: Tipo) => void;
}

export default function WaitlistForm({ tipo, onTipoChange }: WaitlistFormProps) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [provincia, setProvincia] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [pos, setPos] = useState<number | null>(null);
  const [usuarios, setUsuarios] = useState(0);
  const [joined, setJoined] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let active = true;
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d) => {
        if (active && d?.ok) setUsuarios(d.usuarios ?? 0);
      })
      .catch(() => {});
    try {
      if (localStorage.getItem(JOIN_KEY) === "1") setJoined(true);
    } catch {}
    return () => {
      active = false;
    };
  }, []);

  const puedeEnviar =
    nombre.trim().length >= 2 &&
    telefono.trim().replace(/[^\d]/g, "").length >= 7 &&
    provincia !== "";

  async function enviar(payload: Record<string, string>): Promise<boolean> {
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setPos(data?.position ?? null);
        if (data?.usuarios != null) setUsuarios(data.usuarios);
        setStatus("success");
        return true;
      }
      setStatus("error");
      return false;
    } catch {
      setStatus("error");
      return false;
    }
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!puedeEnviar) return;
    enviar({
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      provincia: provincia.trim(),
      tipo: "negocio",
      source: "preview"
    });
  }

  async function sumarUsuario() {
    if (joined || provincia === "") return;
    const ok = await enviar({
      provincia: provincia.trim(),
      tipo: "usuario",
      source: "preview"
    });
    if (ok) {
      setJoined(true);
      try {
        localStorage.setItem(JOIN_KEY, "1");
      } catch {}
    }
  }

  const reset = () => {
    setStatus("idle");
    setNombre("");
    setTelefono("");
    setProvincia("");
    onTipoChange("usuario");
  };

  const nombreCorto = nombre.trim().split(/\s+/)[0] || "vecino";

  return (
    <div className="mx-auto w-full max-w-lg">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-4xl border border-verde-400/30 bg-verde-50/70 p-8 text-center"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-verde-100 text-verde-700">
              <PartyPopper className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h3 className="mt-4 font-display text-2xl font-bold text-ink">
              {tipo === "negocio" ? `¡Listo, ${nombreCorto}!` : "¡Dentro!"}
            </h3>
            {tipo === "negocio" ? (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
                Anotamos tu negocio en la lista de pertenencia. Te llamamos al{" "}
                <span className="font-semibold text-verde-700">{telefono}</span> en
                cuanto abra la puerta.
              </p>
            ) : (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
                Te avisamos apenas abra la puerta. No necesitas dar nada más.
              </p>
            )}
            {pos && tipo === "negocio" ? (
              <p className="mt-3 text-sm text-ink-soft/80">
                Eres el número{" "}
                <span className="font-display text-lg font-bold text-verde-600">
                  {pos}
                </span>{" "}
                de la lista.
              </p>
            ) : null}
            {tipo === "usuario" && (
              <p className="mt-3 text-sm text-ink-soft/80">
                <span className="font-display text-lg font-bold text-verde-600">
                  {usuarios}
                </span>{" "}
                personas ya quieren usarla.
              </p>
            )}
            <button
              onClick={reset}
              className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-verde-700 transition-colors hover:text-verde-600"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
              {tipo === "negocio" ? "Anotar a otro" : "Volver"}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="shell-light"
          >
            <div className="core p-2">
              <div className="rounded-[calc(2rem-10px)] bg-white p-2">
                {/* Tipo: usar o pertenecer */}
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-sand p-1">
                  {OPCIONES_TIPO.map((o) => {
                    const active = tipo === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => onTipoChange(o.value)}
                        className={cn(
                          "flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5 text-center transition-all duration-300",
                          active
                            ? "bg-verde-600 text-white shadow-soft"
                            : "text-ink-soft/70 hover:bg-white"
                        )}
                        aria-pressed={active}
                      >
                        <span className="flex items-center gap-1.5 text-sm font-bold">
                          <o.icon className="h-4 w-4" strokeWidth={2} />
                          {o.label}
                        </span>
                        <span
                          className={cn(
                            "text-[10px]",
                            active ? "text-verde-100" : "text-ink-soft/50"
                          )}
                        >
                          {o.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {tipo === "negocio" ? (
                  <form onSubmit={submit} className="mt-2">
                    {/* Nombre */}
                    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-sand/60 px-3.5 transition-colors focus-within:bg-sand">
                      <User className="h-4 w-4 shrink-0 text-verde-600" strokeWidth={2} />
                      <input
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nombre de tu negocio"
                        aria-label="Nombre del negocio"
                        className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none"
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="mt-2 flex items-center gap-2 rounded-2xl bg-sand/60 px-3.5 transition-colors focus-within:bg-sand">
                      <Phone className="h-4 w-4 shrink-0 text-verde-600" strokeWidth={2} />
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        placeholder="+53 5 1234567"
                        aria-label="Número de teléfono"
                        className="w-full bg-transparent py-3 text-sm text-ink placeholder:text-ink-soft/40 focus:outline-none"
                      />
                    </div>
                    <p className="mt-1.5 px-2 text-[11px] text-ink-soft/50">
                      Te contactamos por llamada o WhatsApp, sin spam.
                    </p>

                    {/* Provincia */}
                    <div className="mt-2">
                      <ProvinciaSelect
                        value={provincia}
                        onChange={setProvincia}
                        placeholder="Provincia del negocio"
                        ariaLabel="Provincia del negocio"
                        tone="sand"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!puedeEnviar || status === "loading"}
                      className={cn(
                        "btn-pill mt-3 w-full bg-verde-600 py-3.5 text-white shadow-soft hover:bg-verde-500 disabled:cursor-not-allowed disabled:opacity-50"
                      )}
                    >
                      {status === "loading" ? (
                        <Loader2
                          className={cn("h-4 w-4", reduce ? "" : "animate-spin")}
                          strokeWidth={2}
                        />
                      ) : (
                        <span className="font-bold">Reservar cupo →</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="mt-3 rounded-2xl bg-sand/60 p-4 text-center">
                    <Users className="mx-auto h-6 w-6 text-verde-600" strokeWidth={1.8} />
                    <p className="mt-2 text-sm text-ink-soft/80">
                      Súmate con un toque: solo elige tu provincia.
                    </p>
                    <div className="mt-2">
                      <ProvinciaSelect
                        value={provincia}
                        onChange={setProvincia}
                        placeholder="¿En qué provincia estás?"
                        ariaLabel="Tu provincia"
                        tone="white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={sumarUsuario}
                      disabled={joined || provincia === "" || status === "loading"}
                      className={cn(
                        "btn-pill mt-3 w-full bg-verde-600 py-3.5 text-white shadow-soft hover:bg-verde-500 disabled:cursor-not-allowed disabled:opacity-60"
                      )}
                    >
                      {status === "loading" ? (
                        <Loader2
                          className={cn("h-4 w-4", reduce ? "" : "animate-spin")}
                          strokeWidth={2}
                        />
                      ) : joined ? (
                        <span className="flex items-center justify-center gap-1.5 font-bold">
                          <CheckCircle2 className="h-4 w-4" strokeWidth={2.2} />
                          Ya estás dentro
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1.5 font-bold">
                          <MousePointerClick className="h-4 w-4" strokeWidth={2} />
                          Quiero usarla
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            {status === "error" && (
              <p className="mt-3 px-2 text-center text-xs text-red-500">
                Algo salió mal. Inténtalo de nuevo en un momento.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-5 flex items-center justify-center gap-6 text-xs text-white/75">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-verde-300" strokeWidth={2} />
          Sin spam, sin compromiso
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-verde-300" strokeWidth={2} />
          Recomendado por gente local
        </span>
      </div>
    </div>
  );
}