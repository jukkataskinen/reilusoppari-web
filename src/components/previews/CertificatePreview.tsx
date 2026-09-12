import { Covered, Sheet, SheetHead, StatRow } from "./parts";

/**
 * Vuokralaisen vuokratodistus.
 *
 * ===========================================================================
 * NIMET ON PEITETTY
 *
 * CLAUDE.md 4.6 sanoo sen suoraan, ja syy on tuotteessa: todistus on
 * yksityinen asiakirja, jonka omistaja päättää kenelle sen näyttää.
 * Markkinointisivu, joka esittelisi kokonaisen todistuksen nimineen, kertoisi
 * asiakirjasta toista kuin palvelu itse.
 *
 * Kaikki muu näytetään kokonaan – juuri numerot ovat se, mikä todistuksessa
 * on arvokasta.
 *
 * LUVUT TULEVAT KUITTAUKSISTA
 *
 * 24 kuukautta, 22 ajallaan, 2 alle viikon myöhässä. Nämä eivät ole
 * kehuja vaan laskettuja lukuja, ja siksi niistä on tehty taulukko eikä
 * kolmea tähteä.
 *
 * SUOSITUS ON KAKSIARVOINEN
 *
 * `recommend` tai ei mitään. Kielteistä vaihtoehtoa ei ole eikä todistukseen
 * tule merkintää puuttuvasta suosituksesta – esimerkki näyttää annetun
 * suosituksen, ei tyhjää kohtaa (ks. sovelluksen CLAUDE.md).
 * ===========================================================================
 */
export function CertificatePreview() {
  return (
    <Sheet label="Vuokratodistus, jossa nimet on peitetty: vuokrasuhde 1.9.2024–31.8.2026, 24 kuukautta, 24 vuokraa maksettu, 22 ajallaan, vakuus palautettu kokonaan, vuokranantaja suosittelee. Sinetöity 2.9.2026.">
      <SheetHead kicker="Reilusoppari" title="Vuokratodistus" badge={{ text: "sinetöity", done: true }} />

      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-ink/50">Vuokralainen</span>
          <Covered width="w-24" />
        </div>
        <p className="text-[12px] font-semibold">1.9.2024 – 31.8.2026 · 24 kuukautta</p>
      </div>

      <dl className="mt-3 divide-y divide-line border-y border-line py-0.5">
        <StatRow label="Vuokria maksettu" value="24 / 24" />
        <StatRow label="Ajallaan" value="22" />
        <StatRow label="Yli viikon myöhässä" value="0" />
        <StatRow label="Vakuus palautettu" value="kokonaan" />
      </dl>

      <div className="mt-3 rounded-lg border border-line px-2.5 py-2">
        <p className="text-[12px] font-semibold">Vuokranantaja suosittelee</p>
        <p className="mt-1 text-[11px] leading-snug text-ink/70">
          &rdquo;Asunto oli aina siistissä kunnossa, ja viat ilmoitettiin ajoissa.&rdquo;
        </p>
        <p className="mt-1.5 flex items-center gap-2">
          <span className="text-[10px] text-ink/50">Vuokranantaja</span>
          <Covered width="w-20" />
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-[10px] text-ink/55">
        <span>Sinetöity 2.9.2026</span>
        {/* Tarkistuskoodit ja tiivisteet ovat aina monospacea (CLAUDE.md 5). */}
        <span className="font-mono">4KJ2-9FQ1</span>
      </div>
    </Sheet>
  );
}
