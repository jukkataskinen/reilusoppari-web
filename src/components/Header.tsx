import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PrimaryCta } from "@/components/PrimaryCta";
import { MobileNav } from "@/components/MobileNav";
import { getAppUrl, isLive } from "@/lib/launch";

/**
 * Päänavigaatio (CLAUDE.md kohta 3): logo · Miten toimii · Vuokranantajalle ·
 * Vuokralaiselle · Hinnat · Blogi · [CTA].
 *
 * Kaksi kohderyhmälinkkiä rinnakkain on tarkoituksellista: sivusto sanoo
 * rakenteellaan, että osapuolia on kaksi. Niitä ei siis saa yhdistää
 * alavalikoksi eikä laittaa eri tasoille.
 */
const navItems = [
  { href: "/miten-toimii", label: "Miten toimii" },
  { href: "/vuokranantajalle", label: "Vuokranantajalle" },
  { href: "/vuokralaiselle", label: "Vuokralaiselle" },
  { href: "/hinnat", label: "Hinnat" },
  { href: "/blogi", label: "Blogi" },
];

export function Header() {
  const live = isLive();

  return (
    <header className="relative border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[var(--container-content)] items-center justify-between gap-6 px-6 py-4">
        {/*
          Linkin saavutettava nimi tulee logon aria-labelista ("Reilusoppari").
          Erillinen aria-label ("Reilusoppari, etusivulle") olisi eri kuin
          näkyvä nimi, mistä axe antaa label-content-name-mismatch -virheen.
        */}
        <Link href="/" className="shrink-0 text-ink">
          <Logo markSize={34} />
        </Link>

        <nav aria-label="Päänavigaatio" className="hidden lg:block">
          <ul className="flex items-center gap-6 text-[15px]">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-ink hover:underline hover:underline-offset-4">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          {live && (
            <a href={`${getAppUrl()}/kirjaudu`} className="text-[15px] text-ink hover:underline">
              Kirjaudu
            </a>
          )}
          <PrimaryCta />
        </div>

        <MobileNav
          items={[
            ...navItems,
            { href: "/katselmus", label: "Katselmus" },
            { href: "/verolaskelma", label: "Verolaskelma" },
            { href: "/todistus", label: "Todistus" },
            { href: "/ukk", label: "UKK" },
            { href: "/yhteystiedot", label: "Yhteystiedot" },
            ...(live ? [{ href: `${getAppUrl()}/kirjaudu`, label: "Kirjaudu" }] : []),
          ]}
          cta={<PrimaryCta size="lg" className="w-full" />}
        />
      </div>
    </header>
  );
}
