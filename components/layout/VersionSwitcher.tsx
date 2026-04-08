"use client";

import { usePathname, useRouter } from "next/navigation";

const versions = [
  { label: "A", path: "/settings/dispatch-v2" },
  { label: "B", path: "/settings/dispatch-v3" },
];

export default function VersionSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Show on all dispatch settings pages
  const isDispatchPage = pathname.startsWith("/settings/dispatch");

  if (!isDispatchPage) return null;

  return (
    <div
      className="fixed flex flex-row items-center bg-white rounded-full"
      style={{
        top: 18,
        right: 80,
        zIndex: 100,
        padding: 4,
        gap: 2,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      {versions.map((v) => {
        const isActive = pathname.startsWith(v.path);
        return (
          <button
            key={v.label}
            onClick={() => router.push(v.path)}
            className="flex items-center justify-center rounded-full border-none cursor-pointer transition-all duration-150"
            style={{
              width: 32,
              height: 32,
              fontSize: 13,
              fontWeight: 700,
              background: isActive ? "#008062" : "transparent",
              color: isActive ? "#FFFFFF" : "#737373",
            }}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
