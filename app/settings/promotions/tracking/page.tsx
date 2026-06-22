import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import TrackingPagePromotions from "@/components/promotions/TrackingPagePromotions";
import { ThemeProvider } from "@/components/ThemeContext";

export default function TrackingPagePromotionsPage() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <TrackingPagePromotions />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
