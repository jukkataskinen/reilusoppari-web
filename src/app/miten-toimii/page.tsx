import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Container } from "@/components/Container";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero } from "@/components/PageHero";
import { ConfirmationPreview } from "@/components/previews/ConfirmationPreview";
import { DocumentPage } from "@/components/previews/DocumentPage";
import { CtaSection } from "@/components/sections/CtaSection";

const title = "Miten Reilusoppari toimii";
const description =
  "Koko vuokrasuhteen kaari: sopimus, alkukatselmus, kuukausikuittaus, huoltokirja, loppukatselmus ja todistus molemmille.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/miten-toimii" },
  openGraph: { title, description, type: "website" },
};

/**
 * Koko kaari asiakirjoina (CLAUDE.md kohta 3). Vaiheet ovat aito sekvenssi,
 * joten ne on numeroitu. Jokaisessa vaiheessa kerrotaan erikseen mitä kumpikin
 * osapuoli tekee – sivu ei kerro tarinaa vain toiselle.
 *
 * Vaiheella on asiakirjanäkymä silloin, kun siinä syntyy asiakirja. Huoltokirja
 * ja loppukatselmus jäävät ilman: huoltokirja on juokseva lista eikä asiakirja,
 * ja loppukatselmuksen pöytäkirja näyttäisi alkukatselmuksen kopiolta, mikä
 * hämärtäisi eron sen sijaan että selittäisi sen.
 */
const stages = [
  {
    title: "Sopimus",
    preview: <DocumentPage name="vuokrasopimus" />,
    landlord: "Täytät vuokrasopimuksen ja lähetät sen allekirjoitettavaksi.",
    tenant: "Allekirjoitat pankkitunnuksilla tai mobiilivarmenteella omalla puhelimellasi.",
    fact: "Allekirjoitus on eIDAS-asetuksen mukainen kehittynyt sähköinen allekirjoitus, joka on laillisesti pätevä. Molemmat saavat saman kappaleen.",
  },
  {
    title: "Alkukatselmus",
    preview: <DocumentPage name="alkukatselmus" />,
    landlord: "Kuvaat ne kohdat, jotka itse pidät olennaisina, ja merkitset tiedossa olevat viat.",
    tenant: "Kuvaat sen, minkä itse pidät olennaisena – et ole sidottu vuokranantajan listaan.",
    fact: "Kuvat aikaleimataan ja sinetöidään sopimuksen liitteeksi. Molemmat hyväksyvät koko kuvakokoelman allekirjoittaessaan vuokrasopimuksen, eikä kumpikaan voi muuttaa tai poistaa kuvia jälkikäteen.",
  },
  {
    title: "Vuokrakuittaus",
    preview: <ConfirmationPreview />,
    landlord: "Saat kerran kuussa kysymyksen ja vastaat kyllä, ei vielä tai osittain.",
    tenant: "Näet kuittauksen heti ja voit kommentoida sitä.",
    fact: "Kuittaukset ovat vuokranantajan omia merkintöjä, jotka vuokralainen näkee ja voi kommentoida. Pankkitiliä ei liitetä palveluun.",
  },
  {
    title: "Huoltokirja",
    preview: null,
    landlord: "Kirjaat korjaukset ja näet, mitä on ilmoitettu ja milloin.",
    tenant: "Ilmoitat viasta, ja ilmoitus jää talteen aikaleimalla.",
    fact: "Sama lista näkyy molemmille koko vuokrasuhteen ajan: milloin ilmoitettiin, milloin korjattiin ja mitä sovittiin.",
  },
  {
    title: "Loppukatselmus",
    preview: null,
    landlord: "Käytte huoneet läpi ja vertaatte alkukuviin.",
    tenant: "Näet samat kuvat kuin vuokranantaja – ei muistelua kummallakaan.",
    fact: "Vakuudesta ja mahdollisista korjauksista sovitaan samojen kuvien äärellä. Sopimus ei muutu jälkikäteen.",
  },
  {
    title: "Todistus",
    preview: <DocumentPage name="vuokratodistus" />,
    landlord: "Saat oman todistuksesi: vakuus palautettu ajallaan, viat korjattu.",
    tenant: "Saat vuokratodistuksen, jonka voit näyttää seuraavalle vuokranantajalle.",
    fact: "Todistuksen numerot tulevat kuittauksista automaattisesti. Todistus on sen omistajan oma asiakirja, ja aitouden voi tarkistaa linkistä.",
  },
];

export default function MitenToimiiPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Miten toimii" alt="Reilusopparin vaiheet" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Miten toimii", path: "/miten-toimii" },
        ]}
      />
      <PageHero
        eyebrow="Koko kaari"
        title="Yksi sopimus, kuusi vaihetta, kaksi tyytyväistä osapuolta"
        lead="Reilusoppari kulkee mukana koko vuokrasuhteen ajan. Jokaisessa vaiheessa molemmat näkevät saman tiedon – siinä on koko juju."
      />

      <section className="bg-paper py-12 md:py-[72px]">
        <Container>
          <ol className="flex flex-col gap-14">
            {stages.map((stage, index) => (
              <li key={stage.title} className="border-t border-line pt-8 first:border-t-0 first:pt-0">
                <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-start">
                  <div>
                    <span className="font-mono text-sm text-ink/60">{`0${index + 1}`}</span>
                    <h2 className="mt-2 text-2xl">{stage.title}</h2>
                    <p className="prose-measure mt-3 text-ink/70">{stage.fact}</p>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <PartyNote tone="sky" label="Vuokranantaja" text={stage.landlord} />
                      <PartyNote tone="coral" label="Vuokralainen" text={stage.tenant} />
                    </div>
                  </div>

                  {stage.preview && (
                    <div className="mx-auto w-full max-w-[340px]">{stage.preview}</div>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-12">
            <Link href="/katselmus" className="font-medium underline underline-offset-4">
              Katselmus tarkemmin
            </Link>
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}

function PartyNote({ tone, label, text }: { tone: "sky" | "coral"; label: string; text: string }) {
  const bar = tone === "sky" ? "bg-sky" : "bg-coral";
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${bar}`} aria-hidden="true" />
        <h3 className="text-sm font-medium">{label}</h3>
      </div>
      <p className="mt-2 text-ink/80">{text}</p>
    </div>
  );
}
