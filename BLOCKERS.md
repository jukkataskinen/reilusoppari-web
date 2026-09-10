# BLOCKERS — reilusoppari-web

## Projekti on TYÖLISTALLA, ei aloitettu (päivitetty 2026-09-10)

Rakennusohje (`CLAUDE.md`) on siirretty tänne Downloads-kansiosta 2026-09-10.
Työtä ei ole aloitettu. Alkuperäisistä kolmesta esteestä (CLAUDE.md kohta 9)
yksi on poistunut, kaksi on jäljellä.

### ~~1. Nimi ja verkkotunnus~~ — SELVÄ (Jukka 2026-09-10)

- **`reilusoppari.fi` on tilattu ja maksettu**, aukeaa lähipäivinä.
- **YTJ-toiminimihaku tehty** — ei estettä.
- **Tavaramerkit tarkistettu** — ei estettä. (PRH:n kansallinen haku
  `reilusoppari` → 0 osumaa 2026-09-10; Jukka on sittemmin todennut myös
  EUIPOn ja sekoitettavuuden osalta, että homma on ok.)

Nimi on siis lukittu. Ei enää tarvitse palata tähän.

### 2. Repo `reilusoppari-web` — JÄLJELLÄ

Tämä hakemisto **ei ole vielä git-repo**. Uusi chat ei voi committoida ennen
kuin repo on olemassa.

- Jos luot GitHubiin repon README:n kanssa: kloonaa se ja siirrä nämä kaksi
  tiedostoa kloonin sisään.
- Jos teet `git init` täällä ja lisäät remoten jälkikäteen: älä luo GitHubiin
  README:tä, muuten historioita on kaksi.

Kun repo on luotu, tässä oleva `CLAUDE.md` on jo oikeassa paikassa ja oikealla
nimellä.

### 3. Ympäristö — JÄLJELLÄ

Vercel-projekti, domain Verceliin, Resend-audience `reilusoppari-waitlist`,
Turnstile, Plausible, env-muuttujat — samat kuin esinetti-webissä.

Domainin osalta tämä odottaa vain sitä, että verkkotunnus aukeaa. Ks. DNS-osio
alempana ennen kuin koskee tietueisiin.

## Kustannukset

Ks. `KUSTANNUKSET.md` — palvelut, hinnat, ALV-käsittely ja sääntö siitä, ettei
uusia maksullisia palveluita ehdoteta ilman hintatietoa.

## Riippuvuus eSinettiin

Sovellus (`app.reilusoppari.fi`) ajaa eSinetin moottorilla omalla brändillä. Se
tarkoittaa, että eSinetin monivuokraajaisuus ja brändäys (vaihe 3) on oltava
kunnossa ennen kuin `LAUNCH_MODE=live` on mahdollinen.

Verkkosivu odotuslistatilassa EI riipu siitä — **vaiheet A–C voi tehdä heti kun
repo on olemassa.** Tavoitelanseeraus CLAUDE.md:n mukaan on kesä 2027, eli tämä
ei kilpaile eSinetin kanssa aikataulusta.

## Ensimmäinen kehote kun repo on olemassa

> Lue CLAUDE.md, BLOCKERS.md ja KUSTANNUKSET.md. Kopioi runko esinetti-web-reposta, luo PLAN.md
> kohdan 8 pohjalta ja aloita vaihe A.

(`BLOCKERS.md` on mainittava erikseen — CLAUDE.md:n oma kehote ei mainitse sitä,
jolloin uusi chat ei näkisi tätä tilaa eikä alla olevaa DNS-korjausta.)

## DNS: speksin kohta 9.1 on epätarkka (huomio 2026-09-10)

CLAUDE.md sanoo "nimipalvelimet `ns1/ns2.vercel-dns.com` kuten esinetti.fi".
Kaksi korjausta:

1. **esinetti.fi EI käytä nimipalvelinsiirtoa.** esinetti-webin oma ohje
   (`esinetti-web/CLAUDE.md` kohta 249) neuvoo pitämään domainin välittäjän
   DNS-hallinnassa ja lisäämään sinne vain A-tietueen `@` → Vercelin IP ja
   CNAME `www` → `cname.vercel-dns.com`. "Kuten esinetti.fi" tarkoittaa siis
   tätä, ei nimipalvelinsiirtoa.
2. **Älä käytä `ns1/ns2.vercel-dns.com` muistista.** Vercel antaa osalle
   tileistä oman parinsa (`ns1.vercel-dns-0XX.com`). Oikea pari näkyy vasta
   kun domain lisätään: Vercel → projekti → Settings → Domains. Se on ainoa
   auktoriteetti.

Valinta tapojen välillä:

| Tapa | Mitä tehdään | Milloin |
|---|---|---|
| Nimipalvelinsiirto | Vaihdetaan NS-tietueet rekisteröijällä Vercelin osoittamiin | Vercel hoitaa koko DNS:n, myös www → apex |
| A + CNAME | Nimipalvelimet ennallaan, lisätään kaksi tietuetta | Domainille tulee myös sähköpostia (MX säilyy nykyisessä hallinnassa) |

**Suositus:** A + CNAME, jos `reilusoppari.fi`-osoitteeseen tulee joskus
sähköpostia. Nimipalvelinsiirto vie kaikki tietueet Vercelille ja MX:t pitää
perustaa siellä uudelleen.
