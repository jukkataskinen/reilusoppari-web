# KUSTANNUKSET — Reilusoppari

Kirjattu 2026-09-10. **Nämä ovat listahintoja sellaisina kuin ne olivat tiedossa
kirjaushetkellä, eivät laskuilta tarkistettuja.** Hinnoittelu muuttuu näissä
palveluissa usein — tarkista laskutusruudusta ennen budjetointia.
Dollarihinnat euroiksi kurssilla ~0,92.

## Sääntö uudelle chatille

Älä ehdota tähän projektiin palvelua, jota ei ole alla olevissa taulukoissa,
ilman että kerrot samalla sen hinnan ja sen, korvaako se jonkin nykyisen.
Pino on tarkoituksella sama kuin `esinetti-web`/`esinetti`-repoissa, koska
**suurin osa maksuista on tilikohtaisia, ei projektikohtaisia** — uusi palvelu
on aina uusi kiinteä kulu, kun taas olemassa olevan laajentaminen on usein 0 €.

## Verkkosivu (reilusoppari-web) — vaiheet A–C

| Palvelu | Hinta | Lisäkustannus, kun eSinetti on jo samalla tilillä |
|---|---|---|
| GitHub | Free — yksityiset repot rajattomasti | 0 € |
| Vercel | Hobby 0 $, Pro 20 $/kk/käyttäjä (~18 €) | 0 € — Pro sisältää rajattomasti projekteja |
| Cloudflare Turnstile | Ilmainen | 0 € |
| Plausible | alk. 9 $/kk vuosilaskutuksella (10 000 sivunäyttöä/kk) | 0 € — sivustoja rajattomasti, kiintiö on yhteinen sivunäyttömäärä |
| Resend | Free 3 000 viestiä/kk mutta **vain 1 verkkotunnus**; Pro 20 $/kk (~18 €) | **~220 €/v** — `reilusoppari.fi` on toinen domain ja pakottaa Pro-tasolle |
| .fi-verkkotunnus | ~10–20 €/v | jo maksettu 2026-09-10 |

**Vercel Hobby vs Pro.** Hobby on ilmainen, mutta Vercelin käyttöehdot kieltävät
kaupallisen käytön. Reilusoppari on kaupallinen tuote jo odotuslistavaiheessa,
joten oikea taso on Pro. Jos Pro on jo eSinetin takia olemassa, tämä ei maksa
lisää — mutta älä ehdota Hobbya ratkaisuksi säästöön.

Nollasta aloittaen: 20 + 20 + 9 = 49 $/kk ≈ **540 €/v** + domain.
eSinetin päälle lisättynä: käytännössä vain Resend, **~220 €/v**.

## Sovellus (app.reilusoppari.fi) — lanseerauksesta alkaen

Ajaa eSinetin moottorilla, joten pino on sama kuin `esinetti`-repossa.

| Palvelu | Hinta | Huom |
|---|---|---|
| Supabase | Free 0 € (2 projektia, tietokanta nukahtaa viikon käyttämättömyydestä → ei kelpaa tuotantoon); Pro 25 $/kk (~23 €) organisaatiolta | Pro sisältää useita projekteja, joten monivuokraajaisuus voi mahtua eSinetin tilaukseen |
| Upstash Redis | Free-taso riittää pitkälle, sitten käytön mukaan | ~0–10 $/kk |
| Vahva tunnistautuminen (Telia) | kuukausimaksu + hinta per tunnistus | **Tarjous pyytämättä.** Ainoa erä, joka kasvaa käyttäjämäärän mukana |

**Hinnoitteluriski, joka on ratkaistava ennen lanseerausta:** 29 €/vuokrasuhde
kattaa sopimuksen, jossa tunnistautuu **kaksi** osapuolta, ja vuokrasuhde voi
kestää 5 vuotta. Tunnistautumisen yksikköhinta on siis suoraan kate-erä.
Pyydä Telian tarjous ennen kuin hinta lyödään lopullisesti lukkoon.

## ALV ja kirjanpito

Kaikki palvelut ovat ulkomaisia:

- **Vercel, GitHub, Supabase, Resend, Cloudflare, Upstash** — Yhdysvallat →
  käännetty verovelvollisuus, ei ALV:tä laskulla
- **Plausible** — Viro (EU) → VIES-käännetty verovelvollisuus

**Syötä ALV-numero `FI22371312` jokaisen palvelun laskutusasetuksiin.** Ilman
sitä osa palveluista veloittaa kuluttaja-ALV:n, jota ei saa vähentää.

Laskutus on dollareissa, joten euromääriin tulee kurssiheittoa kuukausittain.

## Yhteenveto

| Vaihe | Nollasta | eSinetin päälle |
|---|---|---|
| Sivusto nyt (odotuslista) | ~540 €/v | **~220 €/v** |
| Sovellus lanseerauksesta | ~+300 €/v + tunnistukset | ~+0–300 €/v + tunnistukset |
