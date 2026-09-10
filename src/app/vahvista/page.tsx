import Link from "next/link";
import type { Metadata } from "next";
import { confirmWaitlistSubscription } from "@/app/actions/waitlist";

export const metadata: Metadata = {
  title: "Vahvista liittyminen | Reilusoppari",
  robots: { index: false, follow: false },
};

const messages: Record<string, { title: string; body: string }> = {
  confirmed: {
    title: "Liittyminen vahvistettu",
    body: "Kiitos! Olet nyt Reilusopparin odotuslistalla. Ilmoitamme sähköpostiisi, kun palvelu avautuu.",
  },
  expired: {
    title: "Linkki on vanhentunut",
    body: "Vahvistuslinkki on vanhentunut. Liity odotuslistalle uudelleen etusivulta, niin lähetämme uuden linkin.",
  },
  invalid: {
    title: "Linkki ei kelpaa",
    body: "Tämä vahvistuslinkki ei ole kelvollinen. Tarkista, että kopioit linkin kokonaan, tai liity listalle uudelleen.",
  },
  unavailable: {
    title: "Odotuslista ei ole vielä käytössä",
    body: "Vahvistus ei juuri nyt onnistu teknisistä syistä. Yritä myöhemmin uudelleen.",
  },
  error: {
    title: "Vahvistus epäonnistui",
    body: "Liittymisen vahvistus epäonnistui teknisen virheen vuoksi. Yritä hetken kuluttua uudelleen, tai ota yhteyttä jos ongelma jatkuu.",
  },
  missing: {
    title: "Vahvistuslinkki puuttuu",
    body: "Osoitteesta puuttuu vahvistustunniste. Käytä sähköpostissasi ollutta linkkiä kokonaisuudessaan.",
  },
};

export default async function VahvistaPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await confirmWaitlistSubscription(token) : { status: "missing" as const };
  const content = messages[result.status];

  return (
    <div className="mx-auto flex max-w-[var(--container-content)] flex-col items-center px-6 py-24 text-center">
      <h1 className="text-[26px] text-ink md:text-[32px]">{content.title}</h1>
      <p className="mt-4 max-w-md text-ink/70">{content.body}</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 font-medium text-paper"
      >
        Etusivulle
      </Link>
    </div>
  );
}
