"use client";

import { useState } from "react";
import Icon from "@/components/ui/Icon";

/* ══════════════════════════════════════════════
   TAB 1 — ALL MATERIALS (QR Code cards)
══════════════════════════════════════════════ */

function MaterialCard({
  title,
  description,
  linkLabel,
  linkPlaceholder,
  formatLabel,
  qrOptionLabel,
  imageOptionLabel,
}: {
  title: string;
  description: string;
  linkLabel: string;
  linkPlaceholder: string;
  formatLabel: string;
  qrOptionLabel: string;
  imageOptionLabel: string;
}) {
  const [format, setFormat] = useState<"qr" | "image">("qr");

  return (
    <div style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 16, overflow: "hidden" }}>
      {/* Header */}
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

      {/* Body */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", padding: 24, gap: 56 }}>
        {/* Left */}
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

        {/* Right — QR preview */}
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

/* Mini flyer previews */

function PromotionFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      {/* Dark header */}
      <div style={{ background: "linear-gradient(96.98deg, #23232E 0%, #353545 100%)", padding: "28px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>20% OFF</span>
      </div>
      {/* Content */}
      <div style={{ padding: "20px 16px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11.7, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter, sans-serif" }}>Sunset Grocers</span>
          <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", fontFamily: "Inter, sans-serif", lineHeight: "140%" }}>Use code SAVE20 at checkout to get 20% off your next order. Valid for orders over $25.</span>
        </div>
        <div style={{ background: "#008062", borderRadius: 999, padding: "4px 13px" }}>
          <span style={{ fontSize: 9.1, fontWeight: 500, color: "#FFFFFF", fontFamily: "Inter, sans-serif" }}>Order Now →</span>
        </div>
      </div>
      {/* QR section */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373", fontFamily: "Inter, sans-serif" }}>Scan to order</span>
          <Icon name="qr_code_2" size={52} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function MenuFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      {/* Photo placeholder */}
      <div style={{ height: 104, background: "linear-gradient(135deg, #E8F4F0 0%, #C6E6DC 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="restaurant" size={40} color="#008062" />
      </div>
      {/* Content */}
      <div style={{ background: "#FFFFFF", padding: "20px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>New Sushi Menu</span>
        <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", fontFamily: "Inter, sans-serif", lineHeight: "140%" }}>Try our new handcrafted sushi rolls, made fresh daily with premium ingredients.</span>
      </div>
      {/* QR section */}
      <div style={{ background: "#EBFEF6", padding: "10px 16px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 7.8, padding: "10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: "100%" }}>
          <span style={{ fontSize: 8.45, fontWeight: 400, color: "#525252", fontFamily: "Inter, sans-serif" }}>Scan to view our menu</span>
          <Icon name="qr_code_2" size={72} color="#C8C8C0" />
        </div>
      </div>
    </div>
  );
}

function ReviewFlyerPreview() {
  return (
    <div style={{ width: 260, background: "#FFFFFF", borderRadius: 6.5, overflow: "hidden", boxShadow: "0px 2.6px 3.9px -0.65px rgba(0,0,0,0.05), 0px 13px 32.5px -7.8px rgba(0,0,0,0.15)" }}>
      {/* Amber header */}
      <div style={{ background: "linear-gradient(96.98deg, #A16207 0%, #CA8A04 100%)", padding: "22px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 15.6, fontWeight: 700, color: "#FFFFFF", textAlign: "center", fontFamily: "Inter, sans-serif", lineHeight: "130%" }}>Thank you for your order!</span>
      </div>
      {/* Content */}
      <div style={{ padding: "20px 16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 11.7, fontWeight: 600, color: "#0A0A0A", fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>How was your experience?</span>
          <span style={{ fontSize: 9.1, fontWeight: 400, color: "#525252", textAlign: "center", fontFamily: "Inter, sans-serif" }}>We'd love to hear your feedback.</span>
        </div>
        {/* Stars */}
        <div style={{ display: "flex", flexDirection: "row", gap: 7.8 }}>
          {[0,1,2,3,4].map(i => (
            <span key={i} style={{ fontSize: 15.6, color: "#EFB841" }}>★</span>
          ))}
        </div>
      </div>
      {/* QR section */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ background: "#F6FEF9", borderRadius: 7.8, padding: "12px 10px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 8.45, fontWeight: 500, color: "#737373", fontFamily: "Inter, sans-serif" }}>Scan here!</span>
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

function FlyerCard({ template }: { template: typeof flyerTemplates[0] }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 12, overflow: "hidden" }}>
      {/* Preview area */}
      <div style={{ height: 200, background: template.previewBg, borderBottom: "1px solid #E8E8E4", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
        <div style={{ position: "absolute", top: 24, transform: "scale(0.72)", transformOrigin: "top center" }}>
          {template.preview}
        </div>
      </div>

      {/* Label */}
      <div style={{ padding: "20px 24px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
        <span style={{ fontSize: 16, fontWeight: 800, color: "#0A0A0A", lineHeight: "150%" }}>{template.label}</span>
        <span style={{ fontSize: 15, fontWeight: 400, color: "#404040", lineHeight: "140%" }}>{template.description}</span>
      </div>

      {/* Buttons */}
      <div style={{ padding: "4px 24px 24px", display: "flex", flexDirection: "row", gap: 10 }}>
        <button style={{ flex: 1, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", padding: "10px 20px", gap: 6, height: 44, background: "#008062", border: "none", borderRadius: 8, cursor: "pointer" }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "24px" }}>Download</span>
        </button>
        <button style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF", border: "1px solid #E8E8E4", borderRadius: 8, cursor: "pointer", flexShrink: 0 }}>
          <Icon name="share" size={20} color="#525252" />
        </button>
      </div>
    </div>
  );
}

function FlyersContent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "44px 64px", gap: 40, background: "#FFFFFF" }}>
      {/* Section title */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", color: "#0A0A0A", lineHeight: "140%" }}>Create a new flyer</span>
        <span style={{ fontSize: 16, fontWeight: 350, color: "#404040", lineHeight: "150%" }}>Choose a template and download a ready-to-print or shareable flyer for your business</span>
      </div>

      {/* 3-column grid */}
      <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
        {flyerTemplates.map((t) => (
          <FlyerCard key={t.id} template={t} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */

const tabs = [
  { id: "all", label: "All materials" },
  { id: "flyers", label: "Flyers" },
];

export default function MarketingMaterials() {
  const [activeTab, setActiveTab] = useState("all");

  return (
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
          {tabs.map((tab) => {
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
        <FlyersContent />
      )}
    </div>
  );
}
