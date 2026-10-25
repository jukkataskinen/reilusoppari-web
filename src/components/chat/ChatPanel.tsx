"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CHAT_CONFIG, CHAT_CTAS } from "@/lib/chat/config";
import { ctaHref, ctaTag, splitCtaTrailer, type CtaType } from "@/lib/chat/cta";
import { getSignupUrl } from "@/lib/launch";
import { track } from "@/lib/analytics";
import { ChatMarkdown } from "@/lib/chat/markdown";
import { KNOWN_PATHS } from "@/lib/chat/known-paths.generated";
import { MAX_MESSAGE_CHARS, MAX_MESSAGES } from "@/lib/chat/limits";
import { Nappi, Pyorii } from "@/components/painike";

type Msg = { role: "user" | "assistant"; content: string; cta?: CtaType };
type Status = "checking" | "ready" | "disabled";

const ERRORS: Record<string, string> = {
  rate_limited: "Kysymyksiä on tullut hetkessä paljon. Odota hetki ja yritä uudelleen.",
  budget_exceeded: "Chat on tältä päivältä täynnä. Kokeile huomenna tai ota yhteyttä.",
  too_long: "Viesti on liian pitkä. Lyhennä sitä ja yritä uudelleen.",
  forbidden_origin: "Viestin lähetys ei onnistunut. Päivitä sivu ja yritä uudelleen.",
  not_configured: "Chat ei ole vielä käytössä.",
};
const GENERIC_ERROR = "Vastauksen hakeminen epäonnistui. Yritä hetken päästä uudelleen tai ota yhteyttä.";

class ChatError extends Error {}

/** Historia palvelimelle: aiempi ehdotus merkitään tagina, jotta botti ei toista sitä. */
function toApi(messages: Msg[]) {
  return messages.map((m) => ({ role: m.role, content: m.cta ? `${m.content}\n\n${ctaTag(m.cta)}` : m.content }));
}

/**
 * Toimintakehotenappi botin vastauksen alla. Vie lomakkeelle aihe esitäytettynä; osoitteessa
 * on vain aihe ja lähde. Painikepalaute: teksti vaihtuu ja ilmaisin pyörii, kunnes sivu vaihtuu.
 */
function CtaButton({ type, pending, onPress }: { type: CtaType; pending: boolean; onPress: () => void }) {
  const def = CHAT_CTAS[type];
  const href = ctaHref(def, getSignupUrl());
  const className =
    "mt-2 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-strong aria-busy:opacity-80";
  const content = pending ? (
    <>
      <Pyorii />
      <span role="status" aria-live="polite">
        {def.pending}
      </span>
    </>
  ) : (
    def.label
  );
  const onClick = onPress;
  return href.startsWith("/") ? (
    <Link href={href} onClick={onClick} aria-busy={pending || undefined} className={className}>
      {content}
    </Link>
  ) : (
    <a href={href} onClick={onClick} aria-busy={pending || undefined} className={className}>
      {content}
    </a>
  );
}

export default function ChatPanel({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>("checking");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const [pendingCta, setPendingCta] = useState<number | null>(null);
  const pathname = usePathname();
  const startPath = useRef(pathname);

  // Kun ehdotusnappi vei toiselle sivulle, chat sulkeutuu, jotta lomake näkyy.
  useEffect(() => {
    if (pendingCta !== null && pathname !== startPath.current) onClose();
    startPath.current = pathname;
  }, [pathname, pendingCta, onClose]);
  useEffect(() => {
    if (pendingCta === null) return;
    const timer = setTimeout(() => setPendingCta(null), 4000);
    return () => clearTimeout(timer);
  }, [pendingCta]);

  const pressCta = useCallback((type: CtaType, index: number) => {
    track("Chat: ehdotus painettu", { tyyppi: type });
    setPendingCta(index);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: false }))
      .then((d: { enabled?: boolean }) => alive && setStatus(d.enabled ? "ready" : "disabled"))
      .catch(() => alive && setStatus("disabled"));
    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, error]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || busy) return;
      if (messages.length === 0) track("Chat: keskustelu alkoi");
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages([...next, { role: "assistant", content: "" }]);
      setInput("");
      setError(null);
      setBusy(true);
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toApi(next) }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) {
          const code = await res.json().then((d: { error?: string }) => d.error ?? "").catch(() => "");
          throw new ChatError(ERRORS[code] ?? GENERIC_ERROR);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          // Erottimen jälkeinen osa on ehdotus, ei näytettävää tekstiä.
          setMessages([...next, { role: "assistant", content: splitCtaTrailer(answer).text }]);
        }
        const { text: finalText, type: cta } = splitCtaTrailer(answer);
        if (!finalText.trim()) throw new ChatError(GENERIC_ERROR);
        if (cta) {
          setMessages([...next, { role: "assistant", content: finalText.trimEnd(), cta }]);
          track("Chat: ehdotus näytetty", { tyyppi: cta });
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        setMessages((m) => (m[m.length - 1]?.role === "assistant" && m[m.length - 1].content === "" ? m.slice(0, -1) : m));
        setError(e instanceof ChatError ? e.message : GENERIC_ERROR);
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
    },
    [busy, messages],
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  }

  // Esc sulkee, Tab kiertää paneelin sisällä (kosketus- ja näppäimistökäyttö).
  function onPanelKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = panelRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), textarea:not([disabled]), a[href]");
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const full = messages.length >= MAX_MESSAGES - 1;
  const contact = (
    <Link href={CHAT_CONFIG.contactPath} onClick={onClose} className="font-medium text-ink underline decoration-sky underline-offset-2">
      Ota yhteyttä
    </Link>
  );

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`${CHAT_CONFIG.productName}-chat`}
      onKeyDown={onPanelKeyDown}
      className="fixed bottom-20 right-4 z-50 flex h-[min(36rem,calc(100dvh-6.5rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[12px] border border-line bg-paper text-base text-ink"
    >
      <div className="flex items-center justify-between border-b border-line bg-cloud px-4 py-3">
        <h2 className="text-base font-semibold">{CHAT_CONFIG.title}</h2>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => {
                abortRef.current?.abort();
                setMessages([]);
                setError(null);
                setBusy(false);
              }}
              className="rounded-full px-3 py-1 text-sm text-ink/70 hover:bg-paper"
            >
              Uusi keskustelu
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="Sulje chat" className="rounded-full p-2 text-ink/70 hover:bg-paper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>

      {status === "checking" && <p className="p-4 text-sm text-ink/70">Avataan chat…</p>}

      {status === "disabled" && (
        <div className="flex flex-col gap-3 p-4 text-sm">
          <p className="font-medium">Chat ei ole vielä käytössä.</p>
          <p className="text-ink/70">Kysy mieluummin suoraan, niin vastaamme sähköpostilla. {contact}</p>
        </div>
      )}

      {status === "ready" && (
        <>
          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 text-sm" aria-live="polite" aria-busy={busy}>
            {messages.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p>{CHAT_CONFIG.welcome}</p>
                <ul className="flex flex-col gap-2" aria-label="Kysymysehdotukset">
                  {CHAT_CONFIG.suggestions.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => void send(s)}
                        className="w-full rounded-[12px] border border-line px-3 py-2 text-left hover:bg-cloud"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ul className="flex flex-col gap-3">
                {messages.map((m, i) => (
                  <li key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[85%] whitespace-pre-wrap break-words rounded-[12px] bg-ink px-3 py-2 text-paper"
                          : "max-w-[92%] break-words rounded-[12px] bg-cloud px-3 py-2"
                      }
                    >
                      <span className="sr-only">{m.role === "user" ? "Sinä: " : `${CHAT_CONFIG.productName}: `}</span>
                      {m.role === "user" ? (
                        m.content
                      ) : m.content ? (
                        <ChatMarkdown text={m.content} knownPaths={KNOWN_PATHS} />
                      ) : (
                        <span className="text-ink/70">Kirjoitetaan…</span>
                      )}
                      {m.role === "assistant" && m.cta && (
                        <div>
                          <CtaButton type={m.cta} pending={pendingCta === i} onPress={() => pressCta(m.cta!, i)} />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {error && (
              <p role="alert" className="mt-3 rounded-[12px] border border-coral px-3 py-2 text-coral">
                {error} {contact}
              </p>
            )}
            {full && !busy && (
              <p className="mt-3 text-ink/70">Keskustelu on pitkä. Aloita uusi keskustelu yläreunan painikkeella tai {contact}.</p>
            )}
          </div>

          <form onSubmit={onSubmit} className="border-t border-line p-3">
            <p className="mb-2 text-xs text-ink/70">{CHAT_CONFIG.privacyNotice}</p>
            <div className="flex items-end gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Kysymyksesi
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                maxLength={MAX_MESSAGE_CHARS}
                rows={2}
                disabled={full}
                placeholder="Kirjoita kysymys"
                className="min-h-[3rem] flex-1 resize-none rounded-[12px] border border-line px-3 py-2 text-sm"
              />
              <Nappi
                type="submit"
                natiivi={false}
                kaynnissa={busy}
                kesken="Vastataan…"
                disabled={busy || full || input.trim() === ""}
                className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-strong disabled:opacity-50"
              >
                Lähetä
              </Nappi>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
