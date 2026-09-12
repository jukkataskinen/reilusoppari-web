# DECISIONS — reilusoppari-web

Päätökset, jotka eivät ole CLAUDE.md:ssä. Uusin ensin.

---

## Odotuslistaa ei kerätä – kolmas julkaisutila `soon` (2026-09-11, Jukan päätös)

Odotuslista jäi tarpeettomaksi: eSinetti valmistuu lähipäivinä, ja Reilusoppari
saadaan toimintaan ennen kuin listasta ehtisi olla hyötyä.

Ongelma oli akuutti, ei teoreettinen: sivusto oli jo livenä ja näytti
odotuslistalomaketta, jonka lähetys olisi epäonnistunut, koska Resend-asetuksia
ei ollut. Rikkinäinen lomake on huonompi kuin ei lomaketta lainkaan.

Ratkaisu: kolmas tila `soon`, josta tehtiin **oletus**. Ilman
`LAUNCH_MODE`-muuttujaa sivusto ei siis voi näyttää lomaketta, joka ei toimi —
tuotannossa ei tarvitse asettaa mitään, ja virhe korjaantuu seuraavassa
deployssa itsestään.

`waitlist` säilyy tuettuna koodipolkuna: lomake, skeema, kaksoisvarmistus ja
Server Action ovat ennallaan ja e2e-testit ajavat ne omassa tilassaan
(`playwright.config.ts` asettaa `LAUNCH_MODE=waitlist`). Jos listaa joskus
tarvitaan, se on yhden ympäristömuuttujan takana.

`soon`-tilassa CTA on "Katso miten toimii" → `/miten-toimii`, eikä
päivämäärää luvata. Nappi ei saa luvata mitään, mitä ei voi pitää: palvelua ei
voi aloittaa eikä listalle liittyä.

## Kanoninen osoite on www, ei apex (2026-09-11)

CLAUDE.md kohta 2 linjasi `www → apex`. Toteutunut ratkaisu on päinvastainen:
`reilusoppari.fi` ohjaa 308:lla osoitteeseen `www.reilusoppari.fi`, joka on
kanoninen.

Syyt: ohjaus oli jo tuohon suuntaan Vercelissä, sisarpalvelu `esinetti.fi`
toimii samoin, ja kääntäminen olisi tarkoittanut muutosta molempiin ilman että
kumpikaan suunta on teknisesti parempi. `NEXT_PUBLIC_SITE_URL` on siksi
`https://www.reilusoppari.fi`, ja sivukartta, robots ja canonical-linkit
seuraavat sitä. Todennettu livenä 2026-09-11.

CLAUDE.md kohta 2 on päivitetty vastaamaan tätä.

## Vercel-projektin framework oli `Other` (2026-09-11)

Sivusto vastasi 404:llä jokaisessa polussa, vaikka build oli virheetön ja
28 sivua syntyi. Syy: projekti luotiin ennen kuin repossa oli koodia, jolloin
Vercel ei tunnistanut frameworkia, valitsi `Other` ja julkaisi `public/`-kansion
staattisena sivustona. Asetus ei korjaannu itsestään, vaikka koodi tulee myöhemmin.

Diagnoosi mittauksella: `public/`-kansion tiedostot (`/favicon.svg`,
`/logo-mark.svg`) palauttivat 200, mutta `/_next/static/…` palautti 404.
Se erottaa tämän tapauksen kaikista muista 404-syistä yksiselitteisesti.

Korjaus: Framework Preset → `Next.js`, kaikki Override-kytkimet pois, redeploy
ilman build-välimuistia. Jos vastaava tulee joskus vastaan, testaa ensin
`public/`-kansion tiedosto — se kertoo heti kumpi vika on kyseessä.

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

## Asiakirjat näytetään sellaisina kuin ne ovat (2026-09-12)

Jukka pyysi heroon kaksi sopimuskorttia ja muihinkin kohtiin konkreettisempia
kuvia – erityisesti katselmusraportista ja vuokralaisen loppuraportista.
Taustalla oli `reilusoppari-web-visual-v1`-kokeilu, jossa heroon oli tehty
oikean näköinen sopimuskortti.

**Kokeilusta otettiin idea, ei tiedostoja.** Sen hero oli konkreettisempi kuin
vanha, mutta se rikkoi viittä kohdan 5 sääntöä: varjot, liukuvärit, versaalit,
värjätty yksittäinen sana otsikossa ja napin hover-nosto. Lisäksi se poisti
osapuolikytkimen liikkeen ja siten koko kaksipuolisen näkymän – jäljelle jäi
yksi sopimus ilman kahta osapuolta. Sen paletti myös haalensi `sky`n ja
`coral`in pastelliksi koko sivustolla, mikä olisi pudottanut lomakkeen
virheilmoitusten kontrastin 2,7:1 → 1,7:1.

**Ratkaisu: kaksi sopimuskorttia.** Sama sopimus kahtena näkymänä, kortit
samankokoiset, alla yksi yhteinen rivi. Kytkin vaihtaa korttien paikkaa kuten
puhelinpaneelit ennen, joten sivuston ainoa animaatio säilyy. Kaksi osapuolta,
yksi sopimus – nyt niin, että lukija näkee myös mitä sopimuksessa lukee.

**Sama tehtiin neljälle muulle asiakirjalle:** katselmuspöytäkirja,
vuokratodistus, kuittausilmoitus ja verolaskelma. Ne ovat komponentteja eivätkä
SVG-kuvia, koska kuvana sama sisältö olisi sumeaa pienessä koossa ja
vanhentuisi hiljaa tuotteen sanaston muuttuessa.

Kaksi yksityiskohtaa, jotka eivät ole kosmeettisia:

- **Todistuksen nimet on peitetty** (kohta 4.6). Todistus on yksityinen
  asiakirja, jonka omistaja päättää kenelle sen näyttää. Kokonainen todistus
  nimineen markkinointisivulla kertoisi asiakirjasta toista kuin palvelu itse.
- **Verolaskelmassa ei ole kilometririviä.** Se paljastaisi laskelmasta
  km-taksan, joka muuttuu vuosittain – sivu kertoisi hiljaa väärää lukua.
  Varoitus "ei veroneuvontaa" on mukana, koska se on asiakirjassakin.

**Korjaus samana päivänä: piirretyt valokuvat pois.** Katselmuspöytäkirjassa
oli aluksi kuvaruudut viivapiirroksin (liesi, lattia, jääkaappi). Jukan arvio
oli suora: "nuo kuvat ovat ihan naurettavia". Hän oli oikeassa, ja syy on
periaatteellinen eikä tyylillinen: **pöytäkirjassa kuva on todiste, ja piirretty
todiste on sisäisesti ristiriitainen.** Piirros, joka esittää valokuvaa, ei ole
kumpikaan.

Pöytäkirja esitetään nyt samalla tavalla kuin todistus ja verolaskelma –
riveinä, joissa on selite, kuvaajan tunnusväri ja tiivisteen alku. Se on
asiakirjan oikea sisältö eikä sen kuvitus. Jukan oma arvio vahvisti suunnan:
"nämä alimmaiset ovat parempia", ja juuri ne kaksi olivat pelkkää
asiakirjatietoa ilman keksittyä kuvitusta.

Jos oikeita valokuvia joskus lisätään, ne tulevat rivien viereen eivätkä niiden
tilalle: rivi tiivisteineen on se, mikä asiakirjassa pitää.

`public/illustrations/`-SVG:t jäävät paikoilleen, vaikka neljä viidestä on nyt
käyttämättä. Ne ovat pieniä, ja poistaminen on helppo tehdä myöhemmin – niiden
mahdollinen käyttö sosiaalisen median kuvissa on Jukan päätettävissä.

## Sivustolla näytetään oikeat asiakirjat (2026-09-12, sama päivä)

Jukka näytti luonnoksensa vuokrasopimuksesta ja vuokrasuhdetodistuksesta:
"nämä ovat nettiin ja tuotantoonkin aivan erinomaisia".

Olennainen havainto: **ne oli jo toteutettu.** `reilusoppari`-repon
`src/documents/` on kirjoitettu juuri näiden luonnosten pohjalta
(`src/documents/README.md`), ja `npm run samples` tuottaa valmiit PDF:t.
Puute ei ollut tuotannossa vaan sivustolla, joka näytti samoista
asiakirjoista sivustoa varten tehtyjä korttiversioita.

Kortit poistettiin ja tilalle tulivat oikeiden PDF-pohjien sivut
(`public/asiakirjat/`, komponentti `DocumentPage`). Syy ei ole ulkonäkö vaan
se, että kaksi toteutusta samasta asiakirjasta on kaksi totuutta: kun pohja
muuttuu, sivusto ei muutu, eikä eroa huomaa kukaan ennen kuin asiakas huomaa.

Tämä ratkaisi samalla katselmuspöytäkirjan, joka oli koko päivän ongelma.
Piirretyt valokuvat olivat väärä vastaus kysymykseen, johon oikea vastaus oli
"näytä oikea pöytäkirja".

**Hinta:** kuvat eivät synny tässä repossa, joten ne voivat jäädä jälkeen.
Päivityskomento on kirjattu sekä `DocumentPage`-komponenttiin että
sovelluksen `src/documents/README.md`:hen. Vaihtoehto olisi ollut renderöidä
PDF:t sivuston buildissa, mutta se toisi sivustolle riippuvuuden sovelluksen
koko asiakirjakoodiin – kolmesta PNG-tiedostosta ei kannata maksaa sitä.

Merkkauksena tehtyjä näkymiä jäi kolme, kullakin syynsä: heron sopimuskortit
(kytkin tarvitsee kaksi vaihtuvaa näkymää), kuittausilmoitus (puhelimen
ilmoitus, ei asiakirja) ja verolaskelma (pohja on olemassa, esimerkkiä ei
vielä tehdä).

Todistuksen nimet näkyvät nyt kokonaan, toisin kuin kohta 4.6 aiemmin vaati.
Perustelu kääntyi: esimerkkihenkilöt ovat tunnistettavasti keksittyjä, ja
todistuksen arvo on juuri siinä, että siinä lukee jonkun nimi. Peitetty nimi
teki esimerkistä varovaisen kohdassa, jossa tuotteen pitää näyttää vahvalta.
