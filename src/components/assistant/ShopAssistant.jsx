import "./ShopAssistant.css";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@/contexts/UserContext";
import { ShopAssistantLoading } from "./ShopAssistantLoading";

// Guest chat is public shopping help; storefront tokens never cross this boundary.
const enabled = import.meta.env.DEV && import.meta.env.VITE_SHOP_ASSISTANT_ENABLED !== "false";
const origin = `http://${window.location.hostname === "localhost" ? "localhost" : "127.0.0.1"}:8080`;
const installation = import.meta.env.VITE_SHOP_ASSISTANT_INSTALLATION || "local-thekitestore";
const panelStorageKey = `shop-assistant:panel-open:${installation}`;

export function ShopAssistant() {
  const { user } = useUser();
  const [open, setOpen] = useState(() => {
    try { return sessionStorage.getItem(panelStorageKey) === "true"; }
    catch { return false; }
  });
  const [started, setStarted] = useState(enabled);
  const [frameState, setFrameState] = useState("loading");
  const [attempt, setAttempt] = useState(0);
  const resetAfterReady = useRef(false);
  const frame = useRef(null);
  const launcher = useRef(null);
  const previousUser = useRef(user?.id);
  useEffect(() => {
    try { sessionStorage.setItem(panelStorageKey, String(open)); }
    catch { /* Chat still connects when browser storage is unavailable. */ }
  }, [open]);
  useEffect(() => {
    if (previousUser.current !== user?.id) {
      resetAfterReady.current = true;
      frame.current?.contentWindow?.postMessage({ type: "shop-assistant:reset" }, origin);
      previousUser.current = user?.id;
    }
  }, [user?.id]);
  useEffect(() => {
    function receive(event) {
      if (event.origin !== origin || event.source !== frame.current?.contentWindow) return;
      if (event.data?.type === "shop-assistant:ui-ready") setFrameState("ready");
      if (event.data?.type === "shop-assistant:ready" && resetAfterReady.current) {
        event.source.postMessage({ type: "shop-assistant:reset" }, origin);
        resetAfterReady.current = false;
      }
      if (event.data?.type === "shop-assistant:close") close();
    }
    function close() {
      setOpen(false);
      requestAnimationFrame(() => launcher.current?.focus());
    }
    function escape(event) { if (event.key === "Escape") close(); }
    window.addEventListener("message", receive);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("message", receive);
      window.removeEventListener("keydown", escape);
    };
  }, []);
  useEffect(() => {
    if (!started) return;
    const timer = window.setTimeout(() => setFrameState(current => current === "ready" ? current : "error"), 10000);
    return () => window.clearTimeout(timer);
  }, [started, attempt]);
  useEffect(() => {
    if (open && frameState === "ready") frame.current?.focus();
  }, [open, frameState]);
  if (!enabled) return null;
  return createPortal(<aside aria-label="Shopping assistant" className="shop-chat">
    {started && <section id="shop-chat-panel" hidden={!open} aria-label="Shopping chat" className="shop-chat-panel">
      <div className="shop-chat-links"><span className="shop-chat-brand"><span aria-hidden="true">✦</span>The Kite Store assistant</span><button type="button" aria-label="Close shopping chat" onClick={() => { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()); }}>×</button></div>
      {frameState === "loading" && <ShopAssistantLoading />}
      {frameState === "error" && <div className="shop-chat-status" role="status">
        <p>Chat is temporarily unavailable. Please try again shortly.</p><button type="button" onClick={() => { setFrameState("loading"); setAttempt(current => current + 1); }}>Try again</button>
      </div>}
      <iframe key={attempt} ref={frame} hidden={frameState !== "ready"} title="The Kite Store shopping assistant" src={`${origin}/widget/${encodeURIComponent(installation)}?header=host`} />
    </section>}
    <button ref={launcher} hidden={open} type="button" className="shop-chat-launcher" aria-controls="shop-chat-panel" aria-label="Open shopping assistant" aria-expanded={open} onClick={() => { setStarted(true); setOpen(true); }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-8 8H5l-3 2v-10a9 9 0 0 1 18 0Z"/><path d="M7 10h10M7 14h6"/></svg>
    </button>
  </aside>, document.body);
}
