"use client";

import { useState } from "react";
import {
  Megaphone, Users, Sparkles, MessageCircleHeart,
  ChevronRight, Info, Plus,
  UserPlus, Crown, RefreshCw, ShoppingBag, Moon, ThumbsDown, MapPin,
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

const TABS = ["Overview", "Audiences", "Offers", "Campaigns"] as const;
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
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, background: C.bgPage }}>

        {/* ── Section header ── */}
        <div style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          {/* Title */}
          <div style={{ padding: "32px 64px 0px" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.02em", color: C.text, margin: 0, lineHeight: "36px" }}>
              SMS Promotions
            </h1>
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
                    <span style={{ fontSize: 16, fontWeight: isActive ? 500 : 400, color: isActive ? C.greenActive : C.textInactive, whiteSpace: "nowrap" }}>
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
              showBanner={showBanner}
              onDismissBanner={() => setShowBanner(false)}
              onAutomate={() => setShowAutomateModal(true)}
              onSubscriber={() => setShowSubscriberModal(true)}
              onNewCampaign={() => setShowModal(true)}
              onTabChange={setActiveTab}
            />
          )}
          {activeTab === "Audiences" && <AudiencesTab onNewCampaign={() => setShowModal(true)} />}
          {activeTab === "Offers" && <OffersTab />}
          {activeTab === "Campaigns" && <CampaignsTab onNewCampaign={() => setShowModal(true)} />}
          {activeTab !== "Overview" && activeTab !== "Audiences" && activeTab !== "Offers" && activeTab !== "Campaigns" && (
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

function OverviewTab({
  showBanner,
  onDismissBanner,
  onAutomate,
  onSubscriber,
  onNewCampaign,
  onTabChange,
}: {
  showBanner: boolean;
  onDismissBanner: () => void;
  onAutomate: () => void;
  onSubscriber: () => void;
  onNewCampaign: () => void;
  onTabChange: (tab: Tab) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "32px 64px", gap: 24, background: C.bg, minHeight: "100%" }}>

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
            if (tool.label === "Campaigns")                        onTabChange("Campaigns");
            else if (tool.label === "AI-generated audiences")      onTabChange("Audiences");
            else if (tool.label === "Automate your SMS campaigns")  onAutomate();
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
                cursor: "pointer",
                transition: "background 150ms ease",
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
    </div>
  );
}

/* ── Offers tab ── */

const OFFERS = [
  { code: "SUMMER20",     expiry: "Dec 25, 2024", link: "https://example.com/order" },
  { code: "WINTER15",     expiry: "Jan 15, 2025", link: "https://example.com/order" },
  { code: "FALL25",       expiry: "Nov 30, 2024", link: "https://example.com/order" },
  { code: "SPRING10",     expiry: "Jun 20, 2024", link: "https://example.com/order" },
  { code: "HOLIDAY30",    expiry: "Dec 31, 2024", link: "https://example.com/order" },
  { code: "LUCKY7",       expiry: "Jul 04, 2024", link: "https://example.com/order" },
  { code: "FREEDELIVERY", expiry: "Jul 12, 2024", link: "https://example.com/order" },
  { code: "TAKE10",       expiry: "Sep 01, 2024", link: "https://example.com/order" },
  { code: "WELCOME5",     expiry: "Ongoing",      link: "https://example.com/order" },
];

function OffersTab() {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "40px 64px 32px", gap: 32, background: C.bg, minHeight: "100%" }}>

      {/* Header row */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%" }}>
            All offers (23)
          </p>
          <p style={{ fontSize: 16, fontWeight: 350, color: C.textSecondary, margin: 0, lineHeight: "140%" }}>
            Reusable promotions you can send to customers multiple times.
          </p>
        </div>
        <button
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
        >
          <Plus size={16} color="#FFFFFF" />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>New offer</span>
        </button>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: "0 0 240px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Offer code</span>
          </div>
          <div style={{ flex: "0 0 240px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Expiration date</span>
          </div>
          <div style={{ flex: 1, padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Associated order link</span>
          </div>
          <div style={{ flex: "0 0 160px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Status</span>
          </div>
        </div>

        {/* Rows */}
        {OFFERS.map((offer, i) => (
          <div
            key={offer.code}
            style={{
              display: "flex", flexDirection: "row", alignItems: "center",
              borderBottom: i < OFFERS.length - 1 ? `1px solid #F4F4F8` : "none",
              cursor: "pointer", transition: "background 150ms ease",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
          >
            <div style={{ flex: "0 0 240px", padding: "16px 24px" }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{offer.code}</span>
            </div>
            <div style={{ flex: "0 0 240px", padding: "16px 24px" }}>
              <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{offer.expiry}</span>
            </div>
            <div style={{ flex: 1, padding: "16px 24px" }}>
              <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{offer.link}</span>
            </div>
            <div style={{ flex: "0 0 160px", padding: "16px 24px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", padding: "7px 12px", background: "#DFFDEF", borderRadius: 99, fontSize: 14, fontWeight: 500, color: "#03624C", lineHeight: "110%" }}>
                Active
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Campaigns tab ── */

const CAMPAIGNS = [
  { name: "20% off - Labor day",     datetime: "Apr 2, 2024 · 11:00 AM",  recipients: 450, sent: 450, delivered: 450 },
  { name: "Flash sale - Spring",     datetime: "Jan 20, 2024 · 2:30 PM",  recipients: 480, sent: 480, delivered: 480 },
  { name: "New products release",    datetime: "Feb 1, 2024 · 4:45 PM",   recipients: 510, sent: 510, delivered: 510 },
  { name: "Loyalty reward - June",   datetime: "Mar 12, 2024 · 9:00 AM",  recipients: 490, sent: 490, delivered: 490 },
  { name: "Free shipping - May",     datetime: "Dec 24, 2023 · 1:15 PM",  recipients: 460, sent: 460, delivered: 460 },
  { name: "Holiday season - 30% off",datetime: "Nov 5, 2023 · 3:30 PM",   recipients: 500, sent: 500, delivered: 500 },
];

function CampaignsTab({ onNewCampaign }: { onNewCampaign: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "40px 64px 32px", gap: 48, background: C.bg, minHeight: "100%" }}>

      {/* Campaign performance card */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%", flex: 1 }}>
            Campaign performance
          </p>
          <button
            onClick={onNewCampaign}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit" }}
          >
            <Plus size={16} color="#FFFFFF" />
            <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>New campaign</span>
          </button>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", gap: 16, borderRight: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: C.textMuted }}>Campaigns sent</span>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>12</span>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px", gap: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 500, color: C.textMuted }}>Engagement rate</span>
              <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", color: C.text }}>64%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign history table */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <p style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: 0, lineHeight: "140%" }}>
          Campaign history
        </p>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ flex: 1, padding: "16px 24px" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Campaign name</span>
            </div>
            <div style={{ flex: "0 0 228px", padding: "16px 24px" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Date &amp; Time</span>
            </div>
            <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Recipients</span>
            </div>
            <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Sent</span>
            </div>
            <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Delivered</span>
            </div>
            <div style={{ flex: "0 0 148px", padding: "16px 24px" }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Status</span>
            </div>
          </div>

          {/* Rows */}
          {CAMPAIGNS.map((c, i) => (
            <div
              key={c.name}
              style={{
                display: "flex", flexDirection: "row", alignItems: "center",
                borderBottom: i < CAMPAIGNS.length - 1 ? `1px solid #F4F4F8` : "none",
                cursor: "pointer", transition: "background 150ms ease",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.bgPage}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
            >
              <div style={{ flex: 1, padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 500, color: C.text }}>{c.name}</span>
              </div>
              <div style={{ flex: "0 0 228px", padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{c.datetime}</span>
              </div>
              <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{c.recipients}</span>
              </div>
              <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{c.sent}</span>
              </div>
              <div style={{ flex: "0 0 120px", padding: "16px 24px", textAlign: "right" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>{c.delivered}</span>
              </div>
              <div style={{ flex: "0 0 148px", padding: "16px 24px" }}>
                <span style={{ display: "inline-flex", alignItems: "center", padding: "7px 12px", background: "#DFFDEF", borderRadius: 99, fontSize: 14, fontWeight: 500, color: "#03624C", lineHeight: "110%" }}>
                  Completed
                </span>
              </div>
            </div>
          ))}
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
    <div style={{ display: "flex", flexDirection: "column", padding: "40px 64px 0px", gap: 32, background: C.bg, minHeight: "100%" }}>

      {/* Section title + button */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <p style={{ fontSize: 20, fontWeight: 800, color: "#262626", margin: 0, lineHeight: "140%" }}>
            Customer audiences
          </p>
          <p style={{ fontSize: 16, fontWeight: 350, color: C.textSecondary, margin: 0, lineHeight: "140%" }}>
            Audiences are created automatically as customers subscribe to SMS.
          </p>
        </div>
        <button
          onClick={onNewCampaign}
          style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, padding: "8px 16px 8px 11px", background: C.green, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
        >
          <Plus size={16} color="#FFFFFF" />
          <span style={{ fontSize: 14, fontWeight: 800, color: "#FFFFFF" }}>New campaign</span>
        </button>
      </div>

      {/* Table */}
      <div style={{ border: `1px solid ${C.border}`, borderRadius: "16px 16px 0 0", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "row", background: "#F9FAFC", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ flex: "0 0 407px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Audience</span>
          </div>
          <div style={{ flex: "0 0 167px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Customers</span>
          </div>
          <div style={{ flex: "0 0 167px", padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Campaigns sent</span>
          </div>
          <div style={{ flex: 1, padding: "16px 24px" }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: C.textMuted }}>Engagement rate</span>
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
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>0</span>
              </div>
              {/* Campaigns sent */}
              <div style={{ flex: "0 0 167px", padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>0</span>
              </div>
              {/* Engagement rate */}
              <div style={{ flex: 1, padding: "16px 24px" }}>
                <span style={{ fontSize: 16, fontWeight: 350, color: C.text }}>-</span>
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
