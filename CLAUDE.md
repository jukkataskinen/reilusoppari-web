# reilusoppari.fi – verkkosivuston rakennusohje Claude Codelle

Tämä on repon `reilusoppari-web` `CLAUDE.md`. Sivusto on Reilusoppari-palvelun julkinen sivusto. Tekninen pohja, työskentelyprotokolla, `LAUNCH_MODE`, lomakkeet, analytiikka, turvaotsakkeet ja laatuvaatimukset ovat **samat kuin `esinetti-web`-repossa** – kopioi sen runko ja tämä tiedosto korvaa vain sisällön, sävyn ja ilmeen. Älä kysy käyttäjältä mitään, mikä on tässä päätetty; kirjaa muut päätökset `DECISIONS.md`:ään.

---

## 1. Mikä Reilusoppari on ja miltä sen pitää tuntua

Reilusoppari on vuokranantajan ja vuokralaisen yhteinen työkalu koko vuokrasuhteen ajaksi: vuokrasopimus pankkitunnuksilla, alkukatselmus kuvin, kuukausittainen vuokrakuittaus, huoltokirja, loppukatselmus ja lopuksi todistus molemmille. Vuokranantaja maksaa, vuokralainen ei koskaan. Ensimmäinen vuokrasuhde on ilmainen.

Sivuston sävy: **rento, hyväntuulinen, reilu**. Kuin ystävällinen naapuri, joka sattuu olemaan kirjanpitäjä. Ei lakitoimisto, ei pankki, ei startup-hype. Sivuston pitää saada sekä 24-vuotias ensiasuntoon muuttava että 62-vuotias kahden sijoitusasunnon omistaja tuntemaan, että tämä on tehty heitä varten – ja toista osapuolta vastaan ei ole ketään.

**Äänensävyn mittatikku.** Kaikki sivuston teksti mitataan tätä vasten – jos kappale ei kuulosta samalta kirjoittajalta, kirjoita se uudelleen:

> Parketissa kulumaa? Ovikellon nappi jumii? Ainahan asunnoissa jotain on, kun eivät uusia ole. Turha niistä on kuitenkaan riidellä; otetaan kuva ja laitetaan se talteen niin ei tarvitse vikoja muistella. Reilua.

Mitä siinä on: arkinen konkreettinen esimerkki ensin, ymmärrystä molemmille ("kun eivät uusia ole"), ratkaisu yhdessä lauseessa passiivissa ("otetaan kuva"), ja lopuksi yksi sana, joka on koko tuotteen lupaus. Ei "sinä", ei käskyä, ei pelottelua. Sama rakenne toimii kuittauksessa ("Vuokra maksettu? Napautetaan kyllä, niin molemmat tietävät. Reilua.") ja todistuksessa – mutta älä käytä "Reilua."-loppua useammin kuin kerran per sivu, muuten se kuluu.

Rennon ja hyväntuulisen raja: sinuttelu, huumori tilanteista (kynä joka ei toimi, jääkaapin magneetin alle unohtunut sopimus, vakuusriita laminaatista), lämpimät kuvitukset. Mutta: ei emojeja tekstissä, ei huutomerkkejä, ei "yli 10 000 tyytyväistä", ei keksittyjä sitaatteja, eikä vitsailua riidoista, jotka ovat ihmisille oikeasti raskaita. Huumori kohdistuu paperisotaan, ei ihmisiin.

---

## 2. Lukitut päätökset

| Aihe | Päätös |
|---|---|
| Repo | `reilusoppari-web`, kopio `esinetti-web`-rungosta (Next.js 15, MDX-sisältö, Plausible, Resend, Turnstile). |
| Domain | `reilusoppari.fi`, **apex → www** (`www.reilusoppari.fi` on kanoninen osoite; korjattu 2026-09-11, aiemmin tässä luki www → apex – ks. DECISIONS.md). Sovellus myöhemmin `app.reilusoppari.fi` (eSinetin moottori, oma brändi). |
| Julkaisutila | `LAUNCH_MODE=soon` (oletus, 2026-09-11 alkaen): palvelu avautuu pian, **odotuslistaa ei kerätä**. `waitlist`-tila on yhä tuettu koodipolku, jos listaa joskus tarvitaan. Odotuslistalomake kysyy: sähköposti + "Olen vuokranantaja / vuokralainen / molempia" + asuntojen määrä (vain vuokranantajalta). |
| Hinnasto | `content/pricing.ts`: ensimmäinen vuokrasuhde 0 €; sitten 29 €/vuokrasuhde kertamaksuna (sisältää kaiken vuokrasuhteen ajan, enintään 5 v); Plus: kulut ja verolaskelma 12 €/asunto/v, veloitus vasta ensimmäistä laskelmaa tulostettaessa; 5+ asuntoa 15 €/asunto/v sisältää kaiken; vuokralaiselle aina 0 €. Hinnat sis. ALV 25,5 % – kuluttajahinnat näytetään verollisina. |
| Suosittelu | "Tuo kaveri, molemmat saatte seuraavan sopimuksen ilmaiseksi." Näytetään sivustolla, toteutus sovelluksessa. |
| Kieli | Suomi. Rakenne sallii sv/en myöhemmin. |
| Kuvitus | Oma kuvitustyyli (kohta 5), ei stock-kuvia, ei valokuvia ihmisistä. Aidot käyttöliittymäkuvat vasta kun sovellus on olemassa. |
| Oikeushenkilö | **Adepta Tilat Oy, Y-tunnus 2145627-7** (Jukan linjaus 2026-09-13). Sivustolla näytetään käyntiosoite Yhdystie 4, 19650 Joutsa – **ei** kotipaikkaa (Kuopio), koska osoite kertoo mihin voi ottaa yhteyttä ja kotipaikka ei kerro mitään. eSinetti on **eri yhtiön** (Adepta Oy, 2237131-2) tuote, joten sitä ei saa esittää samana talona. Tiedot ovat yhdessä paikassa: `content/company.ts` – älä kovakoodaa nimeä tai Y-tunnusta sivuihin. Alatunnisteessa "Reilusoppari toimii eSinetti-allekirjoitusmoottorilla" linkkinä. |
| Sallitut väittämät | Kohta 7. Sitovat. |

---

## 3. Sivukartta

```
/                       Etusivu
/miten-toimii           Koko kaari kuvina: sopimus → katselmus → kuittaus → huoltokirja → loppukatselmus → todistus
/vuokranantajalle       Mitä saat, mitä maksat, salkkuhinta
/vuokralaiselle         Miksi ilmainen, mitä saat (todistus, kuvat, kuittaukset), miksi kannattaa pyytää vuokranantajaa käyttämään
/katselmus              Alku- ja loppukatselmus kuvin – miksi tämä on tuotteen sydän
/verolaskelma           Kulut talteen, keväällä valmis laskelma (Plus)
/hinnat                 Hinnasto ja UKK hinnoista
/todistus               Vuokratodistus: mitä siinä on, kuka sen omistaa, miten tarkistetaan
/blogi, /blogi/[slug]   Tietopankki
/ukk
/yhteystiedot
/tietosuoja             Erityisen huolellinen: kuvat kodista, molempien osapuolten oikeudet, todistuksen omistajuus
/kayttoehdot            Kuluttajaehdot (Jukka tarkistaa; huomioi kuluttajansuojalaki ja etämyynnin peruutusoikeus)
/sitemap.xml, /robots.txt, /rss.xml
```

Navigaatio: logo · Miten toimii · Vuokranantajalle · Vuokralaiselle · Hinnat · Blogi · [Aloita ilmaiseksi]. Kaksi kohderyhmälinkkiä rinnakkain on tarkoituksellista: sivusto sanoo rakenteellaan, että osapuolia on kaksi.

---

## 4. Etusivu

1. **Hero.** Otsikko: "Vuokrasopimus, jonka molemmat allekirjoittavat mielellään." Alaotsikko: "Reilusoppari hoitaa sopimuksen, kuvat asunnon kunnosta, vuokrakuittaukset ja lopuksi todistuksen – molemmille. Ensimmäinen vuokrasuhde on ilmainen." CTA `<PrimaryCta />` ("Aloita ilmaiseksi" / odotuslista), alle "Vuokralaiselle aina maksuton."
   Heron visuaalinen elementti: **kaksipuolinen näkymä**. Sovelluksen oikea vuokrasopimus (`<DocumentPage name="vuokrasopimus" />`) ja sen alla kaksi samankokoista allekirjoittajapaneelia – vuokranantaja `sky`, vuokralainen `coral` – sekä yhteinen rivi "Yksi sopimus · molemmat allekirjoittavat pankkitunnuksilla". Asiakirja on yksi, koska niin se on oikeastikin: osapuolia on kaksi, ei sopimuksia. Kytkin vaihtaa allekirjoittajien järjestyksen; valittu osapuoli on aina vasemmalla. Allekirjoittajien nimet ovat samat kuin kuvassa näkyvässä sopimuksessa. Vaihtokytkin heron yläreunassa "Olen vuokranantaja / Olen vuokralainen" vaihtaa alaotsikon ja CTA-tekstin (vuokralaiselle: "Pyydä vuokranantajaa käyttämään Reilusopparia" → valmis viestipohja jaettavaksi). Kytkimen tila muistetaan sivuston sisällä (URL-parametri, ei evästettä).
2. **Kolme askelta, kevyesti.** "Sopikaa. Kuvatkaa. Kuitatkaa." Yksi lause per askel. Aito sekvenssi, numerointi perusteltu.
3. **Ainahan asunnoissa jotain on.** Tämä osio on sivun sydän ja sen teksti on sitova (Jukan kirjoittama):
   > Parketissa kulumaa? Ovikellon nappi jumii? Ainahan asunnoissa jotain on, kun eivät uusia ole. Turha niistä on kuitenkaan riidellä; otetaan kuva ja laitetaan se talteen niin ei tarvitse vikoja muistella. Reilua.

   Vieressä alkukatselmuksen pöytäkirja (`<DocumentPage name="alkukatselmus" />`): sovelluksen oikean PDF:n ensimmäinen sivu. Aikaleima on asiakirjassa itsessään, joten erillistä kuvatekstiä ei ole. Alle yksi asiallinen lause: "Alkukatselmus on osa sopimusta: kumpikin kuvaa ne kohdat, jotka itse pitää olennaisina, ja molemmat hyväksyvät kuvat allekirjoittaessaan vuokrasopimuksen. Muuttopäivänä katsotaan samoja kuvia." (Korjattu 2026-09-10, aiemmin "molemmat kuvaavat samat huoneet" – ks. DECISIONS.md.) Ei sanaa "riita" tämän kappaleen ulkopuolella etusivulla.

4. **Molemmille jotain.** Kaksi palstaa rinnakkain, ei kortteja. Vuokranantaja: sopimus pankkitunnuksilla · kuvat todisteena · kuukausikuittaus yhdellä napilla · huoltokirja · kulut talteen ja verolaskelma keväällä (Plus). Vuokralainen: pankkitunnistettu vuokranantaja · omat kuvat samassa paikassa · ilmoitus kun vuokra on kuitattu · viat kirjattu, kukaan ei voi poistaa · vuokratodistus seuraavaan asuntoon. Palstojen pitää olla yhtä pitkät – se on viesti.
5. **Vuokrakuittaus.** Teksti sitova (Jukan kirjoittama):
   > Olikos sen Liisan tämän kuun vuokra jo tullut? No joo, yleensä se tulee ajallaan niin kuin nytkin. Laitetaan siitä viesti menemään. Reilua.

   Vieressä kuittausilmoitus (`ConfirmationPreview`): "Maksoiko Liisa 850 € eräpäivään 2.9. mennessä?" ja napit Kyllä · Ei vielä · Osittain, alla vuokralaisen näkymä samasta kuittauksesta. Napit ovat kuvassa eivätkä ole painettavia. Alle yksi asiallinen lause: "Vuokralainen näkee kuittauksen heti, ja vuoden päästä kummallakin on sama maksuhistoria – ilman pankkitiliä, ilman perintätoimistoa." Huom: tämä on sivun toinen "Reilua."-loppu; ohjeen sääntö yhdestä per sivu väistyy, kun tekstit ovat Jukan – mutta kolmatta ei lisätä.

6. **Todistus.** Vuokralaisen äänellä, teksti sitova (Jukan kirjoittama):
   > Sitten kun on aika muuttaa seuraavaan kotiin niin muistoksi saat yhteenvedon vuokrien maksusta ajallaan ja vuokranantajan terveiset. Allekirjoitettu dokumentti hyvästä vuokrasuhteesta on kovaa valuuttaa, kun näytät sen seuraavalle vuokranantajalle.

   Vieressä vuokratodistus (`<DocumentPage name="vuokratodistus" />`): sovelluksen oikean PDF:n sivu. Esimerkkihenkilöiden nimet näkyvät kokonaan – ne ovat tunnistettavasti keksittyjä, ja todistuksen arvo on juuri siinä, että siinä lukee jonkun nimi. Alle yksi asiallinen lause: "Todistus on sinun: sinä päätät, kenelle sen näytät. Aitouden voi tarkistaa linkistä." Sama teksti on `/vuokralaiselle`-sivun avaus. Vuokranantajan todistus mainitaan tässä yhdellä rivillä: "Vuokranantaja saa omansa – vakuus palautettu ajallaan, viat korjattu."

7. **Hinta.** "Ensimmäinen vuokrasuhde ilmaiseksi. Sen jälkeen 29 € – kerran, koko vuokrasuhteen ajaksi. Vuokralaiselle 0 €." Alle rivi: "Plus: kulut ja verolaskelma 12 €/asunto/v. Salkut: 15 €/asunto/v." Linkki `/hinnat`.
8. **Tuo kaveri.** Suosittelulupaus yhdellä lauseella.
9. **UKK** (6 kpl): Onko sähköinen vuokrasopimus pätevä? · Mitä vuokralainen maksaa? · Kuka näkee kuvat? · Voiko vuokranantaja kirjoittaa todistukseen mitä tahansa? · Mitä jos vuokralainen ei halua käyttää palvelua? · Missä tiedot säilytetään?
10. **Loppu-CTA.** "Aloitetaanko reilusti?" + CTA + "Ensimmäinen vuokrasuhde ilmaiseksi · Vuokralaiselle aina maksuton".

---

## 5. Visuaalinen suunta – lämmin, selkeä, kahden osapuolen tuote

**Idea:** kaksi väriä, kaksi osapuolta, yksi sopimus. Vuokranantajan puoli on `sky`, vuokralaisen `coral`, ja kaikki yhteinen (sopimus, todistus, CTA) on `ink`-tummaa valkoisella. Kun molemmat värit esiintyvät, ne ovat aina yhtä isoina – ei koskaan toinen toisen päällä.

**Paletti**
- `ink` #1B2A41 – teksti, yhteiset elementit, ensisijainen CTA
- `sky` #3D8BFF – vuokranantaja
- `coral` #FF6F59 – vuokralainen
- `paper` #FFFFFF – tausta
- `cloud` #F3F6FA – paneelit ja vuorottelevat osiot
- `moss` #2E9E6B – "kuitattu", "sinetöity", "tarkistettu" -tilat, vain niihin
- Ei kermanväriä, ei terrakottaa, ei liukuvärejä. Lämpö tulee `coral`-sävystä ja kuvituksista, ei taustasta.

**Typografia:** **Plus Jakarta Sans** 400/500/700/800, itse hostattuna. Hero 800, 52/34 px, rivinväli 1.05. Otsikot 700. Leipäteksti 400, 18/17 px, rivinväli 1.65, max 66 merkkiä. Tiivisteet ja tarkistuskoodit JetBrains Mono. Otsikot saavat olla puhekielisiä ("Sopikaa. Kuvatkaa. Kuitatkaa."), mutta ei versaaleja, ei värjättyjä yksittäisiä sanoja.

**Asiakirjat näytetään oikeina, ei mukaelmina.** Vuokrasopimus, katselmuspöytäkirja ja vuokratodistus ovat sivustolla `reilusoppari`-sovelluksen todellisten PDF-pohjien sivuja (`public/asiakirjat/`, komponentti `DocumentPage`). Sivustolla näkyy siis täsmälleen se asiakirja, jonka käyttäjä saa. Sivustolle erikseen tehty korttiversio olisi toinen totuus: kun pohja muuttuu, sivusto ei muutu, eikä kukaan huomaa eroa ennen kuin asiakas huomaa.

Kuvat päivitetään ajamalla `reilusoppari`-repossa `npm run samples` ja `node scripts/pdf-to-png.mjs esimerkit/<nimi>.pdf sivu`, ja kopioimalla `sivu-1.png` tänne.

Merkkauksena tehtyjä näkymiä (`src/components/previews/`) jää kolme, ja kullakin on syynsä: heron sopimuskortit (osapuolikytkin tarvitsee kaksi vaihtuvaa näkymää), kuittausilmoitus (se on puhelimen ilmoitus eikä asiakirja) ja verolaskelma (pohja on sovelluksessa, mutta esimerkkitiedostoa ei vielä tehdä). Kukin niistä on saavutettavuudelle yksi kuva (`role="img"` + `aria-label`), eikä sisällä ole nappeja tai linkkejä.

**Kuvitus:** yksinkertainen kaksiväri-viivakuvitus (`ink`-viiva + yksi täyttöväri), aiheina koti ja tavarat: avaimet, jääkaappi magneetteineen, laminaattilattia, puhelin jossa kuittausnappi, sinetöity paperi. Ei kasvoja eikä ihmishahmoja – kaksi osapuolta esitetään kahdella puhelimella tai kahdella kädellä, jotka pitävät samaa paperia. Kuvitukset SVG:nä `public/illustrations/`, kaikki samalla viivanpaksuudella (2,5 px 100 px:n ruudukossa). Tee ensin viisi: hero-kaksoisnäkymä, katselmus, kuittaus, todistus, verolaskelma.

**Muodot:** pyöristys 16 px paneeleissa, pilleri napeissa. Ei varjoja. Osiot vuorottelevat `paper` ja `cloud`. Sisältö max 1080 px. Osiovälit 88/56 px.

**Liike:** yksi animaatio, hero-kytkin: kun käyttäjä vaihtaa osapuolta, puhelimet vaihtavat paikkaa 300 ms:n liukuliikkeellä ja teksti vaihtuu. Käyttäjän käynnistämä, joten ei `reduced-motion`-ongelmaa (silti kunnioita asetusta: ilman animaatiota vaihto on välitön). Ei muita animaatioita.

**Ääni kuvissa ja mikrokopioissa:** nappien tekstit puhekielisiä mutta täsmällisiä: "Aloita ilmaiseksi", "Kyllä, maksoi", "Ei vielä", "Lähetä kaverille". Tyhjät tilat ja virheviestit samaa sävyä: "Tänne tulee kuvia, kun katselmus on tehty."

**Vältettävät:** stock-kuvat kättelevistä ihmisistä, isometriset 3D-kuvitukset, gradienttitaustat, konfetti, emojit tekstissä, "🎉"-henkinen ilmaisuus, jokaiselle osiolle oma kortti-ruudukko.

---

## 6. Blogi – lanseerauksen 10 artikkelia

900–1 400 sanaa, käytännöllisiä, sinuttelevia, kirjanpitäjän tarkkuudella. Lakiviittaukset nimellä (AHVL 481/1995, KSL, eIDAS). Ei keksittyjä lukuja. Jokaiseen sisäinen linkki `/katselmus`- tai `/verolaskelma`-sivulle ja hintoihin.

1. Vuokrasopimuspohja 2026 – mitä siinä pitää olla ja mitä ei kannata laittaa
2. Muuttotarkastus vuokra-asunnossa: näin kuvaat asunnon niin, että kuvista on hyötyä
3. Vuokravakuuden palautus – milloin vuokranantaja saa pidättää ja miten riita vältetään
4. Vuokralaisen tunnistaminen: miksi pankkitunnistus suojaa molempia
5. Vuokrakuittaus ilman pankkiliittymää – miksi kerran kuussa riittää
6. Vuokratulon verotus 2026: vastikkeet, korjaukset ja se kuuluisa rahoitusvastike
7. Vuokranantajan matkakulut ja muut vähennykset, jotka jäävät usein tekemättä
8. Mitä vuokranantaja saa kirjoittaa suositukseen – ja mitä vuokralainen voi vastata
9. Vuokrankorotus: indeksiehto, ilmoitusaika ja tavallisimmat virheet
10. Vuokrasuhteen päättyminen reilusti: loppukatselmus, avaimet ja vakuus kahdessa viikossa

Rakenne kuten esinetti-web: "Lyhyesti"-laatikko, H2-rakenne, UKK lopussa `FAQPage`-skeemalla, `description` alle 155 merkkiä.

---

## 7. Sallitut ja kielletyt väittämät

**Saa sanoa**
- "Vuokrasopimus allekirjoitetaan pankkitunnuksilla tai mobiilivarmenteella; kyse on eIDAS-asetuksen mukaisesta kehittyneestä sähköisestä allekirjoituksesta, joka on laillisesti pätevä."
- "Kuvat aikaleimataan palvelimella, tiivistetään ja sinetöidään sopimuksen liitteeksi; kumpikaan osapuoli ei voi muuttaa tai poistaa niitä."
- "Kuittaukset ovat vuokranantajan omia merkintöjä, jotka vuokralainen näkee ja voi kommentoida" – aina tässä muodossa, ei "todiste maksamattomuudesta".
- "Vuokratodistus on vuokralaisen oma asiakirja; hän päättää, jakaako sen."
- "Verolaskelma on yhteenveto omista kirjauksistasi OmaVeron kenttien mukaan" – ei "hoidamme veroilmoituksesi", ei "veroneuvontaa".
- "Kehittänyt suomalainen tilitoimistoyrittäjä." "Tiedot EU:ssa." "Vuokralaiselle aina maksuton."

**Ei saa sanoa**
- "Luottotieto", "maksuhäiriö", "maksumoraali", "vuokralaisrekisteri" – ei missään muodossa.
- "Perintä", "häätö" palvelun ominaisuutena. Ohjaus neuvontaan sallittu.
- "Vuokranantaja voi tarkistaa vuokralaisen taustat" – palvelu ei tee taustatarkistuksia.
- Superlatiivit ilman näyttöä, käyttäjämäärät, sitaatit, logot ennen kuin ovat aitoja.
- Mitään, mikä asemoi palvelun toista osapuolta vastaan ("suojaa vuokranantajaa vuokralaiselta"). Aina "molemmat".

---

## 8. Vaiheet

**Vaihe A** (1–2 sessiota): runko kopioituna esinetti-webistä, tokenit ja fontit vaihdettu, logo, viisi kuvitusta, etusivu kytkimineen, odotuslista, savutesti. DoD: julkaistavissa odotuslistatilassa.
**Vaihe B** (2–3 sessiota): kaikki sivukartan sivut, hinnasto laskurilla (asuntojen määrä → vuosihinta), tietosuoja ja käyttöehdot pohjina, skeemat, OG-kuvat.
**Vaihe C** (2 sessiota): blogi ja 10 artikkelia.
**Vaihe D** (lanseeraus): `LAUNCH_MODE=live`, aidot kuvakaappaukset, sovelluksen linkit, suosittelupolku testattu.

---

## 9. Jukan tehtävät

1. Tarkista ja rekisteröi `reilusoppari.fi` (nimipalvelimet `ns1/ns2.vercel-dns.com` kuten esinetti.fi). Tarkista tavaramerkki PRH:sta.
2. Luo repo `reilusoppari-web`, kopioi tämä tiedosto juureen nimellä `CLAUDE.md`. Ensimmäinen kehote: *"Lue CLAUDE.md. Kopioi runko esinetti-web-reposta, luo PLAN.md kohdan 8 pohjalta ja aloita vaihe A."*
3. Vercel-projekti, domain, Resend-audience `reilusoppari-waitlist`, Turnstile, Plausible, env-muuttujat.
4. Lue ja hyväksy `/tietosuoja` ja `/kayttoehdot` – kuluttajaehdot vaativat erityistä huolellisuutta (peruutusoikeus, kuvat kodista, todistuksen omistajuus). Harkitse juristin tarkistusta ennen lanseerausta.
5. Kirjoita tai tarkista blogin verotusartikkelit (6 ja 7) itse – ne ovat sivuston uskottavuuden ydin.
