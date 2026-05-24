import { X } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./LeftSidebar";
import MobileBottomNav from "./MobileBottomNav";
import Navbar from "./Navbar";
import RightSidebar from "./RightSidebar";

export default function AppLayout() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col">
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Layout */}
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Left */}
        <aside className="hidden lg:block w-64 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-r border-border">
          <LeftSidebar />
        </aside>

        {/* Center */}
        <main className="flex-1 px-4 py-6 pb-20">
          <Outlet />
        </main>

        {/* Right */}
        <aside className="hidden xl:block w-80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto border-l border-border px-4">
          <RightSidebar />
        </aside>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-bg z-50 p-4 lg:hidden overflow-y-auto">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="mb-6 p-2 rounded-xl bg-surface border border-border"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="space-y-6">
            <LeftSidebar />
            <RightSidebar />
          </div>
        </div>
      )}

      {/* Bottom Nav */}
      <MobileBottomNav onMenuClick={() => setShowMobileMenu(true)} />
    </div>
  );
}
