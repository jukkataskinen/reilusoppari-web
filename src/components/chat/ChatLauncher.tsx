"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CHAT_CONFIG } from "@/lib/chat/config";

// Chatin koodi ladataan vasta, kun painiketta painetaan: etusivun latausaika ei kasva.
const ChatPanel = dynamic(() => import("./ChatPanel"), { ssr: false });

/** Kelluva chat-painike oikeassa alakulmassa. */
export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // Fokus palaa painikkeeseen, kun chat suljetaan.
  useEffect(() => {
    if (wasOpen.current && !open) buttonRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      {open && <ChatPanel onClose={() => setOpen(false)} />}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink-strong"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 21 12z" />
        </svg>
        {open ? "Sulje chat" : CHAT_CONFIG.title}
      </button>
    </>
  );
}
