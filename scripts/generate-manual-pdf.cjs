/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * generate-manual-pdf.cjs
 *
 * Genera el manual de usuario como PDF estatico dentro de public/manual/.
 * El frontend sirve este archivo directamente, evitando que el navegador
 * tenga que renderizar @react-pdf al abrir la pagina del manual.
 *
 * Uso:
 *   npm run manual:pdf
 */

const fs = require("fs");
const path = require("path");
const Module = require("module");
const ts = require("typescript");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "manual");
const OUT_FILE = path.join(OUT_DIR, "biotecare-manual-usuario.pdf");

const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function resolveProjectAlias(request, parent, isMain, options) {
  if (request.startsWith("@/")) {
    return originalResolveFilename.call(
      this,
      path.join(ROOT, "src", request.slice(2)),
      parent,
      isMain,
      options,
    );
  }

  return originalResolveFilename.call(this, request, parent, isMain, options);
};

function registerTsExtension(extension) {
  require.extensions[extension] = function compileTypeScript(module, filename) {
    const source = fs.readFileSync(filename, "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2019,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      },
      fileName: filename,
    }).outputText;

    module._compile(output, filename);
  };
}

registerTsExtension(".ts");
registerTsExtension(".tsx");

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { renderToFile } = require("@react-pdf/renderer");
  const { ManualPdfDocument } = require(path.join(
    ROOT,
    "src",
    "components",
    "manual",
    "ManualPdf.tsx",
  ));

  await renderToFile(ManualPdfDocument(), OUT_FILE);

  const sizeKb = Math.round(fs.statSync(OUT_FILE).size / 1024);
  console.log(`Manual PDF generado: ${path.relative(ROOT, OUT_FILE)} (${sizeKb} KB)`);
}

main().catch((error) => {
  console.error("No se pudo generar el manual PDF:", error);
  process.exit(1);
});
