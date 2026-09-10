# DECISIONS — reilusoppari-web

Päätökset, jotka eivät ole CLAUDE.md:ssä. Uusin ensin.

---

## Katselmuksen mekanismi: hyväksyntä, ei kuvaaja (2026-09-10, Jukan korjaus)

Sivustolla luki useassa kohdassa, että "molemmat kuvaavat samat huoneet" ja
että kuvista ei ole todistetta, jos vain toinen kuvaa. **Tämä oli väärin.**

Oikea mekanismi on:

> Kumpikin kuvaa ne kohdat, jotka **itse** pitää olennaisina, ja molemmat
> hyväksyvät kuvat allekirjoittaessaan vuokrasopimuksen.

Todistusarvo ei siis synny siitä, kuka on ottanut kuvat, vaan siitä että
molemmat ovat hyväksyneet koko kokoelman allekirjoituksellaan osana sopimusta.
Kuvaaminen ei ole koordinoitua eikä kumpikaan ole sidottu toisen listaan –
vuokranantaja kuvaa yleensä pinnat ja kodinkoneet, vuokralainen sen, mikä
häntä itseään huolestuttaa, ja yhdessä kokoelmasta tulee kattavampi.

Korjattu näissä: etusivun asiallinen lause, `Steps`, `/katselmus`,
`/miten-toimii`, `/vuokralaiselle`, `content/faq.ts` sekä blogiartikkelit
1, 2 ja 3.

**CLAUDE.md kohta 4.3 muutettiin tämän takia.** Speksin alkuperäinen lause oli
"molemmat kuvaavat samat huoneet", ja se on korvattu yllä olevalla. Tämä on
ainoa kohta, jossa speksin sitovaa tekstiä on muutettu, ja muutos on Jukan
oma linjaus.

## Leipäfontti: Plus Jakarta Sans, latin-osajoukko (2026-09-10)

`public/fonts/sans-variable.woff2` on Plus Jakarta Sans -muuttujafontti
(v12, painot 400–800), ladattu kertaalleen Google Fontsista ja tarjoiltu
omasta domainista – ei CDN-kutsuja (CLAUDE.md kohta 5).

Ladattu osajoukko on **latin**, joka kattaa U+0000–00FF (siis ä, ö ja å),
lainausmerkit ja ajatusviivan U+2000–206F -alueelta. Latin-ext jätettiin pois:
se toisi lähinnä š- ja ž-kirjaimet, joita sivuston teksteissä ei ole, ja
kaksinkertaistaisi latauksen. Jos sellaisia joskus tarvitaan, oikea korjaus on
ladata latin-ext-tiedosto ja lisätä se omana `localFont`-määrittelynään
fonttipinoon – ei vaihtaa tätä tiedostoa laajempaan.

Tiedoston nimi on tarkoituksella geneerinen: fontin vaihto on pelkän woff2:n
korvaus, eikä `globals.css` tai yksikään komponentti viittaa fontin nimeen.

## Hero-kuvitus on väritön, väri tulee paneelista (2026-09-10)

Ensimmäisessä versiossa hero-SVG:n sivupuhelimissa oli `sky`- ja `coral`-väriset
elementit. Kun hero-kytkin kääntää puhelinten paikat, SVG ei käänny mukana, ja
värit osoittivat väärään osapuoleen.

Ratkaisu: sivupuhelimet ovat SVG:ssä värittömiä, ja osapuoliväri tulee
taustapaneelista, joka vaihtaa puolta kytkimen mukana. Kuvitus säilyy
speksin vaatimana kaksoisnäkymänä, mutta väri ei voi eriytyä totuudesta.

## Kertamaksua ei jaeta vuosille hintalaskurissa (2026-09-10)

CLAUDE.md kohta 8 pyytää laskurin "asuntojen määrä → vuosihinta". Vuokrasuhteen
29 € on kuitenkin kertamaksu, ei vuosimaksu. Jos se jaettaisiin vuosille, sivu
antaisi ymmärtää palvelun olevan tilausmalli, mitä se ei ole.

Laskuri näyttää siksi kaksi lukua: toistuvan vuosihinnan (Plus tai salkku) ja
erikseen kertamaksun. Salkkuhinnassa kertamaksua ei ole, joten rivi katoaa.

## Odotuslistan asuntokenttä poistetaan DOM:ista (2026-09-10)

Asuntojen määrä kysytään vain vuokranantajalta (CLAUDE.md kohta 2). Kenttä
poistetaan kokonaan, kun osapuoleksi valitaan vuokralainen – ei piiloteta
CSS:llä, koska piilotettu kenttä lähtisi silti lomakkeen datassa mukaan.
Lisäksi skeema pudottaa arvon palvelinpuolella, jos se jostain syystä tulee
vuokralaisen lomakkeesta.

## Radio-painikkeiden fokusrengas labelissa (2026-09-10)

Osapuolivalinta on pilleripainikkeiden näköinen, joten itse `<input
type="radio">` on `sr-only`. Fokusrengas piirretään labeliin
(`has-[:focus-visible]`), koska muuten näppäimistökäyttäjä ei näkisi, missä
hän on. Sama syy siihen, miksi e2e-testi klikkaa labelia eikä inputtia.

## Blogirekisteri sallii tyhjän listan (2026-09-10)

esinetti-webissä `POST_ORDER` on `as const` -taulukko ja `PostSlug` johdetaan
siitä. Tyhjänä se antaisi tyypin `never`, joka kaataisi kaikki blogifunktiot.
Tässä `POST_ORDER` on `readonly string[]` ja `isPostSlug` tarkistaa avaimen
`POST_FRONTMATTER`-objektista. Rakenne on siis valmis vaiheelle C ilman, että
tyhjä lista rikkoo mitään.

## Resend: Audience → Segment (peritty esinetti-webistä)

Resend on siirtänyt kontaktien ryhmittelyn Audiencesta Segmentteihin, ja
`audienceId` on SDK:ssa deprecated. CLAUDE.md kohta 9.3 puhuu "audiencesta",
mutta luotava asia on **segmentti** nimeltä `reilusoppari-waitlist`, ja
ympäristömuuttuja on `RESEND_SEGMENT_ID`.

## Resendin SDK ei heitä poikkeusta API-virheistä (peritty esinetti-webistä)

`resend.emails.send()` palauttaa virheen muodossa `{ data: null, error }` eikä
heitä poikkeusta esimerkiksi vahvistamattomasta lähettäjädomainista. Pelkkä
try/catch ei siis havaitse epäonnistunutta lähetystä, ja käyttäjälle
näytettäisiin "Kiitos" vaikka viestiä ei lähtenyt. `error`-kenttä on
tarkistettava aina erikseen.

## OG-kuvat reittinä, ei tiedostokonventiona (peritty esinetti-webistä)

`opengraph-image.tsx`-tiedostokonventio sai Next.js 15.5.25:n striimaamaan koko
sivun metadatan `<body>`:hyn `<head>`:n sijaan nonce-CSP:n kanssa. OG-kuvat
generoidaan siksi `/api/og`-reitillä ja meta-tagit renderöidään JSX:nä
(`OgImageMeta`), joka ei kulje Next.js:n metadata-resoluution kautta.

## Tietosuoja ja käyttöehdot: kaksi aikatasoa (2026-09-10)

Tietosuojaseloste on jaettu odotuslistan käsittelyyn (voimassa nyt) ja palvelun
käsittelyyn (alkaa lanseerauksessa). Syy on, ettei seloste saa väittää
käsittelevänsä vuokrasuhteen tietoja tänään – odotuslista on ainoa todellinen
käsittely tässä vaiheessa, ja se on kuvattava täsmällisesti jo nyt.

Käyttöehdoissa peruutusoikeus on kirjoitettu kuluttajansuojalain etämyynnin
mukaan: oikeus voi lakata vain, jos kuluttaja on antanut nimenomaisen
suostumuksen suorituksen aloittamiseen ja saanut tiedon oikeuden menettämisestä.
Molemmat sivut ovat pohjia, jotka Jukan on hyväksyttävä (CLAUDE.md kohta 9.4).
