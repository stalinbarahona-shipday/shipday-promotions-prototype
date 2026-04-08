import { Plus, Bell, HelpCircle } from "lucide-react";

const tabs = ["Delivery", "Orders", "Drivers", "Routes", "Reports", "Integrations"];

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center px-4 bg-white border-b border-border-nav"
      style={{ height: 68 }}
    >
      {/* Left — Company identity */}
      <div className="flex flex-row items-center gap-3 shrink-0">
        <div
          className="box-border flex items-center justify-center border border-border-nav rounded-[4px]"
          style={{ width: 36, height: 36 }}
        >
          <Plus size={12} color="#737373" strokeWidth={2} />
        </div>
        <div className="flex flex-col gap-[2px]">
          <span
            className="font-[800] text-neutral-950 leading-[20px]"
            style={{ fontSize: 16 }}
          >
            Company name
          </span>
          <span
            className="font-normal text-neutral-600 leading-[14px] tracking-[0.02em]"
            style={{ fontSize: 10 }}
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
          <Bell size={18} color="#525252" />
        </div>
        <div
          className="flex items-center justify-center rounded-[4px]"
          style={{ width: 32, height: 32 }}
        >
          <HelpCircle size={22} color="#525252" strokeWidth={2} />
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
