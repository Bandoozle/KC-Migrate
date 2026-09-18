"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { FORM_NAMES, trackFormSuccess, trackPhoneClick } from "@/lib/analytics/track";
import { getPublicWordPressUrl } from "@/lib/wordpress-public";
import "@/styles/aca-widget.css";

type ChatRole = "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };
type ChatCta = {
  type?: string;
  label?: string;
  phone?: string;
  href?: string;
} | null;

type ChatWidgetConfig = {
  businessName: string;
  widgetTitle: string;
  subtitle: string;
  avatarUrl: string;
  launcherIconUrl: string;
  greeting: string;
  teaserText: string;
  showTeaser: boolean;
  teaserDelayMs: number;
  primaryColor: string;
  position: "bottom-right" | "bottom-left";
  phoneNumber: string;
  phoneCtaLabel: string;
  formCtaLabel: string;
  enablePhoneCta: boolean;
  enableFormCta: boolean;
};

const DEFAULT_CONFIG: ChatWidgetConfig = {
  businessName: "Kosick Communications",
  widgetTitle: "Connect with us",
  subtitle: "Typically replies in a few minutes",
  avatarUrl:
    "https://staging.kosick.com/wp-content/uploads/2026/05/kosick-communications.jpg",
  launcherIconUrl:
    "https://staging.kosick.com/wp-content/uploads/2026/05/chat-feature.jpg",
  greeting: "Hello! How can we assist?",
  teaserText: "Hello! How can we assist?",
  showTeaser: true,
  teaserDelayMs: 3000,
  primaryColor: "#000000",
  position: "bottom-right",
  phoneNumber: "604-925-5800",
  phoneCtaLabel: "Call our team",
  formCtaLabel: "Connect With Us",
  enablePhoneCta: true,
  enableFormCta: true,
};

const STORAGE_KEY = "aca_session_v1";
const TEASER_KEY = "aca_teaser_dismissed_v1";

function mediaUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http")) {
    try {
      const u = new URL(pathOrUrl);
      // Prefer same WP origin configured for the app when possible.
      if (u.pathname.includes("/wp-content/")) {
        return `${getPublicWordPressUrl()}${u.pathname}${u.search}`;
      }
    } catch {
      /* keep */
    }
    return pathOrUrl;
  }
  return `${getPublicWordPressUrl()}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function newSessionId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function phoneHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits.startsWith("+") ? `tel:${digits}` : `tel:+1${digits.replace(/^1/, "")}`;
}

export function ChatWidget({ config = DEFAULT_CONFIG }: { config?: Partial<ChatWidgetConfig> }) {
  const cfg: ChatWidgetConfig = {
    ...DEFAULT_CONFIG,
    ...config,
    avatarUrl: mediaUrl((config.avatarUrl || DEFAULT_CONFIG.avatarUrl)),
    launcherIconUrl: mediaUrl(
      config.launcherIconUrl || DEFAULT_CONFIG.launcherIconUrl,
    ),
  };

  const rootId = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [input, setInput] = useState("");
  const [teaserVisible, setTeaserVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [lastCta, setLastCta] = useState<ChatCta>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          messages?: ChatMessage[];
          sessionId?: string;
        };
        if (Array.isArray(parsed.messages)) {
          setMessages(
            parsed.messages.filter(
              (m) =>
                m &&
                (m.role === "user" || m.role === "assistant") &&
                typeof m.content === "string" &&
                m.content.length > 0,
            ),
          );
        }
        if (parsed.sessionId) setSessionId(parsed.sessionId);
        else setSessionId(newSessionId());
      } else {
        setSessionId(newSessionId());
      }
    } catch {
      setSessionId(newSessionId());
    }

    if (cfg.showTeaser) {
      const dismissed = sessionStorage.getItem(TEASER_KEY) === "1";
      if (!dismissed) {
        const t = window.setTimeout(() => setTeaserVisible(true), cfg.teaserDelayMs);
        return () => window.clearTimeout(t);
      }
    }
  }, [cfg.showTeaser, cfg.teaserDelayMs]);

  useEffect(() => {
    if (!sessionId) return;
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ messages, sessionId }),
      );
    } catch {
      /* ignore */
    }
  }, [messages, sessionId]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open && !welcomeShown && messages.length === 0) {
      setMessages([{ role: "assistant", content: cfg.greeting }]);
      setWelcomeShown(true);
    }
  }, [open, welcomeShown, messages.length, cfg.greeting]);

  function dismissTeaser() {
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {
      /* ignore */
    }
    setTeaserVisible(false);
  }

  function toggleOpen() {
    setOpen((v) => !v);
    setTeaserVisible(false);
    setMenuOpen(false);
  }

  async function trackOutcome(outcome: string) {
    try {
      await fetch("/api/chat/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, outcome }),
        keepalive: true,
      });
    } catch {
      /* ignore */
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          sessionId,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        reply?: string;
        cta?: ChatCta;
        error?: string;
      } | null;

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data?.error || "Sorry, something went wrong. Please try again.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data?.reply || "" },
      ]);
      setLastCta((data?.cta as ChatCta) || null);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void sendMessage(input);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function startNewChat() {
    setMenuOpen(false);
    const id = newSessionId();
    setSessionId(id);
    setMessages([{ role: "assistant", content: cfg.greeting }]);
    setWelcomeShown(true);
    setLastCta(null);
    void trackOutcome("new_chat");
  }

  function endChat() {
    setMenuOpen(false);
    void trackOutcome("ended");
    setOpen(false);
  }

  return (
    <>
      <div
        id="aca-root"
        className={open ? "aca-open" : undefined}
        data-position={cfg.position}
        style={{ ["--aca-primary" as string]: cfg.primaryColor }}
        data-react-root={rootId}
      >
        {teaserVisible && !open ? (
          <div
            className="aca-teaser aca-teaser-visible"
            role="button"
            tabIndex={0}
            aria-label="Open chat"
            onClick={() => {
              dismissTeaser();
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                dismissTeaser();
                setOpen(true);
              }
            }}
          >
            <button
              type="button"
              className="aca-teaser-dismiss"
              aria-label="Dismiss"
              onClick={(e) => {
                e.stopPropagation();
                dismissTeaser();
              }}
            >
              ×
            </button>
            <div className="aca-teaser-text">{cfg.teaserText}</div>
          </div>
        ) : null}

        <button
          type="button"
          className="aca-launcher"
          aria-label={open ? "Close chat" : "Open chat"}
          onClick={toggleOpen}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="aca-launcher-avatar" src={cfg.launcherIconUrl} alt="" />
          <svg
            className="aca-icon-close"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span className="aca-launcher-pulse" />
        </button>

        <div
          className="aca-panel"
          role="dialog"
          aria-label="Chat with us"
          aria-hidden={!open}
        >
          <header className="aca-header">
            <div className="aca-header-content">
              <div className="aca-avatar aca-header-avatar" style={{ width: 40, height: 40 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cfg.avatarUrl} alt="" />
              </div>
              <div className="aca-header-text">
                <div className="aca-header-title">{cfg.businessName}</div>
                {cfg.subtitle ? (
                  <div className="aca-header-subtitle">{cfg.subtitle}</div>
                ) : null}
              </div>
            </div>
            <div className="aca-header-actions">
              <button
                type="button"
                className="aca-header-menu-btn"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                ⋮
              </button>
              <button
                type="button"
                className="aca-header-close"
                aria-label="Close chat"
                onClick={toggleOpen}
              >
                ×
              </button>
              {menuOpen ? (
                <div className="aca-header-menu aca-menu-open" role="menu">
                  <button
                    type="button"
                    className="aca-menu-item"
                    role="menuitem"
                    onClick={startNewChat}
                  >
                    Start a new chat
                  </button>
                  <button
                    type="button"
                    className="aca-menu-item aca-menu-item-danger"
                    role="menuitem"
                    onClick={endChat}
                  >
                    End chat
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          <div className="aca-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                className={`aca-message aca-message-${message.role}`}
              >
                <div className="aca-message-bubble">{message.content}</div>
              </div>
            ))}
            {busy ? (
              <div className="aca-message aca-message-assistant aca-typing">
                <div className="aca-message-bubble aca-typing-bubble">
                  <span className="aca-dot" />
                  <span className="aca-dot" />
                  <span className="aca-dot" />
                </div>
              </div>
            ) : null}
            {!busy && lastCta ? (
              <div className="aca-cta-row">
                {cfg.enablePhoneCta ? (
                  <a
                    className="aca-cta-btn"
                    href={phoneHref(cfg.phoneNumber)}
                    onClick={() => {
                      trackPhoneClick(phoneHref(cfg.phoneNumber));
                      void trackOutcome("called");
                    }}
                  >
                    {cfg.phoneCtaLabel}
                  </a>
                ) : null}
                {cfg.enableFormCta ? (
                  <button
                    type="button"
                    className="aca-cta-btn"
                    onClick={() => {
                      void trackOutcome("opened_form");
                      setLeadOpen(true);
                    }}
                  >
                    {cfg.formCtaLabel}
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          <form className="aca-input-row" onSubmit={onSubmit}>
            <div className="aca-input-wrap">
              <textarea
                ref={inputRef}
                className="aca-input"
                rows={1}
                placeholder="Send a message..."
                aria-label="Message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={busy}
              />
              <button
                type="submit"
                className="aca-send"
                aria-label="Send"
                disabled={busy || !input.trim()}
              >
                ➤
              </button>
            </div>
          </form>
          <div className="aca-footer">Powered by Kosick AI</div>
        </div>
      </div>

      {leadOpen ? (
        <LeadModal
          cfg={cfg}
          sessionId={sessionId}
          transcript={messages}
          onClose={() => setLeadOpen(false)}
          onSuccess={() => {
            setLeadOpen(false);
            const followup =
              "Got it. Someone from our team will reach out shortly. Anything else I can help with in the meantime?";
            setMessages((prev) => [...prev, { role: "assistant", content: followup }]);
          }}
        />
      ) : null}
    </>
  );
}

function LeadModal({
  cfg,
  sessionId,
  transcript,
  onClose,
  onSuccess,
}: {
  cfg: ChatWidgetConfig;
  sessionId: string;
  transcript: ChatMessage[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setError(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/chat/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          business_name: data.get("business_name"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          transcript,
          pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
          sessionId,
        }),
      });
      const result = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) {
        setError(result?.error || "Something went wrong.");
        setStatus("error");
        return;
      }
      trackFormSuccess(FORM_NAMES.chatLead);
      setStatus("success");
      window.setTimeout(onSuccess, 1200);
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="aca-modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="aca-modal"
        role="dialog"
        aria-label="Contact form"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="aca-modal-close" aria-label="Close" onClick={onClose}>
          ×
        </button>
        <div className="aca-modal-header">
          <div className="aca-avatar aca-modal-avatar" style={{ width: 48, height: 48 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cfg.avatarUrl} alt="" />
          </div>
          <h3 className="aca-modal-title">{cfg.formCtaLabel}</h3>
          <p className="aca-modal-sub">Leave your details and we will reach out shortly.</p>
        </div>
        <form className="aca-lead-form" onSubmit={onSubmit}>
          <label>
            <span>Name</span>
            <input type="text" name="name" required placeholder="Your name" />
          </label>
          <label>
            <span>Business name</span>
            <input type="text" name="business_name" placeholder="Your company" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" name="email" placeholder="you@example.com" />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" name="phone" placeholder="(555) 123-4567" />
          </label>
          <label>
            <span>How can we help?</span>
            <textarea name="message" rows={3} placeholder="Tell us a bit about what you need..." />
          </label>
          {status !== "success" ? (
            <button type="submit" className="aca-lead-submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending..." : "Send message"}
            </button>
          ) : null}
          <div
            className={`aca-lead-status${status === "error" ? " aca-error" : ""}${status === "success" ? " aca-success" : ""}`}
          >
            {status === "success"
              ? "Thanks! We will be in touch soon."
              : error}
          </div>
        </form>
      </div>
    </div>
  );
}
