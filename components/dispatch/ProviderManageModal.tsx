"use client";

import { X, Zap, ChevronRight } from "lucide-react";

interface ProviderInfo {
  name: string;
  logoColor: string;
  logoLetter: string;
  subtitle: string;
}

const providerInfo: Record<string, ProviderInfo> = {
  doordash: {
    name: "DoorDash Drive",
    logoColor: "#FF3008",
    logoLetter: "D",
    subtitle: "On-demand delivery fulfillment",
  },
  uber: {
    name: "Uber Direct",
    logoColor: "#000000",
    logoLetter: "U",
    subtitle: "Delivery powered by Uber",
  },
  "doordash-catering": {
    name: "DoorDash Catering",
    logoColor: "#FF3008",
    logoLetter: "D",
    subtitle: "Catering delivery fulfillment",
  },
  dlivrd: {
    name: "Dlivrd",
    logoColor: "#6B21A8",
    logoLetter: "d",
    subtitle: "Premium catering delivery service",
  },
};

interface ProviderManageModalProps {
  providerId: string;
  onClose: () => void;
  onDisconnect: (id: string) => void;
  autoDispatchEnabled?: boolean;
  onConfigureDispatch?: () => void;
}

export default function ProviderManageModal({
  providerId,
  onClose,
  onDisconnect,
  autoDispatchEnabled = false,
  onConfigureDispatch,
}: ProviderManageModalProps) {
  const info = providerInfo[providerId];
  if (!info) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col justify-center items-center"
      style={{
        background: "rgba(10, 10, 10, 0.5)",
        zIndex: 3,
        padding: "40px 0",
      }}
      onClick={onClose}
    >
      <div
        className="flex flex-col bg-white rounded-[20px]"
        style={{ width: 636 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex flex-row items-start"
          style={{ padding: 24, gap: 20 }}
        >
          <div
            className="flex flex-row items-center flex-1"
            style={{ gap: 20 }}
          >
            {/* Logo */}
            <div
              className="box-border flex items-center justify-center border border-border-default rounded-lg"
              style={{ width: 60, height: 60, padding: 10 }}
            >
              <div
                className="flex items-center justify-center rounded-[4px]"
                style={{
                  width: 40,
                  height: 40,
                  background: info.logoColor,
                }}
              >
                <span
                  className="text-white font-[800]"
                  style={{ fontSize: 20, lineHeight: 1 }}
                >
                  {info.logoLetter}
                </span>
              </div>
            </div>

            <div className="flex flex-col flex-1" style={{ gap: 4 }}>
              <div className="flex flex-row items-center" style={{ gap: 12 }}>
                <h2
                  className="font-[800] text-neutral-950 tracking-[-0.02em]"
                  style={{ fontSize: 24, lineHeight: "140%", margin: 0 }}
                >
                  {info.name}
                </h2>
                {/* Connected chip */}
                <div
                  className="flex flex-row items-center"
                  style={{
                    padding: "5px 10px",
                    background: "#EBFEF6",
                    borderRadius: 100,
                  }}
                >
                  <span
                    className="font-medium"
                    style={{
                      fontSize: 13,
                      lineHeight: "140%",
                      color: "#03624C",
                    }}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-start bg-white rounded-[99px] cursor-pointer border-none"
            style={{ padding: 8, width: 40, height: 40 }}
          >
            <X size={24} color="#404040" />
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex flex-row border-t border-border-default"
          style={{ padding: "0 24px" }}
        >
          {/* Orders delivered */}
          <div
            className="flex flex-col flex-1 border-r border-border-default"
            style={{ padding: "20px 16px 20px 0", gap: 4 }}
          >
            <span
              className="font-[800]"
              style={{ fontSize: 28, lineHeight: "130%", color: "#0A0A0A" }}
            >
              0
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: "140%",
                color: "#737373",
              }}
            >
              Orders delivered
            </span>
          </div>

          {/* Drivers used */}
          <div
            className="flex flex-col flex-1 border-r border-border-default"
            style={{ padding: "20px 16px", gap: 4 }}
          >
            <span
              className="font-[800]"
              style={{ fontSize: 28, lineHeight: "130%", color: "#0A0A0A" }}
            >
              0
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: "140%",
                color: "#737373",
              }}
            >
              Drivers used
            </span>
          </div>

          {/* Avg delivery time */}
          <div
            className="flex flex-col flex-1"
            style={{ padding: "20px 0 20px 16px", gap: 4 }}
          >
            <span
              className="font-[800]"
              style={{ fontSize: 28, lineHeight: "130%", color: "#0A0A0A" }}
            >
              —
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: "140%",
                color: "#737373",
              }}
            >
              Avg. delivery time
            </span>
          </div>
        </div>

        {/* Auto-dispatch status row */}
        <div
          className={`flex flex-row items-center border-t border-border-default${onConfigureDispatch ? " cursor-pointer transition-colors duration-150 hover:bg-[#FAFAF7]" : ""}`}
          style={{ padding: "16px 24px", gap: 16 }}
          onClick={onConfigureDispatch}
        >
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: autoDispatchEnabled ? "#ECFDF5" : "#F4F4F8",
            }}
          >
            <Zap size={18} color={autoDispatchEnabled ? "#008062" : "#A3A3A3"} />
          </div>
          <div className="flex flex-col flex-1" style={{ gap: 2 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: "#262626" }}>
              {autoDispatchEnabled ? "Automatic dispatch" : "Manual dispatch"}
            </span>
            <span style={{ fontSize: 15, fontWeight: 400, lineHeight: "150%", color: "#737373" }}>
              {autoDispatchEnabled
                ? `Orders are automatically assigned to ${info.name}`
                : `You're assigning orders to ${info.name} manually`}
            </span>
          </div>
          {onConfigureDispatch && (
            <ChevronRight size={20} color="#A3A3A3" className="shrink-0" />
          )}
        </div>

        {/* Footer */}
        <div
          className="box-border flex flex-row justify-between items-center border-t border-border-default"
          style={{ padding: "20px 28px", gap: 16 }}
        >
          {/* Disconnect */}
          <button
            onClick={() => {
              onDisconnect(providerId);
              onClose();
            }}
            className="flex justify-center items-center bg-white rounded-lg cursor-pointer"
            style={{
              padding: "11px 20px",
              height: 48,
              border: "1px solid #E8E8E4",
            }}
          >
            <span
              className="font-medium"
              style={{ fontSize: 16, lineHeight: "22px", color: "#D92D20" }}
            >
              Disconnect service
            </span>
          </button>

          {/* Done */}
          <button
            onClick={onClose}
            className="flex justify-center items-center rounded-lg border-none cursor-pointer"
            style={{
              padding: "11px 20px",
              height: 48,
              background: "#008062",
            }}
          >
            <span
              className="font-medium"
              style={{ fontSize: 16, lineHeight: "22px", color: "#FFFFFF" }}
            >
              Done
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
