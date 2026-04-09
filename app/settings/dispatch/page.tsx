import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import MarketingMaterials from "@/components/dispatch/MarketingMaterials";
import { ThemeProvider } from "@/components/ThemeContext";

export default function DeliveryServicesPage() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar activePage="marketing" />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <MarketingMaterials />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
