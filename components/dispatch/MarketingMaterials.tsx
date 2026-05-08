"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import Icon from "@/components/ui/Icon";
import { useTheme, useThemeToggle } from "@/components/ThemeContext";

function toQrUrl(url?: string): string {
  if (!url?.trim()) return "https://shipday.com";
  const u = url.trim();
  return u.startsWith("http") ? u : `https://${u}`;
}

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
   SHARED PRIMITIVES
══════════════════════════════════════════════ */

const colorThemes = [
  { id: "shipday", label: "Shipday", bg: "#008062",  gradient: undefined, dark: "#005642", light: "#008062", qrBg: "#F6FEF9" },
  { id: "red",     label: "Red",     bg: undefined,   gradient: "linear-gradient(96.98deg, #B32318 0%, #D92D20 100%)", dark: "#B32318", light: "#D92D20", qrBg: "#FEF3F2" },
  { id: "yellow",  label: "Yellow",  bg: undefined,   gradient: "linear-gradient(96.98deg, #A16207 0%, #CA8A04 100%)", dark: "#A16207", light: "#CA8A04", qrBg: "#FEFCE8" },
  { id: "slate",   label: "Slate",   bg: undefined,   gradient: "linear-gradient(96.98deg, #23232E 0%, #353545 100%)", dark: "#23232E", light: "#353545", qrBg: "#F4F4F8" },
  { id: "mint",    label: "Mint",    bg: "#EEFCF3",   gradient: undefined, dark: "#BEEFDE", light: "#EEFCF3", qrBg: "#D1FAE0" },
  { id: "navy",    label: "Navy",    bg: "#001D23",   gradient: undefined, dark: "#001D23", light: "#002A33", qrBg: "#002A33" },
  { id: "purple",  label: "Purple",  bg: undefined,   gradient: "linear-gradient(96.98deg, #5B21B6 0%, #7C3AED 100%)", dark: "#5B21B6", light: "#7C3AED", qrBg: "#F5F3FF" },
  { id: "rose",    label: "Rose",    bg: undefined,   gradient: "linear-gradient(96.98deg, #9F1239 0%, #E11D48 100%)", dark: "#9F1239", light: "#E11D48", qrBg: "#FFF1F2" },
  { id: "teal",    label: "Teal",    bg: undefined,   gradient: "linear-gradient(96.98deg, #0F766E 0%, #14B8A6 100%)", dark: "#0F766E", light: "#14B8A6", qrBg: "#F0FDFA" },
  { id: "orange",  label: "Orange",  bg: undefined,   gradient: "linear-gradient(96.98deg, #C2410C 0%, #EA580C 100%)", dark: "#C2410C", light: "#EA580C", qrBg: "#FFF7ED" },
];

const PRESET_FOOD_PHOTOS = [
  { id: "burger",  label: "Burger",  url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=566&fit=crop&q=80" },
  { id: "pizza",   label: "Pizza",   url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=566&fit=crop&q=80" },
  { id: "sushi",   label: "Sushi",   url: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=566&fit=crop&q=80" },
  { id: "tacos",   label: "Tacos",   url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=566&fit=crop&q=80" },
  { id: "pasta",   label: "Pasta",   url: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&h=566&fit=crop&q=80" },
];

type FieldDef = { id: string; label: string; placeholder: string; multiline?: boolean; maxLength?: number };

type AccountData = {
  businessName: string;
  tagline: string;
  googleRating: string;
  reviewCount: string;
  signatureDish: string;
  deliveryAreas: string;
  orderUrl: string;
};

function themeBackground(theme: typeof colorThemes[0]) {
  return theme.gradient ?? theme.bg ?? theme.light;
}

const EDITOR_FONT = "'Avenir', 'AvenirWeb', 'Nunito Sans', sans-serif";

function EditorField({
  label, placeholder, value, onChange, multiline = false, hint, maxLength,
}: { label: string; placeholder: string; value: string; onChange: (v: string) => void; multiline?: boolean; hint?: string; maxLength?: number }) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  const remaining = maxLength !== undefined ? maxLength - value.length : undefined;
  const base: React.CSSProperties = {
    width: "100%",
    padding: multiline ? 14 : "0 16px",
    border: `1px solid ${focused ? t.accent : t.border}`,
    borderRadius: 10, outline: "none",
    fontSize: 15, fontWeight: 400, color: t.text,
    background: t.inputBg,
    lineHeight: "150%", fontFamily: EDITOR_FONT,
    boxSizing: "border-box",
    boxShadow: focused ? "0 0 0 2px rgba(0,128,98,0.12)" : "0 0 0 2px transparent",
    transition: "border-color 150ms ease, box-shadow 150ms ease, background 200ms ease, color 200ms ease",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: EDITOR_FONT, fontSize: 15, fontWeight: 500, color: t.text }}>{label}</span>
        {remaining !== undefined
          ? <span style={{ fontFamily: EDITOR_FONT, fontSize: 13, color: remaining <= 8 ? "#EF4444" : t.textMuted }}>{remaining} left</span>
          : hint && <span style={{ fontFamily: EDITOR_FONT, fontSize: 15, color: t.textMuted }}>{hint}</span>
        }
      </div>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
            spellCheck={false} autoComplete="off" maxLength={maxLength}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, resize: "none" }} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            spellCheck={false} autoComplete="off" maxLength={maxLength}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{ ...base, height: 44 }} />
      }
    </div>
  );
}

function EditorCard({ title, desc, noDivider, children }: { title: string; desc?: string; noDivider?: boolean; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <div style={{ border: `1px solid ${t.border}`, borderRadius: 16, overflow: "hidden", background: t.surface, transition: "background 300ms ease, border 300ms ease" }}>
      <div style={{ padding: noDivider ? "16px 20px 0" : "16px 20px 14px", borderBottom: noDivider ? "none" : `1px solid ${(t as any).borderLight ?? t.border}`, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ fontFamily: EDITOR_FONT, fontWeight: 800, fontSize: 16, color: t.text }}>{title}</span>
        {desc && <span style={{ fontFamily: EDITOR_FONT, fontWeight: 400, fontSize: 15, color: t.textMuted }}>{desc}</span>}
      </div>
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GOOGLE BUSINESS SEARCH MODAL
══════════════════════════════════════════════ */

const BIZ_TYPES    = ["Pizza & Italian-American", "Mexican Restaurant", "Japanese Restaurant", "Burger Joint", "Chinese Restaurant", "Thai Kitchen", "Indian Restaurant", "Seafood Restaurant", "BBQ & Grill", "Mediterranean Café"];
const BIZ_CITIES   = ["Katonah, NY", "Los Angeles, CA", "Chicago, IL", "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX", "San Diego, CA", "Dallas, TX", "San Jose, CA"];
const BIZ_STREETS  = ["278 Main St", "124 Oak Ave", "456 Park Blvd", "891 Commerce Dr", "332 Elm St", "714 Broadway", "55 Central Ave", "1200 Lake Rd", "88 Riverside Dr", "405 Sunset Blvd"];
const BIZ_DISHES   = ["Penne Alla Vodka", "Birria Tacos", "Dragon Roll", "Smash Burger", "Peking Duck", "Pad Thai", "Butter Chicken", "Lobster Bisque", "Brisket Platter", "Falafel Wrap"];
const BIZ_AREAS    = ["Katonah · Bedford · Mt. Kisco", "Silver Lake · Echo Park · Los Feliz", "Lincoln Park · Wicker Park", "Montrose · Heights · Midtown", "Tempe · Scottsdale · Chandler", "Old City · Fishtown · Northern Liberties", "Pearl District · Alamo Heights", "North Park · Hillcrest · Mission Valley", "Uptown · Deep Ellum · Oak Cliff", "Willow Glen · Almaden · Blossom Hill"];
const BIZ_YEARS    = ["Since 2004", "Since 2011", "Since 2008", "Since 2016", "Since 2019", "Since 2007", "Since 2013", "Since 2003", "Since 2015", "Since 2010"];
const BIZ_SUFFIXES = ["", " Kitchen", " & Bar", " Bistro", " Cantina", " House", " Spot", " Eatery", " Grill", " Co."];

function generateBizResults(query: string): AccountData[] {
  const q = query.trim();
  if (q.length < 2) return [];
  const vowels = (q.match(/[aeiou]/gi) || []).length;
  if (vowels === 0 && q.length > 3) return [];
  const cap = q.charAt(0).toUpperCase() + q.slice(1);
  return BIZ_SUFFIXES.slice(0, 7).map((suffix, i) => ({
    businessName:  `${cap}${suffix}`,
    tagline:       `${BIZ_TYPES[i]} · ${BIZ_YEARS[i]}`,
    googleRating:  String(+(3.8 + Math.sin(i) * 0.7).toFixed(1)),
    reviewCount:   `${50 + ((i * 137) % 450)}+`,
    signatureDish: BIZ_DISHES[i],
    deliveryAreas: BIZ_AREAS[i],
    orderUrl:      `order.${q.toLowerCase().replace(/\s+/g, "")}${suffix.toLowerCase().replace(/[\s&]/g, "")}.com`,
    _address:      `${BIZ_STREETS[i]}, ${BIZ_CITIES[i]}`,
  } as AccountData & { _address: string }));
}

const EXTRACTION_STEPS = [
  "Searching Google Business Profile...",
  "Pulling ratings and reviews...",
  "Extracting menu highlights...",
];

function ExtractionView({ onComplete }: { onComplete: () => void }) {
  const t = useTheme();
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2600);
    const t3 = setTimeout(onComplete, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <div style={{ width: 20, height: 20, flexShrink: 0 }}>
          <DownloadSpinner />
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, color: t.textMuted, transition: "opacity 200ms" }}>{EXTRACTION_STEPS[step]}</span>
      </div>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: 14, border: `1px solid ${t.border}`, borderRadius: 12, opacity: 1 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bgTertiary, flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ width: "55%", height: 13, borderRadius: 6, background: t.bgTertiary }} />
            <div style={{ width: "80%", height: 11, borderRadius: 6, background: t.bgTertiary }} />
          </div>
          <div style={{ width: 28, height: 13, borderRadius: 6, background: t.bgTertiary, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  );
}

function GoogleBusinessModal({ onConnect, onClose }: { onConnect: (data: AccountData) => void; onClose: () => void }) {
  const t = useTheme();
  const [query, setQuery]         = useState("");
  const [results, setResults]     = useState<(AccountData & { _address?: string })[]>([]);
  const [searched, setSearched]   = useState(false);
  const [extracting, setExtracting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSearch = () => {
    if (!query.trim() || extracting) return;
    setSearched(false);
    setResults([]);
    setExtracting(true);
  };

  const handleExtractionDone = useCallback(() => {
    setExtracting(false);
    setSearched(true);
    setResults(generateBizResults(query));
  }, [query]);

  const handlePick = (biz: AccountData & { _address?: string }) => {
    const { _address, ...data } = biz;
    onConnect(data);
  };

  const canSearch = query.trim().length > 0 && !extracting;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 640, background: t.surface, borderRadius: 20, boxShadow: "0px 24px 80px rgba(0,0,0,0.25)", overflow: "hidden", display: "flex", flexDirection: "column", transition: "background 200ms ease" }}>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: "28px 28px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: t.text }}>Find your Google Business Profile</span>
            <span style={{ fontSize: 14, fontWeight: 400, color: t.textMuted }}>Your flyers will be pre-filled with your real business info.</span>
          </div>
          <button onClick={onClose} style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 12 }}>
            <Icon name="close" size={22} color={t.textMuted} />
          </button>
        </div>

        {/* Search input + button */}
        <div style={{ padding: "0 28px 16px", display: "flex", flexDirection: "row", gap: 10 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex" }}>
              <Icon name="search" size={20} color={t.textMuted} />
            </div>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") handleSearch(); }}
              placeholder="e.g. Bella Roma Pizzeria"
              style={{ width: "100%", height: 48, padding: "0 40px 0 44px", background: t.inputBg, border: `1px solid ${t.border}`, borderRadius: 12, fontSize: 15, fontWeight: 400, color: t.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box", transition: "border-color 150ms ease" }}
            />
            {query && (
              <button onClick={() => { setQuery(""); setSearched(false); setResults([]); }} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                <Icon name="close" size={18} color={t.textMuted} />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={!canSearch}
            style={{ height: 48, padding: "0 24px", border: "none", borderRadius: 12, background: canSearch ? t.accent : t.bgTertiary, fontSize: 15, fontWeight: 500, color: canSearch ? "#FFFFFF" : t.textMuted, cursor: canSearch ? "pointer" : "not-allowed", flexShrink: 0, fontFamily: "inherit", transition: "background 150ms ease" }}
          >Search</button>
        </div>

        {/* Body */}
        <div style={{ padding: "0 28px 28px", display: "flex", flexDirection: "column", gap: 8, maxHeight: 420, overflowY: "auto" }}>
          {extracting ? (
            <ExtractionView onComplete={handleExtractionDone} />
          ) : searched && results.length > 0 ? (
            results.map((biz, i) => (
              <button
                key={i}
                onClick={() => handlePick(biz)}
                style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12, padding: "12px 16px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 150ms ease, background 150ms ease", fontFamily: "inherit" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.accent; (e.currentTarget as HTMLElement).style.background = t.accentLight; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.background = t.surface; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 10, background: t.bgTertiary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name="storefront" size={20} color={t.textMuted} />
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{biz.businessName}</span>
                  <span style={{ fontSize: 13, fontWeight: 400, color: t.textMuted }}>{(biz as any)._address} · {biz.tagline.split(" · ")[0]}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 3, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: "#EFB841" }}>★</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{biz.googleRating}</span>
                </div>
              </button>
            ))
          ) : searched && results.length === 0 ? (
            <div style={{ padding: "32px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <Icon name="search_off" size={32} color={t.textMuted} />
              <span style={{ fontSize: 14, fontWeight: 400, color: t.textMuted }}>No results for &ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            <div style={{ padding: "48px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <Icon name="business" size={36} color={t.textMuted} />
              <span style={{ fontSize: 15, fontWeight: 500, color: t.textMuted, textAlign: "center", maxWidth: 300, lineHeight: "150%" }}>
                Search by name or address to find your business
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   TEMPLATE FIELD CONFIGS
══════════════════════════════════════════════ */

const BIZ_FIELD_IDS = new Set(["businessName", "tagline", "orderUrl", "googleRating", "deliveryAreas"]);

const templateFields: Record<string, FieldDef[]> = {
  menuPrices: [
    { id: "businessName", label: "Business name", placeholder: "e.g. La Familia Katonah" },
    { id: "orderUrl",     label: "QR code link",  placeholder: "e.g. order.yourstore.com" },
    { id: "headline",     label: "Offer title",       placeholder: "e.g. Same food. Lower price." },
    { id: "bodyCopy",     label: "Offer description", placeholder: "e.g. Apps charge 30% extra. Order direct and pay our real menu prices.", multiline: true },
  ],
  discount: [
    { id: "businessName", label: "Business name",      placeholder: "e.g. La Familia Katonah" },
    { id: "headline",     label: "Title",              placeholder: "e.g. 15% Off your next order", maxLength: 50 },
    { id: "details",      label: "Promo code",         placeholder: "e.g. SHIPDAY15" },
    { id: "termsText",    label: "Terms & expiration", placeholder: "e.g. T&Cs apply · Valid until Dec 31, 2024" },
    { id: "orderUrl",     label: "QR code link",       placeholder: "e.g. order.yourstore.com" },
  ],
  freeItem: [
    { id: "businessName", label: "Business name",      placeholder: "e.g. La Familia Katonah" },
    { id: "headline",     label: "Offer title",        placeholder: "e.g. Get free garlic knots on orders over $20", maxLength: 47 },
    { id: "details",      label: "Promo code",         placeholder: "e.g. OFF20" },
    { id: "termsText",    label: "Terms & expiration", placeholder: "e.g. T&Cs apply · Offer ends 30.05.26" },
    { id: "orderUrl",     label: "QR code link",       placeholder: "e.g. order.yourstore.com" },
  ],
};

/* ══════════════════════════════════════════════
   LOGO / BRAND AVATAR
══════════════════════════════════════════════ */

function BrandAvatar({ size = 48 }: { size?: number }) {
  const s = size;
  const inner  = s * (48 / 56);
  const circle = inner * (18.7 / 26.4);
  const offset = inner * (7.72 / 26.4);
  return (
    <div style={{ width: s, height: s, borderRadius: 99, background: "#F4F4F8", border: "3px solid #FFFFFF", boxShadow: "0px 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: inner, height: inner, borderRadius: 132, position: "relative" }}>
        <div style={{ position: "absolute", width: circle, height: circle, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: circle, height: circle, left: offset, top: offset, background: "#ABE571", borderRadius: "50%" }} />
        <div style={{ position: "absolute", width: circle * 0.6, height: circle * 0.6, left: inner * (7.53 / 26.4), top: inner * (7.52 / 26.4), background: "#008062", borderRadius: "50%" }} />
      </div>
    </div>
  );
}

function LogoOrAvatar({ logo, size = 48 }: { logo?: string | null; size?: number }) {
  if (logo) {
    return (
      <div style={{ width: size, height: size, borderRadius: 99, background: "#F4F4F8", border: "3px solid #FFFFFF", boxShadow: "0px 2px 8px rgba(0,0,0,0.08)", overflow: "hidden", flexShrink: 0 }}>
        <img src={logo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return <BrandAvatar size={size} />;
}

function Stars({ rating, size = 13 }: { rating?: string; size?: number }) {
  const num = Math.min(Math.round(parseFloat(rating ?? "5")), 5);
  return (
    <span style={{ display: "inline-flex", gap: 1 }}>
      {[0,1,2,3,4].map(i => (
        <span key={i} style={{ fontSize: size, color: i < num ? "#EFB841" : "#D4D4D0", lineHeight: 1 }}>★</span>
      ))}
    </span>
  );
}

/* ══════════════════════════════════════════════
   SHARED QR FOOTER
══════════════════════════════════════════════ */

function FlyerQrFooter({ fields, dark, label = "Scan to order direct →" }: { fields: Record<string, string>; dark: string; label?: string }) {
  return (
    <div style={{ background: dark, padding: "20px 24px 18px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 10 }}>
        <QRCodeSVG value={toQrUrl(fields.orderUrl)} size={76} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
      </div>
      {fields.orderUrl?.trim() && (
        <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)" }}>{fields.orderUrl}</span>
      )}
      <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>Powered by Shipday</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   LIVE PREVIEWS — full 400px
══════════════════════════════════════════════ */

type PreviewProps = {
  fields: Record<string, string>;
  themeId: string;
  logo?: string | null;
  photo?: string | null;
  onFieldChange?: (id: string, value: string) => void;
  onPhotoClick?: () => void;
  onLogoClick?: () => void;
};

const MENU_PRICES_THEMES: Record<string, { bg: string; textPrimary: string; textBody: string; taglineBg: string; dividerColor: string; photoBg: string; dark: boolean }> = {
  mint:    { bg: "#EEFCF3", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#D1FAE0", dividerColor: "#BEEFDE", photoBg: "linear-gradient(180deg, #C8F5D8 0%, #A8D5B5 100%)", dark: false },
  shipday: { bg: "#F0FDF9", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#CCFCE8", dividerColor: "#99F0D0", photoBg: "linear-gradient(180deg, #B0EDD8 0%, #80D0B0 100%)", dark: false },
  navy:    { bg: "#001D23", textPrimary: "#FFFFFF",  textBody: "rgba(255,255,255,0.85)", taglineBg: "#002A33", dividerColor: "#333333", photoBg: "linear-gradient(180deg, #003340 0%, #001D23 100%)", dark: true  },
  slate:   { bg: "#23232E", textPrimary: "#FFFFFF",  textBody: "rgba(255,255,255,0.85)", taglineBg: "#353545", dividerColor: "#444455", photoBg: "linear-gradient(180deg, #353545 0%, #23232E 100%)", dark: true  },
  purple:  { bg: "#FAF5FF", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#EDE9FE", dividerColor: "#C4B5FD", photoBg: "linear-gradient(180deg, #E9D5FF 0%, #C4B5FD 100%)", dark: false },
  rose:    { bg: "#FFF1F2", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#FFE4E6", dividerColor: "#FECDD3", photoBg: "linear-gradient(180deg, #FFD6DB 0%, #FECDD3 100%)", dark: false },
  teal:    { bg: "#F0FDFA", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#CCFBF1", dividerColor: "#99F6E4", photoBg: "linear-gradient(180deg, #B2F5EA 0%, #81E6D9 100%)", dark: false },
  orange:  { bg: "#FFF7ED", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#FED7AA", dividerColor: "#FDBA74", photoBg: "linear-gradient(180deg, #FED7AA 0%, #FB923C 100%)", dark: false },
  red:     { bg: "#FEF2F2", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#FEE2E2", dividerColor: "#FECACA", photoBg: "linear-gradient(180deg, #FECACA 0%, #F87171 100%)", dark: false },
  yellow:  { bg: "#FEFCE8", textPrimary: "#0A0A0A", textBody: "#262626",                 taglineBg: "#FEF08A", dividerColor: "#FDE047", photoBg: "linear-gradient(180deg, #FDE047 0%, #EAB308 100%)", dark: false },
};

function MenuPricesLivePreview({ fields, themeId, logo, photo, onFieldChange, onPhotoClick, onLogoClick }: PreviewProps) {
  const flyerTheme  = FLYER_THEMES.find(ft => ft.id === themeId);
  const tc          = flyerTheme ? flyerThemeToTokens(flyerTheme) : (MENU_PRICES_THEMES[themeId] ?? MENU_PRICES_THEMES.mint);
  const { bg, textPrimary, textBody, taglineBg, dividerColor, photoBg } = tc;
  const isDark       = tc.dark;
  const editHoverBg  = isDark ? "rgba(255,255,255,0.08)" : "rgba(1,173,133,0.08)";
  const editFocusBg  = isDark ? "rgba(255,255,255,0.14)" : "rgba(1,173,133,0.14)";

  const name = fields.businessName?.trim() || "Your Restaurant";
  const url  = fields.orderUrl?.trim()     || "yourbusiness.com/menu";
  const editable = !!onFieldChange;

  const editableSpanProps = (id: string): React.HTMLAttributes<HTMLSpanElement> => ({
    contentEditable: editable,
    suppressContentEditableWarning: true,
    onBlur: e => onFieldChange?.(id, e.currentTarget.textContent?.trim() ?? ""),
    onMouseEnter: editable ? e => { e.currentTarget.style.background = editHoverBg; } : undefined,
    onMouseLeave: editable ? e => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.background = "transparent"; } : undefined,
    onFocus: editable ? e => { e.currentTarget.style.background = editFocusBg; } : undefined,
  });

  return (
    <div style={{ width: 400, height: 566, background: bg, display: "flex", flexDirection: "row", overflow: "hidden" }}>

      {/* Left — content column (flexbox, flows naturally) */}
      <div style={{ width: 260, height: 566, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 20px", boxSizing: "border-box" }}>

        {/* Logo + name */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8, whiteSpace: "nowrap", flexShrink: 0 }}>
          <div onClick={onLogoClick} style={{ cursor: onLogoClick ? "pointer" : "default", flexShrink: 0 }}>
            <LogoOrAvatar logo={logo} size={24} />
          </div>
          <span
            {...editableSpanProps("businessName")}
            style={{ fontSize: 14, fontWeight: 600, color: textPrimary, fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.01em", outline: "none", borderRadius: 4, padding: "1px 3px", cursor: editable ? "text" : "default", transition: "background 120ms ease" }}
          >{name}</span>
        </div>

        {/* Spacer — pushes content to center-ish */}
        <div style={{ flex: 1, minHeight: 16 }} />

        {/* Headline */}
        <span
          {...editableSpanProps("headline")}
          style={{ fontSize: 33, fontWeight: 700, color: textPrimary, lineHeight: "105%", letterSpacing: "-0.02em", textAlign: "center", fontFamily: "Inter, system-ui, sans-serif", outline: "none", borderRadius: 4, padding: "2px 0", cursor: editable ? "text" : "default", whiteSpace: "pre-wrap", display: "block", width: "100%", transition: "background 120ms ease", flexShrink: 0 }}
        >{fields.headline?.trim() || "Same food.\nHigher price."}</span>

        {/* Divider */}
        <div style={{ width: 90, height: 1, background: dividerColor, margin: "18px 0", flexShrink: 0 }} />

        {/* Body copy */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <span
            {...editableSpanProps("bodyCopy")}
            style={{ fontSize: 14, fontWeight: 400, color: textBody, lineHeight: "140%", fontFamily: "Inter, system-ui, sans-serif", outline: "none", borderRadius: 4, padding: "1px 3px", cursor: editable ? "text" : "default", whiteSpace: "pre-wrap", transition: "background 120ms ease" }}
          >{fields.bodyCopy?.trim() || "Apps add 30% to our prices.\nOrder direct, pay ours."}</span>
        </div>

        {/* Spacer — pushes CTA to bottom */}
        <div style={{ flex: 1, minHeight: 16 }} />

        {/* CTA + QR */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: textBody, fontFamily: "Inter, system-ui, sans-serif" }}>
            Order direct &amp; save.
          </span>
          <div style={{ background: "#FFFFFF", borderRadius: 8, padding: 6 }}>
            <QRCodeSVG value={toQrUrl(url)} size={88} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
          </div>
          <span
            {...editableSpanProps("orderUrl")}
            style={{ fontSize: 14, fontWeight: 400, color: textBody, fontFamily: "Inter, system-ui, sans-serif", outline: "none", borderRadius: 4, padding: "1px 3px", cursor: editable ? "text" : "default", transition: "background 120ms ease" }}
          >{url}</span>
        </div>
      </div>

      {/* Right — photo column (clickable in edit mode) */}
      <div
        onClick={onPhotoClick}
        style={{ width: 140, height: 566, flexShrink: 0, background: photoBg, overflow: "hidden", position: "relative", cursor: onPhotoClick ? "pointer" : "default" }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : onPhotoClick ? (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)", border: `1px dashed ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)"}`, borderRadius: 8, padding: "10px 14px", whiteSpace: "nowrap" }}>
            <Icon name="add_photo_alternate" size={16} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
            <span style={{ fontSize: 9, fontFamily: "Inter, system-ui, sans-serif", color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}>Add photo</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function getContrastRatio(hexA: string, hexB: string): number {
  const lum = (hex: string) => {
    const rgb = parseInt(hex.replace("#", ""), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8)  & 0xff) / 255;
    const b = (rgb & 0xff) / 255;
    const lin = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  };
  const [l1, l2] = [lum(hexA), lum(hexB)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

const FLYER_THEMES = [
  { id: "classic",  label: "Classic",  bg: "#FFFFFF", pill: "#000000", text: "#000000", pillText: "#FFFFFF" },
  { id: "shipday",  label: "Shipday",  bg: "#ECFDF5", pill: "#34D399", text: "#0A0A0A", pillText: "#000000" },
  { id: "ocean",    label: "Ocean",    bg: "#CFFAFE", pill: "#22D3EE", text: "#0A0A0A", pillText: "#000000" },
  { id: "royal",    label: "Royal",    bg: "#DBEAFE", pill: "#3B82F6", text: "#0A0A0A", pillText: "#FFFFFF" },
  { id: "violet",   label: "Violet",   bg: "#EDE9FE", pill: "#8B5CF6", text: "#0A0A0A", pillText: "#FFFFFF" },
  { id: "rose",     label: "Rose",     bg: "#FCE7F3", pill: "#EC4899", text: "#0A0A0A", pillText: "#FFFFFF" },
  { id: "crimson",  label: "Crimson",  bg: "#FEE2E2", pill: "#EF4444", text: "#0A0A0A", pillText: "#FFFFFF" },
  { id: "rust",     label: "Rust",     bg: "#FFEDD5", pill: "#FB923C", text: "#0A0A0A", pillText: "#000000" },
  { id: "amber",    label: "Amber",    bg: "#FEF3C7", pill: "#FCD34D", text: "#0A0A0A", pillText: "#000000" },
  { id: "stone",    label: "Stone",    bg: "#292524", pill: "#E7E5E4", text: "#F5F5F4", pillText: "#000000" },
  { id: "charcoal", label: "Charcoal", bg: "#1F2937", pill: "#F3F4F6", text: "#F9FAFB", pillText: "#000000" },
] as const;

function flyerThemeToTokens(ft: (typeof FLYER_THEMES)[number]) {
  const isDark = ft.id === "stone" || ft.id === "charcoal";
  return {
    bg:           ft.bg,
    textPrimary:  ft.text,
    textBody:     isDark ? "rgba(255,255,255,0.85)" : "#262626",
    taglineBg:    ft.bg,
    dividerColor: isDark ? "#444444" : `${ft.pill}99`,
    photoBg:      isDark
      ? `linear-gradient(180deg, ${ft.bg}CC 0%, #0A0A0A 100%)`
      : `linear-gradient(180deg, ${ft.pill}55 0%, ${ft.pill}CC 100%)`,
    dark: isDark,
  };
}

function DiscountLivePreview({ fields, themeId, photo }: PreviewProps) {
  const FLYER_H   = 517;
  const HEADER_H  = 264;
  const PICTURE_H = 253;

  const ft = (FLYER_THEMES as readonly FlyerTheme[]).find(t => t.id === themeId) ?? FLYER_THEMES[0];

  const name      = fields.businessName?.trim() || "";
  const headline  = fields.headline?.trim()     || "15% Off your next order";
  const promoCode = fields.details?.trim()      || "";
  const terms     = fields.termsText?.trim()    || "";
  const url       = fields.orderUrl?.trim()     || "yourbusiness.com/order";

  return (
    <div style={{ width: 400, height: FLYER_H, background: ft.bg, position: "relative", overflow: "hidden" }}>

      {/* Header */}
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "32px 24px", gap: 20,
        width: 400, height: HEADER_H, boxSizing: "border-box",
      }}>
        {/* Logo container */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", padding: "11px 16px", gap: 10, borderRadius: 8 }}>
          <div style={{ width: 18, height: 18, position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", width: 12.75, height: 12.75, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 12.75, height: 12.75, left: 5.27, top: 5.23, background: "#ABE571", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 7.71, height: 7.71, left: 5.14, top: 5.12, background: "#008062", borderRadius: "50%" }} />
          </div>
          {name && (
            <span style={{ fontSize: 11.76, fontWeight: 600, color: ft.text, fontFamily: "Inter, system-ui, sans-serif" }}>{name}</span>
          )}
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 352 }}>
          <div style={{ width: "100%", overflow: "hidden", maxHeight: 62 }}>
            <span style={{
              display: "block",
              fontSize: 28, fontWeight: 700, lineHeight: "110%",
              textAlign: "center", letterSpacing: "-0.02em",
              color: ft.text, fontFamily: "Inter, system-ui, sans-serif",
              wordBreak: "break-word",
            }}>
              {headline}
            </span>
          </div>

          {/* Promo code pill + terms */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "center", maxWidth: 300 }}>
            {promoCode && (
              <div style={{
                display: "inline-flex", flexDirection: "row", alignItems: "center",
                padding: "0 14px", gap: 6, background: ft.pill, borderRadius: 6, height: 32,
              }}>
                <span style={{ fontSize: 12, fontWeight: 400, color: ft.pillText, fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
                  Promo code
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: ft.pillText, fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
                  {promoCode}
                </span>
              </div>
            )}
            {terms && (
              <span style={{
                fontSize: 11, fontWeight: 400, color: ft.text,
                fontFamily: "Inter, system-ui, sans-serif", lineHeight: "150%",
                textAlign: "center", opacity: 0.7,
              }}>{terms}</span>
            )}
          </div>
        </div>
      </div>

      {/* Picture section */}
      <div style={{
        position: "absolute", width: 400, height: PICTURE_H,
        left: 0, bottom: 0, background: "#898989", overflow: "hidden",
      }}>
        {photo && <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}

        {/* QR Code container */}
        <div style={{
          position: "absolute", right: 16, bottom: 16,
          width: 108, height: 123, background: "#FFFFFF", borderRadius: 6,
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: 6, gap: 1, boxSizing: "border-box",
        }}>
          <span style={{
            fontSize: 10, fontWeight: 500, color: "#262626",
            textAlign: "center", width: 96, fontFamily: "Inter, system-ui, sans-serif",
            lineHeight: "140%",
          }}>Scan to order direct</span>
          <QRCodeSVG value={toQrUrl(url)} size={96} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

function FreeItemLivePreview({ fields, themeId, logo, photo, onPhotoClick, onLogoClick }: PreviewProps) {
  const flyerTheme = FLYER_THEMES.find(ft => ft.id === themeId);
  const tc         = flyerTheme ? flyerThemeToTokens(flyerTheme) : (MENU_PRICES_THEMES[themeId] ?? MENU_PRICES_THEMES.mint);
  const pillBg     = flyerTheme ? flyerTheme.pill     : "#2FD8A2";
  const pillText   = flyerTheme ? flyerTheme.pillText : "#0A0A0A";

  const name     = fields.businessName?.trim() || "Your Business";
  const headline = fields.headline?.trim()     || "Get free garlic knots on orders over $20";
  const promo    = fields.details?.trim()      || "OFF20";
  const terms    = fields.termsText?.trim()    || "T&Cs apply. Offer ends 30.05.26";
  const url      = fields.orderUrl?.trim()     || "yourbusiness.com/order";

  return (
    <div style={{ width: 400, height: 566, background: tc.bg, position: "relative", overflow: "hidden" }}>

      {/* Logo — top:20, left:20 */}
      <div style={{ position: "absolute", top: 20, left: 20, display: "flex", flexDirection: "row", alignItems: "center", padding: "11px 8px", gap: 10, borderRadius: 8 }}>
        <div onClick={onLogoClick} style={{ cursor: onLogoClick ? "pointer" : "default" }}>
          <LogoOrAvatar logo={logo} size={18} />
        </div>
        <span style={{ fontSize: 11.76, fontWeight: 600, color: tc.textPrimary, fontFamily: "Inter, system-ui, sans-serif", lineHeight: "140%" }}>
          {name}
        </span>
      </div>

      {/* Photo — 360×280, top:74, left:20 (taller for A4 proportion) */}
      <div
        onClick={onPhotoClick}
        style={{ position: "absolute", top: 74, left: 20, width: 360, height: 280, background: tc.photoBg, overflow: "hidden", cursor: onPhotoClick ? "pointer" : "default" }}
      >
        {photo ? (
          <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : onPhotoClick ? (
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, background: tc.dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)", border: `1px dashed ${tc.dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)"}`, borderRadius: 8, padding: "10px 14px", whiteSpace: "nowrap" }}>
            <Icon name="add_photo_alternate" size={16} color={tc.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
            <span style={{ fontSize: 9, fontFamily: "Inter, system-ui, sans-serif", color: tc.dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)" }}>Add photo</span>
          </div>
        ) : null}
      </div>

      {/* Content row — top:378 (74+280+24), left:20, width:360 */}
      <div style={{ position: "absolute", top: 378, left: 20, width: 360, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 32 }}>

        {/* Left: headline + promo + terms */}
        <div style={{ width: 228, flexShrink: 0, display: "flex", flexDirection: "column", gap: 18 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: tc.textPrimary, lineHeight: "100%", letterSpacing: "-0.02em", fontFamily: "Inter, system-ui, sans-serif" }}>
            {headline}
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "inline-flex", alignItems: "center", padding: "0 12px", height: 32, background: pillBg, borderRadius: 6, alignSelf: "flex-start" }}>
              <span style={{ fontSize: 12, fontWeight: 400, color: pillText, fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>
                Promo code <strong>{promo}</strong>
              </span>
            </div>
            <span style={{ fontSize: 11, fontWeight: 400, color: tc.textBody, fontFamily: "Inter, system-ui, sans-serif", lineHeight: "150%" }}>
              {terms}
            </span>
          </div>
        </div>

        {/* Right: QR code */}
        <div style={{ width: 100, height: 100, background: "#FFFFFF", borderRadius: 8, padding: 6, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <QRCodeSVG value={toQrUrl(url)} size={88} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

function EditorPreview({ templateId, fields, themeId, logo, photo, onFieldChange, onPhotoClick, onLogoClick }: { templateId: string; fields: Record<string, string>; themeId: string; logo?: string | null; photo?: string | null; onFieldChange?: (id: string, value: string) => void; onPhotoClick?: () => void; onLogoClick?: () => void }) {
  if (templateId === "discount") return <DiscountLivePreview fields={fields} themeId={themeId} logo={logo} photo={photo} />;
  if (templateId === "freeItem")  return <FreeItemLivePreview  fields={fields} themeId={themeId} logo={logo} photo={photo} onPhotoClick={onPhotoClick} onLogoClick={onLogoClick} />;
  return <MenuPricesLivePreview fields={fields} themeId={themeId} logo={logo} photo={photo} onFieldChange={onFieldChange} onPhotoClick={onPhotoClick} onLogoClick={onLogoClick} />;
}

/* ══════════════════════════════════════════════
   FLYER EDITOR MODAL
══════════════════════════════════════════════ */

type FlyerTheme = typeof FLYER_THEMES[number];
type FlyerTemplate = { id: string; label: string; description: string; badge?: string; preview: React.ReactNode; previewBg: string; previewOffsetY?: number; colorVariants?: string[]; defaultTheme?: string; flyerHeight?: number; templateDefaults?: Record<string, string>; flyerThemes?: readonly FlyerTheme[] };

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
  const flyerH = template.flyerHeight ?? 566;
  const fieldDefs       = templateFields[template.id] ?? templateFields.menuPrices;
  const availableThemes = template.colorVariants
    ? colorThemes.filter(ct => template.colorVariants!.includes(ct.id))
    : colorThemes;
  const isMenuPrices = template.id === "menuPrices";
  const bizFields   = fieldDefs.filter(f => BIZ_FIELD_IDS.has(f.id));
  const offerFields = fieldDefs.filter(f => !BIZ_FIELD_IDS.has(f.id));
  const [fields,             setFields]            = useState<Record<string, string>>({ ...(template.templateDefaults ?? {}), ...(initialFields ?? {}) });
  const [colorTheme, setColorTheme] = useState(() => {
    const raw = initialTheme ?? template.defaultTheme ?? "shipday";
    if (template.flyerThemes && !template.flyerThemes.find(ft => ft.id === raw)) {
      return template.defaultTheme ?? "classic";
    }
    return raw;
  });
  const [exportSize, setExportSize] = useState(initialExportSize ?? "print");
  const [downloading,        setDownloading]       = useState(false);
  const [logo,               setLogo]              = useState<string | null>(null);
  const [photo,              setPhoto]             = useState<string | null>(PRESET_FOOD_PHOTOS[0].url);
  const [editingBusinessInfo, setEditingBusinessInfo] = useState(false);
  const logoRef             = useRef<HTMLInputElement>(null);
  const photoRef            = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const flyerRef            = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      setPreviewScale(Math.min((width - 64) / 400, (height - 64) / flyerH, 1.4));
    };
    compute();
    const obs = new ResizeObserver(compute);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const setField = (id: string, val: string) => setFields(prev => ({ ...prev, [id]: val }));
  const hasContent = fieldDefs.some(f => fields[f.id]?.trim());

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setter(URL.createObjectURL(file));
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !downloading) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, downloading]);

  const handleSaveAndDownload = async () => {
    if (downloading || !hasContent || !flyerRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(flyerRef.current, {
        width: 400,
        height: flyerH,
        pixelRatio: 3,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${(fields.businessName || template.label).replace(/\s+/g, "-").toLowerCase()}-flyer.png`;
      link.href = dataUrl;
      link.click();
      onSave?.(fields, colorTheme, exportSize);
      onToast("Flyer downloaded!", "check_circle");
      onClose();
    } catch (err) {
      console.error("Export failed:", err);
      onToast("Export failed — please try again", "error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", background: t.surface, transition: "background 200ms ease" }}>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "0 28px", height: 60, flexShrink: 0, background: t.surface, borderBottom: `1px solid ${t.border}`, transition: "background 200ms ease, border 200ms ease" }}>
        <span style={{ fontFamily: EDITOR_FONT, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: t.text }}>{template.label}</span>
        <button onClick={onClose} style={{ width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: t.bgSecondary, border: "none", borderRadius: 99, cursor: "pointer" }}>
          <Icon name="close" size={20} color={t.textMuted} />
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "row", flex: 1, overflow: "hidden" }}>
        {/* ── Left panel: white, flat form, no cards ── */}
        <div className="[&::-webkit-scrollbar]:hidden" style={{ width: 440, flexShrink: 0, background: t.surface, borderRight: `1px solid ${t.border}`, overflowY: "auto", scrollbarWidth: "none", transition: "background 200ms ease, border 200ms ease" }}>
          <div style={{ padding: "24px 28px 40px", display: "flex", flexDirection: "column", gap: 24 }}>

            <input ref={logoRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload(e, setLogo)} />

            {/* Business info row — all templates */}
            {!editingBusinessInfo ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: t.bgSecondary, border: `1px solid ${t.border}`, borderRadius: 12 }}>
                <div onClick={() => logoRef.current?.click()} title="Change logo" style={{ flexShrink: 0, cursor: "pointer", position: "relative" }}>
                  <LogoOrAvatar logo={logo} size={44} />
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 99, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="photo_camera" size={11} color={t.textMuted} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: EDITOR_FONT, fontSize: 15, fontWeight: 700, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fields.businessName || "Your Business"}</div>
                  <div style={{ fontFamily: EDITOR_FONT, fontSize: 14, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{fields.orderUrl || "your-order-url.com"}</div>
                </div>
                <button onClick={() => setEditingBusinessInfo(true)} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontFamily: EDITOR_FONT, transition: "border-color 150ms ease" }} onMouseEnter={e => (e.currentTarget.style.borderColor = t.accent)} onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}>
                  <Icon name="edit" size={16} color={t.textMuted} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: t.textMuted }}>Edit</span>
                </button>
              </div>
            ) : (
              /* Edit mode — in-place */
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: t.bgSecondary, border: `1px solid ${t.accent}`, borderRadius: 12 }}>
                <div onClick={() => logoRef.current?.click()} title="Change logo" style={{ flexShrink: 0, cursor: "pointer", position: "relative" }}>
                  <LogoOrAvatar logo={logo} size={44} />
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 99, background: t.surface, border: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="photo_camera" size={11} color={t.textMuted} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                  {bizFields.map(f => (
                    <input
                      key={f.id}
                      value={fields[f.id] ?? ""}
                      onChange={e => setField(f.id, e.target.value)}
                      placeholder={f.placeholder}
                      style={{ width: "100%", height: 36, padding: "0 10px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontFamily: EDITOR_FONT, fontSize: 14, fontWeight: f.id === "businessName" ? 600 : 400, color: t.text, outline: "none", boxSizing: "border-box", transition: "border-color 150ms ease" }}
                      onFocus={e => (e.target.style.borderColor = t.accent)}
                      onBlur={e => (e.target.style.borderColor = t.border)}
                    />
                  ))}
                </div>
                <button onClick={() => setEditingBusinessInfo(false)} style={{ flexShrink: 0, padding: "6px 14px", background: t.accent, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: EDITOR_FONT, fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}>Done</button>
              </div>
            )}

            {/* Offer fields — only non-business fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {offerFields.map(f => (
                <EditorField key={f.id} label={f.label} placeholder={f.placeholder} value={fields[f.id] ?? ""} onChange={v => setField(f.id, v)} multiline={f.multiline} maxLength={f.maxLength} />
              ))}
            </div>

            {/* Color */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <span style={{ fontFamily: EDITOR_FONT, fontSize: 15, fontWeight: 500, color: t.text }}>Color</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                {template.flyerThemes ? (
                  template.flyerThemes.map(ft => {
                    const sel = colorTheme === ft.id;
                    const usesBg = ft.id === "stone" || ft.id === "charcoal" || ft.id === "classic";
                    return (
                      <div
                        key={ft.id}
                        onClick={() => setColorTheme(ft.id)}
                        title={ft.label}
                        style={{
                          width: 26, height: 26, borderRadius: 99,
                          background: usesBg ? ft.bg : ft.pill,
                          border: ft.id === "classic" ? "1.5px solid #D1D5DB" : (ft.id === "stone" || ft.id === "charcoal") ? "1.5px solid rgba(255,255,255,0.3)" : "none",
                          cursor: "pointer", flexShrink: 0,
                          boxShadow: sel
                            ? `0 0 0 2.5px ${t.surface}, 0 0 0 4.5px ${t.accent}`
                            : `0 0 0 2.5px ${t.surface}, 0 0 0 4.5px transparent`,
                          transition: "box-shadow 150ms ease",
                        }}
                      />
                    );
                  })
                ) : (
                  availableThemes.map(ct => {
                    const sel = colorTheme === ct.id;
                    return (
                      <div key={ct.id} onClick={() => setColorTheme(ct.id)} title={ct.label} style={{ width: 26, height: 26, borderRadius: 99, background: ct.dark, cursor: "pointer", flexShrink: 0, boxShadow: sel ? `0 0 0 2.5px ${t.surface}, 0 0 0 4.5px ${t.accent}` : `0 0 0 2.5px ${t.surface}, 0 0 0 4.5px transparent`, transition: "box-shadow 150ms ease" }} />
                    );
                  })
                )}
              </div>
            </div>

            {/* Photo */}
            {(
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <span style={{ fontFamily: EDITOR_FONT, fontSize: 15, fontWeight: 500, color: t.text }}>Photo</span>
                  <input ref={photoRef} type="file" accept="image/*" hidden onChange={e => handleFileUpload(e, setPhoto)} />
                  <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                    <div onClick={() => setPhoto(null)} title="No photo" style={{ width: 72, height: 96, borderRadius: 10, flexShrink: 0, cursor: "pointer", background: t.bgSecondary, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, border: `2px solid ${!photo ? t.accent : t.border}`, boxShadow: !photo ? `0 0 0 2px ${t.accentLight}` : "none", transition: "border-color 150ms ease, box-shadow 150ms ease" }}>
                      <Icon name="hide_image" size={20} color={!photo ? t.accent : t.textMuted} />
                      <span style={{ fontFamily: EDITOR_FONT, fontSize: 11, fontWeight: 500, color: !photo ? t.accent : t.textMuted }}>None</span>
                    </div>
                    {PRESET_FOOD_PHOTOS.slice(0, 3).map(preset => {
                      const isSelected = photo === preset.url;
                      return (
                        <div key={preset.id} onClick={() => setPhoto(preset.url)} title={preset.label} style={{ width: 72, height: 96, borderRadius: 10, flexShrink: 0, cursor: "pointer", overflow: "hidden", border: `2px solid ${isSelected ? t.accent : "transparent"}`, boxShadow: isSelected ? `0 0 0 2px ${t.accentLight}` : "0 0 0 1px rgba(0,0,0,0.10)", transition: "border-color 150ms ease, box-shadow 150ms ease", position: "relative" }}>
                          <img src={preset.url} alt={preset.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {isSelected && <div style={{ position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: 99, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} color="#FFFFFF" /></div>}
                        </div>
                      );
                    })}
                    {photo && !PRESET_FOOD_PHOTOS.slice(0, 3).some(p => p.url === photo) && PRESET_FOOD_PHOTOS.some(p => p.url === photo) && (
                      <div style={{ width: 72, height: 96, borderRadius: 10, flexShrink: 0, overflow: "hidden", border: `2px solid ${t.accent}`, boxShadow: `0 0 0 2px ${t.accentLight}`, position: "relative" }}>
                        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: 99, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} color="#FFFFFF" /></div>
                      </div>
                    )}
                    {photo && !PRESET_FOOD_PHOTOS.some(p => p.url === photo) && (
                      <div style={{ width: 72, height: 96, borderRadius: 10, flexShrink: 0, overflow: "hidden", border: `2px solid ${t.accent}`, boxShadow: `0 0 0 2px ${t.accentLight}`, position: "relative" }}>
                        <img src={photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div style={{ position: "absolute", bottom: 3, right: 3, width: 14, height: 14, borderRadius: 99, background: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="check" size={10} color="#FFFFFF" /></div>
                      </div>
                    )}
                    <button onClick={() => photoRef.current?.click()} style={{ width: 72, height: 96, borderRadius: 10, flexShrink: 0, cursor: "pointer", background: t.bgSecondary, border: `1.5px dashed ${t.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, fontFamily: EDITOR_FONT, transition: "border-color 150ms ease, background 150ms ease" }} title="Upload your own" onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = t.accent; (e.currentTarget as HTMLElement).style.background = t.accentLight; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.background = t.bgSecondary; }}>
                      <Icon name="upload" size={18} color={t.textMuted} />
                      <span style={{ fontFamily: EDITOR_FONT, fontSize: 14, fontWeight: 500, color: t.textMuted, lineHeight: 1 }}>Upload</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right panel: preview, no card, scales to fill ── */}
        <div ref={previewContainerRef} style={{ flex: 1, background: t.bgSecondary, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative", transition: "background 200ms ease" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: (t as any).dotPattern, backgroundSize: "20px 20px", opacity: 0.45, pointerEvents: "none" }} />

          {/* Floating format pill — bottom right */}
          <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 10, display: "flex", background: t.surface, borderRadius: 10, padding: 3, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: `1px solid ${t.border}` }}>
            {[
              { id: "print", label: "A4 / Letter" },
              { id: "social", label: "Social" },
            ].map(opt => {
              const sel = exportSize === opt.id;
              return (
                <div key={opt.id} onClick={() => setExportSize(opt.id)} style={{ cursor: "pointer", padding: "5px 14px", borderRadius: 7, background: sel ? t.bgSecondary : "transparent", transition: "background 150ms ease" }}>
                  <span style={{ fontFamily: EDITOR_FONT, fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? t.text : t.textMuted }}>{opt.label}</span>
                </div>
              );
            })}
          </div>

          <div style={{ width: 400, height: flyerH, transform: `scale(${previewScale})`, transformOrigin: "center center", flexShrink: 0, position: "relative" }}>
            <div ref={flyerRef} style={{ width: 400, height: flyerH, overflow: "hidden", borderRadius: 10, position: "relative", boxShadow: "0 8px 48px rgba(0,0,0,0.16)" }}>
              <EditorPreview
                templateId={template.id}
                fields={fields}
                themeId={colorTheme}
                logo={logo}
                photo={photo}
              />
              {exportSize === "social" && (
                <>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 400, border: "2px dashed rgba(1,173,133,0.5)", borderRadius: 10, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 400, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.35)", borderRadius: "0 0 10px 10px", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cropped in export</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: "20px 32px", height: 88, flexShrink: 0, borderTop: `1px solid ${t.border}`, background: t.surface, transition: "background 200ms ease" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onClose} style={{ padding: "12px 20px", height: 48, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", fontSize: 16, fontWeight: 500, color: t.text, fontFamily: "inherit", transition: "background 200ms ease, border 200ms ease, color 200ms ease" }}>
            Cancel
          </button>
        </div>
        <button onClick={handleSaveAndDownload} disabled={downloading || !hasContent} style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "12px 24px 12px 20px", gap: 8, height: 48, background: downloading || !hasContent ? t.border : t.accent, border: "none", borderRadius: 8, cursor: downloading || !hasContent ? "default" : "pointer", fontFamily: "inherit", transition: "background 200ms ease" }}>
          {downloading ? (
            <><DownloadSpinner /><span style={{ fontSize: 16, fontWeight: 500, color: t.textMuted }}>Preparing…</span></>
          ) : (
            <><Icon name="download" size={24} color={hasContent ? "#FFFFFF" : t.textMuted} /><span style={{ fontSize: 16, fontWeight: 500, color: hasContent ? "#FFFFFF" : t.textMuted }}>Save & download</span></>
          )}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLYER CARD THUMBNAILS
══════════════════════════════════════════════ */

function MenuPricesFlyerPreview({ account }: { account: AccountData }) {
  // Mint (light) theme — matches designer's default
  const bg          = "#EEFCF3";
  const textPrimary = "#0A0A0A";
  const textBody    = "#262626";
  const taglineBg   = "#D1FAE0";
  const dividerColor= "#BEEFDE";
  const photoBg     = "linear-gradient(180deg, #C8F5D8 0%, #A8D5B5 100%)";
  const name = account.businessName || "Your Restaurant";
  const url  = account.orderUrl     || "yourbusiness.com/menu";

  return (
    <div style={{ width: 260, height: 368, background: bg, display: "flex", flexDirection: "row", overflow: "hidden" }}>

      {/* Left content column — 169px (260/400 × 260) */}
      <div style={{ width: 169, height: 368, position: "relative", flexShrink: 0 }}>

        {/* Logo + name */}
        <div style={{ position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
          <BrandAvatar size={16} />
          <span style={{ fontSize: 9, fontWeight: 600, color: textPrimary, fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "-0.01em" }}>{name}</span>
        </div>

        {/* Message block */}
        <div style={{ position: "absolute", top: 60, left: 13, width: 143, display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
          <span style={{ fontSize: 23, fontWeight: 700, color: textPrimary, lineHeight: "100%", letterSpacing: "-0.02em", textAlign: "center", fontFamily: "Inter, system-ui, sans-serif" }}>
            Same food.<br />Higher price.
          </span>
        </div>

        {/* Divider */}
        <div style={{ position: "absolute", top: 148, left: "50%", transform: "translateX(-50%)", width: 58, height: 1, background: dividerColor }} />

        {/* Body copy */}
        <div style={{ position: "absolute", top: 160, left: 13, width: 143, textAlign: "center" }}>
          <span style={{ fontSize: 8.5, fontWeight: 400, color: textBody, lineHeight: "140%", fontFamily: "Inter, system-ui, sans-serif" }}>
            Apps add 30% to our prices.<br />Order direct, pay ours.
          </span>
        </div>

        {/* CTA bottom */}
        <div style={{ position: "absolute", bottom: 13, left: "50%", transform: "translateX(-50%)", width: 143, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 7, fontWeight: 500, color: textBody, fontFamily: "Inter, system-ui, sans-serif" }}>Order direct &amp; save.</span>
          <div style={{ background: "#FFFFFF", borderRadius: 5, padding: 4 }}>
            <QRCodeSVG value={toQrUrl(url)} size={57} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
          </div>
          <span style={{ fontSize: 7.5, fontWeight: 400, color: textBody, fontFamily: "Inter, system-ui, sans-serif", maxWidth: 130, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{url}</span>
        </div>
      </div>

      {/* Right photo column — 91px */}
      <div style={{ width: 91, height: 368, flexShrink: 0, background: photoBg, overflow: "hidden" }} />
    </div>
  );
}

function DiscountFlyerPreview({ account }: { account: AccountData }) {
  const url = account.orderUrl || "yourbusiness.com/order";
  return (
    <div style={{ width: 260, height: 336, background: "#EEFCF3", position: "relative", overflow: "hidden" }}>
      {/* Header area (~171px = 260 × 264/400) */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", gap: 13, width: 260, height: 171, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 12, height: 12, position: "relative", flexShrink: 0 }}>
            <div style={{ position: "absolute", width: 8.5, height: 8.5, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 8.5, height: 8.5, left: 3.5, top: 3.5, background: "#ABE571", borderRadius: "50%" }} />
            <div style={{ position: "absolute", width: 5.1, height: 5.1, left: 3.4, top: 3.4, background: "#008062", borderRadius: "50%" }} />
          </div>
          <span style={{ fontSize: 7.6, fontWeight: 600, color: "#000000", fontFamily: "Inter, system-ui, sans-serif" }}>{account.businessName}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 228 }}>
          <span style={{ fontSize: 18, fontWeight: 700, lineHeight: "110%", textAlign: "center", letterSpacing: "-0.02em", color: "#0A0A0A", fontFamily: "Inter, system-ui, sans-serif" }}>
            15% Off<br />your next direct order
          </span>
          <div style={{ background: "#6AEBBE", borderRadius: 4, height: 20, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 8px" }}>
            <span style={{ fontSize: 7.8, fontWeight: 400, color: "#0A0A0A", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>No code needed</span>
          </div>
        </div>
      </div>
      {/* Photo area */}
      <div style={{ position: "absolute", left: 0, bottom: 0, width: 260, height: 164, background: "#898989" }}>
        <div style={{ position: "absolute", right: 10, bottom: 10, width: 70, height: 80, background: "#FFFFFF", borderRadius: 4, display: "flex", flexDirection: "column", alignItems: "center", padding: 4, boxSizing: "border-box", gap: 1 }}>
          <span style={{ fontSize: 6.5, fontWeight: 500, color: "#262626", textAlign: "center", fontFamily: "Inter, system-ui, sans-serif" }}>Scan to order</span>
          <QRCodeSVG value={toQrUrl(url)} size={57} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

function FreeItemFlyerPreview({ account }: { account: AccountData }) {
  const bg   = "#ECFDF5";
  const url  = account.orderUrl || "yourbusiness.com/order";
  const photoUrl = PRESET_FOOD_PHOTOS[0].url.replace("w=400&h=566", "w=234&h=150");
  return (
    <div style={{ width: 260, height: 336, background: bg, position: "relative", overflow: "hidden" }}>
      {/* Logo */}
      <div style={{ position: "absolute", top: 13, left: 13, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 12, height: 12, position: "relative", flexShrink: 0 }}>
          <div style={{ position: "absolute", width: 8.5, height: 8.5, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 8.5, height: 8.5, left: 3.5, top: 3.5, background: "#ABE571", borderRadius: "50%" }} />
          <div style={{ position: "absolute", width: 5.1, height: 5.1, left: 3.4, top: 3.4, background: "#008062", borderRadius: "50%" }} />
        </div>
        <span style={{ fontSize: 7.6, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter, system-ui, sans-serif" }}>{account.businessName}</span>
      </div>
      {/* Photo */}
      <div style={{ position: "absolute", top: 48, left: 13, width: 234, height: 150, background: "#C8F5D8", overflow: "hidden" }}>
        <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {/* Content row */}
      <div style={{ position: "absolute", top: 214, left: 13, width: 234, display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 20 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", lineHeight: "100%", letterSpacing: "-0.02em", fontFamily: "Inter, system-ui, sans-serif", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" } as React.CSSProperties}>
            Get free garlic knots on orders over $20
          </span>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0 8px", height: 21, background: "#34D399", borderRadius: 4 }}>
            <span style={{ fontSize: 7.8, fontWeight: 400, color: "#0A0A0A", fontFamily: "Inter, system-ui, sans-serif", whiteSpace: "nowrap" }}>Promo code <strong>OFF20</strong></span>
          </div>
        </div>
        <div style={{ width: 65, height: 65, background: "#FFFFFF", borderRadius: 5, padding: 4, boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <QRCodeSVG value={toQrUrl(url)} size={57} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLYER TEMPLATES (built at render time with account)
══════════════════════════════════════════════ */

function buildFlyerTemplates(account: AccountData): FlyerTemplate[] {
  return [
    {
      id: "menuPrices",
      preview: <MenuPricesFlyerPreview account={account} />,
      previewBg: "#FFFFFF",
      label: "Store Menu Prices",
      description: "Show customers they pay your real prices — save $5–$15 vs. 3rd party.",
      flyerThemes: FLYER_THEMES,
      defaultTheme: "shipday",
    },
    {
      id: "discount",
      preview: <DiscountFlyerPreview account={account} />,
      previewBg: "#FFFFFF",
      label: "% Off Discount",
      description: "Offer a percentage discount on their next direct order.",
      defaultTheme: "violet",
      flyerHeight: 517,
      flyerThemes: FLYER_THEMES,
      templateDefaults: { headline: "15% Off your next direct order", details: "DIRECT15", termsText: "T&Cs apply · Valid until Dec 31, 2024" },
    },
    {
      id: "freeItem",
      preview: <FreeItemFlyerPreview account={account} />,
      previewBg: "#FFFFFF",
      label: "Free Item or Delivery",
      description: "Give away a free item or free delivery to drive first orders.",
      flyerThemes: FLYER_THEMES,
      defaultTheme: "royal",
      flyerHeight: 566,
      templateDefaults: { headline: "Get free garlic knots on orders over $20", details: "OFF20", termsText: "T&Cs apply. Offer ends 30.05.26" },
    },
  ];
}

/* ══════════════════════════════════════════════
   FLYER PREVIEW MODAL (eye icon)
══════════════════════════════════════════════ */

function FlyerPreviewModal({ template, account, onCreate, onClose }: { template: FlyerTemplate; account: AccountData; onCreate: () => void; onClose: () => void }) {
  const t = useTheme();
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", background: t.overlayBg }}>
      <div onClick={e => e.stopPropagation()} style={{ display: "flex", flexDirection: "column", background: t.surface, borderRadius: 20, boxShadow: "0px 24px 80px rgba(0,0,0,0.25)", width: 640, maxHeight: "92vh", overflow: "hidden", transition: "background 200ms ease" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", padding: "32px 32px 0" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", color: t.text }}>{template.label}</span>
            <span style={{ fontSize: 15, fontWeight: 400, color: t.textMuted, lineHeight: "150%" }}>{template.description}</span>
          </div>
          <button onClick={onClose} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginLeft: 16 }}>
            <Icon name="close" size={24} color={t.textMuted} />
          </button>
        </div>
        <div className="[&::-webkit-scrollbar]:hidden" style={{ padding: "40px 32px 48px", display: "flex", justifyContent: "center", overflowY: "auto", scrollbarWidth: "none" }}>
          <EditorPreview templateId={template.id} fields={{ ...(template.templateDefaults ?? {}), ...(account as unknown as Record<string, string>) }} themeId={template.defaultTheme ?? "shipday"} />
        </div>
        <div style={{ padding: "0 32px 32px" }}>
          <button onClick={() => { onClose(); onCreate(); }} style={{ width: "100%", height: 52, background: t.accent, border: "none", borderRadius: 10, cursor: "pointer", fontSize: 16, fontWeight: 600, color: "#FFFFFF", fontFamily: "inherit" }}>
            Create flyer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   FLYER CARD
══════════════════════════════════════════════ */

function FlyerCard({ template, account, onCreate, onToast }: { template: FlyerTemplate; account: AccountData; onCreate: () => void; onToast: (msg: string, icon?: string) => void }) {
  const t = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const previewBg = t.mode === "dark" ? t.bgSecondary : template.previewBg;
  return (
    <>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", transition: "background 200ms ease, border 200ms ease", position: "relative" }}>
        <div style={{ height: 220, background: previewBg, borderBottom: `1px solid ${t.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center", transition: "background 200ms ease" }}>
          <div style={{ position: "absolute", top: 10, transform: "scale(0.48)", transformOrigin: "top center" }}>
            <EditorPreview templateId={template.id} fields={{ ...(template.templateDefaults ?? {}), ...(account as unknown as Record<string, string>) }} themeId={template.defaultTheme ?? "mint"} photo={PRESET_FOOD_PHOTOS[0].url} />
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
          <button onClick={() => setShowPreview(true)} style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border 200ms ease" }}>
            <Icon name="visibility" size={20} color={t.textMuted} />
          </button>
        </div>
      </div>
      {showPreview && <FlyerPreviewModal template={template} account={account} onCreate={onCreate} onClose={() => setShowPreview(false)} />}
    </>
  );
}

/* ══════════════════════════════════════════════
   SAVED FLYER CARD
══════════════════════════════════════════════ */

function SavedFlyerCard({ flyer, flyerTemplates, onEdit, onToast }: { flyer: SavedFlyer; flyerTemplates: FlyerTemplate[]; onEdit: () => void; onToast: (msg: string, icon?: string) => void }) {
  const t = useTheme();
  const [downloading, setDownloading] = useState(false);
  const template  = flyerTemplates.find(tp => tp.id === flyer.templateId);
  const dateStr   = flyer.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const previewBg = t.mode === "dark" ? t.bgSecondary : (template?.previewBg ?? "#F9FAFC");

  const handleDownload = () => {
    if (downloading) return;
    setDownloading(true);
    setTimeout(() => { setDownloading(false); onToast("Flyer downloaded!", "download"); }, 1200);
  };

  return (
    <div style={{ width: 220, display: "flex", flexDirection: "column", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", transition: "background 200ms ease, border 200ms ease" }}>
      <div style={{ height: 220, background: previewBg, borderBottom: `1px solid ${t.border}`, position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center", transition: "background 200ms ease" }}>
        <div style={{ position: "absolute", top: 12, transform: "scale(0.55)", transformOrigin: "top center" }}>
          <EditorPreview templateId={flyer.templateId} fields={flyer.fields} themeId={flyer.themeId} />
        </div>
      </div>
      <div style={{ padding: "16px 16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: t.text, lineHeight: "140%" }}>{flyer.title}</span>
        <span style={{ fontSize: 13, fontWeight: 400, color: t.textMuted, lineHeight: "140%" }}>Created {dateStr} · {flyer.templateLabel}</span>
      </div>
      <div style={{ padding: "4px 16px 16px", display: "flex", flexDirection: "row", gap: 8 }}>
        <button onClick={handleDownload} disabled={downloading} style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: downloading ? "default" : "pointer", fontFamily: "inherit", transition: "background 200ms ease, border 200ms ease" }}>
          {downloading ? <DownloadSpinner /> : <><Icon name="download" size={18} color={t.textMuted} /><span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Download</span></>}
        </button>
        <button onClick={onEdit} style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, cursor: "pointer", flexShrink: 0, transition: "background 200ms ease, border 200ms ease" }}>
          <Icon name="edit" size={18} color={t.textMuted} />
        </button>
      </div>
    </div>
  );
}

/* (AccountInfoPanel removed — replaced by inline ConnectBusiness) */

/* ══════════════════════════════════════════════
   FLYERS CONTENT
══════════════════════════════════════════════ */

const DEFAULT_ACCOUNT: AccountData = {
  businessName:  "La Familia Katonah",
  tagline:       "Pizza & Italian-American · Since 2004",
  googleRating:  "4.7",
  reviewCount:   "280+",
  signatureDish: "Penne Alla Vodka",
  deliveryAreas: "Katonah · Bedford · Mt. Kisco",
  orderUrl:      "order.lafamiliakatonah.com",
};

function FlyersContent({ onToast, initialAccount }: { onToast: (msg: string, icon?: string) => void; initialAccount?: AccountData }) {
  const t = useTheme();
  const [account,      setAccount]      = useState<AccountData>(initialAccount ?? DEFAULT_ACCOUNT);
  const [isConnected,  setIsConnected]  = useState(false);
  const [showGBModal,  setShowGBModal]  = useState(false);
  const [editorFlyer,  setEditorFlyer]  = useState<FlyerTemplate | null>(null);
  const [savedFlyers,  setSavedFlyers]  = useState<SavedFlyer[]>([]);
  const [editingFlyer, setEditingFlyer] = useState<SavedFlyer | null>(null);

  const flyerTemplates = buildFlyerTemplates(account);

  const handleConnect = useCallback((data: AccountData) => {
    setAccount(data);
    setIsConnected(true);
    setShowGBModal(false);
    onToast(`Connected: ${data.businessName}`, "check_circle");
  }, [onToast]);

  const getPrefilledFields = (): Record<string, string> => ({ ...account });

  const handleSave = (templateId: string, templateLabel: string, fields: Record<string, string>, themeId: string, exportSize: string) => {
    const title =
      fields.freeItem?.trim()        ? `Free ${fields.freeItem}` :
      fields.discountPercent?.trim() ? `${fields.discountPercent}% Off` :
      fields.businessName?.trim()    || templateLabel;

    if (editingFlyer) {
      setSavedFlyers(prev => prev.map(f => f.id === editingFlyer.id ? { ...f, fields, themeId, exportSize, title } : f));
      setEditingFlyer(null);
    } else {
      setSavedFlyers(prev => [{ id: Date.now(), templateId, templateLabel, title, fields, themeId, exportSize, createdAt: new Date() }, ...prev]);
    }
  };

  const handleEdit = (flyer: SavedFlyer) => {
    const tmpl = flyerTemplates.find(tp => tp.id === flyer.templateId);
    if (!tmpl) return;
    setEditingFlyer(flyer);
    setEditorFlyer(tmpl);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 32, background: t.bg, transition: "background 200ms ease" }}>

        {savedFlyers.length > 0 && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "140%" }}>Your flyers</span>
              <div style={{ display: "flex", flexDirection: "row", gap: 20, flexWrap: "wrap" }}>
                {savedFlyers.map(f => <SavedFlyerCard key={f.id} flyer={f} flyerTemplates={flyerTemplates} onEdit={() => handleEdit(f)} onToast={onToast} />)}
              </div>
            </div>
            <div style={{ height: 1, background: t.border }} />
          </>
        )}

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, lineHeight: "140%" }}>Create a flyer</span>

          {isConnected ? (
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 24, marginTop: 4 }}>
              <div style={{ width: 22, height: 22, borderRadius: 99, background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="check" size={14} color="#16A34A" />
              </div>
              <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{account.businessName}</span>
              <button
                onClick={() => setShowGBModal(true)}
                style={{ fontSize: 13, fontWeight: 500, color: t.textMuted, background: "none", border: "none", cursor: "pointer", padding: "2px 4px", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: 2 }}
              >Change</button>
            </div>
          ) : (
            <button
              onClick={() => setShowGBModal(true)}
              style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: "9px 16px", height: 40, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 24, transition: "border-color 150ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = t.accent)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = t.border)}
            >
              <Icon name="travel_explore" size={18} color={t.accent} />
              <span style={{ fontSize: 14, fontWeight: 500, color: t.text }}>Connect Google Business</span>
            </button>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {flyerTemplates.map(tmpl => (
            <FlyerCard
              key={tmpl.id}
              template={tmpl}
              account={account}
              onCreate={() => { setEditingFlyer(null); setEditorFlyer(tmpl); }}
              onToast={onToast}
            />
          ))}
        </div>
      </div>

      {showGBModal && (
        <GoogleBusinessModal onConnect={handleConnect} onClose={() => setShowGBModal(false)} />
      )}

      {editorFlyer && (
        <FlyerEditorModal
          template={editorFlyer}
          onClose={() => { setEditorFlyer(null); setEditingFlyer(null); }}
          onToast={onToast}
          onSave={(fields, themeId, exportSize) => handleSave(editorFlyer.id, editorFlyer.label, fields, themeId, exportSize)}
          initialFields={editingFlyer?.fields ?? getPrefilledFields()}
          initialTheme={editingFlyer?.themeId}
          initialExportSize={editingFlyer?.exportSize}
        />
      )}
    </>
  );
}

/* ══════════════════════════════════════════════
   TAB 1 — QR CODES & TEMPLATES
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
          {format === "qr" ? (
            <div style={{ background: "#FFFFFF", borderRadius: 10, padding: 12 }}>
              <QRCodeSVG value={toQrUrl(linkPlaceholder)} size={164} level="M" fgColor="#0A0A0A" bgColor="#FFFFFF" />
            </div>
          ) : (
            <Icon name="image" size={80} color={t.border} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */

const tabs = [
  { id: "sms",    label: "SMS Subscribers" },
  { id: "reviews", label: "Reviews" },
  { id: "flyers", label: "Boost direct ordering" },
];

export default function MarketingMaterials({ account }: { account?: AccountData }) {
  const [activeTab, setActiveTab] = useState("sms");
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
          {activeTab === "sms" ? (
            <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: t.bg }}>
              <MaterialCard title="Collect SMS marketing subscribers" description="Let customers opt in to SMS promotions by scanning a code or clicking a link" linkLabel="Opt-in link" linkPlaceholder="https://shipday.com/sms/subscribe/your-store" formatLabel="Format" qrOptionLabel="QR Code" imageOptionLabel="Image" onToast={show} />
            </div>
          ) : activeTab === "reviews" ? (
            <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: t.bg }}>
              <MaterialCard title="Collect reviews by QR Code" description="Share a QR code or image that takes customers directly to your review page" linkLabel="Review page link" linkPlaceholder="https://g.page/r/your-business/review" formatLabel="Format" qrOptionLabel="QR Code" imageOptionLabel="Image" onToast={show} />
            </div>
          ) : (
            <FlyersContent onToast={show} initialAccount={account} />
          )}
        </div>
      </div>
      <ToastStack toasts={toasts} remove={remove} />
    </>
  );
}
