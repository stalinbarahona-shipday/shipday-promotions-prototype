"use client";

import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/Icon";

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */

type ToastData = { id: number; message: string; icon: string };

function Toast({ message, icon, onDone }: { message: string; icon: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // mount → slide in
    requestAnimationFrame(() => setVisible(true));
    const out  = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(onDone, 3300);
    return () => { clearTimeout(out); clearTimeout(done); };
  }, [onDone]);

  return (
    <div style={{
      display: "flex", flexDirection: "row", alignItems: "center", gap: 10,
      padding: "14px 18px",
      background: "#0A0A0A", borderRadius: 12,
      boxShadow: "0px 8px 24px rgba(0,0,0,0.18)",
      pointerEvents: "none",
      transition: "opacity 300ms ease, transform 300ms ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(12px)",
    }}>
      <Icon name={icon} size={20} color="#4ADE80" />
      <span style={{ fontSize: 15, fontWeight: 500, color: "#FFFFFF", whiteSpace: "nowrap" }}>
        {message}
      </span>
    </div>
  );
}

function ToastStack({ toasts, remove }: { toasts: ToastData[]; remove: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      pointerEvents: "none",
    }}>
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} icon={t.icon} onDone={() => remove(t.id)} />
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  let counter = 0;

  const show = useCallback((message: string, icon = "check_circle") => {
    const id = Date.now() + counter++;
    setToasts(prev => [...prev, { id, message, icon }]);
  }, []);

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, show, remove };
}

/* ══════════════════════════════════════════════
   FLYER EDITOR MODAL
══════════════════════════════════════════════ */

const colorThemes = [
  { id: "shipday", label: "Shipday", dark: "#005642", light: "#008062", qrBg: "#F6FEF9" },
  { id: "red",     label: "Red",     dark: "#991B1B", light: "#EF4444", qrBg: "#FEF2F2" },
  { id: "yellow",  label: "Yellow",  dark: "#92400E", light: "#F59E0B", qrBg: "#FFFBEB" },
  { id: "slate",   label: "Slate",   dark: "#1E293B", light: "#475569", qrBg: "#F1F5F9" },
];

function EditorField({
  label, placeholder, value, onChange, multiline = false,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%", padding: "8px 14px",
    border: `1px solid ${focused ? "#008062" : "#E8E8E4"}`,
    borderRadius: 9, outline: "none",
    fontSize: 16, fontWeight: 400, color: "#0A0A0A",
    lineHeight: "150%", fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 150ms ease",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 16, fontWeight: 500, color: "#262626", lineHeight: "140%" }}>{label}</span>
      {multiline ? (
        <textarea
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder} rows={3}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, resize: "none" }}
        />
      ) : (
        <input
          type="text" value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...base, height: 40 }}
        />
      )}
    </div>
  );
}

function FlyerLivePreview({
  offer, description, businessName, themeId, scanLabel,
}: {
  offer: string; description: string; businessName: string; themeId: string; scanLabel: string;
}) {
  const theme = colorThemes.find(t => t.id === themeId)!;
  return (
    <div style={{
      width: 400,
      background: "#FFFFFF",
      boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.05), 0px 20px 50px -12px rgba(0,0,0,0.15)",
      borderRadius: 10, overflow: "hidden",
      display: "flex", flexDirection: "column",
      transition: "box-shadow 200ms ease",
    }}>
      {/* Header */}
      <div style={{
        background: theme.light, height: 140,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 300ms ease",
      }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: "#FFFFFF", lineHeight: "56px", textAlign: "center" }}>
          {offer.trim() || "20% OFF"}
        </span>
      </div>

      {/* Text */}
      <div style={{ padding: "40px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em", textAlign: "center" }}>
          {businessName.trim() || "Your Business"}
        </span>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%", maxWidth: 320 }}>
          {description.trim() || "Use code SAVE20 at checkout to get 20% off your next order. Valid for orders over $25."}
        </span>
      </div>

      {/* QR section */}
      <div style={{ padding: "0 24px 24px", position: "relative" }}>
        {/* Floating badge */}
        <div style={{
          position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
          width: 56, height: 56,
          background: "#F4F4F8", border: "3px solid #FFFFFF",
          boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
          borderRadius: 99,
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: theme.light, transition: "background 300ms ease",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>S</span>
          </div>
        </div>
        <div style={{
          background: theme.qrBg, borderRadius: 12,
          padding: 16, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8,
          transition: "background 300ms ease",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#737373" }}>
            {scanLabel.trim() || "Scan to order"}
          </span>
          <Icon name="qr_code_2" size={140} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function FlyerEditorModal({
  flyerLabel, onClose, onToast,
}: {
  flyerLabel: string;
  onClose: () => void;
  onToast: (msg: string, icon?: string) => void;
}) {
  const [offer,       setOffer]       = useState("");
  const [description, setDescription] = useState("");
  const [redirectLink,setRedirectLink]= useState("");
  const [businessName,setBusinessName]= useState("");
  const [colorTheme,  setColorTheme]  = useState("shipday");
  const [exportSize,  setExportSize]  = useState("print");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onToast("Flyer downloaded!", "download");
    }, 1400);
  };

  const handleShare = async () => {
    const url = redirectLink.trim() || "https://shipday.com/flyer/promo";
    try {
      await navigator.clipboard.writeText(url);
      onToast("Link copied to clipboard", "link");
    } catch {
      onToast("Link copied to clipboard", "link");
    }
  };

  const scanLabel = redirectLink.trim()
    ? "Scan to visit link"
    : "Scan to order";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", flexDirection: "column", background: "#FFFFFF",
    }}>
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
        padding: "20px 32px", height: 98, flexShrink: 0,
        borderBottom: "1px solid #E8E8E4",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "32px" }}>
            {flyerLabel}
          </span>
          <span style={{ fontSize: 16, fontWeight: 400, color: "#404040", lineHeight: "24px" }}>
            Customize your flyer and download it when ready
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 40, height: 40,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#FFFFFF", border: "none", borderRadius: 99, cursor: "pointer",
          }}
        >
          <Icon name="close" size={24} color="#525252" />
        </button>
      </div>

      {/* ── Main ── */}
      <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div
          className="[&::-webkit-scrollbar]:hidden"
          style={{
            width: 480, flexShrink: 0,
            display: "flex", flexDirection: "column",
            background: "#FFFFFF", borderRight: "1px solid #E8E8E4",
            overflowY: "auto", scrollbarWidth: "none",
          }}
        >
          {/* Content */}
          <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24, borderBottom: "1px solid #E8E8E4" }}>
            <EditorField
              label="Offer"
              placeholder="e.g. 20% OFF"
              value={offer} onChange={setOffer}
            />
            <EditorField
              label="Description"
              placeholder="e.g. Use code SAVE20 at checkout to get 20% off your next order."
              value={description} onChange={setDescription} multiline
            />
            <EditorField
              label="Redirect link"
              placeholder="https://your-store.com/order"
              value={redirectLink} onChange={setRedirectLink}
            />
            <EditorField
              label="Business name"
              placeholder="e.g. Sunset Grocers"
              value={businessName} onChange={setBusinessName}
            />
          </div>

          {/* Color theme */}
          <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, borderBottom: "1px solid #E8E8E4" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#262626", lineHeight: "140%" }}>Color Theme</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              {colorThemes.map(t => {
                const sel = colorTheme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setColorTheme(t.id)}
                    style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}
                  >
                    <div style={{
                      height: 44, borderRadius: 6, overflow: "hidden",
                      border: sel ? "1.5px solid #01AD85" : "1.5px solid transparent",
                      outline: sel ? "2px solid #01AD85" : "2px solid transparent",
                      outlineOffset: 2,
                      transition: "outline 150ms ease, border 150ms ease",
                    }}>
                      <div style={{ height: "50%", background: t.dark }} />
                      <div style={{ height: "50%", background: t.light }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? "#262626" : "#404040", textAlign: "center", lineHeight: "140%" }}>
                      {t.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export size */}
          <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#262626", lineHeight: "140%" }}>Export Size</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              {[
                { id: "print",  label: "Print",  sub: "Letter / A4",  iconW: 18, iconH: 24 },
                { id: "social", label: "Social", sub: "1080 × 1080",  iconW: 22, iconH: 22 },
              ].map(opt => {
                const sel = exportSize === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => setExportSize(opt.id)}
                    style={{
                      flex: 1, height: 100, borderRadius: 9, cursor: "pointer",
                      padding: 13, display: "flex", flexDirection: "column", gap: 5,
                      background: sel ? "#EBFEF6" : "#FFFFFF",
                      border: sel ? "1.5px solid #01AD85" : "1.5px solid #E8E8E4",
                      transition: "background 150ms ease, border 150ms ease",
                    }}
                  >
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{
                        width: opt.iconW, height: opt.iconH,
                        background: sel ? "#008062" : "#D4D4D4",
                        borderRadius: 2, transition: "background 150ms ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: "#0A0A0A", lineHeight: "140%" }}>{opt.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 400, color: "#737373", lineHeight: "140%" }}>{opt.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 40, background: "#F8F8F5", position: "relative", overflow: "hidden",
        }}>
          {/* Dot grid */}
          <div style={{
            position: "absolute", inset: 0, opacity: 0.5,
            backgroundImage: "radial-gradient(circle, #BFBFB8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <FlyerLivePreview
              offer={offer}
              description={description}
              businessName={businessName}
              themeId={colorTheme}
              scanLabel={scanLabel}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        display: "flex", flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
        padding: "20px 32px", height: 88, flexShrink: 0,
        borderTop: "1px solid #E8E8E4", background: "#FFFFFF",
      }}>
        <button
          onClick={onClose}
          style={{
            padding: "12px 20px", height: 48,
            background: "#FFFFFF", border: "1px solid #E8E8E4",
            borderRadius: 8, cursor: "pointer",
            fontSize: 16, fontWeight: 500, color: "#262626",
            fontFamily: "inherit",
          }}
        >
          Cancel
        </button>

        <div style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center" }}>
          <button
            onClick={handleShare}
            style={{
              display: "flex", flexDirection: "row", alignItems: "center",
              padding: "12px 20px 12px 16px", gap: 8,
              height: 48, background: "#FFFFFF",
              border: "1px solid #E8E8E4", borderRadius: 8, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon name="share" size={24} color="#525252" />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#262626" }}>Share</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            style={{
              display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center",
              padding: "12px 24px 12px 20px", gap: 8,
              height: 48,
              background: downloading ? "#E8E8E4" : "#008062",
              border: "none", borderRadius: 8,
              cursor: downloading ? "default" : "pointer",
              fontFamily: "inherit",
              transition: "background 200ms ease",
            }}
          >
            {downloading ? (
              <>
                <DownloadSpinner />
                <span style={{ fontSize: 16, fontWeight: 500, color: "#737373" }}>Preparing…</span>
              </>
            ) : (
              <>
                <Icon name="download" size={24} color="#FFFFFF" />
                <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF" }}>Download</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DownloadSpinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ animation: "spin 800ms linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="10" cy="10" r="8" fill="none" stroke="#B0B0B0" strokeWidth="2" />
      <path d="M10 2 A8 8 0 0 1 18 10" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   TAB 1 — ALL MATERIALS (QR Code cards)
══════════════════════════════════════════════ */

function MaterialCard({
  title, description, linkLabel, linkPlaceholder,
  formatLabel, qrOptionLabel, imageOptionLabel,
}: {
  title: string; description: string; linkLabel: string; linkPlaceholder: string;
  formatLabel: string; qrOptionLabel: string; imageOptionLabel: string;
}) {
  const [format, setFormat] = useState<"qr" | "image">("qr");

  return (
    <div style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 16, overflow: "hidden" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 24, gap: 32, borderBottom: "1px solid #E8E8E4" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "140%" }}>{title}</span>
          <span style={{ fontSize: 16, fontWeight: 350, color: "#404040", lineHeight: "150%" }}>{description}</span>
        </div>
        <button style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "12px 20px 12px 16px", gap: 8, height: 48, background: "#008062", border: "none", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>
          <Icon name="download" size={24} color="#FFFFFF" />
          <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "24px" }}>Download</span>
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", padding: 24, gap: 56 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0px", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "24px" }}>{linkLabel}</span>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 12, background: "#F7F7FA", borderRadius: 10, height: 48 }}>
              <span style={{ fontSize: 16, fontWeight: 400, color: "#737373", letterSpacing: "0.02em" }}>{linkPlaceholder}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "24px" }}>{formatLabel}</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
              <div onClick={() => setFormat("qr")} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 10, height: 56, background: format === "qr" ? "#EBFEF6" : "#FFFFFF", border: `1px solid ${format === "qr" ? "#01AD85" : "#E8E8E4"}`, borderRadius: 12, cursor: "pointer" }}>
                <Icon name="qr_code_2" size={24} color="#525252" />
                <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A" }}>{qrOptionLabel}</span>
              </div>
              <div onClick={() => setFormat("image")} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 10, height: 56, background: format === "image" ? "#EBFEF6" : "#FFFFFF", border: `1px solid ${format === "image" ? "#01AD85" : "#E8E8E4"}`, borderRadius: 12, cursor: "pointer" }}>
                <Icon name="image" size={24} color="#525252" />
                <span style={{ fontSize: 16, fontWeight: 500, color: "#0A0A0A" }}>{imageOptionLabel}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 252, height: 252, background: "#F5F5F5", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="qr_code_2" size={180} color="#D4D4D4" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB 2 — FLYERS
══════════════════════════════════════════════ */

function PromotionFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      <div style={{ background: "linear-gradient(96.98deg, #23232E 0%, #353545 100%)", padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>20% OFF</span>
      </div>
      <div style={{ padding: "20px 16px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11.7, fontWeight: 600, color: "#0A0A0A" }}>Sunset Grocers</span>
          <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%" }}>Use code SAVE20 at checkout to get 20% off your next order. Valid for orders over $25.</span>
        </div>
        <div style={{ background: "#008062", borderRadius: 999, padding: "4px 13px" }}>
          <span style={{ fontSize: 9.1, fontWeight: 500, color: "#FFFFFF" }}>Order Now →</span>
        </div>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373" }}>Scan to order</span>
          <Icon name="qr_code_2" size={52} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function MenuFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      <div style={{ height: 104, background: "linear-gradient(135deg, #E8F4F0 0%, #C6E6DC 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="restaurant" size={40} color="#008062" />
      </div>
      <div style={{ background: "#FFFFFF", padding: "20px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em" }}>New Sushi Menu</span>
        <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%" }}>Try our new handcrafted sushi rolls, made fresh daily with premium ingredients.</span>
      </div>
      <div style={{ background: "#EBFEF6", padding: "10px 16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 7.8, padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: "100%" }}>
          <span style={{ fontSize: 8.45, fontWeight: 400, color: "#525252" }}>Scan to view our menu</span>
          <Icon name="qr_code_2" size={72} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function ReviewFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      <div style={{ background: "linear-gradient(96.98deg, #A16207 0%, #CA8A04 100%)", padding: "22px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 15.6, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: "130%" }}>Thank you for your order!</span>
      </div>
      <div style={{ padding: "20px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11.7, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em" }}>How was your experience?</span>
          <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center" }}>We'd love to hear your feedback.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 7.8 }}>
          {[0,1,2,3,4].map(i => <span key={i} style={{ fontSize: 15.6, color: "#EFB841" }}>★</span>)}
        </div>
      </div>
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373" }}>Scan here!</span>
          <Icon name="qr_code_2" size={78} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

const flyerTemplates = [
  {
    id: "promotion",
    preview: <PromotionFlyerPreview />,
    previewBg: "#F9FAFC",
    label: "Promotion flyer",
    description: "Drive repeat orders with a discount code your customers can scan and redeem instantly.",
  },
  {
    id: "menu",
    preview: <MenuFlyerPreview />,
    previewBg: "#FFFFFF",
    label: "Menu spotlight",
    description: "Announce new menu items or seasonal specials with a shareable flyer and QR code.",
  },
  {
    id: "review",
    preview: <ReviewFlyerPreview />,
    previewBg: "#FFFFFF",
    label: "Review collector",
    description: "Encourage customers to leave a review after delivery with a thank-you flyer.",
  },
];

function FlyerCard({
  template, onCreate,
}: {
  template: typeof flyerTemplates[0];
  onCreate: () => void;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ height: 200, background: template.previewBg, borderBottom: "1px solid #E8E8E4", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 24, transform: "scale(0.72)", transformOrigin: "top center" }}>
          {template.preview}
        </div>
      </div>
      <div style={{ padding: "20px 24px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", lineHeight: "150%" }}>{template.label}</span>
        <span style={{ fontSize: 15, fontWeight: 400, color: "#404040", lineHeight: "140%" }}>{template.description}</span>
      </div>
      <div style={{ padding: "4px 24px 24px", display: "flex", flexDirection: "row", gap: 10 }}>
        <button
          onClick={onCreate}
          style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "10px 20px", gap: 6, height: 44, background: "#008062", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
        >
          <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "24px" }}>Create</span>
        </button>
        <button style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>
          <Icon name="share" size={20} color="#525252" />
        </button>
      </div>
    </div>
  );
}

function FlyersContent({ onToast }: { onToast: (msg: string, icon?: string) => void }) {
  const [editorFlyer, setEditorFlyer] = useState<typeof flyerTemplates[0] | null>(null);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: "#FFFFFF" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "140%" }}>Create a new flyer</span>
          <span style={{ fontSize: 16, fontWeight: 350, color: "#404040", lineHeight: "150%" }}>Choose a template and download a ready-to-print or shareable flyer for your business</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {flyerTemplates.map(t => (
            <FlyerCard key={t.id} template={t} onCreate={() => setEditorFlyer(t)} />
          ))}
        </div>
      </div>

      {editorFlyer && (
        <FlyerEditorModal
          flyerLabel={editorFlyer.label}
          onClose={() => setEditorFlyer(null)}
          onToast={onToast}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */

const tabs = [
  { id: "all",    label: "All materials" },
  { id: "flyers", label: "Flyers" },
];

export default function MarketingMaterials() {
  const [activeTab, setActiveTab] = useState("all");
  const { toasts, show, remove } = useToast();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: "#FFFFFF" }}>

        {/* Page header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "32px 64px 0px", gap: 20, borderBottom: "1px solid #E8E8E4" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "40px", margin: 0 }}>
              Marketing materials
            </h1>
            <span style={{ fontSize: 16, fontWeight: 350, color: "#404040", lineHeight: "150%" }}>
              Generate ready-to-use assets to grow your reviews and subscriber list
            </span>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
            {tabs.map(tab => {
              const isActive = tab.id === activeTab;
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 42, borderBottom: isActive ? "2px solid #008062" : "2px solid transparent", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 400, color: isActive ? "#03624C" : "#404040", letterSpacing: isActive ? "0" : "-0.02em", whiteSpace: "nowrap" }}>
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        {activeTab === "all" ? (
          <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: "#FFFFFF" }}>
            <MaterialCard
              title="Collect reviews by QR Code"
              description="Share a QR code or image that takes customers directly to your review page"
              linkLabel="Review page link"
              linkPlaceholder="https://g.page/r/your-business/review"
              formatLabel="Format"
              qrOptionLabel="QR Code"
              imageOptionLabel="Image"
            />
            <MaterialCard
              title="Collect SMS marketing subscribers"
              description="Let customers opt in to SMS promotions by scanning a code or clicking a link"
              linkLabel="Opt-in link"
              linkPlaceholder="https://shipday.com/sms/subscribe/your-store"
              formatLabel="Format"
              qrOptionLabel="QR Code"
              imageOptionLabel="Image"
            />
          </div>
        ) : (
          <FlyersContent onToast={show} />
        )}
      </div>

      <ToastStack toasts={toasts} remove={remove} />
    </>
  );
}
