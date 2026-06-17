"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import MarketingMaterials from "@/components/dispatch/MarketingMaterials";
import SMSPromotions from "@/components/promotions/SMSPromotions";
import TrackingPagePromotions from "@/components/promotions/TrackingPagePromotions";
import { ThemeProvider } from "@/components/ThemeContext";

type AccountData = {
  businessName: string;
  tagline: string;
  googleRating: string;
  reviewCount: string;
  signatureDish: string;
  deliveryAreas: string;
  orderUrl: string;
};

export default function DispatchShell({ account }: { account: AccountData }) {
  const [activePage, setActivePage] = useState("marketing");

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar activePage={activePage} onPageChange={setActivePage} />
          <main className={`flex-1 flex flex-col ${activePage === "promotions/sms" || activePage === "promotions/tracking" ? "overflow-y-auto" : "overflow-hidden"}`}>
            {activePage === "promotions/sms" ? (
              <SMSPromotions />
            ) : activePage === "promotions/tracking" ? (
              <TrackingPagePromotions />
            ) : (
              <MarketingMaterials account={account} />
            )}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
