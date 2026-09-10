# reilusoppari-web

Reilusoppari-palvelun julkinen sivusto. Reilusoppari on vuokranantajan ja
vuokralaisen yhteinen työkalu koko vuokrasuhteen ajaksi: sopimus
pankkitunnuksilla, alkukatselmus kuvin, vuokrakuittaus, huoltokirja,
loppukatselmus ja todistus molemmille.

Sivusto on **odotuslistatilassa** (`LAUNCH_MODE=waitlist`). Tavoitelanseeraus
on kesä 2027.

## Dokumentit

| Tiedosto | Mitä siinä on |
|---|---|
| `CLAUDE.md` | Rakennusohje: sävy, sivukartta, etusivun osiot, ilme, sallitut väittämät |
| `PLAN.md` | Vaiheet A–D ja niiden tila |
| `BLOCKERS.md` | Mikä odottaa Jukkaa: ympäristö, ehtojen hyväksyntä, verotusartikkelit |
| `DECISIONS.md` | Päätökset, jotka eivät ole CLAUDE.md:ssä |
| `KUSTANNUKSET.md` | Palvelut, hinnat ja ALV-käsittely |

## Ajaminen

```bash
npm install
cp .env.example .env.local   # täytä arvot, ks. BLOCKERS.md
npm run dev
```

## Komennot

| Komento | Mitä tekee |
|---|---|
| `npm run dev` | Kehityspalvelin |
| `npm run build` | Tuotantobuild |
| `npm run typecheck` | TypeScript ilman käännöstä |
| `npm run lint` | ESLint |
| `npm test` | Yksikkötestit (vitest) |
| `npm run test:e2e` | Savutestit (playwright) |

## Rakenne

```
content/          Hinnasto, UKK ja blogiartikkelit (MDX) – sisältö, ei koodia
src/app/          Reitit
src/components/   Jaetut komponentit, sections/ = etusivun osiot
src/lib/          Hinnoittelu, launch mode, Resend, skeemat, blogirekisteri
public/           Logo, favicon, kuvitukset, fontit
tests/            Yksikkö- ja savutestit
```

Hinnat muutetaan vain `content/pricing.ts`:ssä ja laskenta on vain
`src/lib/pricing.ts`:ssä – ei omia kaavoja komponenteissa.
