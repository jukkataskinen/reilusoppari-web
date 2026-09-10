"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

/**
 * CTA tulee propsina palvelinkomponentilta (Header), ei importtina:
 * PrimaryCta lukee LAUNCH_MODE:n palvelimen ympäristömuuttujasta, joka ei
 * ole saatavilla selaimessa. Näin mobiilivalikon CTA on aina sama kuin
 * työpöytänavigaation.
 */
export function MobileNav({ items, cta }: { items: NavItem[]; cta?: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        className="inline-flex items-center justify-center rounded-[var(--radius-panel)] border border-line p-2 text-ink"
      >
        <span className="sr-only">{open ? "Sulje valikko" : "Avaa valikko"}</span>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          {open ? (
            <path d="M4 4L18 18M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <path d="M3 6H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 11H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 16H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav
          id="mobile-nav-panel"
          aria-label="Päänavigaatio"
          className="absolute inset-x-0 top-full z-20 border-t border-line bg-paper px-6 py-4"
        >
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-1 text-base text-ink"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {cta && <div className="mt-5">{cta}</div>}
        </nav>
      )}
    </div>
  );
}
