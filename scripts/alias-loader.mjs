// Node-lataaja, jolla rakennusskripti voi tuoda sivuston omia .ts-tiedostoja
// (esim. content/faq.ts) tsconfigin aliaksilla "@/" ja "@content/" ilman
// erillistä bundleria. Käytetään vain build-chat-knowledge.mts:ssä.
import { existsSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const aliases = [
  ["@content/", path.join(root, "content") + path.sep],
  ["@/", path.join(root, "src") + path.sep],
];

export async function resolve(specifier, context, next) {
  for (const [prefix, dir] of aliases) {
    if (specifier.startsWith(prefix)) {
      const base = dir + specifier.slice(prefix.length);
      for (const candidate of [base + ".ts", path.join(base, "index.ts"), base]) {
        if (existsSync(candidate) && /\.ts$/.test(candidate)) {
          return next(pathToFileURL(candidate).href, context);
        }
      }
    }
  }
  return next(specifier, context);
}
