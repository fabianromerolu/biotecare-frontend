/**
 * capture-manual-screenshots.mjs
 *
 * Captura pantallazos reales de la app Biotecare para el manual de usuario.
 *
 * Requisitos:
 *   - Frontend corriendo en localhost:3000  (npm run dev)
 *   - Para páginas autenticadas: backend corriendo en localhost:8000
 *     y credenciales de prueba en las variables de entorno.
 *
 * Uso:
 *   npm run manual:screenshots
 *
 * Variables de entorno opcionales:
 *   MANUAL_EMAIL    (default: doctor@hospital.es)
 *   MANUAL_PASSWORD (default: password123)
 *   MANUAL_BASE_URL (default: http://localhost:3000)
 *
 * Los screenshots se guardan en public/manual/screenshots/
 * y pueden referenciarse en manualSections.ts como:
 *   screenshotPath: "/manual/screenshots/login.png"
 */

import { chromium } from "playwright";
import { mkdir, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public", "manual", "screenshots");
const BASE_URL = process.env.MANUAL_BASE_URL ?? "http://localhost:3000";
const EMAIL = process.env.MANUAL_EMAIL ?? "doctor@hospital.es";
const PASSWORD = process.env.MANUAL_PASSWORD ?? "password123";

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function waitForServer(url, retries = 15, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      const { default: fetch } = await import("node:https");
      await new Promise((resolve, reject) => {
        const req = (url.startsWith("https") ? fetch : (await import("node:http")).default).get(
          url,
          (res) => resolve(res),
        );
        req.on("error", reject);
      });
      return true;
    } catch {
      console.log(`  Esperando servidor en ${url}… (intento ${i + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  return false;
}

async function login(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState("networkidle");
  await page.fill('input[type="email"], input[name="email"], input[placeholder*="correo" i]', EMAIL);
  await page.fill('input[type="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 10000 });
  console.log("  ✓ Sesión iniciada.");
}

const SHOTS = [
  {
    id: "login",
    url: "/login",
    requiresAuth: false,
    selector: "body",
    waitFor: "networkidle",
    description: "Pantalla de acceso al sistema",
  },
  {
    id: "patients-list",
    url: "/patients",
    requiresAuth: true,
    selector: "main, [id='main-content'], body",
    waitFor: "networkidle",
    description: "Listado de pacientes con búsqueda y filtros",
  },
  {
    id: "patients-new",
    url: "/patients/new",
    requiresAuth: true,
    selector: "main, body",
    waitFor: "networkidle",
    description: "Formulario de creación de paciente",
  },
  {
    id: "model",
    url: "/model",
    requiresAuth: true,
    selector: "main, body",
    waitFor: "networkidle",
    description: "Estado del sistema y explicación del modelo",
  },
  {
    id: "legal",
    url: "/legal",
    requiresAuth: true,
    selector: "main, body",
    waitFor: "networkidle",
    description: "Marco legal y cumplimiento normativo",
  },
  {
    id: "manual",
    url: "/manual-usuario",
    requiresAuth: true,
    selector: "main, body",
    waitFor: "networkidle",
    description: "Manual de usuario",
  },
];

async function captureAll() {
  console.log("\n=== Captura de screenshots para el manual de usuario ===\n");

  // Check if server is running
  let online = false;
  try {
    const { default: http } = await import("node:http");
    await new Promise((resolve, reject) => {
      http.get(BASE_URL, resolve).on("error", reject);
    });
    online = true;
  } catch {
    console.log(`⚠ El servidor no responde en ${BASE_URL}.`);
    console.log("  Arranca el frontend con: npm run dev");
    console.log("  Luego vuelve a ejecutar: npm run manual:screenshots\n");
    process.exit(1);
  }

  await ensureDir(OUT_DIR);
  console.log(`Guardando screenshots en: public/manual/screenshots/\n`);

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Take login screenshot first (no auth needed)
  const loginShot = SHOTS.find((s) => s.id === "login");
  if (loginShot) {
    console.log(`📸 ${loginShot.id}: ${loginShot.description}`);
    await page.goto(`${BASE_URL}${loginShot.url}`);
    await page.waitForLoadState(loginShot.waitFor);
    await page.screenshot({
      path: join(OUT_DIR, `${loginShot.id}.png`),
      fullPage: false,
    });
    console.log(`   ✓ Guardado: ${loginShot.id}.png`);
  }

  // Login for authenticated shots
  console.log("\n  Iniciando sesión para páginas autenticadas…");
  try {
    await login(page);
  } catch (err) {
    console.log(`  ⚠ No se pudo iniciar sesión: ${err.message}`);
    console.log("  Los screenshots de páginas protegidas no se capturarán.");
    await browser.close();
    return;
  }

  for (const shot of SHOTS.filter((s) => s.requiresAuth)) {
    try {
      console.log(`📸 ${shot.id}: ${shot.description}`);
      await page.goto(`${BASE_URL}${shot.url}`);
      await page.waitForLoadState(shot.waitFor);
      // Wait a bit extra for dynamic content
      await page.waitForTimeout(800);
      await page.screenshot({
        path: join(OUT_DIR, `${shot.id}.png`),
        fullPage: false,
      });
      console.log(`   ✓ Guardado: ${shot.id}.png`);
    } catch (err) {
      console.log(`   ✗ Error capturando ${shot.id}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\n✓ Screenshots guardados en public/manual/screenshots/`);
  console.log(
    "  Para usar una imagen en el manual, agrega la ruta en manualSections.ts:\n",
  );
  console.log(`  screenshotPath: "/manual/screenshots/{id}.png"\n`);
}

captureAll().catch((err) => {
  console.error("Error en capture-manual-screenshots:", err);
  process.exit(1);
});
