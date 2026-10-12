// Comprueba la regla de dependencias del front (ver ARCHITECTURE.md):
//   1. src/domain no importa nada de fuera de src/domain.
//   2. src/application solo importa de src/domain y de src/application.
//   3. fetch(, localStorage e import.meta.env solo en src/infrastructure,
//      src/app y src/main.tsx.
//   4. src/infrastructure solo se importa desde src/app y src/main.tsx.
// No se revisa el código de registro (ui, animate-ui, charts).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SRC = join(ROOT, "src");

const EXCLUIDOS = ["components/ui", "components/animate-ui", "components/charts"];
/** Sitios donde sí puede haber fetch, localStorage, variables de entorno e imports de infrastructure. */
const BORDE = ["infrastructure", "app", "main.tsx"];
const PROHIBIDOS = [
  { nombre: "fetch(", patron: /(?<![.\w])fetch\s*\(/ },
  { nombre: "localStorage", patron: /\blocalStorage\b/ },
  { nombre: "import.meta.env", patron: /\bimport\.meta\.env\b/ },
];

const posix = (p) => p.split(sep).join("/");
const dentroDe = (rel, carpetas) => carpetas.some((c) => rel === c || rel.startsWith(`${c}/`));

function archivos(dir) {
  return readdirSync(dir).flatMap((nombre) => {
    const ruta = join(dir, nombre);
    if (statSync(ruta).isDirectory()) return archivos(ruta);
    return /\.(ts|tsx|mts|js|jsx|mjs)$/.test(nombre) ? [ruta] : [];
  });
}

/** Quita comentarios para no confundir un ejemplo escrito en un comentario con código. */
const sinComentarios = (codigo) =>
  codigo.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|[^:"'`\\])\/\/.*$/gm, "$1");

const IMPORT = /(?:\bimport\s+(?:type\s+)?(?:[^"';]*?\sfrom\s+)?|\bexport\s+(?:type\s+)?[^"';]*?\sfrom\s+|\bimport\s*\(\s*)["']([^"']+)["']/g;

/** Devuelve la ruta dentro de src ("domain/menu") o null si es un paquete o algo de fuera de src. */
function destino(archivo, spec) {
  let abs;
  if (spec.startsWith("@/")) abs = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) abs = resolve(dirname(archivo), spec);
  else return { paquete: spec };
  const rel = posix(relative(SRC, abs));
  return rel.startsWith("..") ? { fuera: posix(relative(ROOT, abs)) } : { rel };
}

const errores = [];

for (const archivo of archivos(SRC)) {
  const rel = posix(relative(SRC, archivo));
  if (dentroDe(rel, EXCLUIDOS)) continue;

  const codigo = sinComentarios(readFileSync(archivo, "utf8"));
  const esTest = /\.(test|spec)\.[cm]?[jt]sx?$/.test(rel);
  const capa = rel.split("/")[0];
  const lineaDe = (indice) => codigo.slice(0, indice).split("\n").length;

  for (const m of codigo.matchAll(IMPORT)) {
    const spec = m[1];
    const d = destino(archivo, spec);
    const donde = `src/${rel}:${lineaDe(m.index)}`;
    const capaDestino = d.rel?.split("/")[0];

    if (capa === "domain" || capa === "application") {
      const permitidas = capa === "domain" ? ["domain"] : ["domain", "application"];
      const paqueteDeTest = esTest && d.paquete === "vitest";
      if (d.paquete && !paqueteDeTest) errores.push(`${donde}: src/${capa} no puede importar el paquete "${spec}"`);
      else if (d.fuera) errores.push(`${donde}: src/${capa} no puede importar de fuera de src ("${spec}")`);
      else if (d.rel && !permitidas.includes(capaDestino)) {
        errores.push(`${donde}: src/${capa} solo importa de ${permitidas.map((c) => `src/${c}`).join(" y ")} ("${spec}")`);
      }
    }
    if (capaDestino === "infrastructure" && !dentroDe(rel, BORDE)) {
      errores.push(`${donde}: solo src/app y src/main.tsx importan de src/infrastructure ("${spec}")`);
    }
  }

  if (!dentroDe(rel, BORDE)) {
    codigo.split("\n").forEach((linea, i) => {
      for (const { nombre, patron } of PROHIBIDOS) {
        if (patron.test(linea)) errores.push(`src/${rel}:${i + 1}: ${nombre} solo puede estar en src/infrastructure, src/app o src/main.tsx`);
      }
    });
  }
}

if (errores.length) {
  console.error(errores.map((e) => `✗ ${e}`).join("\n"));
  console.error(`\n${errores.length} incumplimiento(s) de la arquitectura. Ver ARCHITECTURE.md.`);
  process.exit(1);
}
console.log("✓ arquitectura revisada: domain y application sin imports de fuera; fetch, localStorage e import.meta.env solo en infrastructure, app y main.tsx");
