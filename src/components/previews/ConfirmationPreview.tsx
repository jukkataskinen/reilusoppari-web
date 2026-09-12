import { Sheet } from "./parts";

/**
 * Vuokrakuittauksen ilmoitus (CLAUDE.md 4.5).
 *
 * ===========================================================================
 * TEKSTI ON SPEKSISTÄ
 *
 * "Maksoiko Liisa 850 € eräpäivään 2.9. mennessä?" ja napit Kyllä · Ei vielä ·
 * Osittain. Nämä ovat samat sanat kuin sovelluksessa, eivät markkinointiin
 * kirjoitettu mukaelma.
 *
 * NAPIT EIVÄT OLE NAPPEJA
 *
 * Ne ovat `span`eja. Kuvassa oleva nappi, johon voi siirtyä sarkaimella ja
 * jota painamalla ei tapahdu mitään, on rikkinäinen nappi.
 *
 * ALLA NÄKYY TOINEN PUOLI
 *
 * Kuittaus ei ole vuokranantajan yksityinen merkintä vaan molempien yhteinen
 * tieto, joten esimerkissä näkyy myös se, mitä vuokralainen näkee.
 * ===========================================================================
 */
export function ConfirmationPreview() {
  return (
    <Sheet label="Ilmoitus vuokranantajalle: maksoiko Liisa 850 euroa eräpäivään 2.9. mennessä, vaihtoehdot kyllä, ei vielä ja osittain. Alla vuokralaisen näkymä: syyskuun vuokra kuitattu 2.9. kello 9.04.">
      <div className="flex items-center justify-between gap-3 text-[10px] text-ink/50">
        <span>Reilusoppari</span>
        <span className="font-mono">2.9. 9.00</span>
      </div>

      <p className="mt-2 text-[14px] leading-snug font-semibold">
        Maksoiko Liisa 850 € eräpäivään 2.9. mennessä?
      </p>

      <div className="mt-3 grid grid-cols-3 gap-1.5" aria-hidden="true">
        {/*
          Ensimmäinen vaihtoehto on täytetty, koska ilmoituksessa on yksi
          ensisijainen toiminto. Muoto on pilleri kuten kaikissa napeissa.
        */}
        <span className="rounded-full bg-ink px-2 py-1.5 text-center text-[11px] font-medium text-paper">
          Kyllä
        </span>
        <span className="rounded-full border border-line px-2 py-1.5 text-center text-[11px]">
          Ei vielä
        </span>
        <span className="rounded-full border border-line px-2 py-1.5 text-center text-[11px]">
          Osittain
        </span>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <p className="text-[10px] text-ink/50">Liisan näkymä</p>
        <p className="mt-1 flex items-center justify-between gap-3 text-[11px]">
          <span className="font-medium">Syyskuun vuokra kuitattu</span>
          <span className="font-mono text-ink/55">2.9. 9.04</span>
        </p>
      </div>
    </Sheet>
  );
}
