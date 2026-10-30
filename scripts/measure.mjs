// Bundles each entry with esbuild (minified ESM, browser, production React),
// measures gzip -9 and brotli 11, writes results.json and the README table,
// and emits an HTML page per entry so each can be checked in a browser.
import { build } from "esbuild";
import { createReadStream, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { extname, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const entries = [
  { id: "frapx", file: "src/frapx.ts", label: "frapx (`@frapx/fx-canvas`)", packages: ["@frapx/fx-canvas"] },
  { id: "frapx-react", file: "src/frapx-react.tsx", label: "frapx React (`@frapx/react-canvas`), React excluded", packages: ["@frapx/react-canvas"], external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"] },
  { id: "three", file: "src/three.ts", label: "three.js", packages: ["three"] },
  { id: "babylon", file: "src/babylon.ts", label: "Babylon.js (`ThinEngine` + `EffectRenderer`)", packages: ["@babylonjs/core"] },
  { id: "ogl", file: "src/ogl.ts", label: "OGL", packages: ["ogl"] },
  { id: "twgl", file: "src/twgl.ts", label: "twgl.js", packages: ["twgl.js"] }
];

const outdir = join(root, "dist");
mkdirSync(outdir, { recursive: true });

const bundle = async (entry, external = []) => {
  const result = await build({
    entryPoints: [join(root, entry.file)],
    bundle: true,
    minify: true,
    format: "esm",
    platform: "browser",
    target: "es2020",
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    external,
    write: false,
    logLevel: "error"
  });
  return result.outputFiles[0].contents;
};

const results = [];
for (const entry of entries) {
  const measured = await bundle(entry, entry.external ?? []);
  results.push({
    id: entry.id,
    label: entry.label,
    versions: Object.fromEntries(entry.packages.map((name) => [name, pkg.dependencies[name]])),
    min: measured.length,
    gzip: gzipSync(measured, { level: 9 }).length,
    brotli: brotliCompressSync(measured, {
      params: { [constants.BROTLI_PARAM_QUALITY]: 11 }
    }).length
  });
  // The page bundles everything (React included) so it runs standalone.
  writeFileSync(join(outdir, `${entry.id}.js`), entry.external ? await bundle(entry) : measured);
  writeFileSync(
    join(outdir, `${entry.id}.html`),
    `<!doctype html><meta charset="utf-8"><title>${entry.id}</title>` +
      `<style>html,body{margin:0;height:100%}#stage{position:fixed;inset:0}</style>` +
      `<div id="stage"></div><script type="module" src="./${entry.id}.js"></script>`
  );
}

const date = new Date().toISOString().slice(0, 10);
writeFileSync(join(root, "results.json"), JSON.stringify({ date, results }, null, 2) + "\n");

const kb = (bytes) => (bytes / 1000).toFixed(1);
const table = [
  `Measured ${date}. Sizes in kB (1 kB = 1000 bytes).`,
  "",
  "| Library | Version | min | gzip -9 | brotli 11 |",
  "| --- | --- | ---: | ---: | ---: |",
  ...results.map(
    (r) =>
      `| ${r.label} | ${Object.entries(r.versions).map(([n, v]) => `${n}@${v}`).join(", ")} | ${kb(r.min)} | ${kb(r.gzip)} | ${kb(r.brotli)} |`
  )
].join("\n");
const readmePath = join(root, "README.md");
const readme = readFileSync(readmePath, "utf8");
writeFileSync(
  readmePath,
  readme.replace(/<!-- results -->[\s\S]*<!-- \/results -->/, `<!-- results -->\n${table}\n<!-- /results -->`)
);
console.log(table);

if (process.argv.includes("--serve")) {
  const types = { ".html": "text/html", ".js": "text/javascript" };
  createServer((req, res) => {
    const path = join(outdir, (req.url ?? "/").split("?")[0]);
    res.setHeader("content-type", types[extname(path)] ?? "text/plain");
    createReadStream(path).on("error", () => res.writeHead(404).end()).pipe(res);
  }).listen(5468, "127.0.0.1", () => console.log("http://127.0.0.1:5468/<id>.html"));
}
