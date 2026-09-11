import Link from "next/link";
import { getLaunchMode, getSignupUrl } from "@/lib/launch";

type PrimaryCtaSize = "md" | "lg";

interface PrimaryCtaProps {
  className?: string;
  size?: PrimaryCtaSize;
  /**
   * Vuokralaisen polku on eri: hän ei aloita palvelua itse, vaan pyytää
   * vuokranantajaa käyttämään sitä (CLAUDE.md kohta 4.1).
   */
  party?: "vuokranantaja" | "vuokralainen";
}

const sizeClasses: Record<PrimaryCtaSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

/**
 * Ainoa paikka, joka päättää ensisijaisen CTA:n tekstin ja kohteen
 * (CLAUDE.md kohta 2). Kaikki sivuston CTA-napit käyttävät tätä.
 *
 * Yhteinen CTA on aina `ink` – ei `sky` eikä `coral`, koska nappi kuuluu
 * molemmille osapuolille (CLAUDE.md kohta 5).
 *
 * `soon`-tilassa nappi EI lupaa mitään, mitä ei voi pitää: palvelua ei voi
 * vielä aloittaa eikä odotuslistalle voi liittyä, joten se ohjaa siihen mitä
 * sivustolla oikeasti on.
 */
export function PrimaryCta({
  className = "",
  size = "md",
  party = "vuokranantaja",
}: PrimaryCtaProps) {
  const mode = getLaunchMode();
  const tenant = party === "vuokralainen";

  let href: string;
  let label: string;

  if (tenant) {
    href = "/vuokralaiselle#pyyda";
    label = "Pyydä vuokranantajaa käyttämään";
  } else if (mode === "live") {
    href = getSignupUrl();
    label = "Aloita ilmaiseksi";
  } else if (mode === "waitlist") {
    href = "/#odotuslista";
    label = "Liity odotuslistalle";
  } else {
    href = "/miten-toimii";
    label = "Katso miten toimii";
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-ink font-medium text-paper transition-colors hover:bg-ink-strong ${sizeClasses[size]} ${className}`}
    >
      {label}
    </Link>
  );
}
