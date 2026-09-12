import { PartyDot, Sheet } from "./parts";

/**
 * Sama vuokrasopimus toisen osapuolen näkymänä (CLAUDE.md 4.1).
 *
 * ===========================================================================
 * KAKSI KORTTIA, YKSI SOPIMUS
 *
 * Heron visuaalinen elementti on kaksipuolinen näkymä. Kortteja on siis aina
 * kaksi, ja ne ovat täsmälleen samankokoiset – kun molemmat värit esiintyvät,
 * ne esiintyvät yhtä isoina (CLAUDE.md 5).
 *
 * Kortit eroavat vain kahdesta kohdasta: kuka on vastapuoli ja mitä palvelu
 * maksaa juuri tälle osapuolelle. Vuokra ja alkamispäivä ovat molemmissa
 * samat, koska se on koko idea: yksi sopimus, ei kahta versiota.
 *
 * Vanha versio esitti osapuolet kahtena tyhjänä puhelinpaneelina ja SVG-
 * kuvituksena niiden päällä. Se kertoi rakenteen mutta ei sisältöä – lukija
 * näki, että osapuolia on kaksi, mutta ei sitä mitä palvelu tekee.
 * ===========================================================================
 */
export function ContractPreview({ role }: { role: "landlord" | "tenant" }) {
  const landlord = role === "landlord";

  const label = landlord
    ? "Vuokrasopimus vuokranantajan näkymänä: vuokralainen Liisa Esimerkki, vuokra 850 euroa kuussa, alkaa 1.9.2026, ensimmäinen vuokrasuhde 0 euroa."
    : "Sama vuokrasopimus vuokralaisen näkymänä: vuokranantaja Matti Meikäläinen, vuokra 850 euroa kuussa, alkaa 1.9.2026, vuokralaiselle maksuton.";

  return (
    <Sheet label={label} className="h-full">
      <div className="border-b border-line pb-3">
        <p className="text-[11px] font-medium text-ink/50">Vuokrasopimus</p>
        <p className="mt-1 flex items-center gap-1.5 text-[12px] font-medium">
          <PartyDot role={role} />
          {landlord ? "Vuokranantaja" : "Vuokralainen"}
        </p>
        <p className="mt-1 text-[14px] font-bold">
          {landlord ? "Matti Meikäläinen" : "Liisa Esimerkki"}
        </p>
      </div>

      <dl className="mt-3 space-y-2.5">
        <Row
          label={landlord ? "Vuokralainen" : "Vuokranantaja"}
          value={landlord ? "Liisa Esimerkki" : "Matti Meikäläinen"}
        />
        <Row label="Vuokra" value="850 € / kk" />
        <Row label="Alkaa" value="1.9.2026" />
      </dl>

      {/*
        Hintalupaus on kortin alareunassa eikä irrallisena lappuna sen päällä:
        leijuva lappu vaatisi varjon erottuakseen, ja varjoja ei käytetä.
      */}
      <p className="mt-3 border-t border-line pt-3 text-[11px] text-ink/70">
        {landlord ? "Ensimmäinen vuokrasuhde 0 €" : "Sinulle aina maksuton"}
      </p>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] text-ink/50">{label}</dt>
      <dd className="text-[13px] font-semibold">{value}</dd>
    </div>
  );
}
