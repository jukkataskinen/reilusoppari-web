import type { ReactNode } from "react";

/**
 * Asiakirjanäkymien yhteiset osat.
 *
 * ===========================================================================
 * MIKSI NÄMÄ OVAT KOMPONENTTEJA EIVÄTKÄ KUVIA
 *
 * Sivustolla näytetään neljä asiakirjaa: vuokrasopimus, katselmuspöytäkirja,
 * vuokratodistus ja kuittausilmoitus. Ne ovat tuotteen konkreettinen sisältö,
 * ja lukijan pitää nähdä mitä niissä oikeasti lukee.
 *
 * SVG-kuvituksena sama sisältö olisi sumeaa pienessä koossa, kääntämätöntä ja
 * vanhentuisi heti kun tuotteen sanasto muuttuu. Merkkauksena se skaalautuu,
 * noudattaa samaa palettia kuin muu sivusto ja pysyy yhdessä totuudessa.
 *
 * ESIMERKKIDATA ON TUNNISTETTAVASTI ESIMERKKIÄ
 *
 * Matti Meikäläinen, Liisa Esimerkki, Asunto Oy Esimerkki. Kukaan ei erehdy
 * luulemaan näitä oikeiksi vuokrasuhteiksi.
 *
 * SAAVUTETTAVUUS
 *
 * Koko asiakirja on yksi kuva: `Sheet` asettaa `role="img"` ja `aria-label`in,
 * jolloin ruudunlukija lukee yhden kuvauksen eikä kymmentä irrallista
 * kenttää. Sisällä ei ole nappeja eikä linkkejä – kuittausilmoituksen
 * "napit" ovat `span`eja, koska kuvassa oleva nappi ei ole nappi.
 * ===========================================================================
 */

/** Asiakirjan paperi. Syvyys tehdään reunuksella, ei varjolla (CLAUDE.md 5). */
export function Sheet({
  label,
  children,
  className = "",
}: {
  /** Mitä ruudunlukija kertoo koko asiakirjasta. */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`rounded-[var(--radius-panel)] border border-line bg-paper p-4 md:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Asiakirjan yläreuna: mistä asiakirjasta on kyse ja minkä asunnon.
 *
 * `badge` on asiakirjan tila ("lukittu", "sinetöity"). Se on `moss`-värinen
 * vain silloin, kun tila on tehty ja peruuttamaton – paletin sääntö rajaa
 * `moss`in juuri näihin (CLAUDE.md 5).
 */
export function SheetHead({
  kicker,
  title,
  subtitle,
  badge,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  badge?: { text: string; done?: boolean };
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line pb-3">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-ink/50">{kicker}</p>
        <p className="mt-0.5 truncate text-[15px] font-bold">{title}</p>
        {subtitle && <p className="mt-0.5 truncate text-[11px] text-ink/55">{subtitle}</p>}
      </div>
      {badge && (
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
            badge.done ? "border-moss/40 text-moss" : "border-line text-ink/60"
          }`}
        >
          {badge.text}
        </span>
      )}
    </div>
  );
}

/** Kenttä: selite pienellä, arvo sen alla. */
export function Field({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-line px-2.5 py-2">
      <p className="text-[10px] text-ink/50">{label}</p>
      <p className={`mt-0.5 text-[13px] font-semibold ${mono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

/** Rivi, jossa selite vasemmalla ja luku oikealla. Käytetään todistuksessa. */
export function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <span className="text-[12px] text-ink/70">{label}</span>
      <span className="text-[12px] font-semibold">{value}</span>
    </div>
  );
}

/**
 * Osapuolen tunnusväri pisteenä: `sky` vuokranantaja, `coral` vuokralainen.
 *
 * Piste on aina saman kokoinen kummallekin – kun molemmat värit esiintyvät,
 * ne esiintyvät yhtä isoina (CLAUDE.md 5).
 */
export function PartyDot({ role }: { role: "landlord" | "tenant" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 rounded-full ${
        role === "landlord" ? "bg-sky" : "bg-coral"
      }`}
    />
  );
}

/**
 * Peitetty nimi.
 *
 * Todistuksen esimerkissä nimet on peitetty (CLAUDE.md 4.6). Se ei ole
 * pelkkä kuvituskikka: todistus on yksityinen asiakirja, ja markkinointisivu
 * näyttää siitä juuri sen verran kuin lukijan pitää nähdä.
 */
export function Covered({ width = "w-28" }: { width?: string }) {
  return <span aria-hidden="true" className={`inline-block h-3 rounded-sm bg-cloud ${width}`} />;
}
