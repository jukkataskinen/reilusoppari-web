import Link from "next/link";
import { Logo } from "@/components/Logo";

/**
 * Alatunniste. Kaksi kohderyhmäsaraketta ovat samanpituiset ja samassa
 * asemassa – sama sääntö kuin etusivun palstoissa (CLAUDE.md kohta 4.4).
 */
const linkGroups = [
  {
    title: "Palvelu",
    links: [
      { href: "/miten-toimii", label: "Miten toimii" },
      { href: "/katselmus", label: "Katselmus" },
      { href: "/todistus", label: "Todistus" },
      { href: "/verolaskelma", label: "Verolaskelma" },
    ],
  },
  {
    title: "Kenelle",
    links: [
      { href: "/vuokranantajalle", label: "Vuokranantajalle" },
      { href: "/vuokralaiselle", label: "Vuokralaiselle" },
      { href: "/hinnat", label: "Hinnat" },
      { href: "/ukk", label: "UKK" },
    ],
  },
  {
    title: "Tietoa",
    links: [
      { href: "/blogi", label: "Blogi" },
      { href: "/yhteystiedot", label: "Yhteystiedot" },
      { href: "/tietosuoja", label: "Tietosuoja" },
      { href: "/kayttoehdot", label: "Käyttöehdot" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[var(--container-content)] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo variant="full" markSize={34} className="text-paper" />
            <p className="mt-4 max-w-xs text-sm text-cloud/80">
              Vuokranantajan ja vuokralaisen yhteinen työkalu koko vuokrasuhteen ajaksi.
              Vuokralaiselle aina maksuton.
            </p>
            <p className="mt-4 text-sm font-medium text-paper">Suomalainen palvelu, tiedot EU:ssa.</p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-medium text-cloud/60">{group.title}</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-cloud/80 hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-cloud/60">
          {/* CLAUDE.md kohta 2: alatunnisteessa moottorin maininta linkkinä. */}
          <p>
            Reilusoppari toimii{" "}
            <a
              href="https://esinetti.fi"
              className="underline underline-offset-2 hover:text-paper"
            >
              eSinetti-allekirjoitusmoottorilla
            </a>
            .
          </p>
          <p className="mt-2">Adepta Oy · Y-tunnus 2237131-2 · Joutsa</p>
          <p className="mt-1">
            &copy; {new Date().getFullYear()} Adepta Oy. Kaikki oikeudet pidätetään.
          </p>
        </div>
      </div>
    </footer>
  );
}
