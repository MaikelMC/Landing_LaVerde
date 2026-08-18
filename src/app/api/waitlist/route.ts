import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { list, put } from "@vercel/blob";
import { notificarTodo, notificarUsuario } from "@/lib/notify";
import { isProvincia } from "@/lib/provincias";

// Almacenamiento de la waitlist.
// - En Vercel: si existe BLOB_READ_WRITE_TOKEN (Vercel Blob, free tier), se usa Blob.
// - Fallback local (dev): un archivo JSON dentro de .next para persistir entre reinicios.

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
const DB_PATH = join(process.cwd(), ".next", "waitlist.json");
const BLOB_PATH = "waitlist.json";

const BLOB_TOKEN =
  process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_READ_WRITE_TOKEN;

async function readLocal(): Promise<Registro[]> {
  try {
    const raw = await readFile(DB_PATH, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as Registro[];
  } catch {
    // archivo aún no existe o corrupto
  }
  return [];
}

async function writeLocal(regs: Registro[]): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(regs, null, 2), "utf8");
}

async function readBlob(): Promise<Registro[]> {
  try {
    const { blobs } = await list({ prefix: BLOB_PATH });
    if (!blobs.length) return [];
    const res = await fetch(blobs[0].url, { cache: "no-store" });
    if (!res.ok) return [];
    const parsed = JSON.parse(await res.text());
    if (Array.isArray(parsed)) return parsed as Registro[];
  } catch {
    // primer uso o blob vacío/corrupto
  }
  return [];
}

async function writeBlob(regs: Registro[]): Promise<void> {
  await put(BLOB_PATH, JSON.stringify(regs), {
    contentType: "application/json",
    access: "public",
    addRandomSuffix: false
  });
}

async function read(): Promise<Registro[]> {
  return BLOB_TOKEN ? readBlob() : readLocal();
}

async function write(regs: Registro[]): Promise<void> {
  if (BLOB_TOKEN) return writeBlob(regs);
  return writeLocal(regs);
}

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

  // Contador persistente. Los usuarios se suman con un toque, sin datos personales;
  // el dedupe por teléfono solo aplica a negocios.
  const regs = await read();
  const duplicado =
    esNegocio && regs.some((r) => r.tipo === "negocio" && r.telefono === telefono);
  if (!duplicado) {
    regs.push(registro);
    await write(regs).catch(() => undefined);
  }

  const usuarios = regs.filter((r) => r.tipo === "usuario").length;
  const negocios = regs.filter((r) => r.tipo === "negocio").length;

  // Negocios: notificar solo cupos nuevos (Telegram + hoja Cupos).
  // Usuarios: guardar en la hoja Usuarios y avisar por el bot con el contador.
  if (esNegocio && !duplicado) {
    await notificarTodo(registro).catch(() => undefined);
  } else if (!esNegocio) {
    await notificarUsuario(registro, usuarios).catch(() => undefined);
  }

  return NextResponse.json({
    ok: true,
    position: regs.length,
    total: regs.length,
    usuarios,
    negocios
  });
}

export async function GET() {
  const regs = await read().catch(() => []);
  const total = regs.length;
  const usuarios = regs.filter((r) => r.tipo === "usuario").length;
  const negocios = regs.filter((r) => r.tipo === "negocio").length;
  return NextResponse.json({ ok: true, position: total, total, usuarios, negocios });
}