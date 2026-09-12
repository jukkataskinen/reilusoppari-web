import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { DocumentPage } from "@/components/previews/DocumentPage";
import { CtaSection } from "@/components/sections/CtaSection";

const title = "Alku- ja loppukatselmus";
const description =
  "Kumpikin kuvaa ne kohdat, jotka itse pitää olennaisina, ja molemmat hyväksyvät kuvat allekirjoituksellaan. Muuttopäivänä katsotaan samoja kuvia.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/katselmus" },
  openGraph: { title, description, type: "website" },
};

const checklist = [
  "Eteinen ja säilytystilat",
  "Keittiö: kodinkoneet, hanat, tasot",
  "Kylpyhuone ja vesikalusteet",
  "Lattiat ja seinät huoneittain",
  "Ikkunat, ovet ja lukot",
  "Mittarilukemat ja avainten määrä",
];

export default function KatselmusPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Katselmus" alt="Alku- ja loppukatselmus" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Katselmus", path: "/katselmus" },
        ]}
      />
      <PageHero
        eyebrow="Tuotteen sydän"
        title="Ainahan asunnoissa jotain on, kun eivät uusia ole"
        lead="Turha niistä on kuitenkaan riidellä. Otetaan kuva ja laitetaan se talteen, niin ei tarvitse vikoja muistella."
      />

      <Section title="Miksi tämä on tuotteen sydän" tone="cloud">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div className="prose-measure text-ink/80">
            <p>
              Lähes jokainen vuokrasuhteen erimielisyys palautuu samaan kysymykseen: oliko se
              naarmu jo siinä? Kun kumpikaan ei muista varmasti, asiasta tulee mielipide, ja
              mielipiteestä tulee riita.
            </p>
            <p className="mt-4">
              Alkukatselmus poistaa koko kysymyksen. Kumpikin kuvaa ennen muuttoa ne kohdat, jotka
              itse pitää olennaisina, ja molemmat hyväksyvät koko kuvakokoelman allekirjoittaessaan
              vuokrasopimuksen. Muuttopäivänä ei muistella vaan katsotaan.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[380px]">
            <DocumentPage name="alkukatselmus" />
          </div>
        </div>
      </Section>

      <Section title="Miten kuvat säilyvät muuttumattomina">
        <div className="prose-measure text-ink/80">
          <p>
            Kuvat aikaleimataan palvelimella, niistä lasketaan tiiviste ja koko liite sinetöidään
            sopimuksen osaksi. Kumpikaan osapuoli ei voi muuttaa tai poistaa kuvia jälkikäteen,
            eikä kukaan voi lisätä niiden joukkoon uusia vanhalla päivämäärällä.
          </p>
          <p className="mt-4">
            Kuvat näkyvät vain vuokrasuhteen osapuolille. Ne ovat osa sopimusta, eivät julkinen
            arkisto asunnosta.
          </p>
        </div>
      </Section>

      <Section title="Mitä kannattaa kuvata" tone="cloud">
        <ul className="grid gap-3 sm:grid-cols-2">
          {checklist.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40"
                aria-hidden="true"
              />
              <span className="text-ink/80">{item}</span>
            </li>
          ))}
        </ul>
        <p className="prose-measure mt-6 text-ink/70">
          Palvelu ehdottaa huonelistan, mutta kumpikin voi lisätä omia kuvia. Mitä tavallisemmalta
          kuva tuntuu ottohetkellä, sitä hyödyllisempi se on kahden vuoden päästä.
        </p>
      </Section>

      <Section title="Loppukatselmus">
        <div className="prose-measure text-ink/80">
          <p>
            Vuokrasuhteen lopussa käydään samat huoneet läpi ja verrataan alkukuviin. Vakuudesta ja
            mahdollisista korjauksista sovitaan samojen kuvien äärellä, eikä kumpikaan joudu
            vetoamaan muistiinsa.
          </p>
          <p className="mt-4">
            Loppukatselmus on myös se hetki, josta molempien todistukset syntyvät.{" "}
            <Link href="/todistus" className="font-medium underline underline-offset-4">
              Mitä todistuksessa lukee
            </Link>
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
