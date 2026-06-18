"use client";

import { useState } from "react";
import { X, MessageCircleHeart, Gift, Tag, Zap, UserCheck } from "lucide-react";

const C = {
  text:          "#0A0A0A",
  textSecondary: "#404040",
  textMuted:     "#525252",
  border:        "#E3E4EB",
  bg:            "#FFFFFF",
  bgPage:        "#F8F8F5",
  bgGreen:       "#EBFEF6",
  green:         "#008062",
  greenActive:   "#03624C",
};

/* ── Step 1: Enable collecting consent ── */
function ConsentStep({ onClose, onEnable }: { onClose: () => void; onEnable: () => void }) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.48)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: 520, display: "flex", flexDirection: "column", borderRadius: 20, background: C.bg, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "32px 32px 0", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color={C.textMuted} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.bgGreen, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <MessageCircleHeart size={22} color={C.green} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: 0, lineHeight: "30px" }}>
              Enable collecting consent
            </h2>
          </div>
          <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, margin: 0, lineHeight: "22px" }}>
            This will display an invitation on your customers&apos; order tracking page so they can subscribe to receive promotions via SMS.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: "28px 32px 32px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onEnable}
            style={{ padding: "12px 32px", background: C.green, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Phone mockup ── */
function PhoneMockup() {
  return (
    <div style={{
      width: 280, flexShrink: 0,
      border: "2px solid #E3E4EB",
      borderRadius: 36,
      overflow: "hidden",
      background: C.bg,
      boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    }}>
      {/* Status bar */}
      <div style={{ background: "#F9FAFC", padding: "10px 16px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: C.text }}>09:41</span>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {/* Signal bars */}
          <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="6" width="2.5" height="4" fill="#0A0A0A" rx="0.5"/><rect x="3.5" y="4" width="2.5" height="6" fill="#0A0A0A" rx="0.5"/><rect x="7" y="2" width="2.5" height="8" fill="#0A0A0A" rx="0.5"/><rect x="10.5" y="0" width="2.5" height="10" fill="#0A0A0A" rx="0.5"/></svg>
          {/* Wifi */}
          <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 8.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill="#0A0A0A"/><path d="M4.5 6.5C5.2 5.8 6 5.5 7 5.5s1.8.3 2.5 1" stroke="#0A0A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/><path d="M2 4C3.3 2.7 5 2 7 2s3.7.7 5 2" stroke="#0A0A0A" strokeWidth="1.2" fill="none" strokeLinecap="round"/></svg>
          {/* Battery */}
          <svg width="18" height="10" viewBox="0 0 18 10"><rect x="0" y="1" width="15" height="8" rx="2" stroke="#0A0A0A" strokeWidth="1" fill="none"/><rect x="1" y="2" width="11" height="6" rx="1" fill="#0A0A0A"/><path d="M16 3.5v3" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </div>
      </div>

      {/* URL bar */}
      <div style={{ background: "#F2F2F7", margin: "4px 8px", borderRadius: 8, padding: "4px 10px", textAlign: "center" }}>
        <span style={{ fontSize: 11, color: C.textMuted }}>ordertracking.io</span>
      </div>

      {/* Map area */}
      <div style={{ height: 160, background: "linear-gradient(180deg, #C8D8C0 0%, #A8C0A0 40%, #B0C8B0 100%)", position: "relative", display: "flex", alignItems: "flex-start", padding: "8px 10px" }}>
        {/* Fake map roads */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.4 }}>
          <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 1, background: "#8FA88F" }} />
          <div style={{ position: "absolute", top: 80, left: 0, right: 0, height: 1, background: "#8FA88F" }} />
          <div style={{ position: "absolute", top: 120, left: 0, right: 0, height: 1, background: "#8FA88F" }} />
          <div style={{ position: "absolute", left: 60, top: 0, bottom: 0, width: 1, background: "#8FA88F" }} />
          <div style={{ position: "absolute", left: 140, top: 0, bottom: 0, width: 1, background: "#8FA88F" }} />
          <div style={{ position: "absolute", left: 200, top: 0, bottom: 0, width: 1, background: "#8FA88F" }} />
        </div>
        {/* Restaurant header */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.95)", borderRadius: 8, padding: "5px 8px", zIndex: 1 }}>
          <div style={{ width: 18, height: 18, borderRadius: 4, background: "#C8352A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>I</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.text }}>Little Italy Ristorante</span>
        </div>
        {/* Map pin */}
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", width: 24, height: 24, borderRadius: "50%", background: C.green, border: "3px solid #fff", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
      </div>

      {/* Subscription widget */}
      <div style={{ background: C.bg, padding: "0 0 12px" }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 12px 4px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#525252" strokeWidth="2" strokeLinecap="round"><polyline points="18 15 12 9 6 15" /></svg>
        </div>

        {/* Icon + heading */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "0 16px 10px" }}>
          <span style={{ fontSize: 28 }}>🎁</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text, textAlign: "center" }}>Get exclusive deals</span>
          <span style={{ fontSize: 10, color: C.textMuted, textAlign: "center" }}>from Little Italy Ristorante</span>
        </div>

        {/* Bullet items */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 14px 12px" }}>
          {[
            { icon: "🎫", text: "Special deals on your favorite dishes" },
            { icon: "⚡", text: "Made for loyal customers" },
            { icon: "🔕", text: "Unsubscribe anytime" },
          ].map(item => (
            <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12 }}>{item.icon}</span>
              <span style={{ fontSize: 10, color: C.textSecondary }}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Subscribe button */}
        <div style={{ padding: "0 14px 8px" }}>
          <div style={{ background: "#171717", borderRadius: 8, padding: "10px", textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Subscribe now</span>
          </div>
        </div>

        {/* Fine print */}
        <div style={{ padding: "0 14px" }}>
          <span style={{ fontSize: 8.5, color: C.textMuted, lineHeight: "1.4", display: "block", textAlign: "center" }}>
            By subscribing, you consent to receive automated marketing text messages. Reply stop to opt out.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2: Set campaign preferences ── */
type Preference = "Subtle" | "Balanced" | "Prominent";

const OPTIONS: { value: Preference; desc: string }[] = [
  { value: "Subtle",    desc: "Banner only, soft customer experience." },
  { value: "Balanced",  desc: "Occasional pop-ups, moderate visibility." },
  { value: "Prominent", desc: "Banners + pop-ups, maximum impact." },
];

function PreferencesStep({ onClose, onStart }: { onClose: () => void; onStart: () => void }) {
  const [selected, setSelected] = useState<Preference>("Subtle");
  const [welcomeOffer, setWelcomeOffer] = useState(false);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.48)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: 1000, display: "flex", flexDirection: "column",
        borderRadius: 20, background: C.bg,
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        overflow: "hidden", maxHeight: "90vh",
      }}>

        {/* Header */}
        <div style={{ padding: "36px 40px 28px", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 28, right: 28, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={20} color={C.textMuted} />
          </button>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: "0 0 6px", lineHeight: "32px" }}>
            Set your campaign preferences
          </h2>
          <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, margin: 0, lineHeight: "22px" }}>
            Choose how your promotional campaigns will appear in the tracking page.
          </p>
        </div>

        {/* Body: two columns */}
        <div style={{ display: "flex", flexDirection: "row", padding: "0 40px 32px", gap: 48, alignItems: "flex-start" }}>

          {/* Left: options + toggle */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
            {OPTIONS.map(opt => {
              const isSelected = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelected(opt.value)}
                  style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    padding: "20px 24px",
                    border: `1.5px solid ${isSelected ? C.green : C.border}`,
                    borderRadius: 12,
                    background: C.bg,
                    cursor: "pointer", fontFamily: "inherit",
                    textAlign: "left", gap: 16,
                    transition: "border-color 120ms ease",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", fontSize: 17, fontWeight: 700, color: C.text, lineHeight: "24px" }}>
                      {opt.value}
                    </span>
                    <span style={{ display: "block", fontSize: 14, fontWeight: 400, color: C.textSecondary, lineHeight: "20px", marginTop: 2 }}>
                      {opt.desc}
                    </span>
                  </div>
                  {/* Radio button */}
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    border: `2px solid ${isSelected ? C.green : "#D1D5DB"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: C.bg,
                  }}>
                    {isSelected && (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.green }} />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Enable welcome offer toggle */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
              <span style={{ fontSize: 17, fontWeight: 500, color: C.text }}>Enable welcome offer</span>
              <button
                onClick={() => setWelcomeOffer(v => !v)}
                style={{ width: 48, height: 28, borderRadius: 99, border: "none", background: welcomeOffer ? C.green : "#D1D5DB", cursor: "pointer", position: "relative", transition: "background 200ms ease", flexShrink: 0 }}
              >
                <div style={{ position: "absolute", top: 3, left: welcomeOffer ? 23 : 3, width: 22, height: 22, borderRadius: "50%", background: C.bg, boxShadow: "0 1px 4px rgba(0,0,0,0.18)", transition: "left 200ms ease" }} />
              </button>
            </div>
          </div>

          {/* Right: phone preview */}
          <PhoneMockup />
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 40px 32px", display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onStart}
            style={{ padding: "13px 36px", background: C.green, border: "none", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 16, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.01em" }}
          >
            Start collecting
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Exported two-step modal ── */
export default function SubscriberModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  if (step === 1) return <ConsentStep onClose={onClose} onEnable={() => setStep(2)} />;
  return <PreferencesStep onClose={onClose} onStart={onClose} />;
}
