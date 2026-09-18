// Comprobaciones del build que el compilador no hace: ningún marcador del
// plugin sin sustituir y los archivos de SEO presentes.
import { readdirSync, readFileSync, existsSync } from "node:fs";

const errors = [];
for (const file of readdirSync("dist").filter((f) => f.endsWith(".html"))) {
  const html = readFileSync(`dist/${file}`, "utf8");
  if (html.includes("<!--#")) errors.push(`${file}: quedó un marcador <!--#…--> sin sustituir`);
  if (file !== "404.html" && !html.includes('rel="canonical"')) errors.push(`${file}: falta canonical`);
}
// En Vercel, cada archivo de api/ se publica como función: nada de tests ahí.
for (const file of readdirSync("api")) {
  if (/\.test\.|\.spec\./.test(file)) errors.push(`api/${file}: los tests no van en api/ (Vercel los publicaría)`);
}
for (const file of ["dist/sitemap.xml", "dist/robots.txt", "dist/404.html"]) {
  if (!existsSync(file)) errors.push(`falta ${file}`);
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("✓ dist revisado: sin marcadores pendientes, canonical, sitemap, robots, 404 y api/ sin tests");
