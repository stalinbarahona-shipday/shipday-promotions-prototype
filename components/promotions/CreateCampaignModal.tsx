"use client";

import { useState, useEffect } from "react";
import {
  X, Wifi, Battery, Signal, Mic, Plus,
  Tag, BookOpen, Gift, Calendar, Bell, Zap, PartyPopper, Users2, FileText,
  TicketPercent, RefreshCw, MessageSquare,
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

/* ── Template data ── */

const MESSAGE_TEMPLATES = [
  { id: "discount",    icon: Tag,          label: "Discount offer",     body: "Get 15% off your next order when you order direct on our website. Use code [XXXXXX] at checkout." },
  { id: "lapsed",      icon: RefreshCw,    label: "Long time no see",   body: "Long time no see! We're missing you. 25% off when you order direct on our website. Code: [XXXXXX]" },
  { id: "exclusive",   icon: Gift,         label: "Exclusive deal!",    body: "Exclusive 20% off — direct website order only. Code: [XXXXXX]. Don't miss out!" },
  { id: "invitation",  icon: Calendar,     label: "Website invitation", body: "Try delivery from our website — $5 off + prices up to 15% below apps. Code: [XXXXXX]" },
  { id: "missyou",     icon: Bell,         label: "We miss you",        body: "We miss you! 30% off with a direct website order. Code: [XXXXXX]. Order now at {link}" },
  { id: "flash",       icon: Zap,          label: "Flash deal",         body: "⚡ Flash deal! Unlock 15% off — order direct on our website. Code: [XXXXXX]. Today only!" },
  { id: "seasonal",    icon: PartyPopper,  label: "Seasonal specials",  body: "We miss you! Take 25% off by ordering on our website (direct). Code: [XXXXXX]" },
  { id: "vip",         icon: Users2,       label: "VIP update",         body: "VIP deal — 20% off with a direct website order. Code: [XXXXXX]. Exclusive for you!" },
  { id: "offernews",   icon: FileText,     label: "Offer news",         body: "Make it easy — try direct delivery. $5 off code [XXXXXX] + up to 15% below apps." },
];

const OFFER_TEMPLATES = [
  { id: "firstorder",  icon: Tag,          label: "First order deal",   body: "Welcome! Enjoy $5 off your first direct order with us. Code: [XXXXXX] at {link}" },
  { id: "refer",       icon: Users2,       label: "Refer a friend",     body: "Share the love! Refer a friend and you both get 10% off your next order. Code: [XXXXXX]" },
  { id: "loyalty",     icon: TicketPercent,label: "Loyalty reward",     body: "Thank you for being a loyal customer! Here's 20% off your next order. Code: [XXXXXX]" },
  { id: "bundle",      icon: Gift,         label: "Bundle deal",        body: "Order any 2 items and get a free dessert! Use code [XXXXXX] at checkout. {link}" },
  { id: "weekend",     icon: PartyPopper,  label: "Weekend special",    body: "This weekend only — 15% off all orders! Code: [XXXXXX]. Order at {link} 🎉" },
  { id: "birthday",    icon: BookOpen,     label: "Birthday offer",     body: "Happy birthday! 🎂 Enjoy a free item on us with any order. Code: [XXXXXX]" },
];

const AUDIENCES = [
  { id: "all",           label: "All consented customers", count: 7 },
  { id: "first-time",    label: "First time customers",    count: 0 },
  { id: "high-value",    label: "High value customers",    count: 0 },
  { id: "re-engagement", label: "Re-engagement",           count: 1 },
  { id: "lapsed",        label: "Lapsed customers",        count: 2 },
  { id: "near-store",    label: "Customers near store",    count: 1 },
];

/* ── Template picker modal ── */

function TemplatePicker({
  onSelect,
  onClose,
}: {
  onSelect: (body: string) => void;
  onClose: () => void;
}) {
  const t = useTheme();
  const [tab, setTab]           = useState<"messages" | "offers">("messages");
  const [selected, setSelected] = useState<string | null>(null);

  const templates = tab === "messages" ? MESSAGE_TEMPLATES : OFFER_TEMPLATES;
  const selectedTpl = templates.find(t => t.id === selected);

  useEffect(() => { setSelected(null); }, [tab]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 760, background: t.bg, borderRadius: 20, boxShadow: t.cardShadow, display: "flex", flexDirection: "column", maxHeight: "80vh", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ padding: "28px 28px 20px", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: t.text, margin: 0, letterSpacing: "-0.02em" }}>Select a template</h3>
            <p style={{ fontSize: 14, color: t.textSecondary, margin: "4px 0 0" }}>Pick a template for your SMS message</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 99, border: `1px solid ${t.border}`, background: t.bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={16} color={t.textMuted} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding: "0 28px", display: "flex", gap: 24, borderBottom: `1px solid ${t.border}`, flexShrink: 0 }}>
          {(["messages", "offers"] as const).map(id => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "14px 0",
                border: "none", borderBottom: tab === id ? `2px solid ${t.accent}` : "2px solid transparent",
                background: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 14, fontWeight: tab === id ? 700 : 400,
                color: tab === id ? t.accentText : t.textSecondary,
                marginBottom: -1,
              }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ overflowY: "auto", padding: "20px 28px 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {templates.map(tpl => {
            const Icon = tpl.icon;
            const isSelected = selected === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelected(tpl.id)}
                style={{
                  textAlign: "left", padding: "16px", border: `1.5px solid ${isSelected ? t.accent : t.border}`,
                  borderRadius: 12, background: isSelected ? t.accentLight : t.bg,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 10,
                  transition: "border-color 120ms ease, background 120ms ease",
                }}
                onMouseEnter={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = t.accent + "66"; } }}
                onMouseLeave={e => { if (!isSelected) { (e.currentTarget as HTMLElement).style.borderColor = t.border; } }}
              >
                <Icon size={18} color={isSelected ? t.accent : t.textMuted} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: t.text, margin: "0 0 4px" }}>{tpl.label}</p>
                  <p style={{ fontSize: 13, color: t.textMuted, margin: 0, lineHeight: "18px" }}>
                    {tpl.body.length > 80 ? tpl.body.slice(0, 80) + "…" : tpl.body}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 28px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "flex-end", gap: 10, flexShrink: 0 }}>
          <button onClick={onClose} style={{ padding: "10px 22px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.bg, fontSize: 14, fontWeight: 600, color: t.text, cursor: "pointer", fontFamily: "inherit" }}>
            Cancel
          </button>
          <button
            disabled={!selectedTpl}
            onClick={() => { if (selectedTpl) { onSelect(selectedTpl.body); onClose(); } }}
            style={{ padding: "10px 22px", borderRadius: 10, border: "none", background: selectedTpl ? t.accent : t.border, fontSize: 14, fontWeight: 600, color: selectedTpl ? "#fff" : t.textMuted, cursor: selectedTpl ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background 150ms ease" }}
          >
            Use this template
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main modal ── */

interface Props {
  onClose: () => void;
  preselectedAudience?: string;
}

export default function CreateCampaignModal({ onClose, preselectedAudience }: Props) {
  const t = useTheme();
  const [name, setName]               = useState("New SMS Campaign");
  const [message, setMessage]         = useState("");
  const [audience, setAudience]       = useState(preselectedAudience ?? "all");
  const [schedule, setSchedule]       = useState<"now" | "later">("now");
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showAudience, setShowAudience]             = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && !showTemplatePicker) onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, showTemplatePicker]);

  const selectedAudience = AUDIENCES.find(a => a.id === audience) ?? AUDIENCES[0];
  const canLaunch = name.trim().length > 0 && message.trim().length > 0;

  return (
    <>
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1000,
          background: t.bg,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div style={{ padding: "36px 56px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", color: t.text, margin: 0, lineHeight: "34px" }}>
              Create Campaign
            </h2>
            <p style={{ fontSize: 15, color: t.textSecondary, margin: "6px 0 0", fontWeight: 400 }}>
              Pick a template or write your message to start your SMS campaign.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 99, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}
          >
            <X size={22} color={t.textMuted} />
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", marginTop: 32 }}>

          {/* Left — form */}
          <div style={{ flex: 1, padding: "0 56px 32px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Campaign name */}
            <Field label="Campaign name">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: "100%", height: 48, padding: "0 16px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 15, color: t.text, background: t.bg, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = t.accent)}
                onBlur={e => (e.currentTarget.style.borderColor = t.border)}
              />
            </Field>

            {/* Message */}
            <Field
              label="Your message"
              action={
                <button
                  onClick={() => setShowTemplatePicker(true)}
                  style={{ display: "flex", alignItems: "center", gap: 7, padding: "7px 14px", borderRadius: 8, border: "none", background: "#EBFEF6", cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#008062", fontFamily: "inherit" }}
                >
                  <FileText size={14} color="#008062" />
                  Select from templates
                </button>
              }
            >
              <div style={{ border: `1px solid ${t.border}`, borderRadius: 10, overflow: "hidden" }}>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Write a short message to promote an offer, event, or update. E.g. Come by this Friday for 15% off your order! yourlink.com..."
                  rows={5}
                  style={{ width: "100%", padding: "14px 16px 10px", border: "none", fontSize: 15, color: t.text, background: t.bg, outline: "none", resize: "none", fontFamily: "inherit", boxSizing: "border-box", lineHeight: "150%", display: "block" }}
                />
                <div style={{ padding: "8px 14px", background: t.bgSecondary, borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: 13, color: t.textMuted }}>
                    {Math.ceil(Math.max(message.length, 1) / 160)} / 2 segments
                  </span>
                </div>
              </div>
            </Field>

            {/* Send to */}
            <Field label="Send to">
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setShowAudience(v => !v)}
                  style={{ width: "100%", height: 48, padding: "0 16px", border: `1px solid ${showAudience ? t.accent : t.border}`, borderRadius: 10, fontSize: 15, color: t.text, background: t.bg, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", boxSizing: "border-box" }}
                >
                  <span>{selectedAudience.label} ({selectedAudience.count})</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: showAudience ? "rotate(180deg)" : "none", transition: "transform 150ms ease" }}>
                    <path d="M4 6l4 4 4-4" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {showAudience && (
                  <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: t.bg, border: `1px solid ${t.border}`, borderRadius: 12, overflow: "hidden", zIndex: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}>
                    {AUDIENCES.map((a, i) => (
                      <button
                        key={a.id}
                        onClick={() => { setAudience(a.id); setShowAudience(false); }}
                        style={{ width: "100%", padding: "12px 16px", border: "none", background: a.id === audience ? t.accentLight : t.bg, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: i < AUDIENCES.length - 1 ? `1px solid ${t.border}` : "none" }}
                        onMouseEnter={e => { if (a.id !== audience) (e.currentTarget as HTMLElement).style.background = t.bgSecondary; }}
                        onMouseLeave={e => { if (a.id !== audience) (e.currentTarget as HTMLElement).style.background = t.bg; }}
                      >
                        <span style={{ fontSize: 15, color: t.text }}>{a.label}</span>
                        <span style={{ fontSize: 14, color: t.textMuted }}>{a.count} customers</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>

            {/* Schedule */}
            <Field label="When would you like to send your campaign?">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["now", "later"] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => setSchedule(opt)}
                    style={{
                      padding: "13px 16px",
                      border: `1.5px solid ${schedule === opt ? "#0A0A0A" : t.border}`,
                      borderRadius: 10,
                      background: t.bg,
                      cursor: "pointer", fontFamily: "inherit",
                      fontSize: 15, fontWeight: schedule === opt ? 600 : 400,
                      color: schedule === opt ? t.text : t.textSecondary,
                      transition: "all 150ms ease",
                    }}
                  >
                    {opt === "now" ? "Send immediately" : "Schedule date and time"}
                  </button>
                ))}
              </div>
              {schedule === "later" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                  <input type="date" style={{ height: 48, padding: "0 16px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 15, color: t.text, background: t.bg, outline: "none", fontFamily: "inherit" }} />
                  <input type="time" style={{ height: 48, padding: "0 16px", border: `1px solid ${t.border}`, borderRadius: 10, fontSize: 15, color: t.text, background: t.bg, outline: "none", fontFamily: "inherit" }} />
                </div>
              )}
            </Field>
          </div>

          {/* Right — SMS preview */}
          <div style={{ width: 380, borderLeft: `1px solid ${t.border}`, padding: "0 36px 32px", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, background: "#FFFFFF", overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
              <span style={{ fontSize: 17, fontWeight: 700, color: t.text }}>SMS Preview</span>
              <button style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500, color: t.accent, padding: 0, fontFamily: "inherit" }}>
                <MessageSquare size={14} color={t.accent} />
                Send test SMS
              </button>
            </div>
            <p style={{ fontSize: 14, color: t.textMuted, margin: 0, lineHeight: "140%" }}>
              This is how your message will appear to customers.
            </p>

            {/* Phone mockup */}
            <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 16 }}>
              <div style={{
                width: 270,
                background: "#FFFFFF",
                borderRadius: 22,
                border: "1.5px solid #D1D5DB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
                overflow: "hidden",
                fontFamily: "system-ui, sans-serif",
              }}>
                {/* Status bar */}
                <div style={{ padding: "13px 18px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#FAFAFA" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>09:41</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Signal size={12} color="#0A0A0A" />
                    <Wifi size={12} color="#0A0A0A" />
                    <Battery size={12} color="#0A0A0A" />
                  </div>
                </div>
                {/* Contact header */}
                <div style={{ background: "#FAFAFA", borderBottom: "1px solid #EBEBEB", padding: "6px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#EBFEF6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 20, height: 20, position: "relative" }}>
                      <div style={{ position: "absolute", width: 13, height: 13, left: 0, top: 0, background: "#01AD85", borderRadius: "50%" }} />
                      <div style={{ position: "absolute", width: 13, height: 13, left: 6, top: 6, background: "#ABE571", borderRadius: "50%" }} />
                      <div style={{ position: "absolute", width: 8, height: 8, left: 6, top: 6, background: "#008062", borderRadius: "50%" }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>Your business</span>
                </div>
                {/* Message area */}
                <div style={{ padding: "16px 14px", minHeight: 160, background: "#FFFFFF" }}>
                  <div style={{ background: "#E9E9EB", borderRadius: "16px 16px 16px 4px", padding: "10px 13px", maxWidth: "88%", display: "inline-block" }}>
                    <p style={{ fontSize: 13, color: message.trim() ? "#0A0A0A" : "#6B6B6B", margin: 0, lineHeight: "148%", wordBreak: "break-word" }}>
                      {message.trim() || "Your message will appear here once you start creating your campaign."}
                    </p>
                  </div>
                </div>
                {/* Input bar */}
                <div style={{ borderTop: "1px solid #EBEBEB", padding: "9px 12px", display: "flex", alignItems: "center", gap: 8, background: "#FFFFFF" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", border: "1px solid #D1D5DB", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Plus size={13} color="#737373" />
                  </div>
                  <div style={{ flex: 1, height: 30, background: "#F2F2F7", borderRadius: 15, display: "flex", alignItems: "center", paddingLeft: 11 }}>
                    <span style={{ fontSize: 12, color: "#9CA3AF" }}>SMS text</span>
                  </div>
                  <Mic size={15} color="#737373" />
                </div>
                {/* Home indicator */}
                <div style={{ padding: "7px 0 9px", display: "flex", justifyContent: "center", background: "#FFFFFF" }}>
                  <div style={{ width: 72, height: 4, borderRadius: 4, background: "#D1D1D6" }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: "18px 48px", borderTop: `1px solid ${t.border}`, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16, flexShrink: 0 }}>
          <button
            onClick={onClose}
            style={{ padding: "11px 20px", borderRadius: 10, border: "none", background: "none", fontSize: 15, fontWeight: 500, color: t.textSecondary, cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancel
          </button>
          <button
            disabled={!canLaunch}
            style={{ padding: "11px 28px", borderRadius: 10, border: "none", background: canLaunch ? t.accent : "#D1D5DB", fontSize: 15, fontWeight: 600, color: canLaunch ? "#FFFFFF" : "#9CA3AF", cursor: canLaunch ? "pointer" : "not-allowed", fontFamily: "inherit", transition: "background 150ms ease" }}
          >
            Launch campaign
          </button>
        </div>
      </div>

      {showTemplatePicker && (
        <TemplatePicker
          onSelect={body => setMessage(body)}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}
    </>
  );
}

/* ── Field wrapper ── */
function Field({ label, action, children }: { label: string; action?: React.ReactNode; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{label}</span>
        {action}
      </div>
      {children}
    </div>
  );
}
