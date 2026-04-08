"use client";

import { useState, useEffect } from "react";
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
        { label: "SMS Promotions", path: "promotions/sms", badge: "New" },
        { label: "Tracking Page Promotions", path: "promotions/tracking", badge: "New" },
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
  activePage?: string;
  onPageChange?: (page: string) => void;
}

export default function SettingsSidebar({
  activePage = "dispatch",
  onPageChange,
}: SettingsSidebarProps) {
  return (
    <aside
      className="flex flex-col shrink-0 bg-white border-r border-border-default py-6 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      style={{ width: 332, scrollbarWidth: "none" }}
    >
      <div className="px-6">
        <h2
          className="font-[800] text-neutral-900 leading-7"
          style={{ fontSize: 20 }}
        >
          Settings
        </h2>
      </div>

      <div className="flex flex-col px-4 mt-5">
        {menuEntries.map((entry, i) => {
          if (entry.type === "item") {
            return <FlatItem key={i} item={entry.item} activePage={activePage} />;
          }
          return (
            <ExpandableGroup
              key={i}
              group={entry.group}
              activePage={activePage}
              onPageChange={onPageChange}
            />
          );
        })}
      </div>
    </aside>
  );
}

/* ── Flat menu item ── */

function FlatItem({ item, activePage }: { item: MenuItem; activePage?: string }) {
  const Icon = item.icon;
  const isActive = !!item.path && item.path === activePage;
  return (
    <div
      className="flex flex-row items-center gap-2 rounded-[10px]"
      style={{
        padding: "12px 16px",
        width: 300,
        background: isActive ? "#DBFBE5" : "transparent",
        cursor: item.path ? "pointer" : "default",
      }}
    >
      <div
        className="flex items-center justify-center"
        style={{ width: 20, height: 20 }}
      >
        <Icon size={15} color={isActive ? "#03624C" : "#4A4A4A"} />
      </div>
      <span
        className="flex-1 leading-[21px]"
        style={{ fontSize: 15, fontWeight: isActive ? 700 : 400, color: isActive ? "#0A0A0A" : "#262626" }}
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
            background: "#DBFBE5",
            color: "#03624C",
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
  activePage,
  onPageChange,
}: {
  group: MenuGroup;
  activePage: string;
  onPageChange?: (page: string) => void;
}) {
  const hasActiveChild = group.children.some((c) => c.path === activePage);
  const [expanded, setExpanded] = useState(hasActiveChild);

  // Auto-expand when a child becomes active (e.g. navigating from another variant)
  useEffect(() => {
    if (hasActiveChild) setExpanded(true);
  }, [hasActiveChild]);

  const Icon = group.icon;

  return (
    <div
      className="flex flex-col"
    >
      {/* Group header — always visible, part of the card */}
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
          <Icon size={15} color="#4A4A4A" />
        </div>
        <span
          className={`flex-1 leading-[21px] ${
            hasActiveChild || expanded ? "font-medium" : "font-normal"
          }`}
          style={{ fontSize: 15, color: "#242424" }}
        >
          {group.label}
        </span>
        <ChevronDown
          size={16}
          color="#737373"
          style={{
            transition: "transform 150ms ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {/* Sub-items — inside the same card surface */}
      {expanded && (
        <div style={{ padding: "0 6px 6px" }}>
          {group.children.map((child) => {
            const isActive = child.path === activePage;
            return (
              <div
                key={child.path}
                className="flex flex-row items-center cursor-pointer"
                style={{
                  padding: "10px 16px 10px 40px",
                  borderRadius: 8,
                  background: isActive ? "#DBFBE5" : "transparent",
                  transition: "background 150ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "#F8F8F5";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
                onClick={() => onPageChange?.(child.path)}
              >
                <span
                  className={`flex-1 ${
                    isActive ? "font-[700]" : "font-normal"
                  }`}
                  style={{
                    fontSize: 14,
                    lineHeight: "20px",
                    color: isActive ? "#0A0A0A" : "#525252",
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
                      background: "#DBFBE5",
                      color: "#03624C",
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
