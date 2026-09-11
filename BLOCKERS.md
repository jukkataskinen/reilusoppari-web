# BLOCKERS — reilusoppari-web

## Tila 2026-09-10: vaiheet A ja B tehty, C 8/10, sivusto odottaa ympäristöä

Sivusto on rakennettu vaiheiden A ja B osalta (ks. `PLAN.md`) ja se rakentuu,
läpäisee testit ja on julkaistavissa odotuslistatilassa. Alkuperäisistä kolmesta
esteestä (CLAUDE.md kohta 9) kaksi on poistunut. Jäljellä on ympäristö (kohta 3)
sekä kaksi asiaa, jotka vaativat Jukan omaa työtä (kohdat 9.4 ja 9.5).

### ~~1. Nimi ja verkkotunnus~~ — SELVÄ (Jukka 2026-09-10)

- **`reilusoppari.fi` on tilattu ja maksettu**, aukeaa lähipäivinä.
- **YTJ-toiminimihaku tehty** — ei estettä.
- **Tavaramerkit tarkistettu** — ei estettä. (PRH:n kansallinen haku
  `reilusoppari` → 0 osumaa 2026-09-10; Jukka on sittemmin todennut myös
  EUIPOn ja sekoitettavuuden osalta, että homma on ok.)

Nimi on siis lukittu. Ei enää tarvitse palata tähän.

### ~~2. Repo `reilusoppari-web`~~ — SELVÄ (2026-09-10)

Repo on luotu ja viety GitHubiin:
<https://github.com/jukkataskinen/reilusoppari-web> (yksityinen).
Ensimmäinen commit sisältää `CLAUDE.md`, `BLOCKERS.md`, `KUSTANNUKSET.md`
ja `.gitignore`:n (kopio esinetti-webistä). Haara on `main`.

### 3. Ympäristö — SIVUSTO ON LIVENÄ (2026-09-11)

**<https://www.reilusoppari.fi> toimii.** Todennettu: kaikki 18 polkua vastaavat
200, sivukartta, robots ja RSS kunnossa, canonical-linkit oikein, Plausible
ladataan. `reilusoppari.fi` ohjaa 308:lla www-osoitteeseen.

Tehty:

- Verkkotunnus rekisteröity, nimipalvelimet Vercelillä, DNS-vyöhyke luotu
- Domain liitetty projektiin, TLS-varmenne myönnetty
- Framework Preset korjattu `Other` → `Next.js` (ks. DECISIONS.md)
- `NEXT_PUBLIC_SITE_URL` ja `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` asetettu

**Odotuslista on peruttu (Jukan päätös 2026-09-11).** Sitä ei kerätä, koska
palvelu saadaan toimintaan ennen kuin listasta olisi hyötyä. Julkaisutila on
nyt `soon`, joka on myös oletus — Verceliin ei tarvitse asettaa `LAUNCH_MODE`ia
lainkaan.

Tästä seuraa, että **Resend, Turnstile ja `WAITLIST_TOKEN_SECRET` eivät ole
enää tarpeen** sivustolle. Koodipolku on tallella ja testattu, jos listaa
joskus tarvitaan.

Seuraava ympäristötehtävä on vasta lanseerauksessa: `LAUNCH_MODE=live` ja
`NEXT_PUBLIC_APP_URL`, kun `app.reilusoppari.fi` on olemassa.

### 4. Tietosuoja ja käyttöehdot — JUKAN LUETTAVA (CLAUDE.md kohta 9.4)

`/tietosuoja` ja `/kayttoehdot` ovat pohjia. Kolme kohtaa vaativat erityistä
huolellisuutta, koska palvelu myydään kuluttajalle: peruutusoikeus (KSL 6 luku,
etämyynti), kuvat kodista ja todistuksen omistajuus. Juristin tarkistusta on
syytä harkita ennen lanseerausta. Ks. `DECISIONS.md`.

Huom: tietosuojaselosteen odotuslistaosuus koskee käsittelyä, joka on TOTTA JO
NYT — se ei voi odottaa lanseeraukseen asti.

### 5. Blogin verotusartikkelit — JUKAN KIRJOITETTAVA (CLAUDE.md kohta 9.5)

Kymmenestä artikkelista **kahdeksan on kirjoitettu ja julkaistu**. Jäljellä ovat
artikkelit 6 (vuokratulon verotus) ja 7 (vähennykset), jotka Jukka kirjoittaa
tai tarkistaa itse.

Luonnospohjat runkoineen ovat valmiina hakemistossa `content/blogi/`
nimillä `LUONNOS-vuokratulon-verotus-2026.mdx` ja
`LUONNOS-vuokranantajan-matkakulut.mdx`. Ne eivät ole rekisterissä eivätkä
näy sivustolla. Julkaisuohje on tiedostojen alussa ja `PLAN.md`:n vaiheessa C.

### ~~6. Leipäfontti~~ — SELVÄ (2026-09-10)

Plus Jakarta Sans on ladattu itse hostattavaksi (`public/fonts/sans-variable.woff2`,
latin-osajoukko, painot 400–800). Ei Google Fonts -CDN-kutsuja.

## Kustannukset

Ks. `KUSTANNUKSET.md` — palvelut, hinnat, ALV-käsittely ja sääntö siitä, ettei
uusia maksullisia palveluita ehdoteta ilman hintatietoa.

## Riippuvuus eSinettiin (päivitetty 2026-09-10)

Sovellus (`app.reilusoppari.fi`) ajaa eSinetin moottorilla omalla brändillä.

**eSinetin vaihe 3 (monivuokraajuus, brändäys, upotus) on tehty** — kaikki 11
tehtävää merkitty valmiiksi `esinetti/PLAN.md`:ssä. Tämä este on siis poistunut.

**Sovelluksella ei kuitenkaan ole vielä rakennusohjetta.** eSinetti on
organisaatioiden asiakirjojen allekirjoituspalvelu (tenantit, yhtiöt,
pöytäkirjat, tilinpäätökset). Reilusoppari on kuluttajatuote, jonka ydin on
vuokrasuhde: katselmuskuvat, kuukausikuittaus, huoltokirja, todistukset,
kulut ja verolaskelma. Näistä eSinetissä on valmiina vain allekirjoitus.
"Ajaa eSinetin moottorilla" pitää siis paikkansa allekirjoituksen osalta,
mutta se on pieni osa sovellusta.

Ennen kuin sovellusta aloitetaan, tarvitaan oma `CLAUDE.md` samaan tapaan
kuin tällä sivustolla: tietomalli, käyttäjätyypit, vaiheet ja rajaukset.

Verkkosivu odotuslistatilassa EI riipu tästä. Tavoitelanseeraus CLAUDE.md:n
mukaan on lokakuu 2026.

## Kehote seuraavalle chatille

CLAUDE.md kohdan 9.2 alkuperäinen kehote on vanhentunut. Käytä tätä:

> Lue CLAUDE.md, PLAN.md, DECISIONS.md ja BLOCKERS.md. Vaiheet A ja B ovat
> valmiit ja vaiheesta C on tehty 8 artikkelia kymmenestä. Kerro, mitä
> jäljellä olevista töistä kannattaa tehdä seuraavaksi.

## DNS: nimipalvelinsiirto tehty (päivitetty 2026-09-10)

**Toteutunut ratkaisu:** `reilusoppari.fi` on rekisteröity ja sen nimipalvelimet
osoittavat Verceliin (`ns1.vercel-dns.com`, `ns2.vercel-dns.com`, todennettu
.fi-rekisteristä 2026-09-10).

Suosittelin aiemmin A + CNAME -tapaa, jossa nimipalvelimet olisivat jääneet
rekisteröijälle. Jukka valitsi nimipalvelinsiirron. Se toimii, mutta siitä
seuraa yksi asia, joka on muistettava:

> **Kaikki DNS-tietueet luodaan tästä lähtien Vercelissä.** Jos
> `reilusoppari.fi`-osoitteeseen halutaan joskus sähköpostia, MX-, SPF-, DKIM-
> ja DMARC-tietueet lisätään Vercelin DNS-hallintaan — ei rekisteröijälle.
> Sama koskee Resendin domain-vahvistuksen vaatimia tietueita.

### Nimipalvelinsiirto ei yksin riitä

Todennettu 2026-09-10: `ns1.vercel-dns.com` vastaa kyselyyn
`reilusoppari.fi` **"Query refused"**, ja julkinen resolveri antaa siksi
SERVFAILin. Domain ei siis toimi lainkaan.

Syy ei ole virhe vaan se, miten Vercel toimii: **Vercel tarjoilee DNS:ää vain
domainille, joka on lisätty Vercel-tilille.** Nimipalvelindelegointi osoittaa
palvelimille, jotka eivät tiedä vyöhykkeestä mitään.

Korjaus: lisää domain Vercelissä (projekti `reilusoppari-web` → Settings →
Domains → Add, tai tiimin Domains-näkymä). Vyöhyke syntyy siinä hetkessä ja
varmenne myönnetään automaattisesti.

**Sama koskee `esinetti.fi`:tä.** Se on täsmälleen samassa tilassa: delegointi
Verceliin, `Query refused`, ei toimi. Tarkistettu samalla kertaa.
