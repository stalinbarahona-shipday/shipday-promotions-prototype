"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Icon from "@/components/ui/Icon";
import { useTheme, useThemeToggle } from "@/components/ThemeContext";

/* ══════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════ */

type ToastData = { id: number; message: string; icon: string };

function Toast({ message, onDone }: { message: string; icon: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const out  = setTimeout(() => setVisible(false), 2800);
    const done = setTimeout(onDone, 3300);
    return () => { clearTimeout(out); clearTimeout(done); };
  }, [onDone]);
  return (
    <div style={{
      display: "flex", flexDirection: "row", alignItems: "center", gap: 10,
      padding: "14px 18px", background: "#0A0A0A", borderRadius: 12,
      boxShadow: "0px 8px 24px rgba(0,0,0,0.18)",
      transition: "opacity 300ms ease, transform 300ms ease",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(-12px)",
    }}>
      <Icon name="check_circle" size={24} color="#4ADE80" />
      <span style={{ fontSize: 15, fontWeight: 500, color: "#FFFFFF", whiteSpace: "nowrap" }}>{message}</span>
      <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", marginLeft: 4 }}>
        <Icon name="close" size={24} color="#FFFFFF" />
      </button>
    </div>
  );
}

function ToastStack({ toasts, remove }: { toasts: ToastData[]; remove: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div style={{
      position: "fixed", top: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center",
      gap: 10, pointerEvents: "none",
    }}>
      {toasts.map(t => <Toast key={t.id} message={t.message} icon={t.icon} onDone={() => remove(t.id)} />)}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const counterRef = useRef(0);
  const show = useCallback((message: string, icon = "check_circle") => {
    const id = Date.now() + counterRef.current++;
    setToasts(prev => [...prev, { id, message, icon }]);
  }, []);
  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return { toasts, show, remove };
}

function DownloadSpinner() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" className="animate-spin">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#B0B0B0" strokeWidth="2" />
      <path d="M10 2 A8 8 0 0 1 18 10" fill="none" stroke="#737373" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   FLYER EDITOR — SHARED PRIMITIVES
══════════════════════════════════════════════ */

const colorThemes = [
  { id: "shipday", label: "Shipday", bg: "#008062",  gradient: undefined, dark: "#005642", light: "#008062", qrBg: "#F6FEF9" },
  { id: "red",     label: "Red",     bg: undefined,   gradient: "linear-gradient(96.98deg, #B32318 0%, #D92D20 100%)", dark: "#B32318", light: "#D92D20", qrBg: "#FEF3F2" },
  { id: "yellow",  label: "Yellow",  bg: undefined,   gradient: "linear-gradient(96.98deg, #A16207 0%, #CA8A04 100%)", dark: "#A16207", light: "#CA8A04", qrBg: "#FEFCE8" },
  { id: "slate",   label: "Slate",   bg: undefined,   gradient: "linear-gradient(96.98deg, #23232E 0%, #353545 100%)", dark: "#23232E", light: "#353545", qrBg: "#F4F4F8" },
];

type FieldDef = { id: string; label: string; placeholder: string; multiline?: boolean };

function EditorField({
  label, placeholder, value, onChange, multiline = false,
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const base: React.CSSProperties = {
    width: "100%", padding: "8px 14px",
    border: `1px solid ${focused ? t.accent : t.border}`,
    borderRadius: 9, outline: "none",
    fontSize: 16, fontWeight: 400, color: t.text,
    background: t.inputBg,
    lineHeight: "150%", fontFamily: "inherit",
    boxSizing: "border-box", transition: "border-color 150ms ease, background 200ms ease, color 200ms ease",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: "140%" }}>{label}</span>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, resize: "none" }} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, height: 40 }} />
      }
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLYER EDITOR — PER-TEMPLATE FIELD CONFIGS
══════════════════════════════════════════════ */

const templateFields: Record<string, FieldDef[]> = {
  promotion: [
    { id: "offer",        label: "Offer",         placeholder: "e.g. 20% OFF" },
    { id: "description",  label: "Description",   placeholder: "e.g. Use code SAVE20 at checkout to get 20% off your next order.", multiline: true },
    { id: "redirectLink", label: "Redirect link",  placeholder: "https://your-store.com/order" },
    { id: "businessName", label: "Business name",  placeholder: "e.g. Sunset Grocers" },
  ],
  menu: [
    { id: "itemName",     label: "Item or menu name", placeholder: "e.g. New Sushi Menu" },
    { id: "description",  label: "Description",       placeholder: "e.g. Try our new handcrafted sushi rolls, made fresh daily.", multiline: true },
    { id: "redirectLink", label: "Redirect link",      placeholder: "https://your-store.com/menu" },
    { id: "businessName", label: "Business name",      placeholder: "e.g. Sunset Grocers" },
  ],
  review: [
    { id: "businessName", label: "Business name", placeholder: "e.g. Sunset Grocers" },
    { id: "redirectLink", label: "Review page link", placeholder: "https://g.page/r/your-business/review" },
  ],
};

/* ══════════════════════════════════════════════
   FLYER EDITOR — PER-TEMPLATE LIVE PREVIEWS
══════════════════════════════════════════════ */

function BrandAvatar({ size = 56 }: { size?: number }) {
  const s = size;
  const inner = s * (48 / 56);
  const circle = inner * (18.7 / 26.4);
  const offset = inner * (7.72 / 26.4);
  return (
    <div style={{ width: s, height: s, borderRadius: 99, background: "#F4F4F8", border: "3px solid #FFFFFF", boxShadow: "0px 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: inner, height: inner, borderRadius: 132, position: "relative" }}>
        <div style={{ position: "absolute", width: circle, height: circle, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: circle, height: circle, left: offset, top: offset, background: "#ABE571", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: circle * 0.6, height: circle * 0.6, left: inner * (7.53 / 26.4), top: inner * (7.52 / 26.4), background: "#008062", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

function LogoOrAvatar({ logo, size = 56 }: { logo?: string | null; size?: number }) {
  if (logo) {
    return (
      <div style={{ width: size, height: size, borderRadius: 99, background: "#F4F4F8", border: "3px solid #FFFFFF", boxShadow: "0px 2px 8px rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return <BrandAvatar size={size} />;
}

function themeBackground(theme: typeof colorThemes[0]) {
  return theme.gradient ?? theme.bg ?? theme.light;
}

type PreviewProps = { fields: Record<string, string>; themeId: string; coverPhoto?: string | null; logo?: string | null };

function PromotionLivePreview({ fields, themeId, logo }: PreviewProps) {
  const theme = colorThemes.find(t => t.id === themeId)!;
  const scanLabel = fields.redirectLink?.trim() ? "Scan to visit link" : "Scan to order";
  return (
    <div style={{ width: 400, minHeight: 480, background: "#FFFFFF", boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.05), 0px 20px 50px -12px rgba(0,0,0,0.15)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ background: themeBackground(theme), height: 140, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 300ms ease" }}>
        <span style={{ fontSize: 40, fontWeight: 700, color: "#FFFFFF", lineHeight: "56px", textAlign: "center" }}>
          {fields.offer?.trim() || "20% OFF"}
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
        <div style={{ padding: "40px 24px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em", textAlign: "center" }}>
            {fields.businessName?.trim() || "Your Business"}
          </span>
          <span style={{ fontSize: 14, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%", maxWidth: 352 }}>
            {fields.description?.trim() || "Use code SAVE20 at checkout to get 20% off your next order. Valid for orders over $25."}
          </span>
        </div>
        <div style={{ padding: "0 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ background: theme.qrBg, borderRadius: 12, padding: 16, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 300ms ease" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#737373" }}>{scanLabel}</span>
            <Icon name="qr_code_2" size={120} color="#C8C8C0" />
          </div>
        </div>
        <div style={{ position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <LogoOrAvatar logo={logo} />
        </div>
      </div>
    </div>
  );
}

function MenuLivePreview({ fields, themeId, coverPhoto, logo }: PreviewProps) {
  const theme = colorThemes.find(t => t.id === themeId)!;
  const scanLabel = fields.redirectLink?.trim() ? "Scan to visit link" : "Scan to view our menu";
  return (
    <div style={{ width: 400, minHeight: 480, background: "#FFFFFF", boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.05), 0px 20px 50px -12px rgba(0,0,0,0.15)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
      {/* Photo header */}
      <div style={{ height: 160, background: coverPhoto ? `url(${coverPhoto}) center/cover no-repeat` : "linear-gradient(135deg, #E8E8E4 0%, #D4D4D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", flexShrink: 0 }}>
        {!coverPhoto && <Icon name="add_photo_alternate" size={48} color="rgba(255,255,255,0.6)" />}
        <div style={{ position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <LogoOrAvatar logo={logo} />
        </div>
      </div>
      {/* Item name + description */}
      <div style={{ padding: "40px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
        <span style={{ fontSize: 20, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em", textAlign: "center", lineHeight: "140%" }}>
          {fields.itemName?.trim() || "New Sushi Menu"}
        </span>
        <span style={{ fontSize: 14, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%", maxWidth: 352 }}>
          {fields.description?.trim() || "Try our new handcrafted sushi rolls, made fresh daily with premium ingredients."}
        </span>
      </div>
      {/* QR section */}
      <div style={{ padding: "0 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: theme.qrBg, borderRadius: 12, padding: "18px 16px 16px", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 300ms ease" }}>
          <span style={{ fontSize: 13, fontWeight: 400, color: "#525252" }}>{scanLabel}</span>
          <Icon name="qr_code_2" size={112} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function ReviewLivePreview({ fields, themeId }: PreviewProps) { // logo not used in review
  const theme = colorThemes.find(t => t.id === themeId)!;
  const scanLabel = fields.redirectLink?.trim() ? "Scan to leave a review" : "Scan here!";
  return (
    <div style={{ width: 400, minHeight: 480, background: "#FFFFFF", boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.05), 0px 20px 50px -12px rgba(0,0,0,0.15)", borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: themeBackground(theme), padding: "36px 32px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "background 300ms ease" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", textAlign: "center", lineHeight: "130%" }}>
          Thank you for your order!
        </span>
        {fields.businessName?.trim() && (
          <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
            from {fields.businessName}
          </span>
        )}
      </div>
      {/* Body */}
      <div style={{ padding: "32px 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em", textAlign: "center" }}>
            How was your experience?
          </span>
          <span style={{ fontSize: 14, fontWeight: 400, color: "#525252", textAlign: "center" }}>
            We'd love to hear your feedback.
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
          {[0,1,2,3,4].map(i => <span key={i} style={{ fontSize: 28, color: "#EFB841" }}>★</span>)}
        </div>
      </div>
      {/* QR section */}
      <div style={{ padding: "0 24px 24px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ background: theme.qrBg, borderRadius: 12, padding: 16, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, transition: "background 300ms ease" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#737373" }}>{scanLabel}</span>
          <Icon name="qr_code_2" size={120} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function EditorPreview({ templateId, fields, themeId, coverPhoto, logo }: { templateId: string; fields: Record<string, string>; themeId: string; coverPhoto?: string | null; logo?: string | null }) {
  if (templateId === "menu")   return <MenuLivePreview   fields={fields} themeId={themeId} coverPhoto={coverPhoto} logo={logo} />;
  if (templateId === "review") return <ReviewLivePreview fields={fields} themeId={themeId} logo={logo} />;
  return <PromotionLivePreview fields={fields} themeId={themeId} logo={logo} />;
}

/* ══════════════════════════════════════════════
   FLYER EDITOR MODAL
══════════════════════════════════════════════ */

type FlyerTemplate = { id: string; label: string; description: string; preview: React.ReactNode; previewBg: string };

type SavedFlyer = {
  id: number;
  templateId: string;
  templateLabel: string;
  title: string;
  fields: Record<string, string>;
  themeId: string;
  exportSize: string;
  createdAt: Date;
};

function FlyerEditorModal({
  template, onClose, onToast, onSave, initialFields, initialTheme, initialExportSize,
}: {
  template: FlyerTemplate;
  onClose: () => void;
  onToast: (msg: string, icon?: string) => void;
  onSave?: (fields: Record<string, string>, themeId: string, exportSize: string) => void;
  initialFields?: Record<string, string>;
  initialTheme?: string;
  initialExportSize?: string;
}) {
  const t = useTheme();
  const fieldDefs = templateFields[template.id] ?? templateFields.promotion;
  const [fields,     setFields]     = useState<Record<string, string>>(initialFields ?? {});
  const [colorTheme, setColorTheme] = useState(initialTheme ?? "shipday");
  const [exportSize, setExportSize] = useState(initialExportSize ?? "print");
  const [downloading,setDownloading]= useState(false);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [logo, setLogo]             = useState<string | null>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);
  const logoRef       = useRef<HTMLInputElement>(null);

  const setField = (id: string, val: string) => setFields(prev => ({ ...prev, [id]: val }));

  const hasContent = fieldDefs.some(f => fields[f.id]?.trim());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setter(url);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !downloading) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, downloading]);

  const handleSaveAndDownload = () => {
    if (downloading || !hasContent) return;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      onSave?.(fields, colorTheme, exportSize);
      onToast("Flyer saved & downloaded!", "check_circle");
      onClose();
    }, 1400);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", background: t.bg, transition: "background 200ms ease" }}>

      {/* ── Top bar ── */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", height: 98, flexShrink: 0, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "32px" }}>{template.label}</span>
          <span style={{ fontSize: 16, fontWeight: 400, color: t.textSecondary, lineHeight: "24px" }}>Customize your flyer and download it when ready</span>
        </div>
        <button onClick={onClose} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", borderRadius: 99, cursor: "pointer" }}>
          <Icon name="close" size={24} color={t.textMuted} />
        </button>
      </div>

      {/* ── Main ── */}
      <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>

        {/* LEFT PANEL */}
        <div className="[&::-webkit-scrollbar]:hidden" style={{ width: 480, flexShrink: 0, display: "flex", flexDirection: "column", background: t.bg, borderRight: `1px solid ${t.border}`, overflowY: "auto", scrollbarWidth: "none", transition: "background 200ms ease" }}>

          {/* Content fields */}
          <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 24, borderBottom: `1px solid ${t.border}` }}>
            {fieldDefs.map(f => (
              <EditorField
                key={f.id}
                label={f.label}
                placeholder={f.placeholder}
                value={fields[f.id] ?? ""}
                onChange={v => setField(f.id, v)}
                multiline={f.multiline}
              />
            ))}
          </div>

          {/* Image uploads */}
          <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 20, borderBottom: `1px solid ${t.border}` }}>
            {/* Logo */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: "140%" }}>Logo</span>
              <input ref={logoRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload(e, setLogo)} />
              {logo ? (
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 99, overflow: "hidden", border: `1px solid ${t.border}`, flexShrink: 0 }}>
                    <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <button onClick={() => logoRef.current?.click()} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 500, color: t.text, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>Change</button>
                    <button onClick={() => setLogo(null)} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 500, color: t.textMuted, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => logoRef.current?.click()} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 16px", height: 48, background: t.surface, border: `1px dashed ${t.border}`, borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                  <Icon name="add_photo_alternate" size={20} color={t.textMuted} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: t.textMuted }}>Upload logo</span>
                </button>
              )}
            </div>

            {/* Cover photo — only for menu template */}
            {template.id === "menu" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: "140%" }}>Cover photo</span>
                <input ref={coverPhotoRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload(e, setCoverPhoto)} />
                {coverPhoto ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ width: "100%", height: 120, borderRadius: 9, overflow: "hidden", border: `1px solid ${t.border}` }}>
                      <img src={coverPhoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                      <button onClick={() => coverPhotoRef.current?.click()} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 500, color: t.text, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>Change</button>
                      <button onClick={() => setCoverPhoto(null)} style={{ padding: "6px 14px", fontSize: 14, fontWeight: 500, color: t.textMuted, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => coverPhotoRef.current?.click()} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, padding: "20px 16px", background: t.surface, border: `1px dashed ${t.border}`, borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                    <Icon name="add_photo_alternate" size={24} color={t.textMuted} />
                    <span style={{ fontSize: 14, fontWeight: 500, color: t.textMuted }}>Upload cover photo</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Color theme */}
          <div style={{ padding: "24px 32px", display: "flex", flexDirection: "column", gap: 16, borderBottom: `1px solid ${t.border}` }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: "140%" }}>Color Theme</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              {colorThemes.map(ct => {
                const sel = colorTheme === ct.id;
                return (
                  <div key={ct.id} onClick={() => setColorTheme(ct.id)} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, cursor: "pointer" }}>
                    <div style={{ height: 44, borderRadius: 6, overflow: "hidden", boxShadow: sel ? "0 0 0 2px #01AD85" : "0 0 0 2px transparent", transition: "box-shadow 150ms ease" }}>
                      <div style={{ height: "50%", background: ct.dark }} />
                      <div style={{ height: "50%", background: ct.light }} />
                    </div>
                    <span style={{ fontSize: 14, fontWeight: sel ? 600 : 400, color: sel ? t.text : t.textSecondary, textAlign: "center", lineHeight: "140%" }}>{ct.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Export size */}
          <div style={{ padding: "20px 32px", display: "flex", flexDirection: "column", gap: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: t.text, lineHeight: "140%" }}>Export Size</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
              {[
                { id: "print",  label: "Print",  sub: "Letter / A4",  iconW: 18, iconH: 24 },
                { id: "social", label: "Social", sub: "1080 × 1080",  iconW: 22, iconH: 22 },
              ].map(opt => {
                const sel = exportSize === opt.id;
                return (
                  <div key={opt.id} onClick={() => setExportSize(opt.id)} style={{ flex: 1, height: 100, borderRadius: 9, cursor: "pointer", padding: 13, display: "flex", flexDirection: "column", gap: 5, background: sel ? t.accentLight : t.surface, border: sel ? `1.5px solid ${t.accent}` : `1.5px solid ${t.border}`, transition: "background 150ms ease, border 150ms ease" }}>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <div style={{ width: opt.iconW, height: opt.iconH, background: sel ? t.accent : t.border, borderRadius: 2, transition: "background 150ms ease" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ fontSize: 15, fontWeight: 500, color: t.text, lineHeight: "140%" }}>{opt.label}</span>
                      <span style={{ fontSize: 14, fontWeight: 400, color: t.textMuted, lineHeight: "140%" }}>{opt.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 40, background: t.bgSecondary, position: "relative", overflow: "hidden", transition: "background 200ms ease" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.5, backgroundImage: t.dotPattern, backgroundSize: "20px 20px" }} />
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ width: 400, height: exportSize === "social" ? 400 : undefined, overflow: exportSize === "social" ? "hidden" : "visible", borderRadius: 10, position: "relative", transition: "height 350ms ease" }}>
              <EditorPreview templateId={template.id} fields={fields} themeId={colorTheme} coverPhoto={coverPhoto} logo={logo} />
              {exportSize === "social" && (
                <div style={{ position: "absolute", inset: 0, border: "2px dashed rgba(1,173,133,0.5)", borderRadius: 10, pointerEvents: "none" }} />
              )}
            </div>
            <span style={{ fontSize: 13, fontWeight: 400, color: t.textMuted }}>
              {exportSize === "print" ? "Letter / A4 format" : "1080 × 1080 px — Square crop"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", height: 88, flexShrink: 0, borderTop: `1px solid ${t.border}`, background: t.bg, transition: "background 200ms ease" }}>
        <button onClick={onClose} style={{ padding: "12px 20px", height: 48, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: 500, color: t.text, fontFamily: "inherit", transition: "background 200ms ease, border 200ms ease, color 200ms ease" }}>
          Cancel
        </button>
        <div style={{ display: "flex", flexDirection: "row", gap: 16, alignItems: "center" }}>
          <button onClick={handleSaveAndDownload} disabled={downloading || !hasContent} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "12px 24px 12px 20px", gap: 8, height: 48, background: downloading || !hasContent ? t.border : t.accent, border: "none", borderRadius: 8, cursor: downloading || !hasContent ? "default" : "pointer", fontFamily: "inherit", transition: "background 200ms ease" }}>
            {downloading ? (
              <><DownloadSpinner /><span style={{ fontSize: 16, fontWeight: 500, color: t.textMuted }}>Preparing…</span></>
            ) : (
              <><Icon name="download" size={24} color={hasContent ? "#FFFFFF" : t.textMuted} /><span style={{ fontSize: 16, fontWeight: 500, color: hasContent ? "#FFFFFF" : t.textMuted }}>Save & download</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TAB 1 — ALL MATERIALS
══════════════════════════════════════════════ */

function MaterialCard({
  title, description, linkLabel, linkPlaceholder,
  formatLabel, qrOptionLabel, imageOptionLabel, onToast,
}: {
  title: string; description: string; linkLabel: string; linkPlaceholder: string;
  formatLabel: string; qrOptionLabel: string; imageOptionLabel: string;
  onToast: (msg: string, icon?: string) => void;
}) {
  const t = useTheme();
  const [format, setFormat] = useState<"qr" | "image">("qr");
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); onToast("Asset downloaded!", "download"); }, 1200);
  };

  return (
    <div style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", transition: "background 200ms ease, border 200ms ease" }}>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 24, gap: 32, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "140%" }}>{title}</span>
          <span style={{ fontSize: 16, fontWeight: 350, color: t.textSecondary, lineHeight: "150%" }}>{description}</span>
        </div>
        <button onClick={handleDownload} disabled={downloading} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "12px 20px 12px 16px", gap: 8, height: 48, background: downloading ? t.border : t.accent, border: "none", borderRadius: 8, cursor: downloading ? "default" : "pointer", flexShrink: 0, transition: "background 200ms ease", fontFamily: "inherit" }}>
          {downloading
            ? <><DownloadSpinner /><span style={{ fontSize: 16, fontWeight: 500, color: t.textMuted, lineHeight: "24px" }}>Preparing…</span></>
            : <><Icon name="download" size={24} color="#FFFFFF" /><span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "24px" }}>Download</span></>
          }
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", padding: 24, gap: 56 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "8px 0px", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: t.text, lineHeight: "24px" }}>{linkLabel}</span>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 12, background: t.bgTertiary, borderRadius: 10, height: 48 }}>
              <span style={{ fontSize: 16, fontWeight: 400, color: t.textMuted, letterSpacing: "0.02em" }}>{linkPlaceholder}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: t.text, lineHeight: "24px" }}>{formatLabel}</span>
            <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
              <div onClick={() => setFormat("qr")} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 10, height: 56, background: format === "qr" ? t.accentLight : t.surface, border: `1px solid ${format === "qr" ? t.accent : t.border}`, borderRadius: 12, cursor: "pointer", transition: "background 200ms ease, border 200ms ease" }}>
                <Icon name="qr_code_2" size={24} color={t.textMuted} />
                <span style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{qrOptionLabel}</span>
              </div>
              <div onClick={() => setFormat("image")} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", padding: 16, gap: 10, height: 56, background: format === "image" ? t.accentLight : t.surface, border: `1px solid ${format === "image" ? t.accent : t.border}`, borderRadius: 12, cursor: "pointer", transition: "background 200ms ease, border 200ms ease" }}>
                <Icon name="add_photo_alternate" size={24} color={t.textMuted} />
                <span style={{ fontSize: 16, fontWeight: 500, color: t.text }}>{imageOptionLabel}</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: 252, height: 252, background: t.bgTertiary, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 200ms ease" }}>
          <Icon name="qr_code_2" size={180} color={t.border} />
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
      <div style={{ background: "#008062", padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF" }}>20% OFF</span>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ padding: "26px 16px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11.7, fontWeight: 600, color: "#0A0A0A" }}>Sunset Grocers</span>
          <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%" }}>Use code SAVE20 at checkout to get 20% off your next order. Valid for orders over $25.</span>
        </div>
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373" }}>Scan to order</span>
            <Icon name="qr_code_2" size={52} color="#C8C8C0" />
          </div>
        </div>
        <div style={{ position: "absolute", top: -18, left: "50%", transform: "translateX(-50%)" }}>
          <BrandAvatar size={36} />
        </div>
      </div>
    </div>
  );
}

function MenuFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)", position: "relative" }}>
      <div style={{ height: 104, background: "linear-gradient(135deg, #E8E8E4 0%, #D4D4D4 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <Icon name="add_photo_alternate" size={32} color="rgba(255,255,255,0.6)" />
        <div style={{ position: "absolute", bottom: -18, left: "50%", transform: "translateX(-50%)", zIndex: 2 }}>
          <BrandAvatar size={36} />
        </div>
      </div>
      <div style={{ padding: "26px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", letterSpacing: "-0.02em", textAlign: "center" }}>New Sushi Menu</span>
        <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", lineHeight: "140%" }}>Try our new handcrafted sushi rolls, made fresh daily with premium ingredients.</span>
      </div>
      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 400, color: "#525252" }}>Scan to view our menu</span>
          <Icon name="qr_code_2" size={60} color="#C8C8C0" />
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
        <div style={{ background: "#FEFCE8", borderRadius: 7.8, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373" }}>Scan here!</span>
          <Icon name="qr_code_2" size={78} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

const flyerTemplates: FlyerTemplate[] = [
  { id: "promotion", preview: <PromotionFlyerPreview />, previewBg: "#F9FAFC", label: "Offer Promotion",    description: "Promote discounts, deals, or special offers to attract new customers." },
  { id: "menu",      preview: <MenuFlyerPreview />,      previewBg: "#F2FAF7", label: "New items or updates", description: "Share new dishes, seasonal menus, events, or important updates." },
  { id: "review",    preview: <ReviewFlyerPreview />,    previewBg: "#FFFBEB", label: "Thank you / review",  description: "Encourage customers to leave a review after their order." },
];

function FlyerPreviewModal({ template, onCreate, onClose }: { template: FlyerTemplate; onCreate: () => void; onClose: () => void }) {
  const t = useTheme();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg }}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", background: t.surface, borderRadius: 20, boxShadow: "0px 24px 80px rgba(0,0,0,0.25)", width: 640, maxHeight: "92vh", overflow: "hidden", transition: "background 200ms ease" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: "32px 32px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: t.text }}>{template.label}</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: t.textMuted, lineHeight: "150%" }}>{template.description}</span>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
            <Icon name="close" size={24} color={t.textMuted} />
          </button>
        </div>
        {/* Preview */}
        <div className="[&::-webkit-scrollbar]:hidden" style={{ padding: "40px 32px 48px", display: "flex", justifyContent: "center", overflowY: "auto", scrollbarWidth: "none" }}>
          <EditorPreview templateId={template.id} fields={{}} themeId="shipday" />
        </div>
        {/* CTA */}
        <div style={{ padding: "0 32px 32px" }}>
          <button onClick={() => { onClose(); onCreate(); }} style={{ width: "100%", height: 52, background: t.accent, border: "none", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600, color: "#FFFFFF", fontFamily: "inherit" }}>
            Create flyer
          </button>
        </div>
      </div>
    </div>
  );
}

function FlyerCard({
  template, onCreate, onToast,
}: { template: FlyerTemplate; onCreate: () => void; onToast: (msg: string, icon?: string) => void }) {
  const t = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const previewBg = t.mode === "dark" ? t.bgSecondary : template.previewBg;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", transition: "background 200ms ease, border 200ms ease" }}>
        <div style={{ height: 200, background: previewBg, borderBottom: `1px solid ${t.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center", transition: "background 200ms ease" }}>
          <div style={{ position: "absolute", top: 24, transform: "scale(0.72)", transformOrigin: "top center" }}>
            {template.preview}
          </div>
        </div>
        <div style={{ padding: "20px 24px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: t.text, lineHeight: "150%" }}>{template.label}</span>
          <span style={{ fontSize: 15, fontWeight: 400, color: t.textSecondary, lineHeight: "140%" }}>{template.description}</span>
        </div>
        <div style={{ padding: "4px 24px 24px", display: "flex", flexDirection: "row", gap: 10 }}>
          <button onClick={onCreate} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "10px 20px", gap: 6, height: 44, background: t.accent, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "24px" }}>Create flyer</span>
          </button>
          <button
            onClick={() => setShowPreview(true)}
            style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border 200ms ease" }}
          >
            <Icon name="visibility" size={20} color={t.textMuted} />
          </button>
        </div>
      </div>
      {showPreview && <FlyerPreviewModal template={template} onCreate={onCreate} onClose={() => setShowPreview(false)} />}
    </>
  );
}

function SavedFlyerCard({ flyer, onEdit, onToast }: { flyer: SavedFlyer; onEdit: () => void; onToast: (msg: string, icon?: string) => void }) {
  const t = useTheme();
  const [downloading, setDownloading] = useState(false);
  const template = flyerTemplates.find(tp => tp.id === flyer.templateId);
  const dateStr = flyer.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const previewBg = t.mode === "dark" ? t.bgSecondary : (template?.previewBg ?? "#F9FAFC");

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); onToast("Flyer downloaded!", "download"); }, 1200);
  };

  return (
    <div style={{ width: 220, display: "flex", flexDirection: "column", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", transition: "background 200ms ease, border 200ms ease" }}>
      <div style={{ height: 180, background: previewBg, borderBottom: `1px solid ${t.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center", transition: "background 200ms ease" }}>
        <div style={{ position: "absolute", top: 16, transform: "scale(0.55)", transformOrigin: "top center" }}>
          <EditorPreview templateId={flyer.templateId} fields={flyer.fields} themeId={flyer.themeId} />
        </div>
      </div>
      <div style={{ padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: t.text, lineHeight: "140%" }}>{flyer.title}</span>
        <span style={{ fontSize: 13, fontWeight: 400, color: t.textMuted, lineHeight: "140%" }}>Created {dateStr} · {flyer.templateLabel}</span>
      </div>
      <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "row", gap: 8 }}>
        <button onClick={handleDownload} disabled={downloading} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: downloading ? "default" : "pointer", fontFamily: "inherit", transition: "background 200ms ease, border 200ms ease" }}>
          {downloading
            ? <DownloadSpinner />
            : <><Icon name="download" size={18} color={t.textMuted} /><span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Download</span></>
          }
        </button>
        <button onClick={onEdit} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border 200ms ease" }}>
          <Icon name="edit" size={18} color={t.textMuted} />
        </button>
      </div>
    </div>
  );
}

function FlyersContent({ onToast }: { onToast: (msg: string, icon?: string) => void }) {
  const t = useTheme();
  const [editorFlyer, setEditorFlyer] = useState<FlyerTemplate | null>(null);
  const [savedFlyers, setSavedFlyers] = useState<SavedFlyer[]>([]);
  const [editingFlyer, setEditingFlyer] = useState<SavedFlyer | null>(null);

  const handleSave = (templateId: string, templateLabel: string, fields: Record<string, string>, themeId: string, exportSize: string) => {
    const title = fields.offer?.trim() || fields.itemName?.trim() || fields.businessName?.trim() || templateLabel;
    if (editingFlyer) {
      setSavedFlyers(prev => prev.map(f => f.id === editingFlyer.id ? { ...f, fields, themeId, exportSize, title } : f));
      setEditingFlyer(null);
    } else {
      const saved: SavedFlyer = { id: Date.now(), templateId, templateLabel, title, fields, themeId, exportSize, createdAt: new Date() };
      setSavedFlyers(prev => [saved, ...prev]);
    }
  };

  const handleEdit = (flyer: SavedFlyer) => {
    const template = flyerTemplates.find(t => t.id === flyer.templateId);
    if (!template) return;
    setEditingFlyer(flyer);
    setEditorFlyer(template);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: t.bg, transition: "background 200ms ease" }}>
        {savedFlyers.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "140%" }}>Your flyers</span>
              <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
                {savedFlyers.map(f => (
                  <SavedFlyerCard key={f.id} flyer={f} onEdit={() => handleEdit(f)} onToast={onToast} />
                ))}
              </div>
            </div>
            <div style={{ height: 1, background: t.border }} />
          </>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "140%" }}>Create a new flyer</span>
          <span style={{ fontSize: 16, fontWeight: 350, color: t.textSecondary, lineHeight: "150%" }}>Create simple flyers to include with food orders. Print them or share them online.</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {flyerTemplates.map(t => <FlyerCard key={t.id} template={t} onCreate={() => { setEditingFlyer(null); setEditorFlyer(t); }} onToast={onToast} />)}
        </div>
      </div>
      {editorFlyer && (
        <FlyerEditorModal
          template={editorFlyer}
          onClose={() => { setEditorFlyer(null); setEditingFlyer(null); }}
          onToast={onToast}
          onSave={(fields, themeId, exportSize) => handleSave(editorFlyer.id, editorFlyer.label, fields, themeId, exportSize)}
          initialFields={editingFlyer?.fields}
          initialTheme={editingFlyer?.themeId}
          initialExportSize={editingFlyer?.exportSize}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */

const tabs = [
  { id: "all",    label: "QR codes & templates" },
  { id: "flyers", label: "Flyer maker" },
];

export default function MarketingMaterials() {
  const [activeTab, setActiveTab] = useState("all");
  const { theme: t, toggle: toggleDark } = useThemeToggle();
  const { toasts, show, remove } = useToast();

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: t.bg, height: "100vh", overflow: "hidden", transition: "background 300ms ease, color 300ms ease" }}>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "32px 64px 0px", gap: 20, borderBottom: `1px solid ${t.border}`, background: t.bg, zIndex: 10 }}>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "40px", margin: 0 }}>Marketing materials</h1>
              <span style={{ fontSize: 16, fontWeight: 350, color: t.textSecondary, lineHeight: "150%" }}>Create QR codes and flyers to promote your business and engage customers</span>
            </div>
            <button onClick={toggleDark} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border 200ms ease" }}>
              <Icon name={t.mode === "dark" ? "light_mode" : "dark_mode"} size={20} color={t.mode === "dark" ? "#F59E0B" : "#525252"} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "row", gap: 32 }}>
            {tabs.map(tab => {
              const isActive = tab.id === activeTab;
              return (
                <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: 42, borderBottom: isActive ? `2px solid ${t.accent}` : "2px solid transparent", cursor: "pointer" }}>
                  <span style={{ fontSize: 14, fontWeight: isActive ? 800 : 400, color: isActive ? t.accentText : t.textSecondary, letterSpacing: isActive ? "0" : "-0.02em", whiteSpace: "nowrap" }}>{tab.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="[&::-webkit-scrollbar]:hidden" style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
          {activeTab === "all" ? (
            <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: t.bg }}>
              <MaterialCard title="Collect reviews by QR Code" description="Share a QR code or image that takes customers directly to your review page" linkLabel="Review page link" linkPlaceholder="https://g.page/r/your-business/review" formatLabel="Format" qrOptionLabel="QR Code" imageOptionLabel="Image" onToast={show} />
              <MaterialCard title="Collect SMS marketing subscribers" description="Let customers opt in to SMS promotions by scanning a code or clicking a link" linkLabel="Opt-in link" linkPlaceholder="https://shipday.com/sms/subscribe/your-store" formatLabel="Format" qrOptionLabel="QR Code" imageOptionLabel="Image" onToast={show} />
            </div>
          ) : (
            <FlyersContent onToast={show} />
          )}
        </div>
      </div>
      <ToastStack toasts={toasts} remove={remove} />
    </>
  );
}
