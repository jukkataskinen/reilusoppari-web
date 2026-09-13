import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { LAUNCH_TARGET } from "@/lib/launch";
import { companyLegalName } from "@content/company";

const title = "Tietosuoja";
const description =
  "Miten Reilusoppari käsittelee henkilötietoja: odotuslista nyt, ja palvelun tiedot kun palvelu avautuu.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/tietosuoja" },
};

/**
 * Tietosuojaseloste.
 *
 * TÄRKEÄÄ (CLAUDE.md kohta 9.4): tämä on pohja, jonka Jukka lukee ja
 * hyväksyy ennen lanseerausta, ja jonka juristin tarkistusta on syytä
 * harkita. Erityistä huolellisuutta vaativat kohdat: kuvat kodista,
 * molempien osapuolten oikeudet samaan aineistoon ja todistuksen omistajuus.
 *
 * Sivu on jaettu kahteen osaan tarkoituksella. Odotuslistan käsittely on
 * TOTTA JO NYT, joten se on kuvattava täsmällisesti. Palvelun käsittely
 * alkaa vasta lanseerauksessa, ja se on merkitty sellaiseksi – seloste ei
 * saa väittää, että palvelussa käsiteltäisiin tietoja tänään.
 */
const UPDATED = "10.9.2026";

export default function TietosuojaPage() {
  return (
    <>
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Tietosuoja", path: "/tietosuoja" },
        ]}
      />
      <PageHero
        eyebrow={`Päivitetty ${UPDATED}`}
        title="Tietosuojaseloste"
        lead="Reilusoppari kerää kahdenlaisia tietoja: odotuslistan sähköpostiosoitteita nyt, ja vuokrasuhteen tietoja sitten kun palvelu avautuu. Tässä molemmat erikseen."
      />

      <section className="bg-paper py-12 md:py-[72px]">
        <Container>
          <div className="article-body prose-measure">
            <h2>Rekisterinpitäjä</h2>
            <p>
              {companyLegalName()}. Yhteydenotot tietosuoja-asioissa: liity
              odotuslistalle ja vastaa vahvistusviestiin, tai käytä yhteystietosivun ohjetta.
            </p>

            <h2>Osa 1: Odotuslista (voimassa nyt)</h2>
            <p>
              Kun liityt odotuslistalle, käsittelemme seuraavia tietoja: sähköpostiosoite, valinta
              siitä oletko vuokranantaja, vuokralainen vai molempia, sekä vapaaehtoisesti antamasi
              asuntojen lukumäärä.
            </p>
            <ul>
              <li>
                <strong>Käsittelyn tarkoitus:</strong> kertoa sinulle, kun palvelu avautuu, ja
                arvioida kummalle osapuolelle palvelua eniten odotetaan.
              </li>
              <li>
                <strong>Oikeusperuste:</strong> suostumus. Vahvistat liittymisen sähköpostiisi
                lähetettävästä linkistä (kaksoisvarmistus), eikä osoitetta lisätä listalle ennen
                sitä.
              </li>
              <li>
                <strong>Säilytysaika:</strong> kunnes peruutat tilauksen tai enintään kuusi
                kuukautta palvelun avaamisen jälkeen.
              </li>
              <li>
                <strong>Käsittelijät:</strong> sähköpostien lähetykseen käytetään Resendiä ja
                sivuston tarjoiluun Verceliä. Tiedot käsitellään EU:ssa.
              </li>
              <li>
                <strong>Peruutus:</strong> jokaisessa viestissä on peruutuslinkki, ja peruutus
                poistaa osoitteen listalta.
              </li>
            </ul>
            <p>
              Emme lähetä odotuslistalle muuta kuin palvelun avautumiseen liittyvät viestit, emmekä
              luovuta osoitteita kolmansille osapuolille.
            </p>

            <h2>Kävijämittaus</h2>
            <p>
              Sivustolla käytetään Plausible-kävijämittausta, joka ei aseta evästeitä eikä kerää
              henkilötietoja. Yksittäistä kävijää ei voida tunnistaa eikä seurata sivustojen
              välillä.
            </p>

            <h2>Osa 2: Palvelun tiedot (alkaa {LAUNCH_TARGET})</h2>
            <p>
              Kun palvelu avautuu, Reilusopparissa käsitellään vuokrasuhteeseen liittyviä tietoja.
              Tämä osa kuvaa suunnitellun käsittelyn. Se tarkistetaan ja täsmennetään ennen
              palvelun avaamista.
            </p>

            <h3>Sopimuksen osapuolet</h3>
            <p>
              Vuokrasopimuksen allekirjoittaminen edellyttää vahvaa sähköistä tunnistamista
              (pankkitunnukset tai mobiilivarmenne). Tunnistautumisesta tallennetaan tunnistetiedot,
              jotka ovat tarpeen allekirjoituksen todistamiseksi. Henkilötunnus käsitellään vain
              siltä osin kuin tunnistaminen sitä edellyttää.
            </p>

            <h3>Kuvat kodista</h3>
            <p>
              Katselmuskuvat ovat asunnon kuvia, ja ne voivat sisältää myös vuokralaisen omaa
              omaisuutta. Siksi niitä koskevat seuraavat säännöt:
            </p>
            <ul>
              <li>Kuvat näkyvät vain kyseisen vuokrasuhteen kahdelle osapuolelle.</li>
              <li>
                Kuvat aikaleimataan ja sinetöidään sopimuksen liitteeksi. Kumpikaan osapuoli ei voi
                muuttaa tai poistaa niitä yksin, koska ne ovat osa yhteistä sopimusta.
              </li>
              <li>
                Kuvia ei käytetä markkinointiin, koneoppimiseen eikä mihinkään muuhun tarkoitukseen
                kuin asunnon kunnon todentamiseen.
              </li>
              <li>
                Vuokrasuhteen päätyttyä kuvat säilytetään sen ajan, jonka vuokrasuhteesta
                mahdollisesti syntyvien vaatimusten esittäminen edellyttää, ja poistetaan sen
                jälkeen.
              </li>
            </ul>

            <h3>Molempien osapuolten oikeudet samaan aineistoon</h3>
            <p>
              Sopimus, katselmuskuvat, kuittaukset ja huoltokirja ovat yhteistä aineistoa. Se
              tarkoittaa, että kumpikin osapuoli saa niistä oman kappaleensa, mutta kumpikaan ei voi
              yksin muuttaa tai poistaa niitä. Poisto-oikeuden käyttäminen ei siis poista aineistoa
              toiselta osapuolelta, jolla on siihen oma oikeutettu etunsa – tämä rajoitus on
              tietosuoja-asetuksen mukainen ja koskee molempia yhtäläisesti.
            </p>

            <h3>Vuokrakuittaukset</h3>
            <p>
              Kuittaukset ovat vuokranantajan omia merkintöjä siitä, onko vuokra hänen tietojensa
              mukaan maksettu. Vuokralainen näkee jokaisen merkinnän ja voi kommentoida sitä.
              Reilusoppari ei liity pankkitileihin, ei muodosta luottotietoja eikä ylläpidä
              vuokralaisia koskevaa rekisteriä.
            </p>

            <h3>Todistuksen omistajuus</h3>
            <p>
              Vuokratodistus on sen osapuolen oma asiakirja, jolle se on annettu. Vuokralaisen
              todistus on vuokralaisen, ja hän päättää yksin, kenelle sen näyttää. Reilusoppari ei
              näytä todistusta kenellekään muulle eikä ylläpidä siitä julkista hakemistoa.
              Tarkistuslinkki kertoo vain, että esitetty todistus on aito.
            </p>

            <h3>Oikeutesi</h3>
            <p>
              Sinulla on oikeus saada tietää, mitä tietoja sinusta käsitellään, oikaista virheelliset
              tiedot, pyytää tietojen poistoa siltä osin kuin sopimuksen todistusarvo ei sitä estä,
              rajoittaa käsittelyä, siirtää tiedot toiseen palveluun ja tehdä valitus
              tietosuojavaltuutetun toimistoon.
            </p>

            <h2>Muutokset</h2>
            <p>
              Tätä selostetta täydennetään ennen palvelun avaamista. Merkittävistä muutoksista
              kerrotaan odotuslistalle liittyneille sähköpostitse.
            </p>

            <p>
              <Link href="/kayttoehdot">Käyttöehdot</Link>
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
