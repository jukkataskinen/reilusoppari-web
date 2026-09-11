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
- [x] Leipäfontti Plus Jakarta Sans itse hostattuna (latin-osajoukko).
- [x] Savutesti (17 testiä) ja yksikkötestit (31 testiä) vihreinä.

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

## Vaihe C — blogi · **8/10 valmiina** (2026-09-10)

Julkaistut artikkelit (CLAUDE.md kohdan 6 numerointi):

| # | Slug | Sanoja |
|---|---|---|
| 1 | `vuokrasopimuspohja-2026` | 1007 |
| 2 | `muuttotarkastus-vuokra-asunnossa` | 1174 |
| 3 | `vuokravakuuden-palautus` | 1113 |
| 4 | `vuokralaisen-tunnistaminen` | 976 |
| 5 | `vuokrakuittaus-ilman-pankkiliittymaa` | 1052 |
| 8 | `mita-suositukseen-saa-kirjoittaa` | 1128 |
| 9 | `vuokrankorotus-indeksiehto-ja-ilmoitusaika` | 927 |
| 10 | `vuokrasuhteen-paattyminen-reilusti` | 1109 |

**Jäljellä: artikkelit 6 ja 7** (vuokratulon verotus ja vähennykset). CLAUDE.md
kohta 9.5: Jukka kirjoittaa tai tarkistaa ne itse, koska ne ovat sivuston
uskottavuuden ydin. Luonnospohjat runkoineen ovat valmiina:

- `content/blogi/LUONNOS-vuokratulon-verotus-2026.mdx`
- `content/blogi/LUONNOS-vuokranantajan-matkakulut.mdx`

Ne eivät ole rekisterissä eivätkä siis näy sivustolla. Julkaisu on kolme kohtaa:

1. kirjoita sisältö ja poista `LUONNOS-`-etuliite tiedostonimestä
2. lisää slug `POST_ORDER`- ja `POST_FRONTMATTER`-rakenteisiin
   `src/lib/blog/registry.ts`:ssä
3. lisää staattinen import ja rivi `CONTENT_BY_SLUG`:iin `src/lib/blog/posts.ts`

`tests/unit/blog-frontmatter.test.ts` tarkistaa automaattisesti pituuden
(900–1400 sanaa), description-mitan, sisäiset linkit ja sen, että frontmatter
vastaa rekisteriä.

**Päivämäärät:** kaikki artikkelit on päivätty 2026-09-10, koska ne on
kirjoitettu samana päivänä eikä sivustoa ole julkaistu. Aseta todelliset
julkaisupäivät, kun sivusto avataan.

---

## Vaihe D — lanseeraus · **odottaa** (tavoite lokakuu 2026)

- [ ] `LAUNCH_MODE=live`
- [ ] Aidot kuvakaappaukset sovelluksesta (ei ennen kuin sovellus on olemassa)
- [ ] Sovelluksen linkit ja `NEXT_PUBLIC_APP_URL`
- [ ] Suosittelupolku testattu päästä päähän
- [ ] Riippuvuus: eSinetin monivuokraajaisuus ja brändäys valmiina

---

## Mitä ei ole tehty ja miksi

| Asia | Syy |
|---|---|
| Blogiartikkelit | Vaihe C; kaksi niistä on Jukan kirjoitettavia |
| Turnstile käytössä | Odotuslista käyttää honeypotia; Turnstile kytketään kun avaimet ovat olemassa |
| Aidot käyttöliittymäkuvat | Sovellusta ei ole vielä olemassa (CLAUDE.md kohta 2) |
| `/tarkista`-sivu | Todistuksen tarkistus on sovelluksen, ei sivuston toiminto |
