import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";

const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { label: "Orders", value: "orders", icon: ShoppingCart },
  { label: "Products", value: "products", icon: Boxes },
  { label: "Team", value: "team", icon: Users },
];

const EMPLOYEE_NAV_ITEMS = [
  { label: "Orders", value: "orders", icon: ShoppingCart },
  { label: "Products", value: "products", icon: Boxes },
];

export default function Sidebar({ activeItem, onNavigate, onViewChange, actionButton, user, setUser }) {
  const NAV_ITEMS = user?.role === 'employee' ? EMPLOYEE_NAV_ITEMS : ADMIN_NAV_ITEMS;
  return (
    <aside className="hidden md:flex md:w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-white/5 bg-black py-8">
      {/* BRAND LOGO */}
      <div
        className="px-8 mb-10 cursor-pointer"
        onClick={() => onViewChange && onViewChange("home")}
      >
        <h1 className="text-2xl italic font-black tracking-tighter text-orange-300">
          GOGO ATHLETIC
        </h1>
        <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mt-1">
          Back-Office Suite
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map(({ label, value, icon: Icon }) => {
          const isActive = activeItem === value;
          return (
            <button
              key={value}
              onClick={() => onNavigate && onNavigate(value)}
              className={
                "w-full flex items-center gap-4 transition-all duration-200 ease-in-out py-3 text-left " +
                (isActive
                  ? "text-orange-300 font-bold border-l-4 border-orange-300 bg-white/[0.02] pl-4"
                  : "text-neutral-400 font-medium pl-5 hover:text-orange-300 hover:bg-white/[0.02]")
              }
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm uppercase tracking-widest">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* ACTION BUTTON (Optional) */}
      {actionButton && (
        <div className="px-8 pb-4">
          {actionButton}
        </div>
      )}

      {/* FOOTER CONTROLS */}
      <div className="border-t border-white/5 p-4 space-y-1 mt-auto">

        <button
          onClick={() => {
            if (setUser) setUser(null);
            if (onViewChange) onViewChange('home');
          }}
          className="w-full flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-orange-300 transition-colors p-4"
        >
          <LogOut size={16} />
          <span className="text-[10px] uppercase tracking-widest text-left">Logout</span>
        </button>
      </div>
    </aside>
  );
}
