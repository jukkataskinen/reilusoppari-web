import type { MDXComponents } from "mdx/types";
import { Lyhyesti } from "@/components/mdx/Lyhyesti";
import { UKK } from "@/components/mdx/UKK";
import { Hintalaskuri } from "@/components/mdx/Hintalaskuri";
import { Askeleet } from "@/components/mdx/Askeleet";

/**
 * @next/mdx lukee tämän tiedoston (src/mdx-components.tsx) automaattisesti
 * jokaiselle .mdx-tiedostolle (webpack-alias "next-mdx-import-source-file",
 * ks. node_modules/@next/mdx/index.js) – näin Lyhyesti/UKK/Hintalaskuri/
 * Askeleet ovat käytettävissä kaikissa content/blogi/*.mdx-artikkeleissa
 * ilman erillistä importia jokaisessa tiedostossa (CLAUDE.md kohta 8).
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Lyhyesti,
    UKK,
    Hintalaskuri,
    Askeleet,
  };
}
