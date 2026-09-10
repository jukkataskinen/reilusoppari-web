# BLOCKERS — reilusoppari-web

## Tila 2026-09-10: vaiheet A ja B tehty, sivusto odottaa ympäristöä

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

### 3. Ympäristö — OSITTAIN

- **Vercel-projekti on olemassa** ja repo on kytketty siihen (2026-09-10).
- **Jäljellä:** domain Verceliin (odottaa verkkotunnuksen aukeamista, ks.
  DNS-osio alempana), Resend-segmentti `reilusoppari-waitlist`, Turnstile,
  Plausible ja ympäristömuuttujat.

Muuttujat ovat `.env.example`-tiedostossa. Ilman `RESEND_API_KEY`- ja
`RESEND_SEGMENT_ID`-arvoja odotuslista näyttää selkeän virheilmoituksen sen
sijaan, että kaatuisi – sivusto siis toimii jo nyt, mutta lomake ei vielä
tallenna mitään.

### 4. Tietosuoja ja käyttöehdot — JUKAN LUETTAVA (CLAUDE.md kohta 9.4)

`/tietosuoja` ja `/kayttoehdot` ovat pohjia. Kolme kohtaa vaativat erityistä
huolellisuutta, koska palvelu myydään kuluttajalle: peruutusoikeus (KSL 6 luku,
etämyynti), kuvat kodista ja todistuksen omistajuus. Juristin tarkistusta on
syytä harkita ennen lanseerausta. Ks. `DECISIONS.md`.

Huom: tietosuojaselosteen odotuslistaosuus koskee käsittelyä, joka on TOTTA JO
NYT — se ei voi odottaa lanseeraukseen asti.

### 5. Blogin verotusartikkelit — JUKAN KIRJOITETTAVA (CLAUDE.md kohta 9.5)

Artikkelit 6 (vuokratulon verotus) ja 7 (vähennykset) ovat sivuston
uskottavuuden ydin. Blogin rakenne on valmis, artikkelilista tyhjä. Ks. `PLAN.md`
vaihe C: artikkelin lisääminen on kolme kohtaa.

### ~~6. Leipäfontti~~ — SELVÄ (2026-09-10)

Plus Jakarta Sans on ladattu itse hostattavaksi (`public/fonts/sans-variable.woff2`,
latin-osajoukko, painot 400–800). Ei Google Fonts -CDN-kutsuja.

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

## Kehote seuraavalle chatille

Vaiheet A ja B ovat tehty, joten CLAUDE.md kohdan 9.2 alkuperäinen kehote on
vanhentunut. Käytä tätä:

> Lue CLAUDE.md, PLAN.md, DECISIONS.md ja BLOCKERS.md. Vaiheet A ja B ovat
> valmiit. Aloita vaihe C: kirjoita blogiartikkelit CLAUDE.md kohdan 6
> järjestyksessä, yksi kerrallaan, ja jätä artikkelit 6 ja 7 Jukan
> kirjoitettaviksi.

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
