import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { readFileSync } from "node:fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { handleSoroRequest } from "./scripts/soro-content.mjs";
import { publicHeaders } from "./scripts/public-headers.mjs";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

let bundlePublicMedia = false;

export default defineConfig({
  base: basePath,
  // Playwright's production-mode Vite server must not overwrite the running
  // preview's development React bundles in a shared dependency cache.
  cacheDir: process.env.PLAYWRIGHT_TEST === "true"
    ? "node_modules/.vite-playwright"
    : "node_modules/.vite",
  plugins: [
    {
      name: "fingerprinted-public-media",
      configResolved(config) {
        bundlePublicMedia = config.command === "build";
      },
      // Keep the original public URLs for compatibility, but reference
      // content-hashed copies from the current release for immutable caching.
      resolveId(source) {
        if (source.startsWith("public-media:/")) return `\0${source}`;
      },
      load(id) {
        if (!id.startsWith("\0public-media:/")) return;
        const url = id.slice("\0public-media:".length);
        if (!bundlePublicMedia) {
          return `export default ${JSON.stringify(`${basePath.replace(/\/$/, "")}${url}`)};`;
        }
        const file = path.resolve(import.meta.dirname, "public", `.${url}`);
        const publicRoot = path.resolve(import.meta.dirname, "public") + path.sep;
        if (!file.startsWith(publicRoot)) throw new Error("Invalid public media path");
        const reference = this.emitFile({
          type: "asset",
          name: path.basename(file),
          source: readFileSync(file),
        });
        return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
      },
      resolveFileUrl({ fileName }) {
        return JSON.stringify(`${basePath.replace(/\/$/, "")}/${fileName}`);
      },
    },
    {
      name: "soro-public-content",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          handleSoroRequest(req, res).then((handled) => { if (!handled) next(); }).catch(next);
        });
      },
    },
    react(),
    tailwindcss({ optimize: true }),
    ...(process.env.PLAYWRIGHT_TEST === "true" ? [] : [runtimeErrorOverlay()]),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    // Keep production JavaScript and CSS compressed for crawler and visitor
    // performance. Vite defaults to this, but make it explicit for releases.
    minify: "esbuild",
    cssMinify: "lightningcss",
    sourcemap: false,
  },
  server: {
    headers: publicHeaders,
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
