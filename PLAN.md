# PLAN — reilusoppari-web

Vaiheet CLAUDE.md kohdan 8 mukaan. Tilat: **valmis** / **kesken** / **odottaa**.

---

## Vaihe A — runko ja etusivu · **valmis** (2026-09-10)

DoD: julkaistavissa odotuslistatilassa.

- [x] Runko kopioitu `esinetti-web`-reposta: Next.js 15, MDX, Tailwind v4,
      CSP-nonce middlewaressa, turvaotsakkeet, vitest + playwright.
- [x] Tokenit vaihdettu: `ink` / `sky` / `coral` / `paper` / `cloud` / `moss`.
      Ei varjoja, pyöristys 16 px, sisältö 1080 px, osiovälit 88/56 px.
- [x] Typografia: hero 800 / 52 px, otsikot 700, leipäteksti 1.65, 66 merkkiä.
- [x] Logo (`public/logo-mark.svg`) ja favicon.
- [x] Viisi kuvitusta: hero-kaksoisnäkymä, katselmus, kuittaus, todistus,
      verolaskelma. Kaikki samalla viivanpaksuudella.
- [x] Etusivu kohdan 4 osiojärjestyksessä, kolme sitovaa sitaattia sellaisenaan.
- [x] Hero-kytkin: alaotsikko ja CTA vaihtuvat, puhelimet vaihtavat paikkaa
      300 ms:ssä, tila URL-parametrissa.
- [x] Odotuslista: sähköposti + osapuoli + asuntojen määrä, kaksoisvarmistus.
- [x] Savutesti (17 testiä) ja yksikkötestit (31 testiä) vihreinä.

**Jäljellä A:sta:** leipäfontti on väliaikainen. CLAUDE.md lukitsee Plus Jakarta
Sansin, mutta tiedostoa ei ole ladattu – ks. DECISIONS.md.

---

## Vaihe B — sivukartta, hinnasto, ehdot · **valmis** (2026-09-10)

- [x] `/miten-toimii` — koko kaari kuusi vaihetta, kummankin osapuolen osuus
      jokaisessa vaiheessa erikseen.
- [x] `/vuokranantajalle` ja `/vuokralaiselle` — samanarvoiset sivut.
- [x] `/katselmus`, `/verolaskelma`, `/todistus`.
- [x] `/hinnat` — hinnasto, laskuri (asunnot → vuosihinta) ja UKK hinnoista.
- [x] `/ukk`, `/yhteystiedot`.
- [x] `/tietosuoja`, `/kayttoehdot` — **pohjat, Jukan hyväksyttävä** (kohta 9.4).
- [x] Skeemat: Organization, SoftwareApplication, FAQPage, BreadcrumbList, Article.
- [x] OG-kuvat `/api/og`-reitin kautta jokaisella sivulla.
- [x] `/sitemap.xml`, `/robots.txt`, `/rss.xml`.

---

## Vaihe C — blogi · **odottaa**

Rakenne on valmis (`src/lib/blog/`, `/blogi`, `/blogi/[slug]`, RSS, MDX-
komponentit). Artikkelilista on tyhjä, ja `/blogi` näyttää tyhjän tilan.

Artikkelin lisääminen on kolme kohtaa:

1. `content/blogi/<slug>.mdx` frontmatterilla (title, description, date, tags)
2. rivi `POST_ORDER`- ja `POST_FRONTMATTER`-rakenteisiin `src/lib/blog/registry.ts`
3. staattinen import ja rivi `CONTENT_BY_SLUG`:iin `src/lib/blog/posts.ts`

Artikkelit 1–10 ovat CLAUDE.md kohdassa 6. **Huom kohta 9.5:** verotusartikkelit
6 ja 7 Jukka kirjoittaa tai tarkistaa itse – ne ovat sivuston uskottavuuden ydin.

---

## Vaihe D — lanseeraus · **odottaa** (tavoite kesä 2027)

- [ ] `LAUNCH_MODE=live`
- [ ] Aidot kuvakaappaukset sovelluksesta (ei ennen kuin sovellus on olemassa)
- [ ] Sovelluksen linkit ja `NEXT_PUBLIC_APP_URL`
- [ ] Suosittelupolku testattu päästä päähän
- [ ] Riippuvuus: eSinetin monivuokraajaisuus ja brändäys valmiina

---

## Mitä ei ole tehty ja miksi

| Asia | Syy |
|---|---|
| Plus Jakarta Sans | Fonttitiedostoa ei ole ladattu, paikalla väliaikainen fontti |
| Blogiartikkelit | Vaihe C; kaksi niistä on Jukan kirjoitettavia |
| Turnstile käytössä | Odotuslista käyttää honeypotia; Turnstile kytketään kun avaimet ovat olemassa |
| Aidot käyttöliittymäkuvat | Sovellusta ei ole vielä olemassa (CLAUDE.md kohta 2) |
| `/tarkista`-sivu | Todistuksen tarkistus on sovelluksen, ei sivuston toiminto |
