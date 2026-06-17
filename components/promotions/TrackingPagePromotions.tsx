"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Link2, Eye, ListOrdered } from "lucide-react";

type Tab = "Active" | "Inactive";

/* ── Instagram SVG icon ── */
function IgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <defs>
        <radialGradient id="ig1" cx="26.56%" cy="107.7%" r="92.18%">
          <stop offset="0%"   stopColor="#FFDD55" />
          <stop offset="10%"  stopColor="#FFDD55" />
          <stop offset="50%"  stopColor="#FF543E" />
          <stop offset="100%" stopColor="#C837AB" />
        </radialGradient>
        <radialGradient id="ig2" cx="-16.75%" cy="7.2%" r="179.06%">
          <stop offset="0%"   stopColor="#3771C8" />
          <stop offset="12.8%" stopColor="#3771C8" />
          <stop offset="100%" stopColor="rgba(102,0,255,0)" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig1)" />
      <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#ig2)" />
      <rect x="2.625" y="2.625" width="18.75" height="18.75" rx="4.5" fill="white" />
      <rect x="2.625" y="2.625" width="18.75" height="18.75" rx="4.5" fill="url(#ig1)" fillOpacity="0.7" />
      <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="1.8" fill="none" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="white" />
    </svg>
  );
}

/* ── Card component ── */
type CardData = {
  id: number;
  bg: string;
  illustration: React.ReactNode;
  title: string;
  cta: { type: "button"; label: string } | { type: "link"; label: string };
  status: { emoji: string; text: string };
};

function AdCard({ card }: { card: CardData }) {
  return (
    <div style={{
      width: 382, height: 212,
      display: "flex", flexDirection: "column",
      filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.12))",
      flexShrink: 0,
    }}>
      {/* Top section: 382 × 160 */}
      <div style={{
        display: "flex", flexDirection: "row", alignItems: "center",
        width: 382, height: 160,
        background: card.bg,
        borderRadius: "10px 10px 0 0",
        overflow: "hidden",
      }}>
        {/* Image container: 140 × 160 */}
        <div style={{
          width: 140, height: 160, flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {card.illustration}
        </div>

        {/* Ad container: 242 × 160, padding 18, gap 16 */}
        <div style={{
          width: 242, height: 160, flexShrink: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: 18, gap: 16,
          boxSizing: "border-box",
        }}>
          {/* Description */}
          <span style={{
            width: 198, maxHeight: 72,
            fontFamily: "Inter, sans-serif",
            fontWeight: 500, fontSize: 16, lineHeight: "150%",
            color: "#0A0A0A",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {card.title}
          </span>

          {/* CTA or link */}
          {card.cta.type === "button" ? (
            <div style={{
              display: "inline-flex", flexDirection: "row", alignItems: "center",
              padding: "7px 12px", gap: 2,
              background: "#171717", borderRadius: 8,
              cursor: "pointer", alignSelf: "flex-start",
            }}>
              <span style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 500, fontSize: 14, lineHeight: "140%",
                color: "#FFFFFF", whiteSpace: "nowrap",
              }}>
                {card.cta.label}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: 206 }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Link2 size={20} color="#737373" strokeWidth={1.8} />
                <span style={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 500, fontSize: 14, lineHeight: "140%",
                  color: "#262626",
                }}>
                  {card.cta.label}
                </span>
              </div>
              <IgIcon />
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar: 382 × 52 */}
      <div style={{
        display: "flex", flexDirection: "row",
        justifyContent: "space-between", alignItems: "center",
        padding: "10px 6px 10px 12px", gap: 33,
        width: 382, height: 52,
        background: "#FFFFFF",
        borderRadius: "0 0 10px 10px",
        boxSizing: "border-box",
      }}>
        {/* Status */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, flex: 1 }}>
          <span style={{ fontSize: 17, lineHeight: "140%" }}>{card.status.emoji}</span>
          <span style={{
            fontFamily: "Avenir, Inter, sans-serif",
            fontWeight: 400, fontSize: 16, lineHeight: "140%",
            color: "#404040",
          }}>
            {card.status.text}
          </span>
        </div>
        {/* Navigate (⋮) */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32, borderRadius: 100,
          cursor: "pointer",
        }}>
          <MoreHorizontal size={20} color="#525252" />
        </div>
      </div>
    </div>
  );
}

/* ── Card illustrations (placeholder photos) ── */

/* loremflickr.com returns photos by keyword; lock= ensures the same image each time */
const PHOTO = {
  tacos:      "https://loremflickr.com/140/160/tacos,mexican-food?lock=3",
  pizza:      "https://loremflickr.com/140/160/pizza,italian-food?lock=7",
  restaurant: "https://loremflickr.com/140/160/food,restaurant?lock=12",
};

function FoodIllustration() {
  return (
    <img src={PHOTO.tacos} alt="" style={{ width: 140, height: 160, objectFit: "cover", display: "block" }} />
  );
}

function PizzaIllustration() {
  return (
    <div style={{ width: 140, height: 160, position: "relative", overflow: "hidden" }}>
      <img src={PHOTO.pizza} alt="" style={{ width: 140, height: 160, objectFit: "cover", display: "block" }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, background: "rgba(0,0,0,0.5)", borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "12px solid #FFFFFF", marginLeft: 3 }} />
        </div>
      </div>
    </div>
  );
}

function GiftIllustration() {
  return (
    <img src={PHOTO.restaurant} alt="" style={{ width: 140, height: 160, objectFit: "cover", display: "block" }} />
  );
}

const CARDS: CardData[] = [
  {
    id: 1,
    bg: "#BBF3DC",
    illustration: <FoodIllustration />,
    title: "Order direct and save up to 20%",
    cta: { type: "button", label: "Direct ordering link" },
    status: { emoji: "🔥", text: "Promotion is gaining attention!" },
  },
  {
    id: 2,
    bg: "#ECD7F9",
    illustration: <PizzaIllustration />,
    title: "Algun Lugar Pizzeria on Instagram",
    cta: { type: "link", label: "Instagram.com" },
    status: { emoji: "🎉", text: "109 customers viewed this promotion" },
  },
  {
    id: 3,
    bg: "#FFE4F3",
    illustration: <GiftIllustration />,
    title: "Welcome to our new Store in Zapopan, Guadalajara!",
    cta: { type: "button", label: "Direct ordering link" },
    status: { emoji: "🔥", text: "Promotion is gaining attention!" },
  },
];

/* ── Main component ── */
export default function TrackingPagePromotions() {
  const [activeTab, setActiveTab] = useState<Tab>("Active");

  const rows: CardData[][] = [];
  const active = activeTab === "Active" ? CARDS : [];
  for (let i = 0; i < active.length; i += 2) {
    rows.push(active.slice(i, i + 2));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", background: "#FFFFFF", flex: 1, overflowY: "auto" }}>

      {/* ── Title ── */}
      <div style={{ padding: "32px 64px 0px", gap: 16, display: "flex", flexDirection: "column" }}>
        <h1 style={{
          fontFamily: "Avenir, Inter, sans-serif",
          fontWeight: 800, fontSize: 26, lineHeight: "40px",
          letterSpacing: "-0.02em", color: "#0A0A0A",
          margin: 0, width: 306,
        }}>
          Tracking Page promotions
        </h1>
      </div>

      {/* ── Controls row: tabs (left) + buttons (right) ── */}
      <div style={{
        display: "flex", flexDirection: "row",
        justifyContent: "space-between", alignItems: "flex-end",
        padding: "28px 64px 0px", gap: 16,
      }}>
        {/* Tabs */}
        <div style={{ display: "flex", flexDirection: "row", gap: 0, alignItems: "flex-end" }}>
          {(["Active", "Inactive"] as Tab[]).map(tab => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "0 4px 10px", marginRight: 20,
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "Avenir, Inter, sans-serif",
                  fontSize: 16, fontWeight: isActive ? 600 : 400,
                  color: isActive ? "#03624C" : "#6B6B6B",
                  borderBottom: `2px solid ${isActive ? "#008062" : "transparent"}`,
                  lineHeight: "22px",
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16 }}>
          {/* New Promotion */}
          <button style={{
            display: "flex", flexDirection: "row", alignItems: "center",
            padding: "8px 16px 8px 12px", gap: 6, height: 40,
            background: "#008062", borderRadius: 8, border: "none", cursor: "pointer",
            fontFamily: "Avenir, Inter, sans-serif", whiteSpace: "nowrap",
          }}>
            <Plus size={24} color="#FFFFFF" />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#FFFFFF", lineHeight: "140%", whiteSpace: "nowrap" }}>
              New Promotion
            </span>
          </button>

          {/* Live preview */}
          <button style={{
            display: "flex", flexDirection: "row", alignItems: "center",
            padding: "8px 16px 8px 12px", gap: 6, height: 40,
            background: "#FFFFFF", border: "1px solid #E3E4EB", borderRadius: 8, cursor: "pointer",
            fontFamily: "Avenir, Inter, sans-serif", whiteSpace: "nowrap",
          }}>
            <Eye size={24} color="#525252" strokeWidth={1.5} />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#262626", lineHeight: "140%", whiteSpace: "nowrap" }}>
              Live preview
            </span>
          </button>

          {/* Reorder */}
          <button style={{
            display: "flex", flexDirection: "row", alignItems: "center",
            padding: "8px 16px 8px 12px", gap: 6, height: 40,
            background: "#FFFFFF", border: "1px solid #E3E4EB", borderRadius: 8, cursor: "pointer",
            fontFamily: "Avenir, Inter, sans-serif", whiteSpace: "nowrap",
          }}>
            <ListOrdered size={24} color="#525252" strokeWidth={1.5} />
            <span style={{ fontSize: 16, fontWeight: 500, color: "#262626", lineHeight: "140%", whiteSpace: "nowrap" }}>
              Reorder
            </span>
          </button>
        </div>
      </div>

      {/* ── Cards area ── */}
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "flex-start",
        padding: "40px 64px",
        gap: 32,
      }}>
        {rows.length > 0 ? rows.map((row, ri) => (
          <div key={ri} style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 32 }}>
            {row.map(card => <AdCard key={card.id} card={card} />)}
          </div>
        )) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: 200 }}>
            <span style={{ fontSize: 15, color: "#6B6B6B" }}>No inactive promotions</span>
          </div>
        )}
      </div>
    </div>
  );
}
