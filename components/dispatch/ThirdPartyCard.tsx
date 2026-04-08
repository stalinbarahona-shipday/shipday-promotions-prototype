"use client";

import { useState } from "react";
import { Plus, ChevronRight, Mail } from "lucide-react";
import ProviderDetailModal from "./ProviderDetailModal";
import ProviderManageModal from "./ProviderManageModal";
import InviteLocalModal from "./InviteLocalModal";

interface InvitedCompany {
  name: string;
  email: string;
}

interface ProviderPreview {
  id: string;
  name: string;
  description: string;
  logoColor: string;
  logoLetter: string;
}

const onDemandProviders: ProviderPreview[] = [
  {
    id: "doordash",
    name: "DoorDash Drive",
    description:
      "On-demand short distance food delivery, grocery, convenience, and other small retail deliveries",
    logoColor: "#FF3008",
    logoLetter: "D",
  },
  {
    id: "uber",
    name: "Uber Direct",
    description: "On-demand short distance food delivery",
    logoColor: "#000000",
    logoLetter: "U",
  },
  {
    id: "relay",
    name: "Relay",
    description: "On-demand local delivery for restaurants and retailers",
    logoColor: "#16A34A",
    logoLetter: "R",
  },
];

const cateringProviders: ProviderPreview[] = [
  {
    id: "doordash-catering",
    name: "DoorDash Catering",
    description: "Scheduled delivery for large catering orders",
    logoColor: "#FF3008",
    logoLetter: "D",
  },
  {
    id: "dlivrd",
    name: "Dlivrd",
    description: "Catering and large order specialist",
    logoColor: "#6B21A8",
    logoLetter: "d",
  },
];

interface ThirdPartyCardProps {
  connectedProviders: Set<string>;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
  onConfigureDispatch?: () => void;
  mode?: string;
  autoDispatchEnabled?: boolean;
}

export default function ThirdPartyCard({
  connectedProviders,
  onConnect,
  onDisconnect,
  onConfigureDispatch,
  mode = "inhouse",
  autoDispatchEnabled = false,
}: ThirdPartyCardProps) {
  const [detailProviderId, setDetailProviderId] = useState<string | null>(null);
  const [manageProviderId, setManageProviderId] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitedCompanies, setInvitedCompanies] = useState<InvitedCompany[]>([]);

  const handleInvite = (company: InvitedCompany) => {
    setInvitedCompanies((prev) => [...prev, company]);
    setInviteModalOpen(false);
  };

  const handleConnectClick = (id: string) => {
    if (connectedProviders.has(id)) {
      onDisconnect(id);
    } else {
      setDetailProviderId(id);
    }
  };

  const handleConfirmConnect = (id: string) => {
    onConnect(id);
    setDetailProviderId(null);
  };

  /* ── Shared provider row renderer ── */
  const renderProviderRow = (
    provider: ProviderPreview,
    showBorder: boolean
  ) => {
    const isConnected = connectedProviders.has(provider.id);
    return (
      <div key={provider.id} className="flex flex-col">
      <div
        className="flex flex-row items-center"
        style={{ padding: "16px 24px", gap: 12 }}
      >
        {/* Logo */}
        <div
          className="box-border flex items-center justify-center border border-border-default rounded-lg overflow-hidden"
          style={{ width: 40, height: 40, padding: 6 }}
        >
          <div
            className="flex items-center justify-center rounded-[4px]"
            style={{
              width: 28,
              height: 28,
              background: provider.logoColor,
            }}
          >
            <span
              className="text-white font-[800]"
              style={{ fontSize: 12, lineHeight: 1 }}
            >
              {provider.logoLetter}
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col flex-1" style={{ gap: 2 }}>
          <span
            className="font-[800]"
            style={{
              fontSize: 16,
              lineHeight: "140%",
              color: "#262626",
            }}
          >
            {provider.name}
          </span>
          <span
            style={{
              fontSize: 15,
              fontWeight: 400,
              lineHeight: "140%",
              color: "#737373",
            }}
          >
            {isConnected
              ? `You can assign orders manually to ${provider.name} drivers`
              : provider.description}
          </span>
        </div>

        {/* Action area: button + arrow always visible */}
        <div className="flex flex-row items-center shrink-0" style={{ gap: 8 }}>
          {/* Connect button or Connected chip with tooltip */}
          {isConnected ? (
            <div className="relative group">
              <div
                className="flex flex-row items-center"
                style={{
                  padding: "7px 12px",
                  height: 36,
                  background: "#EBFEF6",
                  borderRadius: 100,
                  cursor: "default",
                }}
              >
                <span
                  className="font-medium"
                  style={{
                    fontSize: 15,
                    lineHeight: "140%",
                    color: "#03624C",
                  }}
                >
                  Connected
                </span>
              </div>

              {/* Tooltip */}
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none"
                style={{ width: 260 }}
              >
                <div
                  className="rounded-xl"
                  style={{ padding: "12px 16px", background: "#262626" }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 400,
                      lineHeight: "150%",
                      color: "#FFFFFF",
                    }}
                  >
                    {autoDispatchEnabled
                      ? `Orders are automatically assigned to ${provider.name} based on your dispatch settings.`
                      : `You can manually assign orders to ${provider.name} drivers from Dispatch.`}
                  </span>
                </div>
                <div
                  className="absolute left-1/2 -translate-x-1/2"
                  style={{
                    bottom: -6,
                    width: 0,
                    height: 0,
                    borderLeft: "7px solid transparent",
                    borderRight: "7px solid transparent",
                    borderTop: "7px solid #262626",
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleConnectClick(provider.id)}
              className="box-border flex justify-center items-center rounded-lg cursor-pointer"
              style={{
                padding: "8px 16px",
                height: 40,
                background: "#FFFFFF",
                border: "1px solid #E8E8E4",
              }}
            >
              <span
                className="font-medium"
                style={{
                  fontSize: 14,
                  lineHeight: "19px",
                  color: "#03624C",
                }}
              >
                Connect
              </span>
            </button>
          )}

          {/* Arrow — always visible, disabled if not connected */}
          <button
            onClick={() => isConnected && setManageProviderId(provider.id)}
            className="flex items-center justify-center shrink-0 bg-transparent border-none"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              cursor: isConnected ? "pointer" : "default",
              opacity: isConnected ? 1 : 0.3,
            }}
          >
            <ChevronRight size={20} color="#737373" />
          </button>
        </div>
      </div>
      {showBorder && (
        <div style={{ height: 1, background: "#EEECEA", margin: "0 24px" }} />
      )}
      </div>
    );
  };

  return (
    <>
      {/* ── Delivery Services (merged card) ── */}
        <div className="box-border flex flex-col bg-white border border-border-default rounded-2xl">

          {/* On Demand section header */}
          <div style={{ padding: "20px 24px 12px" }}>
            <span
              className="font-[800]"
              style={{ fontSize: 18, lineHeight: "140%", color: "#0A0A0A" }}
            >
              On Demand Delivery
            </span>
          </div>
          {onDemandProviders.map((p, idx) =>
            renderProviderRow(p, idx < onDemandProviders.length - 1)
          )}
          <div className="border-b border-border-default" />

          {/* Catering section header — acts as divider */}
          <div style={{ padding: "20px 24px 12px" }}>
            <span
              className="font-[800]"
              style={{ fontSize: 18, lineHeight: "140%", color: "#0A0A0A" }}
            >
              Scheduled Catering Delivery
            </span>
          </div>
          {cateringProviders.map((p, idx) =>
            renderProviderRow(p, idx < cateringProviders.length - 1)
          )}
        </div>

        {/* ── Local Partners ── */}
        <div className="box-border flex flex-col bg-white border border-border-default rounded-2xl">
          {/* Header */}
          <div
            className={`flex flex-row items-center ${invitedCompanies.length > 0 ? "border-b border-border-default" : ""}`}
            style={{ padding: "20px 24px", gap: 16 }}
          >
            <div className="flex flex-col flex-1" style={{ gap: 2 }}>
              <span
                className="font-[800]"
                style={{ fontSize: 18, lineHeight: "140%", color: "#0A0A0A" }}
              >
                Local Delivery Partners
              </span>
              <span style={{ fontSize: 15, fontWeight: 400, color: "#737373", lineHeight: "140%" }}>
                Invite a local courier company to deliver your orders
              </span>
            </div>
            <button
              onClick={() => setInviteModalOpen(true)}
              className="box-border flex justify-center items-center rounded-lg cursor-pointer hover:bg-[#F6FEF9] transition-colors"
              style={{
                padding: "8px 14px",
                height: 38,
                background: "#FFFFFF",
                border: "1.5px solid #E8E8E4",
                gap: 6,
              }}
            >
              <Plus size={15} color="#03624C" />
              <span
                className="font-medium"
                style={{ fontSize: 14, lineHeight: "19px", color: "#03624C" }}
              >
                Invite local company
              </span>
            </button>
          </div>

          {/* Invited companies rows */}
          {invitedCompanies.map((company, idx) => {
            const isLast = idx === invitedCompanies.length - 1;
            return (
              <div
                key={idx}
                className={`flex flex-row items-center ${!isLast ? "border-b border-border-default" : ""}`}
                style={{ padding: "16px 24px", gap: 12 }}
              >
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ width: 40, height: 40, background: "#F4F4F8", border: "1px solid #E8E8E4" }}
                >
                  <span className="font-[800]" style={{ fontSize: 14, color: "#525252" }}>
                    {company.name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Text */}
                <div className="flex flex-col flex-1" style={{ gap: 2 }}>
                  <span className="font-[800]" style={{ fontSize: 16, lineHeight: "140%", color: "#262626" }}>
                    {company.name}
                  </span>
                  <div className="flex flex-row items-center" style={{ gap: 5 }}>
                    <Mail size={13} color="#A3A3A3" />
                    <span style={{ fontSize: 14, fontWeight: 400, lineHeight: "140%", color: "#737373" }}>
                      {company.email}
                    </span>
                  </div>
                </div>

                {/* Invited chip */}
                <div
                  className="flex items-center rounded-full"
                  style={{ padding: "5px 12px", background: "#FEF9C3" }}
                >
                  <span className="font-medium" style={{ fontSize: 13, color: "#A16207" }}>
                    Invite sent
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Invite local modal */}
        {inviteModalOpen && (
          <InviteLocalModal
            onClose={() => setInviteModalOpen(false)}
            onInvite={handleInvite}
          />
        )}

        {/* Provider detail modal */}
        {detailProviderId && (
          <ProviderDetailModal
            providerId={detailProviderId}
            onClose={() => setDetailProviderId(null)}
            onConnect={handleConfirmConnect}
          />
        )}

        {/* Provider manage modal */}
        {manageProviderId && (
          <ProviderManageModal
            providerId={manageProviderId}
            onClose={() => setManageProviderId(null)}
            onDisconnect={onDisconnect}
            autoDispatchEnabled={autoDispatchEnabled}
            onConfigureDispatch={onConfigureDispatch ? () => { setManageProviderId(null); onConfigureDispatch(); } : undefined}
          />
        )}
      </>
  );
}
