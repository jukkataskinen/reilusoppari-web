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
 */
export function PrimaryCta({
  className = "",
  size = "md",
  party = "vuokranantaja",
}: PrimaryCtaProps) {
  const mode = getLaunchMode();
  const tenant = party === "vuokralainen";

  const href = tenant ? "/vuokralaiselle#pyyda" : mode === "live" ? getSignupUrl() : "/#odotuslista";
  const label = tenant
    ? "Pyydä vuokranantajaa käyttämään"
    : mode === "live"
      ? "Aloita ilmaiseksi"
      : "Liity odotuslistalle";

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full bg-ink font-medium text-paper transition-colors hover:bg-ink-strong ${sizeClasses[size]} ${className}`}
    >
      {label}
    </Link>
  );
}
