import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { OgImageMeta } from "@/components/OgImageMeta";
import { PageHero, Section } from "@/components/PageHero";
import { CertificatePreview } from "@/components/previews/CertificatePreview";
import { CtaSection } from "@/components/sections/CtaSection";

const title = "Vuokratodistus";
const description =
  "Mitä todistuksessa lukee, kuka sen omistaa ja miten aitouden voi tarkistaa. Molemmat osapuolet saavat omansa.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/todistus" },
  openGraph: { title, description, type: "website" },
};

const contents = [
  { label: "Vuokrasuhteen kesto", note: "Alkamis- ja päättymispäivä sopimuksen mukaan" },
  { label: "Asunnon osoite", note: "Sama kuin sopimuksessa" },
  { label: "Yhteenveto vuokranmaksusta", note: "Kuittausten perusteella, ei käsin kirjoitettuna" },
  { label: "Vuokranantajan terveiset", note: "Vapaa teksti, jonka vuokralainen näkee ennen valmistumista" },
  { label: "Tarkistuslinkki", note: "Aitouden voi todentaa ilman, että koko asiakirjaa lähetetään" },
];

export default function TodistusPage() {
  return (
    <>
      <OgImageMeta title={title} eyebrow="Todistus" alt="Vuokratodistus" />
      <Breadcrumbs
        entries={[
          { name: "Etusivu", path: "/" },
          { name: "Todistus", path: "/todistus" },
        ]}
      />
      <PageHero
        tone="coral"
        eyebrow="Todistus"
        title="Allekirjoitettu dokumentti hyvästä vuokrasuhteesta on kovaa valuuttaa"
        lead="Vuokrasuhteen päättyessä kumpikin saa oman todistuksensa. Vuokralaisen todistus kertoo vuokranmaksusta, vuokranantajan siitä, että vakuus palautettiin ajallaan ja viat korjattiin."
      />

      <Section title="Mitä todistuksessa lukee" tone="cloud">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:items-start">
          <dl className="divide-y divide-line border-y border-line">
            {contents.map((row) => (
              <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-[240px_1fr] sm:gap-6">
                <dt className="font-medium">{row.label}</dt>
                <dd className="text-ink/70">{row.note}</dd>
              </div>
            ))}
          </dl>
          <figure className="mx-auto w-full max-w-[360px]">
            <CertificatePreview />
            <figcaption className="mt-3 text-center text-xs text-ink/60">
              Nimet on peitetty esimerkissä.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section title="Tämä ei tule yllätyksenä">
        <div className="prose-measure text-ink/80">
          <p>
            Molemmille kerrotaan jo vuokrasuhdetta aloitettaessa, että sen päättyessä kumpikin
            antaa toisestaan arvion ja saa oman todistuksensa. Se on osa sitä, mihin
            allekirjoituksella sitoudutaan – ei jotain, mikä ilmestyy lopussa.
          </p>
          <p className="mt-4">
            Käytännössä tämä muuttaa myös vuokrasuhdetta sen aikana. Kun molemmat tietävät, että
            lopussa katsotaan taaksepäin, asiat tulee useammin hoidettua silloin kun ne ovat
            pieniä.
          </p>
        </div>
      </Section>

      <Section title="Kuka todistuksen omistaa">
        <div className="prose-measure text-ink/80">
          <p>
            Vuokratodistus on vuokralaisen oma asiakirja. Hän päättää, kenelle sen näyttää – eikä
            Reilusoppari näytä sitä kenellekään muulle eikä ylläpidä siitä hakemistoa.
          </p>
          <p className="mt-4">
            Vuokranantajan todistus on vastaavasti hänen omansa. Kumpikaan ei voi julkaista toisen
            todistusta, ja kumpikin voi jättää oman todistuksensa käyttämättä.
          </p>
        </div>
      </Section>

      <Section title="Voiko vuokranantaja kirjoittaa mitä tahansa" tone="cloud">
        <div className="prose-measure text-ink/80">
          <p>
            Numerot tulevat kuittauksista automaattisesti, eikä niitä kirjoiteta käsin. Vapaa teksti
            on vuokranantajan omaa tekstiä, ja vuokralainen näkee todistuksen ennen kuin se on
            valmis. Hän voi liittää siihen oman vastineensa.
          </p>
          <p className="mt-4">
            Vuokranantaja voi halutessaan antaa suosituksen. Kielteistä arviota ei voi antaa:
            vaihtoehtoja on kaksi, suositus tai ei suositusta, eikä ilman suositusta jäävään
            todistukseen tule siitä mitään merkintää. Todistukseen ei kirjata mitään, mikä
            muistuttaisi luottotietoa tai rekisterimerkintää. Se kertoo yhdestä vuokrasuhteesta.
          </p>
        </div>
      </Section>

      <Section title="Miten aitouden tarkistaa">
        <div className="prose-measure text-ink/80">
          <p>
            Todistuksessa on tarkistuslinkki ja tunniste. Linkki näyttää, että juuri tämä todistus on
            annettu, milloin ja mihin vuokrasuhteeseen se liittyy – ilman että koko asiakirjan
            sisältöä tarvitsee lähettää kenellekään etukäteen.
          </p>
          <p className="mt-4">
            Seuraava vuokranantaja voi siis varmistua siitä, että todistus on aito, ilman että
            hänelle luovutetaan mitään ylimääräistä.
          </p>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
