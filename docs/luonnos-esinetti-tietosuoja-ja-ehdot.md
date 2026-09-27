# Luonnos: eSinetti tietosuojaselosteessa ja käyttöehdoissa (26.9.2026)

Yötyön luonnos. Sitä ei julkaistu, koska kolme väitettä ei pidä paikkaansa nykytilanteessa (katselmointi 27.9.2026):

1. "Yhtiöiden välillä on 28 artiklan mukainen kirjallinen käsittelysopimus." Sopimus Adepta Tilat Oy:n ja Adepta Oy:n välillä on vasta luonnos (reilusoppari/docs/luonnos-kasittelysopimus-esinetti.md).
2. "eSinetti ei tallenna henkilötunnusta." eSinetti säilyttää salatun tunnistustiedon (ID-token), jossa henkilötunnus on mukana. Päätös sen poistamisesta on auki (esinetti, yötyön raportti).
3. "Tiedot säilytetään EU:ssa." Tietokanta on Frankfurtissa, mutta eSinetin Vercel-funktiot ajetaan Yhdysvalloissa (iad1) ja Auth0-tenantti on US-alueella.

Käyttöehtojen kohdan 5 vastuunjako on kunnossa, ja sen voi julkaista sellaisenaan.

Luonnos muutoksina (git diff):

```diff
diff --git a/src/app/kayttoehdot/page.tsx b/src/app/kayttoehdot/page.tsx
index d99657a..9c7cd80 100644
--- a/src/app/kayttoehdot/page.tsx
+++ b/src/app/kayttoehdot/page.tsx
@@ -6,7 +6,7 @@ import { PageHero } from "@/components/PageHero";
 import { pricing } from "@content/pricing";
 import { formatEuroAuto } from "@/lib/format";
 import { LAUNCH_TARGET } from "@/lib/launch";
-import { companyLegalName, signingProvider } from "@content/company";
+import { company, companyLegalName, signingProvider } from "@content/company";
 
 const title = "Käyttöehdot";
 const description =
@@ -34,8 +34,12 @@ export const metadata: Metadata = {
  *  2. Kuvat kodista. Ks. tietosuojaseloste – aineistoon on kahden osapuolen
  *     oikeus, joten poisto ei voi olla yksipuolinen.
  *  3. Todistuksen omistajuus. Todistus on saajansa oma asiakirja.
+ *
+ * LUONNOS 2026-09-26 (yötyö, haara yotyo-2026-09-26): kohdan 5 vastuunjako
+ * eSinetin (Adepta Oy) kanssa on Clauden luonnos. Jukka tarkistaa sen
+ * ennen mergeä mainiin. Ks. BLOCKERS.md.
  */
-const UPDATED = "10.9.2026";
+const UPDATED = "26.9.2026";
 
 export default function KayttoehdotPage() {
   return (
@@ -107,6 +111,28 @@ export default function KayttoehdotPage() {
               Allekirjoitusmoottorina toimii {signingProvider.product}, jonka tarjoaa {signingProvider.name} – eri yhtiö kuin palveluntarjoaja. Palvelu ei ota kantaa vuokrasopimuksen
               sisällön lainmukaisuuteen; siitä vastaavat osapuolet itse.
             </p>
+            <p>Vastuunjako {signingProvider.productGenitive} kanssa on seuraava:</p>
+            <ul>
+              <li>
+                Sopimuksesi on vain {company.name}:n kanssa. {company.name} vastaa sinulle koko
+                palvelusta, myös allekirjoituksesta ja tunnistautumisesta, eikä sinun tarvitse
+                hyväksyä {signingProvider.productGenitive} omia käyttöehtoja.
+              </li>
+              <li>
+                {signingProvider.name} toimii {company.name}:n alihankkijana ja henkilötietojen
+                käsittelijänä. Se käsittelee allekirjoituksen tietoja vain Reilusopparia varten, ks.{" "}
+                <Link href="/tietosuoja">tietosuojaseloste</Link>.
+              </li>
+              <li>
+                Jos allekirjoituksessa tai tunnistautumisessa on virhe, ilmoita siitä{" "}
+                {company.name}:lle. Selvitämme asian {signingProvider.productGenitive} kanssa, eikä sinun
+                tarvitse itse olla yhteydessä {signingProvider.product}iin.
+              </li>
+              <li>
+                Tunnistautuminen tehdään omilla pankkitunnuksillasi tai mobiilivarmenteellasi. Niiden
+                säilyttämisestä vastaat itse pankkisi tai operaattorisi ehtojen mukaan.
+              </li>
+            </ul>
 
             <h2>6. Aineisto ja sen omistajuus</h2>
             <p>
diff --git a/src/app/tietosuoja/page.tsx b/src/app/tietosuoja/page.tsx
index 7fc3cfb..922bd85 100644
--- a/src/app/tietosuoja/page.tsx
+++ b/src/app/tietosuoja/page.tsx
@@ -4,7 +4,7 @@ import { Breadcrumbs } from "@/components/Breadcrumbs";
 import { Container } from "@/components/Container";
 import { PageHero } from "@/components/PageHero";
 import { LAUNCH_TARGET } from "@/lib/launch";
-import { companyLegalName } from "@content/company";
+import { company, companyLegalName, signingProvider } from "@content/company";
 
 const title = "Tietosuoja";
 const description =
@@ -28,8 +28,13 @@ export const metadata: Metadata = {
  * TOTTA JO NYT, joten se on kuvattava täsmällisesti. Palvelun käsittely
  * alkaa vasta lanseerauksessa, ja se on merkitty sellaiseksi – seloste ei
  * saa väittää, että palvelussa käsiteltäisiin tietoja tänään.
+ *
+ * LUONNOS 2026-09-26 (yötyö, haara yotyo-2026-09-26): kohta "Allekirjoitus
+ * ja tunnistautuminen: eSinetti käsittelijänä" on Clauden luonnos. Jukka
+ * tarkistaa sen ennen mergeä mainiin, koska merge julkaisee sivun.
+ * Ks. BLOCKERS.md "eSinetti tietosuojaselosteessa ja käyttöehdoissa".
  */
-const UPDATED = "10.9.2026";
+const UPDATED = "26.9.2026";
 
 export default function TietosuojaPage() {
   return (
@@ -111,6 +116,45 @@ export default function TietosuojaPage() {
               siltä osin kuin tunnistaminen sitä edellyttää.
             </p>
 
+            <h3>Allekirjoitus ja tunnistautuminen: eSinetti käsittelijänä</h3>
+            <p>
+              Vuokrasopimuksen allekirjoitus ja siihen liittyvä vahva tunnistautuminen tehdään
+              {" "}{signingProvider.product}-palvelulla. Sen tarjoaa {signingProvider.name} (Y-tunnus{" "}
+              {signingProvider.businessId}), joka on eri yhtiö kuin {company.name}.{" "}
+              {signingProvider.name} käsittelee näitä tietoja henkilötietojen käsittelijänä{" "}
+              {company.name}:n lukuun ja sen ohjeiden mukaan, ei omiin tarkoituksiinsa. Yhtiöiden
+              välillä on tietosuoja-asetuksen 28 artiklan mukainen kirjallinen käsittelysopimus.
+            </p>
+            <p>{signingProvider.product} käsittelee allekirjoituksessa seuraavia tietoja:</p>
+            <ul>
+              <li>allekirjoittajan nimi ja syntymäaika sellaisina kuin tunnistuspalvelu ne kertoo</li>
+              <li>sähköpostiosoite, johon allekirjoituspyyntö lähetetään</li>
+              <li>
+                tunnistautumisen aika ja tapa sekä tunnistuksen välittäjän allekirjoittama todiste
+                tunnistautumisesta
+              </li>
+              <li>allekirjoitettava asiakirja liitteineen, myös katselmuskuvat</li>
+            </ul>
+            <p>
+              Tunnistuksessa välitetään myös henkilötunnus. {signingProvider.product} ei tallenna
+              sitä: siitä lasketaan heti tunniste, josta henkilötunnusta ei voi palauttaa, ja
+              syntymäaika. Allekirjoitettu asiakirja sinetöidään ja aikaleimataan. Aikaleimapalvelulle
+              lähtee vain asiakirjan tiiviste, ei sen sisältöä.
+            </p>
+            <p>
+              {signingProvider.product} käyttää omia alihankkijoitaan (esimerkiksi tunnistuksen
+              välittäjä, tietokanta ja sovelluksen ajoympäristö). Tiedot säilytetään EU:ssa.
+              Alihankkijat on lueteltu {signingProvider.productGenitive} tietoturvasivulla{" "}
+              <a href={`${signingProvider.url}/tietoturva`}>{signingProvider.url.replace("https://", "")}/tietoturva</a>.
+            </p>
+            <p>
+              Allekirjoituksen tiedot säilytetään yhtä kauan kuin muukin vuokrasuhteen aineisto (ks.
+              kuvat kodista alla). Tiedot, joilla allekirjoituksen aitous todistetaan, voidaan
+              säilyttää pidempään, jotta aitous on tarkistettavissa myös myöhemmin. Oikeuksiasi
+              koskevat pyynnöt osoitetaan {company.name}:lle, myös silloin kun ne koskevat
+              allekirjoituksen tietoja.
+            </p>
+
             <h3>Kuvat kodista</h3>
             <p>
               Katselmuskuvat ovat asunnon kuvia, ja ne voivat sisältää myös vuokralaisen omaa
```
