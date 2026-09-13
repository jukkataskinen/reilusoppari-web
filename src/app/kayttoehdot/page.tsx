import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { pricing } from "@content/pricing";
import { formatEuroAuto } from "@/lib/format";
import { LAUNCH_TARGET } from "@/lib/launch";
import { companyLegalName, signingProvider } from "@content/company";

const title = "Käyttöehdot";
const description =
  "Reilusopparin käyttöehdot: sopimussuhde, hinnat, peruutusoikeus, aineiston omistajuus ja vastuunrajoitukset.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/kayttoehdot" },
};

/**
 * Käyttöehdot.
 *
 * TÄRKEÄÄ (CLAUDE.md kohta 9.4): tämä on POHJA. Jukka lukee ja hyväksyy sen
 * ennen lanseerausta, ja juristin tarkistusta on syytä harkita. Kolme kohtaa
 * vaativat erityistä huolellisuutta, koska palvelu myydään kuluttajalle:
 *
 *  1. Peruutusoikeus. Kuluttajansuojalain 6 luvun mukainen 14 vuorokauden
 *     peruutusoikeus koskee etämyyntiä. Jos palvelu suoritetaan kokonaan
 *     ennen määräajan päättymistä, peruutusoikeus voi lakata – mutta vain
 *     jos kuluttaja on antanut siihen nimenomaisen suostumuksen ja saanut
 *     tiedon oikeuden menettämisestä. Sopimuksen allekirjoitus on juuri
 *     tällainen tilanne, joten muotoilun on oltava tarkka.
 *  2. Kuvat kodista. Ks. tietosuojaseloste – aineistoon on kahden osapuolen
 *     oikeus, joten poisto ei voi olla yksipuolinen.
 *  3. Todistuksen omistajuus. Todistus on saajansa oma asiakirja.
 */
const UPDATED = "10.9.2026";

export default function KayttoehdotPage() {
  return (
    <>
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Käyttöehdot", path: "/kayttoehdot" },
        ]}
      />
      <PageHero
        eyebrow={`Päivitetty ${UPDATED}`}
        title="Käyttöehdot"
        lead={`Nämä ehdot koskevat Reilusoppari-palvelua, joka avautuu ${LAUNCH_TARGET}. Odotuslistalle liittymiseen sovelletaan vain kohtia 1 ja 9.`}
      />

      <section className="bg-paper py-12 md:py-[72px]">
        <Container>
          <div className="article-body prose-measure">
            <h2>1. Palveluntarjoaja ja soveltamisala</h2>
            <p>
              Palvelun tarjoaa {companyLegalName()}. Näitä ehtoja sovelletaan
              Reilusoppari-palvelun käyttöön ja reilusoppari.fi-sivustoon. Palvelua käytetään
              vuokrasuhteen hallintaan: sopimus, katselmukset, vuokrakuittaukset, huoltokirja ja
              todistukset.
            </p>

            <h2>2. Osapuolet ja maksuvelvollisuus</h2>
            <p>
              Palvelun sopimuskumppani ja maksaja on vuokranantaja. Vuokralaiselle palvelu on
              maksuton, eikä hänelle synny maksuvelvollisuutta missään vaiheessa. Vuokralainen
              hyväksyy nämä ehdot omalta osaltaan liittyessään vuokrasuhteeseen palvelussa.
            </p>

            <h2>3. Hinnat</h2>
            <p>
              Ensimmäinen vuokrasuhde on maksuton. Sen jälkeen vuokrasuhteesta veloitetaan{" "}
              {formatEuroAuto(pricing.tenancy.fee)} kertamaksuna, joka kattaa vuokrasuhteen
              enintään {pricing.tenancy.maxYears} vuoden ajan. Plus-ominaisuus (kulut ja
              verolaskelma) maksaa {formatEuroAuto(pricing.plus.yearlyPerApartment)} asunnolta
              vuodessa ja veloitetaan ensimmäisen tulostetun laskelman yhteydessä. Vähintään{" "}
              {pricing.portfolio.minApartments} asunnon salkussa hinta on{" "}
              {formatEuroAuto(pricing.portfolio.yearlyPerApartment)} asunnolta vuodessa ja sisältää
              kaiken. {pricing.vatNote}.
            </p>

            <h2>4. Peruutusoikeus</h2>
            <p>
              Kuluttajalla on kuluttajansuojalain mukainen oikeus peruuttaa etämyyntisopimus 14
              vuorokauden kuluessa sopimuksen tekemisestä ilmoittamalla siitä palveluntarjoajalle.
              Peruutuksen johdosta maksettu hinta palautetaan.
            </p>
            <p>
              Jos pyydät palvelun suorittamista jo peruutusaikana – käytännössä lähettämällä
              vuokrasopimuksen allekirjoitettavaksi – pyydämme siihen erikseen nimenomaisen
              suostumuksesi ja kerromme samalla, että menetät peruutusoikeuden, kun palvelu on
              kokonaan suoritettu. Jos peruutat sen jälkeen kun suoritus on aloitettu mutta ennen
              kuin se on valmis, veloitamme suoritetusta osasta kohtuullisen osuuden.
            </p>
            <p>
              Peruutus ei mitätöi vuokrasopimusta osapuolten välillä. Vuokrasopimus on vuokranantajan
              ja vuokralaisen välinen; nämä ehdot koskevat sen tekemiseen käytettyä palvelua.
            </p>

            <h2>5. Allekirjoitus ja tunnistaminen</h2>
            <p>
              Vuokrasopimus allekirjoitetaan vahvan sähköisen tunnistamisen avulla, ja allekirjoitus
              on eIDAS-asetuksen (910/2014) mukainen kehittynyt sähköinen allekirjoitus.
              Allekirjoitusmoottorina toimii {signingProvider.product}, jonka tarjoaa {signingProvider.name} – eri yhtiö kuin palveluntarjoaja. Palvelu ei ota kantaa vuokrasopimuksen
              sisällön lainmukaisuuteen; siitä vastaavat osapuolet itse.
            </p>

            <h2>6. Aineisto ja sen omistajuus</h2>
            <p>
              Sopimus, katselmuskuvat, kuittaukset ja huoltokirjan merkinnät ovat vuokrasuhteen
              yhteistä aineistoa. Kumpikin osapuoli saa niistä oman kappaleensa. Aineistoa ei voi
              yksipuolisesti muuttaa eikä poistaa, koska sen todistusarvo perustuu juuri siihen.
            </p>
            <p>
              Vuokratodistus on sen osapuolen oma asiakirja, jolle se on annettu. Palveluntarjoaja ei
              luovuta todistusta kenellekään muulle eikä julkaise sitä. Aitouden tarkistuslinkki
              kertoo vain, että esitetty todistus on aito.
            </p>

            <h2>7. Mitä palvelu ei ole</h2>
            <ul>
              <li>Palvelu ei tee luottotietokyselyitä eikä taustatarkistuksia.</li>
              <li>Palvelu ei ylläpidä vuokralaisia tai vuokranantajia koskevaa rekisteriä.</li>
              <li>Palvelu ei hoida perintää eikä häätöä eikä anna niihin liittyvää neuvontaa.</li>
              <li>
                Verolaskelma on yhteenveto käyttäjän omista kirjauksista. Se ei ole veroneuvontaa
                eikä veroilmoituksen tekemistä käyttäjän puolesta.
              </li>
            </ul>

            <h2>8. Vastuunrajoitus</h2>
            <p>
              Palvelu tarjotaan sellaisena kuin se on. Palveluntarjoaja vastaa virheestä
              kuluttajansuojalain mukaisesti. Palveluntarjoaja ei vastaa vahingosta, joka aiheutuu
              vuokrasopimuksen sisällöstä, osapuolten välisistä erimielisyyksistä tai siitä, että
              osapuoli on kirjannut palveluun virheellistä tietoa. Näillä ehdoilla ei rajoiteta
              kuluttajalle pakottavan lainsäädännön nojalla kuuluvia oikeuksia.
            </p>

            <h2>9. Odotuslista</h2>
            <p>
              Odotuslistalle liittyminen on maksutonta eikä synnytä sopimusta palvelun käytöstä.
              Liittymisen voi peruuttaa jokaisessa viestissä olevasta linkistä. Odotuslistan
              tietojen käsittely kuvataan{" "}
              <Link href="/tietosuoja">tietosuojaselosteessa</Link>.
            </p>

            <h2>10. Ehtojen muuttaminen ja sovellettava laki</h2>
            <p>
              Ehtoja voidaan muuttaa. Muutoksista ilmoitetaan käyttäjille, ja jo maksettuun
              vuokrasuhteeseen sovelletaan sen ostohetkellä voimassa olleita ehtoja. Sopimukseen
              sovelletaan Suomen lakia. Kuluttaja voi saattaa riidan kuluttajariitalautakunnan
              käsiteltäväksi.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
