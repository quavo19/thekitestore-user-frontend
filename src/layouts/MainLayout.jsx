import { Outlet } from "react-router-dom";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SearchModal } from "@/components/shop/SearchModal";

export function MainLayout() {
  return (
    <div className="flex h-full overflow-hidden bg-white">
      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar />
        <SearchModal />
        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
          <Outlet />
          <Footer />
        </main>
      </div>
    </div>
  );
}
