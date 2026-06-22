"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Building2,
  Palette,
  ArrowLeftRight,
  Car,
  BellRing,
  Route,
  Plug,
  Users,
  Globe,
  Sparkles,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

// Maps sidebar path keys to actual Next.js URLs (only for pages that exist)
const PATH_TO_URL: Record<string, string> = {
  marketing:             "/settings/dispatch",
  "promotions/sms":      "/settings/promotions/sms",
  "promotions/tracking": "/settings/promotions/tracking",
};

/* ── Types ── */

interface MenuItem {
  label: string;
  icon: LucideIcon;
  badge?: string;
  path?: string;
}

interface SubItem {
  label: string;
  path: string;
  badge?: string;
}

interface MenuGroup {
  label: string;
  icon: LucideIcon;
  children: SubItem[];
}

type MenuEntry =
  | { type: "item"; item: MenuItem }
  | { type: "group"; group: MenuGroup };

const menuEntries: MenuEntry[] = [
  { type: "item", item: { label: "Business settings", icon: Building2 } },
  { type: "item", item: { label: "Brand customization", icon: Palette } },
  {
    type: "group",
    group: {
      label: "Promotions",
      icon: Megaphone,
      children: [
        { label: "SMS Promotions", path: "promotions/sms" },
        { label: "Tracking Page Promotions", path: "promotions/tracking" },
        { label: "Marketing materials", path: "marketing", badge: "New" },
      ],
    },
  },
  {
    type: "group",
    group: {
      label: "Delivery",
      icon: ArrowLeftRight,
      children: [
        { label: "Auto-dispatch", path: "dispatch" },
        { label: "Delivery services", path: "services" },
        { label: "Preferences", path: "preferences" },
      ],
    },
  },
  { type: "item", item: { label: "Driver settings", icon: Car } },
  { type: "item", item: { label: "Customer notification", icon: BellRing } },
  { type: "item", item: { label: "Route planning", icon: Route } },
  { type: "item", item: { label: "Shipday Connect", icon: Plug } },
  { type: "item", item: { label: "Users", icon: Users } },
  { type: "item", item: { label: "Location", icon: Globe } },
  {
    type: "item",
    item: { label: "Shipday AgentFlow", icon: Sparkles, badge: "New" },
  },
];

/* ── Component ── */

interface SettingsSidebarProps {
  activePage?: string;        // kept for backwards compat, ignored — URL drives active state
  onPageChange?: (page: string) => void;
}

export default function SettingsSidebar(_props: SettingsSidebarProps) {
  const t = useTheme();
  const pathname = usePathname();
  return (
    <aside
      className="flex flex-col shrink-0 py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ width: 332, scrollbarWidth: "none", background: t.bg, borderRight: `1px solid ${t.border}`, transition: "background 300ms ease, border 300ms ease" }}
    >
      <div className="px-6">
        <h2
          className="font-[800] leading-7"
          style={{ fontSize: 20, color: t.text }}
        >
          Settings
        </h2>
      </div>

      <div className="flex flex-col px-4 mt-5">
        {menuEntries.map((entry, i) => {
          if (entry.type === "item") {
            return <FlatItem key={i} item={entry.item} pathname={pathname} />;
          }
          return (
            <ExpandableGroup
              key={i}
              group={entry.group}
              pathname={pathname}
            />
          );
        })}
      </div>
    </aside>
  );
}

/* ── Flat menu item ── */

function FlatItem({ item, pathname }: { item: MenuItem; pathname: string }) {
  const t = useTheme();
  const Icon = item.icon;
  const itemUrl = item.path ? PATH_TO_URL[item.path] : undefined;
  const isActive = !!itemUrl && pathname === itemUrl;
  const activeBg = t.mode === "dark" ? "rgba(1,173,133,0.15)" : "#DBFBE5";
  const badgeBg = t.mode === "dark" ? "rgba(1,173,133,0.15)" : "#DBFBE5";
  const badgeColor = t.mode === "dark" ? "#4ADE80" : "#03624C";
  return (
    <div
      className="flex flex-row items-center gap-2 rounded-[10px]"
      style={{
        padding: "12px 16px",
        width: 300,
        background: isActive ? activeBg : "transparent",
        cursor: item.path ? "pointer" : "default",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 20, height: 20 }}
      >
        <Icon size={15} color={isActive ? t.accentText : t.textMuted} />
      </div>
      <span
        className="flex-1 leading-[21px]"
        style={{ fontSize: 15, fontWeight: isActive ? 700 : 400, color: isActive ? t.text : t.textSecondary }}
      >
        {item.label}
      </span>
      {item.badge && (
        <span
          className="flex items-center rounded-[6px] font-[600]"
          style={{
            padding: "1px 6px",
            fontSize: 11,
            lineHeight: "16px",
            background: badgeBg,
            color: badgeColor,
          }}
        >
          {item.badge}
        </span>
      )}
    </div>
  );
}

/* ── Expandable group ── */

function ExpandableGroup({
  group,
  pathname,
}: {
  group: MenuGroup;
  pathname: string;
}) {
  const t = useTheme();
  const router = useRouter();
  const hasActiveChild = group.children.some(
    (c) => PATH_TO_URL[c.path] && pathname === PATH_TO_URL[c.path]
  );
  const [expanded, setExpanded] = useState(hasActiveChild);
  const activeBg = t.mode === "dark" ? "rgba(1,173,133,0.15)" : "#DBFBE5";
  const hoverBg = t.mode === "dark" ? t.surfaceHover : "#F8F8F5";
  const badgeBg = t.mode === "dark" ? "rgba(1,173,133,0.15)" : "#DBFBE5";
  const badgeColor = t.mode === "dark" ? "#4ADE80" : "#03624C";

  useEffect(() => {
    if (hasActiveChild) setExpanded(true);
  }, [hasActiveChild, pathname]);

  const Icon = group.icon;

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-row items-center gap-2 cursor-pointer"
        style={{
          padding: "12px 16px",
          borderRadius: 12,
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="flex items-center justify-center"
          style={{ width: 20, height: 20 }}
        >
          <Icon size={15} color={t.textMuted} />
        </div>
        <span
          className={`flex-1 leading-[21px] ${
            hasActiveChild || expanded ? "font-medium" : "font-normal"
          }`}
          style={{ fontSize: 15, color: t.textSecondary }}
        >
          {group.label}
        </span>
        <ChevronDown
          size={16}
          color={t.textMuted}
          style={{
            transition: "transform 150ms ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {expanded && (
        <div style={{ padding: "0 6px 6px" }}>
          {group.children.map((child) => {
            const childUrl = PATH_TO_URL[child.path] ?? null;
            const isActive = !!childUrl && pathname === childUrl;
            return (
              <div
                key={child.path}
                className="flex flex-row items-center cursor-pointer"
                style={{
                  padding: "10px 16px 10px 40px",
                  borderRadius: 8,
                  background: isActive ? activeBg : "transparent",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = hoverBg;
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
                onClick={() => { if (childUrl) router.push(childUrl); }}
              >
                <span
                  className={`flex-1 ${
                    isActive ? "font-[700]" : "font-normal"
                  }`}
                  style={{
                    fontSize: 14,
                    lineHeight: "20px",
                    color: isActive ? t.text : t.textSecondary,
                  }}
                >
                  {child.label}
                </span>
                {child.badge && (
                  <span
                    className="flex items-center rounded-[6px] font-[600]"
                    style={{
                      padding: "1px 6px",
                      fontSize: 11,
                      lineHeight: "16px",
                      background: badgeBg,
                      color: badgeColor,
                    }}
                  >
                    {child.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
