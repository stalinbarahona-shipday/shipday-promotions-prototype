import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import MarketingMaterials from "@/components/dispatch/MarketingMaterials";
import { ThemeProvider } from "@/components/ThemeContext";

// In production: replace with `await fetchMerchantProfile(session.merchantId)`
// Shape mirrors GET /api/merchant/profile response
async function getMerchantAccount() {
  return {
    businessName:  "La Familia Katonah",
    tagline:       "Pizza & Italian-American · Since 2004",
    googleRating:  "4.7",
    reviewCount:   "280+",
    signatureDish: "Penne Alla Vodka",
    deliveryAreas: "Katonah · Bedford · Mt. Kisco",
    orderUrl:      "order.lafamiliakatonah.com",
  };
}

export default async function DeliveryServicesPage() {
  const account = await getMerchantAccount();

  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar activePage="marketing" />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <MarketingMaterials account={account} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
