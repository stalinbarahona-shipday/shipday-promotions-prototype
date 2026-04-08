"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import ThirdPartyCard from "@/components/dispatch/ThirdPartyCard";
import DispatchHeader from "@/components/dispatch/DispatchHeader";

export default function DeliveryServicesPage() {
  const [connectedProviders, setConnectedProviders] = useState<Set<string>>(new Set());

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <SettingsSidebar activePage="services" />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <DispatchHeader
            title="Delivery services"
            description={
              connectedProviders.size === 0
                ? "Deliver more orders without hiring more drivers — connect a service and start today"
                : "Manage your connected delivery services"
            }
          />
          <div className="flex flex-col flex-1 items-center bg-white" style={{ padding: "20px 64px 16px" }}>
            <div className="flex flex-col gap-8 w-full">
              <ThirdPartyCard
                connectedProviders={connectedProviders}
                onConnect={(id) => setConnectedProviders((prev) => new Set([...prev, id]))}
                onDisconnect={(id) => {
                  setConnectedProviders((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                }}
                mode="inhouse"
                autoDispatchEnabled={false}
                onConfigureDispatch={() => {}}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
