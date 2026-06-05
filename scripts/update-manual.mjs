/**
 * update-manual.mjs
 *
 * Escanea las rutas del dashboard y compara con los tags en manualSections.ts.
 * Imprime un reporte [OK]/[FALTA] por ruta y bloques de código listos para
 * pegar en manualSections.ts.
 *
 * Uso: npm run manual:generate
 */

import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DASHBOARD_DIR = join(ROOT, "src", "app", "(dashboard)");
const MANUAL_PATH = join(ROOT, "src", "lib", "manual", "manualSections.ts");

// Rutas que no necesitan cobertura en el manual (son meta-páginas del propio sistema)
const EXCLUDED_ROUTES = new Set(["/manual-usuario"]);

async function collectRoutes(dir, base = "") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const routes = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      if (entry.name === "page.tsx" && base) {
        routes.push(base);
      }
      continue;
    }

    const name = entry.name;
    if (name.startsWith("_") || name === "api") continue;

    const segment = name.startsWith("[")
      ? name.replace(/\[(\w+)\]/, ":$1")
      : name;

    const sub = await collectRoutes(join(dir, name), `${base}/${segment}`);
    routes.push(...sub);

    const subEntries = await readdir(join(dir, name), { withFileTypes: true });
    const hasPage = subEntries.some(
      (e) => !e.isDirectory() && e.name === "page.tsx",
    );
    if (hasPage) {
      routes.push(`${base}/${segment}`);
    }
  }

  return routes;
}

async function extractTagsFromManual(manualSource) {
  const tagMatches = manualSource.matchAll(/tags:\s*\[([^\]]+)\]/g);
  const tags = new Set();
  for (const match of tagMatches) {
    const items = match[1].split(",").map((t) =>
      t.trim().replace(/^["']|["']$/g, ""),
    );
    for (const item of items) {
      if (item.startsWith("/")) tags.add(item);
    }
  }
  return tags;
}

function routeMatchesTags(route, tags) {
  for (const tag of tags) {
    const normalizedTag = tag.replace(/:(\w+)/g, ":$1");
    const normalizedRoute = route.replace(/:(\w+)/g, ":$1");
    if (normalizedRoute === normalizedTag) return true;
    if (normalizedRoute.startsWith(normalizedTag + "/")) return true;
  }
  return false;
}

function slugToId(route) {
  return route
    .replace(/^\//, "")
    .replace(/\//g, "-")
    .replace(/:/g, "")
    .replace(/-+/g, "-");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function routeToTitle(route) {
  const parts = route
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/^:/, "").replace(/-/g, " "))
    .map(capitalize);
  return parts.join(" › ");
}

async function main() {
  console.log("\n=== Biotecare · Script de actualización del manual ===\n");

  const routes = await collectRoutes(DASHBOARD_DIR);
  const uniqueRoutes = [...new Set(routes)].sort();

  const manualSource = await readFile(MANUAL_PATH, "utf-8");
  const coveredTags = await extractTagsFromManual(manualSource);

  console.log("Rutas detectadas en (dashboard):");
  const uncovered = [];

  for (const route of uniqueRoutes) {
    if (EXCLUDED_ROUTES.has(route)) {
      console.log(`  [SKIP]  ${route} (excluida — meta-página)`);
      continue;
    }
    const covered = routeMatchesTags(route, coveredTags);
    const marker = covered ? "  [OK]   " : "  [FALTA]";
    console.log(`${marker} ${route}`);
    if (!covered) uncovered.push(route);
  }

  if (uncovered.length === 0) {
    console.log(
      "\n✓ Todas las rutas están cubiertas en manualSections.ts. No hay sugerencias pendientes.\n",
    );
    return;
  }

  console.log(
    `\n⚠ Hay ${uncovered.length} ruta(s) sin cobertura en el manual.\n`,
  );
  console.log(
    "=== Sugerencias para agregar a manualSections.ts ===\n",
  );
  console.log(
    "Copia los bloques que necesites y agrégalos a la sección correspondiente:\n",
  );

  for (const route of uncovered) {
    const id = slugToId(route);
    const title = routeToTitle(route);
    console.log(`// Ruta: ${route}`);
    console.log(`{`);
    console.log(`  id: "${id}",`);
    console.log(`  question: "¿Cómo usar ${title}?",`);
    console.log(`  answer: "Descripción pendiente para la ruta ${route}.",`);
    console.log(`  steps: [],`);
    console.log(`  tags: ["${route}"],`);
    console.log(`},`);
    console.log("");
  }

  console.log(
    "Abre src/lib/manual/manualSections.ts, busca la sección correspondiente",
  );
  console.log(
    "y pega los bloques de código sugeridos. Luego edita el contenido.\n",
  );
}

main().catch((err) => {
  console.error("Error al ejecutar el script:", err);
  process.exit(1);
});
