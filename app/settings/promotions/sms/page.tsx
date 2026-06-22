import Navbar from "@/components/layout/Navbar";
import SettingsSidebar from "@/components/layout/SettingsSidebar";
import SMSPromotions from "@/components/promotions/SMSPromotions";
import { ThemeProvider } from "@/components/ThemeContext";

export default function SMSPromotionsPage() {
  return (
    <ThemeProvider>
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <SettingsSidebar />
          <main className="flex-1 flex flex-col overflow-y-auto">
            <SMSPromotions />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
