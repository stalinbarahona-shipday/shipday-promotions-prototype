"use client";

import { useState } from "react";
import {
  Megaphone, Users, Sparkles, MessageCircleHeart,
  ChevronRight, ChevronDown, Info, Plus, TrendingUp, TrendingDown,
  UserPlus, Crown, RefreshCw, ShoppingBag, Moon, ThumbsDown, MapPin,
  Search,
} from "lucide-react";
import { useTheme } from "@/components/ThemeContext";
import CreateCampaignModal from "@/components/promotions/CreateCampaignModal";
import AutomateModal from "@/components/promotions/AutomateModal";
import SubscriberModal from "@/components/promotions/SubscriberModal";

/* ── Tokens (from Figma) ── */
const C = {
  text:         "#0A0A0A",
  textSecondary:"#404040",
  textMuted:    "#525252",
  textInactive: "#6B6B6B",
  border:       "#E3E4EB",
  bg:           "#FFFFFF",
  bgPage:       "#F8F8F5",
  bgGreen:      "#EBFEF6",
  green:        "#008062",
  greenActive:  "#03624C",
};

const TABS = ["Overview", "Audiences", "Discount codes", "Campaigns"] as const;
type Tab = typeof TABS[number];

const PROMOTION_TOOLS = [
  {
    icon: Megaphone,
    label: "Campaigns",
    description: "Send SMS offers to your customers and track how each one performs.",
  },
  {
    icon: Users,
    label: "AI-generated audiences",
    description: "Ready-made customer segments built from your order data — like lapsed customers and top spenders.",
  },
  {
    icon: Sparkles,
    label: "Automate your SMS campaigns",
    description: "Let AI automatically create and schedule offers based on customer behavior.",
  },
  {
    icon: MessageCircleHeart,
    label: "Set up SMS subscriber collection",
    description: "Invite customers to subscribe from the tracking page and receive SMS messages from your business.",
  },
];

/* ── Main component ── */

export default function SMSPromotions() {
  const t = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showModal, setShowModal] = useState(false);
  const [showAutomateModal, setShowAutomateModal] = useState(false);
  const [showSubscriberModal, setShowSubscriberModal] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [managerOn, setManagerOn] = useState(false);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: C.bgPage }}>

        {/* ── Section header ── */}
        <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {/* Title */}
          <div style={{ padding: "32px 64px 0px", display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: 0, lineHeight: "36px" }}>
              SMS Promotions
            </h1>
            {collecting && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: C.bgGreen, borderRadius: 99, fontSize: 12, fontWeight: 600, color: C.greenActive }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, flexShrink: 0 }} />
                Collecting SMS
              </span>
            )}
            {managerOn && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: C.bgGreen, borderRadius: 99, fontSize: 12, fontWeight: 600, color: C.greenActive }}>
                <Sparkles size={11} color={C.green} />
                AI Manager
              </span>
            )}
          </div>

          {/* Tabs */}
          <div style={{ padding: "0px 48px", display: "flex", flexDirection: "row", gap: 16, marginTop: 4 }}>
            {TABS.map(tab => {
              const isActive = tab === activeTab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "space-between", padding: 0, gap: 0,
                    background: "none", border: "none", cursor: "pointer",
                    fontFamily: "inherit", height: 50,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 16px", flex: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: isActive ? 500 : 400, color: isActive ? C.greenActive : C.textInactive, whiteSpace: "nowrap" }}>
                      {tab}
                    </span>
                  </div>
                  <div style={{ width: "100%", height: 2, background: isActive ? C.green : "transparent" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tab content ── */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {activeTab === "Overview" && (
            <OverviewTab
              onAutomate={() => setShowAutomateModal(true)}
              onSubscriber={() => setShowSubscriberModal(true)}
              onNewCampaign={() => setShowModal(true)}
              onTabChange={setActiveTab}
              collecting={collecting}
              managerOn={managerOn}
              onCollectingChange={setCollecting}
              onManagerChange={setManagerOn}
            />
          )}
          {activeTab === "Audiences" && <AudiencesTab onNewCampaign={() => setShowModal(true)} />}
          {activeTab === "Discount codes" && <DiscountCodesTab />}
          {activeTab === "Campaigns" && <CampaignsTab onNewCampaign={() => setShowModal(true)} />}
          {activeTab !== "Overview" && activeTab !== "Audiences" && activeTab !== "Discount codes" && activeTab !== "Campaigns" && (
            <PlaceholderTab label={activeTab} />
          )}
        </div>
      </div>

      {showModal && <CreateCampaignModal onClose={() => setShowModal(false)} />}
      {showAutomateModal && <AutomateModal onClose={() => setShowAutomateModal(false)} />}
      {showSubscriberModal && <SubscriberModal onClose={() => setShowSubscriberModal(false)} />}
    </>
  );
}

/* ── Overview tab ── */

const RECENT_CAMPAIGNS = [
  { name: "20% off - Labor day",  date: "Apr 2 · 11:00 AM", delivered: 450, clickRate: "62%", revenue: "$1,240" },
  { name: "Flash sale - Spring",  date: "Jan 20 · 2:30 PM",  delivered: 480, clickRate: "55%", revenue: "$980"   },
  { name: "New products release", date: "Feb 1 · 4:45 PM",   delivered: 510, clickRate: "48%", revenue: "$760"   },
];

function OverviewTab({
  onAutomate, onSubscriber, onNewCampaign, onTabChange,
  collecting, managerOn, onCollectingChange, onManagerChange,
}: {
  onAutomate: () => void;
  onSubscriber: () => void;
  onNewCampaign: () => void;
  onTabChange: (tab: Tab) => void;
  collecting: boolean;
  managerOn: boolean;
  onCollectingChange: (v: boolean) => void;
  onManagerChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "32px 64px 48px", gap: 24, background: C.bg, minHeight: "100%" }}>
      <NewOverview
        onAutomate={onAutomate}
        onSubscriber={onSubscriber}
        onNewCampaign={onNewCampaign}
        onTabChange={onTabChange}
        collecting={collecting}
        managerOn={managerOn}
        onCollectingChange={onCollectingChange}
        onManagerChange={onManagerChange}
      />
    </div>
  );
}

/* ── Current overview (unchanged design) ── */

function CurrentOverview({
  showBanner,
  onDismissBanner,
  onAutomate,
  onSubscriber,
  onTabChange,
}: {
  showBanner: boolean;
  onDismissBanner: () => void;
  onAutomate: () => void;
  onSubscriber: () => void;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <>
      {/* AI banner */}
      {showBanner && (
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20, background: C.bgGreen, borderRadius: 16 }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16, flex: 1 }}>
            <div style={{ width: 52, height: 52, background: C.bg, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={24} color={C.green} />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%" }}>
                Automate your sms campaigns with marketing agent
              </p>
              <p style={{ fontSize: 15, fontWeight: 350, color: C.textSecondary, margin: "2px 0 0", lineHeight: "140%" }}>
                Let AI automatically create and schedule offers based on customer behavior.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button
              onClick={onAutomate}
              style={{ padding: "8px 16px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 500, color: "#FFFFFF" }}
            >
              Automate Campaigns
            </button>
            <button
              onClick={onDismissBanner}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 400, color: "#262626", padding: "8px 4px" }}
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Performance card */}
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#262626" }}>Performance</span>
        </div>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          {[
            { label: "Subscribers",     value: "450"  },
            { label: "Campaigns sent",  value: "10"   },
            { label: "Engagement rate", value: "54%", info: true },
            { label: "Offers created",  value: "12"   },
          ].map((stat, i, arr) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "row", alignItems: "center", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", padding: "20px 26px", gap: 20, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 17, fontWeight: 500, color: C.textMuted, lineHeight: "100%" }}>{stat.label}</span>
                  {stat.info && <Info size={16} color={C.textMuted} />}
                </div>
                <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, lineHeight: 1 }}>
                  {stat.value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 1, height: 40, background: C.border, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Promotion tools card */}
      <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#262626" }}>Promotion Tools</span>
        </div>
        {PROMOTION_TOOLS.map((tool, i) => {
          const Icon = tool.icon;
          const handleClick = () => {
            if (tool.label === "Campaigns")                            onTabChange("Campaigns");
            else if (tool.label === "AI-generated audiences")          onTabChange("Audiences");
            else if (tool.label === "Automate your SMS campaigns")     onAutomate();
            else if (tool.label === "Set up SMS subscriber collection") onSubscriber();
          };
          return (
            <div
              key={tool.label}
              onClick={handleClick}
              style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                padding: "24px", gap: 24,
                borderBottom: i < PROMOTION_TOOLS.length - 1 ? `1px solid ${C.border}` : "none",
                cursor: "pointer", transition: "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <div style={{ width: 56, height: 56, background: C.bgGreen, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon size={24} color={C.green} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: 0, lineHeight: "140%" }}>
                  {tool.label}
                </p>
                <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, margin: "4px 0 0", lineHeight: "140%" }}>
                  {tool.description}
                </p>
              </div>
              <ChevronRight size={24} color="#525252" />
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ── New overview (redesigned) ── */

const CARD = {
  background: "#FFFFFF",
  border: "1px solid #E3E4EB",
  borderRadius: 16,
  overflow: "hidden" as const,
};

function NewOverview({
  onAutomate, onSubscriber, onNewCampaign, onTabChange,
  collecting, managerOn, onCollectingChange, onManagerChange,
}: {
  onAutomate: () => void;
  onSubscriber: () => void;
  onNewCampaign: () => void;
  onTabChange: (tab: Tab) => void;
  collecting: boolean;
  managerOn: boolean;
  onCollectingChange: (v: boolean) => void;
  onManagerChange: (v: boolean) => void;
}) {
  const [period, setPeriod] = useState("30");

  const STATS = [
    { label: "Subscribers",     value: "450", trend: "+23 this month", up: true, sub: "active opt-ins",  info: false, health: false },
    { label: "Campaigns sent",  value: "10",  trend: "+3",             up: true, sub: "vs last period",  info: false, health: false },
    { label: "Engagement rate", value: "54%", trend: "+6%",            up: true, sub: "vs last period",  info: true,  health: false },
    { label: "Offers created",  value: "12",  trend: "+2",             up: true, sub: "vs last period",  info: false, health: false },
  ];


  return (
    <>
      {/* Performance card */}
      <div style={CARD}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#262626" }}>Performance</span>
          <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              style={{
                fontSize: 13, fontWeight: 500, color: C.text,
                border: `1px solid ${C.border}`, borderRadius: 10,
                padding: "6px 32px 6px 12px", background: C.bg,
                cursor: "pointer", fontFamily: "inherit", outline: "none",
                appearance: "none", WebkitAppearance: "none",
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <ChevronDown size={14} color={C.textMuted} style={{ position: "absolute", right: 10, pointerEvents: "none" }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "row", alignItems: "stretch" }}>
          {STATS.map((stat, i, arr) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "row", alignItems: "stretch", flex: 1 }}>
              <div style={{ display: "flex", flexDirection: "column", padding: "24px 28px", gap: 10, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>{stat.label}</span>
                  {stat.info && <Info size={14} color={C.textMuted} />}
                </div>
                <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, lineHeight: 1 }}>
                  {stat.value}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  {stat.health ? (
                    <>
                      <span style={{ display: "inline-flex", alignItems: "center", padding: "2px 8px", background: "#DFFDEF", borderRadius: 99, fontSize: 12, fontWeight: 600, color: "#03624C" }}>
                        {stat.trend}
                      </span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{stat.sub}</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp size={13} color={C.green} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.green }}>{stat.trend}</span>
                      <span style={{ fontSize: 12, color: C.textMuted }}>{stat.sub}</span>
                    </>
                  )}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ width: 1, background: C.border, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent campaigns */}
      <div style={CARD}>
        {/* Header: title left, New campaign button right */}
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#262626" }}>Recent campaigns</span>
          <button
            onClick={onNewCampaign}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 16px 8px 12px", background: C.green,
              border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Plus size={15} color="#FFFFFF" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>New campaign</span>
          </button>
        </div>

        {/* Table header */}
        <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
          {["Campaign", "Date", "Delivered", "Click rate", "Revenue"].map((h, i) => (
            <div key={h} style={{ flex: i === 0 ? 2 : 1, padding: "14px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>{h}</span>
            </div>
          ))}
        </div>

        {/* Rows */}
        {RECENT_CAMPAIGNS.map((c, i) => (
          <div
            key={c.name}
            onClick={() => onTabChange("Campaigns")}
            style={{
              display: "flex", flexDirection: "row", alignItems: "center",
              borderBottom: i < RECENT_CAMPAIGNS.length - 1 ? `1px solid #F4F4F8` : "none",
              cursor: "pointer", transition: "background 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <div style={{ flex: 2, padding: "15px 24px" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{c.name}</span>
            </div>
            <div style={{ flex: 1, padding: "15px 24px" }}>
              <span style={{ fontSize: 14, color: C.textSecondary }}>{c.date}</span>
            </div>
            <div style={{ flex: 1, padding: "15px 24px" }}>
              <span style={{ fontSize: 14, color: C.text }}>{c.delivered}</span>
            </div>
            <div style={{ flex: 1, padding: "15px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.green }}>{c.clickRate}</span>
            </div>
            <div style={{ flex: 1, padding: "15px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{c.revenue}</span>
            </div>
          </div>
        ))}

        {/* View all — bottom of table */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => onTabChange("Campaigns")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 15, fontWeight: 600, color: C.green, padding: 0 }}
          >
            View all campaigns
          </button>
        </div>
      </div>

      {/* Setup */}
      <SetupCard
        onSubscriber={onSubscriber}
        onAutomate={onAutomate}
        collecting={collecting}
        managerOn={managerOn}
        onCollectingChange={onCollectingChange}
        onManagerChange={onManagerChange}
      />
    </>
  );
}

/* ── Setup card ── */

function SetupCard({
  onSubscriber, onAutomate,
  collecting, managerOn, onCollectingChange, onManagerChange,
}: {
  onSubscriber: () => void;
  onAutomate: () => void;
  collecting: boolean;
  managerOn: boolean;
  onCollectingChange: (v: boolean) => void;
  onManagerChange: (v: boolean) => void;
}) {
  const rows = [
    {
      icon: MessageCircleHeart,
      label: "Collecting subscribers",
      desc: collecting
        ? "Customers can opt in to SMS from their order tracking page."
        : "Not collecting — customers can't subscribe to SMS yet.",
      active: collecting,
      onToggle: () => {
        if (!collecting) { onSubscriber(); onCollectingChange(true); }
        else onCollectingChange(false);
      },
    },
    {
      icon: Sparkles,
      label: "Shipday Marketing Manager",
      desc: managerOn
        ? "AI is automatically scheduling and sending campaigns for you."
        : "Off — campaigns are created and sent manually.",
      active: managerOn,
      onToggle: () => {
        if (!managerOn) { onAutomate(); onManagerChange(true); }
        else onManagerChange(false);
      },
    },
  ];

  return (
    <div style={CARD}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}` }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: "#262626" }}>Setup</span>
      </div>

      {rows.map((row, i) => {
        const Icon = row.icon;
        return (
          <div
            key={row.label}
            style={{
              display: "flex", alignItems: "center", padding: "20px 24px", gap: 20,
              borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: row.active ? C.bgGreen : "#F4F4F8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={20} color={row.active ? C.green : C.textMuted} />
            </div>

            {/* Text */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 2px" }}>{row.label}</p>
              <p style={{ fontSize: 14, color: C.textSecondary, margin: 0, lineHeight: "140%" }}>{row.desc}</p>
            </div>

            {/* Label + Toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: row.active ? C.green : C.textMuted }}>
                {row.active ? "On" : "Off"}
              </span>
              <button
                onClick={row.onToggle}
                style={{
                  width: 48, height: 28, borderRadius: 99, border: "none",
                  background: row.active ? C.green : "#D1D5DB",
                  cursor: "pointer", position: "relative", transition: "background 200ms ease",
                }}
              >
                <div style={{
                  position: "absolute", top: 3,
                  left: row.active ? 23 : 3,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
                  transition: "left 200ms ease",
                }} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── Discount codes tab ── */

const DISCOUNT_CODES = [
  { code: "SUMMER20",     discount: "20% off",       expiry: "Dec 25, 2024", used: 142, status: "Active"  },
  { code: "WINTER15",     discount: "15% off",       expiry: "Jan 15, 2025", used: 89,  status: "Active"  },
  { code: "FALL25",       discount: "25% off",       expiry: "Nov 30, 2024", used: 210, status: "Expired" },
  { code: "SPRING10",     discount: "10% off",       expiry: "Jun 20, 2024", used: 67,  status: "Expired" },
  { code: "HOLIDAY30",    discount: "30% off",       expiry: "Dec 31, 2024", used: 38,  status: "Active"  },
  { code: "LUCKY7",       discount: "7% off",        expiry: "Jul 04, 2024", used: 154, status: "Expired" },
  { code: "FREEDELIVERY", discount: "Free delivery", expiry: "Jul 12, 2024", used: 92,  status: "Active"  },
  { code: "TAKE10",       discount: "10% off",       expiry: "Sep 01, 2024", used: 45,  status: "Paused"  },
  { code: "WELCOME5",     discount: "5% off",        expiry: "Ongoing",      used: 231, status: "Active"  },
];

const CODE_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Active:  { bg: "#DFFDEF", color: "#03624C" },
  Expired: { bg: "#F4F4F8", color: "#525252" },
  Paused:  { bg: "#FEF3C7", color: "#92400E" },
};

const CODE_FILTERS = ["All", "Active", "Expired", "Paused"] as const;

function DiscountCodesTab() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = DISCOUNT_CODES.filter(o => {
    const matchesQuery = o.code.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "32px 64px 48px", gap: 24, background: C.bg, minHeight: "100%" }}>

      {/* Header row */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%" }}>
            Discount codes ({DISCOUNT_CODES.length})
          </p>
          <p style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, margin: 0, lineHeight: "140%" }}>
            Reusable coupon codes you can attach to SMS campaigns. Customers enter these at checkout.
          </p>
        </div>
        <button
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginTop: 4 }}
        >
          <Plus size={16} color="#FFFFFF" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>New code</span>
        </button>
      </div>

      {/* Search + status filters */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative", width: 280, flexShrink: 0 }}>
          <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Search size={15} color={C.textMuted} />
          </div>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search discount codes…"
            style={{
              width: "100%", height: 38, paddingLeft: 36, paddingRight: 12,
              border: `1px solid ${C.border}`, borderRadius: 10,
              fontSize: 14, color: C.text, fontFamily: "inherit",
              outline: "none", boxSizing: "border-box", background: C.bg,
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", gap: 6 }}>
          {CODE_FILTERS.map(f => {
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: "5px 14px", borderRadius: 99, border: "none",
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? C.bgGreen : "#F4F4F8",
                  color: active ? C.greenActive : C.textSecondary,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: 1, padding: "12px 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>Code</span>
          </div>
          <div style={{ flex: "0 0 150px", padding: "12px 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>Discount</span>
          </div>
          <div style={{ flex: "0 0 160px", padding: "12px 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>Expiration</span>
          </div>
          <div style={{ flex: "0 0 90px", padding: "12px 24px", textAlign: "right" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>Used</span>
          </div>
          <div style={{ flex: "0 0 140px", padding: "12px 24px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: C.textMuted }}>Status</span>
          </div>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "40px 24px", textAlign: "center" }}>
            <span style={{ fontSize: 14, color: C.textMuted }}>No codes match your filters</span>
          </div>
        ) : (
          filtered.map((offer, i) => {
            const s = CODE_STATUS_STYLES[offer.status] ?? CODE_STATUS_STYLES.Active;
            return (
              <div
                key={offer.code}
                style={{
                  display: "flex", flexDirection: "row", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? `1px solid #F4F4F8` : "none",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
              >
                <div style={{ flex: 1, padding: "12px 24px" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text, fontFamily: "monospace", letterSpacing: "0.02em" }}>{offer.code}</span>
                </div>
                <div style={{ flex: "0 0 150px", padding: "12px 24px" }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{offer.discount}</span>
                </div>
                <div style={{ flex: "0 0 160px", padding: "12px 24px" }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{offer.expiry}</span>
                </div>
                <div style={{ flex: "0 0 90px", padding: "12px 24px", textAlign: "right" }}>
                  <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{offer.used}</span>
                </div>
                <div style={{ flex: "0 0 140px", padding: "12px 24px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", background: s.bg, borderRadius: 99, fontSize: 13, fontWeight: 500, color: s.color }}>
                    {offer.status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ── Campaigns tab ── */

const CAMPAIGNS = [
  { name: "Summer happy hour deal",   datetime: "Jun 28, 2025 · 5:00 PM",  recipients: 450, sent: "-" as string | number,  delivered: "-" as string | number,  clickRate: "-",   status: "Scheduled" },
  { name: "Weekend special - 15% off",datetime: "Jun 22, 2025 · 10:00 AM", recipients: 480, sent: 480,  delivered: 471,  clickRate: "58%", status: "Sending"   },
  { name: "20% off - Labor day",      datetime: "Apr 2, 2025 · 11:00 AM",  recipients: 450, sent: 450,  delivered: 450,  clickRate: "62%", status: "Completed" },
  { name: "Flash sale - Spring",      datetime: "Jan 20, 2025 · 2:30 PM",  recipients: 480, sent: 480,  delivered: 480,  clickRate: "55%", status: "Completed" },
  { name: "New products release",     datetime: "Feb 1, 2025 · 4:45 PM",   recipients: 510, sent: 510,  delivered: 510,  clickRate: "48%", status: "Completed" },
  { name: "Loyalty reward - June",    datetime: "Mar 12, 2024 · 9:00 AM",  recipients: 490, sent: 490,  delivered: 490,  clickRate: "71%", status: "Completed" },
  { name: "Free shipping - May",      datetime: "Dec 24, 2023 · 1:15 PM",  recipients: 460, sent: 460,  delivered: 460,  clickRate: "44%", status: "Completed" },
  { name: "Holiday season - 30% off", datetime: "Nov 5, 2023 · 3:30 PM",   recipients: 500, sent: 498,  delivered: 421,  clickRate: "-",   status: "Failed"    },
];

const CAMPAIGN_STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  Completed: { bg: "#DFFDEF", color: "#03624C" },
  Scheduled: { bg: "#EEF2FF", color: "#3730A3" },
  Sending:   { bg: "#FEF9C3", color: "#854D0E" },
  Failed:    { bg: "#FEE2E2", color: "#991B1B" },
};

const CAMPAIGN_FILTERS = ["All", "Completed", "Scheduled", "Sending", "Failed"] as const;

function CampaignsTab({ onNewCampaign }: { onNewCampaign: () => void }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = CAMPAIGNS.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "32px 64px 48px", gap: 32, background: C.bg, minHeight: "100%" }}>

      {/* Campaign performance card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%", flex: 1 }}>
            Campaign performance
          </p>
          <button
            onClick={onNewCampaign}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Plus size={16} color="#FFFFFF" />
            <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>New campaign</span>
          </button>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", gap: 12, borderRight: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Campaigns sent</span>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>12</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", gap: 12, borderRight: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Engagement rate</span>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>64%</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", gap: 12 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Scheduled</span>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign history */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0, lineHeight: "140%" }}>
            Campaign history
          </p>
          {/* Search */}
          <div style={{ position: "relative", width: 280 }}>
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Search size={15} color={C.textMuted} />
            </div>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search campaigns…"
              style={{
                width: "100%", height: 38, paddingLeft: 36, paddingRight: 12,
                border: `1px solid ${C.border}`, borderRadius: 10,
                fontSize: 14, color: C.text,
                fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                background: C.bg,
              }}
            />
          </div>
        </div>

        {/* Status filters */}
        <div style={{ display: "flex", flexDirection: "row", gap: 6 }}>
          {CAMPAIGN_FILTERS.map(f => {
            const active = statusFilter === f;
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                style={{
                  padding: "5px 14px", borderRadius: 99, border: "none",
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? C.bgGreen : "#F4F4F8",
                  color: active ? C.greenActive : C.textSecondary,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
                }}
              >
                {f}
              </button>
            );
          })}
        </div>

        <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ flex: 1, padding: "14px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Campaign name</span>
            </div>
            <div style={{ flex: "0 0 210px", padding: "14px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Date &amp; Time</span>
            </div>
            <div style={{ flex: "0 0 110px", padding: "14px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Recipients</span>
            </div>
            <div style={{ flex: "0 0 90px", padding: "14px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Sent</span>
            </div>
            <div style={{ flex: "0 0 100px", padding: "14px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Delivered</span>
            </div>
            <div style={{ flex: "0 0 110px", padding: "14px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Click rate</span>
            </div>
            <div style={{ flex: "0 0 140px", padding: "14px 24px" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Status</span>
            </div>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: "40px 24px", textAlign: "center" }}>
              <span style={{ fontSize: 14, color: C.textMuted }}>No campaigns match &ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            filtered.map((c, i) => {
              const s = CAMPAIGN_STATUS_STYLES[c.status] ?? CAMPAIGN_STATUS_STYLES.Completed;
              return (
                <div
                  key={c.name}
                  style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    borderBottom: i < filtered.length - 1 ? `1px solid #F4F4F8` : "none",
                    cursor: "pointer", transition: "background 150ms ease",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <div style={{ flex: 1, padding: "15px 24px" }}>
                    <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{c.name}</span>
                  </div>
                  <div style={{ flex: "0 0 210px", padding: "15px 24px" }}>
                    <span style={{ fontSize: 14, fontWeight: 400, color: C.textSecondary }}>{c.datetime}</span>
                  </div>
                  <div style={{ flex: "0 0 110px", padding: "15px 24px", textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{c.recipients}</span>
                  </div>
                  <div style={{ flex: "0 0 90px", padding: "15px 24px", textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{c.sent}</span>
                  </div>
                  <div style={{ flex: "0 0 100px", padding: "15px 24px", textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 400, color: C.text }}>{c.delivered}</span>
                  </div>
                  <div style={{ flex: "0 0 110px", padding: "15px 24px", textAlign: "right" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: c.clickRate === "-" ? C.textMuted : C.green }}>{c.clickRate}</span>
                  </div>
                  <div style={{ flex: "0 0 140px", padding: "15px 24px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", padding: "5px 12px", background: s.bg, borderRadius: 99, fontSize: 13, fontWeight: 500, color: s.color }}>
                      {c.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Audiences tab ── */

const AUDIENCES = [
  { icon: UserPlus,    name: "First-time customers",  description: "Recently placed their first order.",       iconBg: "#F8F8F5" },
  { icon: Crown,       name: "High Value Customers",   description: "Spend more than the average customer.",   iconBg: "#F8F8F5" },
  { icon: RefreshCw,   name: "Re-engagement",          description: "Haven't ordered in a while.",             iconBg: "#F9FAFC" },
  { icon: ShoppingBag, name: "Takeout only",           description: "Prefer pickup orders.",                   iconBg: "#F9FAFC" },
  { icon: Moon,        name: "Lapsed Customers",       description: "Haven't ordered in a long time.",         iconBg: "#F9FAFC" },
  { icon: ThumbsDown,  name: "Recent bad reviews",     description: "Left low ratings recently.",              iconBg: "#F9FAFC" },
  { icon: MapPin,      name: "Customers Near Store",   description: "Located near your store.",                iconBg: "#F9FAFC" },
];

function AudiencesTab({ onNewCampaign }: { onNewCampaign: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "32px 64px 48px", gap: 32, background: C.bg, minHeight: "100%" }}>

      {/* Section title + button */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%" }}>
            Customer audiences
          </p>
          <p style={{ fontSize: 16, fontWeight: 400, color: C.textSecondary, margin: 0, lineHeight: "140%" }}>
            Audiences are created automatically as customers subscribe to SMS.
          </p>
        </div>
        <button
          onClick={onNewCampaign}
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
        >
          <Plus size={16} color="#FFFFFF" />
          <span style={{ fontSize: 14, fontWeight: 700, color: "#FFFFFF" }}>New campaign</span>
        </button>
      </div>

      {/* Zero-state callout */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16, padding: "16px 20px", background: C.bgGreen, borderRadius: 12, border: `1px solid #C6F6E4` }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Users size={18} color={C.green} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.greenActive, margin: 0, lineHeight: "140%" }}>Audiences populate automatically</p>
          <p style={{ fontSize: 13, fontWeight: 400, color: C.green, margin: "2px 0 0", lineHeight: "140%" }}>
            As customers subscribe to SMS from your tracking page, they&apos;ll be sorted into these segments automatically. No setup needed.
          </p>
        </div>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: "0 0 407px", padding: "14px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Audience</span>
          </div>
          <div style={{ flex: "0 0 167px", padding: "14px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Customers</span>
          </div>
          <div style={{ flex: "0 0 167px", padding: "14px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Campaigns sent</span>
          </div>
          <div style={{ flex: 1, padding: "14px 24px" }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: C.textMuted }}>Engagement rate</span>
          </div>
          <div style={{ flex: "0 0 72px" }} />
        </div>

        {/* Rows */}
        {AUDIENCES.map((aud, i) => {
          const Icon = aud.icon;
          return (
            <div
              key={aud.name}
              style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                borderBottom: i < AUDIENCES.length - 1 ? `1px solid #F4F4F8` : "none",
                cursor: "pointer", transition: "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              {/* Audience cell */}
              <div style={{ flex: "0 0 407px", display: "flex", alignItems: "center", padding: "16px 24px", gap: 16 }}>
                <div style={{ width: 40, height: 40, background: aud.iconBg, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={20} color="#525252" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 500, color: C.text, lineHeight: "140%" }}>{aud.name}</span>
                  <span style={{ fontSize: 15, fontWeight: 400, color: C.textSecondary, lineHeight: "140%" }}>{aud.description}</span>
                </div>
              </div>
              {/* Customers */}
              <div style={{ flex: "0 0 167px", padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: C.text }}>0</span>
              </div>
              {/* Campaigns sent */}
              <div style={{ flex: "0 0 167px", padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: C.text }}>0</span>
              </div>
              {/* Engagement rate */}
              <div style={{ flex: 1, padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 400, color: C.text }}>-</span>
              </div>
              {/* Chevron */}
              <div style={{ flex: "0 0 72px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 24px" }}>
                <ChevronRight size={20} color="#525252" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Placeholder for unbuilt tabs ── */

function PlaceholderTab({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <span style={{ fontSize: 16, color: C.textInactive }}>{label} — coming soon</span>
    </div>
  );
}
