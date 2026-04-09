"use client";

import { Plus, Bell, HelpCircle } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";

const tabs = ["Delivery", "Orders", "Drivers", "Routes", "Reports", "Integrations"];

export default function Navbar() {
  const t = useTheme();
  return (
    <nav
      className="flex justify-between items-center px-4"
      style={{ height: 68, background: t.bg, borderBottom: `1px solid ${t.border}`, transition: "background 300ms ease, border 300ms ease" }}
    >
      {/* Left — Company identity */}
      <div className="flex flex-row items-center gap-3 shrink-0">
        <div
          className="box-border flex items-center justify-center rounded-[4px]"
          style={{ width: 36, height: 36, border: `1px solid ${t.border}` }}
        >
          <Plus size={12} color={t.textMuted} strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span
            className="font-[800] leading-[20px]"
            style={{ fontSize: 16, color: t.text }}
          >
            Company name
          </span>
          <span
            className="font-normal leading-[14px] tracking-[0.02em]"
            style={{ fontSize: 10, color: t.textSecondary }}
          >
            Powered by Shipday
          </span>
        </div>
      </div>

      <div />

      {/* Right — Action icons */}
      <div className="flex flex-row items-center gap-6 shrink-0">
        <div
          className="flex items-center justify-center"
          style={{ width: 32, height: 32 }}
        >
          <Bell size={18} color={t.textMuted} />
        </div>
        <div
          className="flex items-center justify-center rounded-[4px]"
          style={{ width: 32, height: 32 }}
        >
          <HelpCircle size={22} color={t.textMuted} strokeWidth={2} />
        </div>
        <div
          className="flex items-center justify-center rounded-[20px] text-white font-[800]"
          style={{
            width: 32,
            height: 32,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%), #17C289",
            fontSize: 15,
            lineHeight: "20px",
          }}
        >
          K
        </div>
      </div>
    </nav>
  );
}
