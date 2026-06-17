"use client";

import { useState } from "react";
import {
  X, RefreshCw, Megaphone, MessageCircleHeart, ShoppingBag,
  ChevronDown, Check, Link2, Store, MessageSquare, PenLine,
  Smile, Briefcase,
} from "lucide-react";

/* ── Feature rows (left panel) ── */
const FEATURES = [
  {
    icon: RefreshCw,
    label: "Drive more repeat purchases automatically",
    desc:  "Send timely messages that bring customers back.",
  },
  {
    icon: Megaphone,
    label: "Reactive with zero manual effort",
    desc:  "Let AI win back customers who've gone quiet.",
  },
  {
    icon: MessageCircleHeart,
    label: "Keep loyal customers engaged, automatically",
    desc:  "Slow appreciation with exclusive deals and offers.",
  },
  {
    icon: ShoppingBag,
    label: "Personalize pickup messages at scale",
    desc:  "Reach pickup-only customers with relevant promos.",
  },
];

const TONES = ["Friendly", "Casual", "Formal"] as const;
type Tone = typeof TONES[number];

/* ── Overlay ── */
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.48)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

/* ── Shipday logomark (three overlapping circles) ── */
function ShipdayMark() {
  return (
    <div style={{
      width: 28, height: 28, border: "1px solid #E3E4EB",
      borderRadius: 87.7215, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", position: "relative",
    }}>
      {/* inner 15.4×15.4 container centred */}
      <div style={{ position: "relative", width: 15.4, height: 15.4 }}>
        <div style={{ position: "absolute", width: 10.91, height: 10.91, left: 0,    top: 0,    background: "#01AD85", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 10.91, height: 10.91, left: 4.5,  top: 4.49, background: "#ABE571", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: 6.6,   height: 6.6,   left: 4.39, top: 4.41, background: "#008062", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

/* ── Gradient icon wrapper (28×28) ── */
function GradientIcon({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 28, height: 28, flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      /* icons rendered with the gradient fill color below */
    }}>
      {children}
    </div>
  );
}

/* ── Step 1: Marketing Manager intro ── */
function IntroStep({ onClose, onGetStarted }: { onClose: () => void; onGetStarted: () => void }) {
  /* gradient color used for all feature icons */
  const iconColor = "#00A374";

  return (
    <Overlay onClose={onClose}>
      <div style={{
        width: 1044, height: 683,
        display: "flex", flexDirection: "row", alignItems: "flex-start",
        borderRadius: 20, overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 24px 64px rgba(0,0,0,0.20)",
        position: "relative",
        /* absolute centering handled by Overlay flex */
      }}>

        {/* ────────────── LEFT PANEL ────────────── */}
        <div style={{
          width: 560, height: 683, flexShrink: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}>

          {/* Content: padding 36, gap 40 */}
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "flex-start",
            padding: 36, gap: 40,
            width: 560, flex: 1,
          }}>

            {/* Title group: gap 16 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, width: 488 }}>

              {/* auto_awesome gradient icon 28×28 */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="iconGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="1.08%" stopColor="#00A324" />
                    <stop offset="42.68%" stopColor="#00AD85" />
                  </linearGradient>
                </defs>
                <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 19L13.09 15.74L12 22L10.91 15.74L5 19L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z" fill="url(#iconGrad)" />
              </svg>

              {/* Text: gap 4 */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, width: 488 }}>
                <span style={{
                  width: 488, height: 32,
                  fontFamily: "Avenir, Inter, sans-serif",
                  fontWeight: 800, fontSize: 24, lineHeight: "32px",
                  letterSpacing: "-0.02em", color: "#0A0A0A",
                  display: "block",
                }}>
                  Shipday Marketing Manager
                </span>
                <span style={{
                  width: 488,
                  fontFamily: "Avenir, Inter, sans-serif",
                  fontWeight: 400, fontSize: 16, lineHeight: "22px",
                  color: "#404040", display: "block",
                }}>
                  Automate personalized SMS campaigns based on customer behavior.
                </span>
              </div>
            </div>

            {/* Features: gap 24 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 24, width: 488 }}>
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.label} style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 12, width: 488, minHeight: 46 }}>
                    {/* 28×28 gradient icon */}
                    <div style={{ width: 28, height: 28, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={20} color={iconColor} strokeWidth={1.8} />
                    </div>
                    {/* Text column */}
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: 448 }}>
                      <span style={{
                        fontFamily: "Avenir, Inter, sans-serif",
                        fontWeight: 800, fontSize: 16, lineHeight: "24px",
                        color: "#262626", display: "block",
                      }}>
                        {f.label}
                      </span>
                      <span style={{
                        fontFamily: "Avenir, Inter, sans-serif",
                        fontWeight: 350, fontSize: 16, lineHeight: "22px",
                        color: "#404040", display: "block",
                      }}>
                        {f.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inputs / CTA section: padding 36, 120px tall */}
          <div style={{
            display: "flex", flexDirection: "row", flexWrap: "wrap",
            alignItems: "flex-start", alignContent: "flex-start",
            padding: 36, gap: 10,
            width: 560, height: 120,
            background: "#FFFFFF",
            flexShrink: 0,
          }}>
            <button
              onClick={onGetStarted}
              style={{
                width: 488, height: 48,
                background: "#008062", border: "none", borderRadius: 8,
                cursor: "pointer", fontFamily: "Avenir, Inter, sans-serif",
                fontWeight: 500, fontSize: 16, lineHeight: "24px",
                color: "#FFFFFF",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              Get started
            </button>
          </div>
        </div>

        {/* ────────────── RIGHT PANEL ────────────── */}
        <div style={{
          flex: 1, height: 683,
          position: "relative", overflow: "hidden",
          /* Photo placeholder — swap url(image.png) here when available */
          background: "linear-gradient(160deg, #C4A882 0%, #B8967A 30%, #8B6F5E 60%, #5C4A40 100%)",
        }}>

          {/* Close button: 40×40, absolute top-right */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 24, right: 24, zIndex: 10,
              width: 40, height: 40, borderRadius: 99,
              background: "#FFFFFF", border: "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <X size={24} color="#404040" />
          </button>

          {/* SMS comment card: absolute, bottom 34, centred */}
          <div style={{
            position: "absolute",
            width: 386.88, height: 197.36,
            left: "calc(50% - 193.44px)",
            bottom: 34,
            display: "flex", flexDirection: "column",
            alignItems: "flex-start",
            padding: "20.7442px 16.5954px",
            gap: 21,
            background: "#FFFFFF",
            boxShadow: "0px -3.87148px 16.0501px rgba(51,51,51,0.04), 0px 11.6144px 23.2289px -5.35003px rgba(51,51,51,0.06)",
            borderRadius: 17.3249,
          }}>

            {/* Name + logo row */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12, width: 138, height: 28 }}>
              <ShipdayMark />
              <span style={{
                fontFamily: "Avenir, Inter, sans-serif",
                fontWeight: 500, fontSize: 18,
                lineHeight: "25px", color: "#0A0A0A",
                display: "flex", alignItems: "center",
              }}>
                Luigi&apos;s Pizza
              </span>
            </div>

            {/* Message bubble */}
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "flex-start",
              padding: 14.4374, gap: 8.3,
              width: 353.69, height: 106.87,
              background: "#F4F4F8",
              borderRadius: 11.5499,
            }}>
              <span style={{
                fontFamily: "Graphik, Inter, sans-serif",
                fontWeight: 400, fontSize: 17, lineHeight: "150%",
                letterSpacing: "-0.01em", color: "#262626",
                display: "block",
              }}>
                Hi Lucas, Enjoy 15% off your next order—only this weekend! Use code SAVE15 at checkout. 🍔
              </span>
            </div>
          </div>
        </div>

      </div>
    </Overlay>
  );
}

/* ── Step 2: Connect business information (full-screen) ── */
function BusinessInfoStep({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  const [orderLink,       setOrderLink]       = useState("");
  const [businessName,    setBusinessName]    = useState("");
  const [smsFrequency,    setSmsFrequency]    = useState("Once Per Week");
  const [tone,            setTone]            = useState<Tone>("Friendly");
  const [allowOfferCodes, setAllowOfferCodes] = useState(false);
  const [freqOpen,        setFreqOpen]        = useState(false);

  const freqOptions = ["Once Per Week", "Twice Per Week", "Once Per Month", "Twice Per Month"];

  const border      = "#E3E4EB";
  const bg          = "#FFFFFF";
  const bgBody      = "#F5F5F2";
  const bgPage      = "#F8F8F5";
  const green       = "#008062";
  const greenActive = "#03624C";
  const text        = "#0A0A0A";
  const textMuted   = "#525252";
  const textSec     = "#404040";

  const card: React.CSSProperties = {
    display: "flex", flexDirection: "column", gap: 16,
    padding: "20px 24px",
    border: `1px solid ${border}`, borderRadius: 12,
    background: bg,
  };

  const inputStyle: React.CSSProperties = {
    padding: "11px 14px", borderRadius: 8,
    border: `1px solid ${border}`, background: bg,
    fontSize: 15, fontWeight: 400, color: text,
    fontFamily: "inherit", outline: "none", width: "100%",
    boxSizing: "border-box",
  };

  const toneIcons: Record<Tone, React.ReactNode> = {
    Friendly: <Smile     size={22} color={tone === "Friendly" ? green : textMuted} strokeWidth={1.5} />,
    Casual:   <Smile     size={22} color={tone === "Casual"   ? green : textMuted} strokeWidth={1.5} />,
    Formal:   <Briefcase size={22} color={tone === "Formal"   ? green : textMuted} strokeWidth={1.5} />,
  };

  return (
    /* Full-screen, no dark overlay — it IS the screen */
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", flexDirection: "column",
      background: bgBody,
    }}>

      {/* ── White header ── */}
      <div style={{
        background: bg, borderBottom: `1px solid ${border}`,
        padding: "28px 40px",
        display: "flex", flexDirection: "column", gap: 6,
        position: "relative", flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 28, right: 32,
            background: "none", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 4,
          }}
        >
          <X size={20} color={textMuted} />
        </button>
        <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: text, margin: 0, lineHeight: "30px" }}>
          Connect your business information
        </h2>
        <p style={{ fontSize: 15, fontWeight: 400, color: textSec, margin: 0, lineHeight: "22px" }}>
          Enter the URL your customers will get to place their orders and your business name, and configure sms settings.
        </p>
      </div>

      {/* ── Scrollable gray body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px 48px" }}>
        <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Order link */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link2 size={18} color={text} strokeWidth={1.8} />
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>Order link</span>
            </div>
            <p style={{ fontSize: 14, color: textSec, margin: 0, lineHeight: "20px" }}>
              This link will be added to every SMS campaign so customers can place their orders.
            </p>
            <input
              type="url" value={orderLink}
              onChange={e => setOrderLink(e.target.value)}
              placeholder="E.g. https://yourrestaurant.com/order"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = green)}
              onBlur={e  => (e.target.style.borderColor = border)}
            />
          </div>

          {/* Business name */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Store size={18} color={text} strokeWidth={1.8} />
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>Business name</span>
            </div>
            <p style={{ fontSize: 14, color: textSec, margin: 0, lineHeight: "20px" }}>
              Enter your business name as it appears to customers.
            </p>
            <input
              type="text" value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="E.g. Joe's Pizza"
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = green)}
              onBlur={e  => (e.target.style.borderColor = border)}
            />
          </div>

          {/* SMS frequency */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <MessageSquare size={18} color={text} strokeWidth={1.8} />
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>SMS frequency per customer</span>
            </div>
            <p style={{ fontSize: 14, color: textSec, margin: 0, lineHeight: "20px" }}>
              Enter how often each customer should receive SMS messages
            </p>
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setFreqOpen(o => !o)}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${border}`, background: bg, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 15, color: text, outline: "none" }}
              >
                {smsFrequency}
                <ChevronDown size={16} color={textMuted} />
              </button>
              {freqOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20, background: bg, border: `1px solid ${border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
                  {freqOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setSmsFrequency(opt); setFreqOpen(false); }}
                      style={{ width: "100%", padding: "11px 14px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: opt === smsFrequency ? 600 : 400, color: opt === smsFrequency ? green : text, textAlign: "left", display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = bgPage}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
                    >
                      {opt}
                      {opt === smsFrequency && <Check size={14} color={green} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI message tone */}
          <div style={card}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <PenLine size={18} color={text} strokeWidth={1.8} />
              <span style={{ fontSize: 16, fontWeight: 700, color: text }}>AI Assisted Message Tone</span>
            </div>
            <p style={{ fontSize: 14, color: textSec, margin: 0, lineHeight: "20px" }}>
              Select the tone of the AI assisted campaign messages
            </p>
            <div style={{ display: "flex", flexDirection: "row", gap: 12 }}>
              {TONES.map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  style={{ flex: 1, padding: "16px 14px", border: `1.5px solid ${tone === t ? green : border}`, borderRadius: 10, background: bg, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, transition: "border-color 120ms ease" }}
                >
                  {toneIcons[t]}
                  <span style={{ fontSize: 14, fontWeight: 400, color: tone === t ? greenActive : text }}>
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Allow offer codes */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: text }}>Allow Using Offer Codes</span>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 14, padding: "14px 16px", border: `1px solid ${border}`, borderRadius: 12, background: bg }}>
              <button
                onClick={() => setAllowOfferCodes(v => !v)}
                style={{ width: 44, height: 26, borderRadius: 99, border: "none", background: allowOfferCodes ? green : "#D1D5DB", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 200ms ease" }}
              >
                <div style={{ position: "absolute", top: 3, left: allowOfferCodes ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.16)", transition: "left 200ms ease" }} />
              </button>
              <span style={{ fontSize: 14, color: textMuted }}>
                Allow agent to apply offer codes in AI-assisted SMS
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onContinue}
            style={{ width: "100%", padding: "14px 24px", background: green, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.01em", marginTop: 8 }}
          >
            Continue to configure AI marketing manager
          </button>

        </div>
      </div>
    </div>
  );
}

/* ── Exported two-step modal ── */
export default function AutomateModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  if (step === 1) return <IntroStep onClose={onClose} onGetStarted={() => setStep(2)} />;
  return <BusinessInfoStep onClose={onClose} onContinue={onClose} />;
}
