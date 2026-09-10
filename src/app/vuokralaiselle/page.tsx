import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MessageTemplate } from "@/components/MessageTemplate";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CtaSection } from "@/components/sections/CtaSection";
import { formatEuroAuto } from "@/lib/format";
import { pricing } from "@content/pricing";

const title = "Vuokralaiselle";
const description =
  "Sinulle Reilusoppari on aina maksuton: samat kuvat, sama sopimus, ilmoitus kun vuokra on kuitattu ja lopuksi todistus seuraavaa asuntoa varten.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vuokralaiselle" },
  openGraph: { title, description, type: "website" },
};

const gains = [
  {
    title: "Tiedät kenen kanssa sovit",
    body: "Vuokranantaja tunnistautuu pankkitunnuksilla samalla tavalla kuin sinä. Kumpikaan ei ole kenellekään pelkkä nimi sähköpostissa.",
  },
  {
    title: "Omat kuvasi samassa paikassa",
    body: "Kuvaat huoneet muuttopäivänä itse, ja kuvat menevät samaan sinetöityyn liitteeseen kuin vuokranantajan. Kukaan ei voi poistaa niitä.",
  },
  {
    title: "Näet, kun vuokra on kuitattu",
    body: "Saat ilmoituksen, kun vuokranantaja on merkinnyt vuokran maksetuksi. Jos merkintä on mielestäsi väärin, voit kommentoida sitä.",
  },
  {
    title: "Viat kirjataan, kun ilmoitat",
    body: "Ilmoitus jää talteen aikaleimalla, ja siitä näkyy myös milloin asia korjattiin. Kukaan ei voi poistaa merkintää jälkikäteen.",
  },
  {
    title: "Todistus seuraavaan asuntoon",
    body: "Vuokrasuhteen päättyessä saat yhteenvedon vuokranmaksusta ja vuokranantajan terveiset – asiakirjan, jonka voit näyttää seuraavalle vuokranantajalle.",
  },
  {
    title: "Etkä maksa mitään",
    body: `Vuokralaiselle Reilusoppari on aina maksuton, ${formatEuroAuto(pricing.tenant.price)}. Se ei ole kampanja vaan koko palvelun perusta.`,
  },
];

/** Valmis viestipohja (CLAUDE.md kohta 4.1). Sävy: pyytävä, ei vaativa. */
const requestMessage = `Moi,

löysin palvelun nimeltä Reilusoppari, jolla vuokrasopimuksen voi tehdä ja allekirjoittaa pankkitunnuksilla. Samalla asunnon kunto kuvataan yhdessä, ja kuvat jäävät talteen molemmille – niin ei tarvitse muuttopäivänä muistella, oliko naarmu jo siinä.

Minulle palvelu on maksuton, ja sinulle ensimmäinen vuokrasuhde on ilmainen. Kävisikö, että tehtäisiin sopimus sillä?

reilusoppari.fi`;

export default function VuokralaisellePage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Vuokralaiselle" alt="Reilusoppari vuokralaiselle" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Vuokralaiselle", path: "/vuokralaiselle" },
        ]}
      />
      <PageHero
        tone="coral"
        eyebrow="Vuokralaiselle"
        title="Sitten kun on aika muuttaa seuraavaan kotiin"
        lead="Muistoksi saat yhteenvedon vuokrien maksusta ajallaan ja vuokranantajan terveiset. Allekirjoitettu dokumentti hyvästä vuokrasuhteesta on kovaa valuuttaa, kun näytät sen seuraavalle vuokranantajalle."
      />

      <Section title="Miksi tämä on sinulle ilmainen">
        <div className="prose-measure text-ink/80">
          <p>
            Koska palvelu toimii vain, jos molemmat ovat mukana. Katselmuskuvista tulee osa
            sopimusta siinä hetkessä, kun molemmat hyväksyvät ne allekirjoittaessaan
            vuokrasopimuksen – ja hyväksyä voi vain se, joka on itse päässyt kuvaamaan sen, minkä
            pitää olennaisena. Kuittauksista ei ole hyötyä, jos vain toinen näkee ne. Siksi
            vuokranantaja maksaa ja sinä et – etkä maksa myöhemminkään.
          </p>
          <p className="mt-4">
            Reilusoppari ei myöskään tee taustatarkistuksia eikä ylläpidä rekisteriä vuokralaisista.
            Palvelu tunnistaa molemmat osapuolet, jotta kumpikaan ei ole joku muu kuin sanoo
            olevansa.
          </p>
        </div>
      </Section>

      <Section title="Mitä saat" tone="cloud">
        <div className="grid gap-8 sm:grid-cols-2">
          {gains.map((gain) => (
            <div key={gain.title}>
              <h3 className="text-lg">{gain.title}</h3>
              <p className="mt-2 text-ink/80">{gain.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <section id="pyyda" className="scroll-mt-16 border-b border-line bg-paper py-12 md:py-[72px]">
        <div className="mx-auto max-w-[var(--container-content)] px-6">
          <h2 className="text-2xl md:text-[30px]">Pyydä vuokranantajaa käyttämään</h2>
          <p className="prose-measure mt-4 text-ink/80">
            Helpoin tapa on kysyä suoraan. Tässä valmis viesti – muokkaa vapaasti tai lähetä
            sellaisenaan.
          </p>
          <div className="mt-6 max-w-2xl">
            <MessageTemplate text={requestMessage} />
          </div>
          <p className="mt-6 text-ink/70">
            Jos vuokranantaja epäröi, {""}
            <Link href="/ukk" className="font-medium underline underline-offset-4">
              usein kysytyt kysymykset
            </Link>{" "}
            vastaavat useimpiin huoliin – etenkin siihen, mitä palvelu maksaa ja kuka näkee kuvat.
          </p>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
