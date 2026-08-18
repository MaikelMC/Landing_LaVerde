import { NextRequest, NextResponse } from "next/server";
import { getCupos, getCounts, notificarTodo, notificarUsuario } from "@/lib/notify";
import { isProvincia } from "@/lib/provincias";

// La waitlist usa Google Sheets como fuente de verdad:
// - "Cupos" guarda los negocios (con teléfono) y sirve para el dedupe.
// - "Usuarios" guarda cada toque de "Quiero usarla".
// Los conteos se calculan leyendo las hojas; si faltan credenciales, la app
// sigue funcionando con conteos en cero (degradación silenciosa).

type Tipo = "usuario" | "negocio";

interface Registro {
  nombre: string;
  telefono: string;
  provincia: string;
  tipo: Tipo;
  source: string;
  ts: number;
}

const TELEFONO_RE = /^\+?[0-9][0-9\s().-]{6,17}$/;
const TIPOS: Tipo[] = ["usuario", "negocio"];

export async function POST(req: NextRequest) {
  let body: {
    nombre?: string;
    telefono?: string;
    provincia?: string;
    tipo?: string;
    source?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const nombre = (body.nombre || "").trim();
  const telefono = (body.telefono || "").trim();
  const provincia = (body.provincia || "").trim();
  const tipo = (body.tipo || "usuario") as Tipo;
  const source = (body.source || "preview").trim();

  if (!TIPOS.includes(tipo) || !isProvincia(provincia)) {
    return NextResponse.json({ ok: false, error: "DATOS_INVALIDOS" }, { status: 400 });
  }

  const esNegocio = tipo === "negocio";
  if (esNegocio && (nombre.length < 2 || !TELEFONO_RE.test(telefono))) {
    return NextResponse.json({ ok: false, error: "DATOS_INVALIDOS" }, { status: 400 });
  }

  const registro: Registro = { nombre, telefono, provincia, tipo, source, ts: Date.now() };

  // Negocios: el dedupe por teléfono usa las filas ya guardadas en "Cupos".
  if (esNegocio) {
    const cupos = await getCupos().catch(() => []);
    const duplicado = cupos.some((c) => c.tipo === "negocio" && c.telefono === telefono);
    if (!duplicado) {
      await notificarTodo(registro).catch(() => undefined);
    }
  } else {
    // Usuarios: se suman con un toque, sin datos personales.
    const { usuarios: actuales } = await getCounts().catch(() => ({ usuarios: 0, negocios: 0 }));
    await notificarUsuario(registro, actuales + 1).catch(() => undefined);
  }

  const { usuarios, negocios } = await getCounts().catch(() => ({ usuarios: 0, negocios: 0 }));
  const total = usuarios + negocios;
  return NextResponse.json({
    ok: true,
    position: total,
    total,
    usuarios,
    negocios
  });
}

export async function GET() {
  const { usuarios, negocios } = await getCounts().catch(() => ({ usuarios: 0, negocios: 0 }));
  const total = usuarios + negocios;
  return NextResponse.json({ ok: true, position: total, total, usuarios, negocios });
}