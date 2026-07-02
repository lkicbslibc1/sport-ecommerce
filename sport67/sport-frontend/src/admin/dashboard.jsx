import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Shirt,
  Users,
  Settings,
  HelpCircle,
  Search,
  Bell,
  TrendingUp,
  Truck,
  AlertTriangle,
  Plus,
  Package,
  Banknote,
  CircleDot,
} from "lucide-react";
import GogoAthleticOrders from "./Orders.jsx";
import GogoAthleticInventory from "./Inventory.jsx";
import GogoAthleticProducts from "./Products.jsx";


const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Orders", icon: ShoppingCart },
  { label: "Inventory", icon: Package },
  { label: "Products", icon: Boxes },
  { label: "Team", icon: Users },
];

const WEEK = [
  { day: "Mon", height: "h-2/3", amount: "$32k" },
  { day: "Tue", height: "h-1/2", amount: "$24k" },
  { day: "Wed", height: "h-3/4", amount: "$36k" },
  { day: "Thu", height: "h-2/5", amount: "$19k" },
  { day: "Fri", height: "h-5/6", amount: "$39k" },
  { day: "Sat", height: "h-4/5", amount: "$37k" },
  { day: "Sun", height: "h-full", amount: "$42k", today: true },
];

const KPIS = [
  {
    label: "Daily Revenue",
    value: "$42,890.00",
    icon: Banknote,
    trend: "+12.4% vs prev. day",
    trendIcon: TrendingUp,
    trendColor: "text-orange-300",
  },
  {
    label: "Active Shipments",
    value: "1,204",
    icon: Truck,
    trend: "89% On-Schedule",
    trendIcon: Truck,
    trendColor: "text-indigo-300",
  },
  {
    label: "Stock Efficiency",
    value: "94.2%",
    icon: Package,
    trend: "12 SKUs critical",
    trendIcon: AlertTriangle,
    trendColor: "text-red-400",
  },
];

const ALERTS = [
  { name: "Ignite 3.0 Leggings", sku: "IGN-LG-BLK-01", status: "2 LEFT" },
  { name: "Vertex Compression Top", sku: "VTX-TP-OR-05", status: "OUT" },
  { name: "Kinetic Headband", sku: "KNT-HB-GRY", status: "8 LEFT" },
];

const BEST_SELLERS = [
  {
    rank: 1,
    name: "Kinetic Compression Shorts",
    series: "Core Tech Series",
    revenue: "$84.5k",
    rankBg: "bg-orange-300 text-neutral-950",
  },
  {
    rank: 2,
    name: "Aero-V Hoodie 2.0",
    series: "Thermo-Control",
    revenue: "$62.1k",
    rankBg: "bg-neutral-300 text-neutral-950",
  },
  {
    rank: 3,
    name: "Volt Endurance Vest",
    series: "Reflective / Night Run",
    revenue: "$51.9k",
    rankBg: "bg-neutral-500 text-neutral-950",
  },
  {
    rank: 4,
    name: "Strike Performance Shoe",
    series: "Footwear / Sprint",
    revenue: "$38.4k",
    rankBg: "bg-neutral-700 text-neutral-100",
  },
];

function GlassPanel({ className = "", children }) {
  return (
    <div
      className={
        "backdrop-blur-md bg-white/[0.03] border border-white/5 " + className
      }
    >
      {children}
    </div>
  );
}

export default function GogoAthleticDashboard({ onViewChange }) {
  const [range, setRange] = useState("daily");
  const [currentPage, setCurrentPage] = useState("dashboard");

  if (currentPage === "orders") {
    return <GogoAthleticOrders onNavigate={setCurrentPage} />;
  }
  if (currentPage === "inventory") {
    return <GogoAthleticInventory onNavigate={setCurrentPage} />;
  }
  if (currentPage === "products") {
    return <GogoAthleticProducts onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      {/* SIDE NAVIGATION */}
      <aside className="hidden md:flex md:w-64 shrink-0 h-screen sticky top-0 flex-col py-8 px-4 border-r border-white/5 bg-black">
        <div className="mb-10">
          <h1 className="text-2xl italic font-black tracking-tighter text-orange-300">
            GOGO ATHLETIC
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mt-1">
            Back-Office Suite
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              onClick={() => {
                if (label === "Orders") setCurrentPage("orders");
                else if (label === "Inventory") setCurrentPage("inventory");
                else if (label === "Products") setCurrentPage("products");
                else setCurrentPage("dashboard");
              }}
              className={
                "w-full flex items-center gap-4 px-4 py-3 transition-all duration-300 ease-in-out hover:pl-6 text-left " +
                (active
                  ? "text-orange-300 font-bold border-r-4 border-orange-300 bg-white/[0.03]"
                  : "text-neutral-400 hover:text-orange-300")
              }
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-sm tracking-wide uppercase">{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5 space-y-2">
          <button className="w-full bg-orange-600 text-white py-3 mb-6 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <Plus size={16} />
            New Product
          </button>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-2 text-neutral-400 hover:text-orange-300 transition-colors"
          >
            <Settings size={18} />
            <span className="text-sm tracking-wide uppercase">Settings</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-4 px-4 py-2 text-neutral-400 hover:text-orange-300 transition-colors"
          >
            <HelpCircle size={18} />
            <span className="text-sm tracking-wide uppercase">Support</span>
          </a>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* TOP NAVIGATION */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-20 px-6 md:px-12 border-b border-white/5 backdrop-blur-md bg-neutral-950/90">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest">
            <span className="text-neutral-500">Admin</span>
            <span className="text-neutral-700">/</span>
            <span className="text-orange-300 font-bold">Dashboard</span>
          </div>

          <div className="flex items-center gap-8">
            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="GLOBAL SEARCH..."
                className="bg-transparent border-0 border-b border-white/10 focus:ring-0 focus:border-orange-300 text-neutral-100 w-64 text-xs placeholder:text-neutral-600 pb-1"
              />
              <Search
                size={14}
                className="absolute right-0 bottom-2 text-neutral-500"
              />
            </div>
            <div className="flex items-center gap-6">
              <button className="text-neutral-400 hover:text-orange-300 transition-colors">
                <Bell size={20} />
              </button>
              <div className="h-10 w-10 bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Admin avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz-ybs2SMIcKqNd6cA5Y6eKUmJZuqUPoX89kMmLEUiYQo8aAMzIwB-BItNxUOPJWePJeqxJ8QByoD7yzUoNE2hYtRjsdBgEkKsTLO4jQE-m3DiArhxZCUV0mpDXagf8JKsRr7L2nVuRiv9KCnEoEnpw9aREw7V8ovWk-qYLSfu5CCbg-mCGxX28R2SM_ocNMsjzBol7TsfXGC9Z9CsjLLCy3wS2XyxPmYwOdawfJQyyHpWA_Io6vqw4ivfZknBwGk5selvwIiApQA"
                />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 md:p-12">
          {/* Dashboard Header */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
            <div>
              <h2 className="text-4xl sm:text-6xl italic uppercase font-black tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                PERFORMANCE
              </h2>
              <h3 className="text-3xl sm:text-4xl uppercase font-black -mt-2 sm:-mt-4 text-orange-300">
                Live Intelligence
              </h3>
            </div>
            <GlassPanel className="px-6 py-3 flex flex-col items-end w-fit">
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                Global Status
              </span>
              <span className="text-orange-300 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-300 animate-pulse" />
                OPERATIONAL
              </span>
            </GlassPanel>
          </div>

          {/* BENTO GRID LAYOUT */}
          <div className="grid grid-cols-12 gap-6">
            {/* KPI CARDS */}
            {KPIS.map(
              ({ label, value, icon: Icon, trend, trendIcon: TrendIcon, trendColor }) => (
                <div
                  key={label}
                  className="col-span-12 lg:col-span-4 relative overflow-hidden group"
                >
                  <GlassPanel className="p-8 relative overflow-hidden h-full">
                    <div className="relative z-10">
                      <p className="text-[11px] text-neutral-400 uppercase tracking-widest mb-2">
                        {label}
                      </p>
                      <h4 className="text-4xl italic tracking-tighter font-black mb-4">
                        {value}
                      </h4>
                      <div className={"flex items-center gap-2 font-bold " + trendColor}>
                        <TrendIcon size={18} />
                        <span className="text-sm">{trend}</span>
                      </div>
                    </div>
                    <Icon
                      size={160}
                      className="absolute -right-10 -bottom-10 opacity-10 scale-150 group-hover:rotate-12 transition-transform duration-700 text-neutral-500"
                    />
                  </GlassPanel>
                </div>
              )
            )}

            {/* VELOCITY MATRIX CHART */}
            <div className="col-span-12 lg:col-span-8">
              <GlassPanel className="p-8 min-h-[400px] h-full">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h5 className="text-2xl uppercase italic font-black tracking-tight">
                      Velocity Matrix
                    </h5>
                    <p className="text-neutral-500 text-[10px] uppercase tracking-widest mt-1">
                      7-Day Transaction Volume
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRange("daily")}
                      className={
                        "text-xs px-4 py-1 uppercase font-bold transition-colors " +
                        (range === "daily"
                          ? "bg-orange-300 text-neutral-950"
                          : "border border-white/10 text-neutral-300 hover:bg-white/5")
                      }
                    >
                      Daily
                    </button>
                    <button
                      onClick={() => setRange("weekly")}
                      className={
                        "text-xs px-4 py-1 uppercase font-bold transition-colors " +
                        (range === "weekly"
                          ? "bg-orange-300 text-neutral-950"
                          : "border border-white/10 text-neutral-300 hover:bg-white/5")
                      }
                    >
                      Weekly
                    </button>
                  </div>
                </div>

                <div className="h-64 w-full flex items-end gap-2 px-2">
                  {WEEK.map(({ day, height, amount, today }) => (
                    <div
                      key={day}
                      className={
                        "flex-1 relative group cursor-pointer transition-colors border-t-2 " +
                        height +
                        " " +
                        (today
                          ? "bg-orange-300 border-white"
                          : "bg-orange-300/20 hover:bg-orange-300/40 border-orange-300")
                      }
                    >
                      <div
                        className={
                          "absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity text-[10px] px-2 py-1 font-bold whitespace-nowrap " +
                          (today
                            ? "opacity-100 bg-white text-neutral-950 italic"
                            : "opacity-0 group-hover:opacity-100 bg-orange-300 text-neutral-950")
                        }
                      >
                        {today ? `TODAY: ${amount}` : `${day.toUpperCase()}: ${amount}`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest opacity-70">
                  {WEEK.map(({ day }) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
              </GlassPanel>
            </div>

            {/* CRITICAL STOCK ALERTS */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
              <GlassPanel className="p-8 bg-red-950/20 border-red-500/20 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h5 className="text-sm text-red-400 uppercase italic tracking-widest font-black flex items-center gap-2">
                    <AlertTriangle size={18} className="fill-red-400/20" />
                    Critical Alerts
                  </h5>
                  <span className="text-[10px] bg-red-400 text-red-950 px-2 py-0.5 font-bold">
                    12 SKUs
                  </span>
                </div>
                <div className="space-y-4">
                  {ALERTS.map(({ name, sku, status }) => (
                    <div
                      key={sku}
                      className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-bold text-sm uppercase">{name}</p>
                        <p className="text-[10px] text-neutral-500">SKU: {sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-400 font-black">{status}</p>
                        <button className="text-orange-300 text-[10px] font-bold underline uppercase tracking-widest">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>

            {/* BEST SELLERS */}
            <div className="col-span-12">
              <GlassPanel className="p-6 sm:p-10 mt-6">
                <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
                  <h5 className="text-2xl sm:text-3xl uppercase italic font-black tracking-tight">
                    Best Sellers{" "}
                    <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                      Leaderboard
                    </span>
                  </h5>
                  <button className="text-neutral-400 hover:text-orange-300 text-xs font-bold uppercase tracking-widest border-b border-neutral-500">
                    View Full Catalog
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {BEST_SELLERS.map(({ rank, name, series, revenue, rankBg }) => (
                    <div key={rank} className="group">
                      <div className="relative aspect-square bg-neutral-900 overflow-hidden mb-4 border border-white/5 transition-all duration-500 group-hover:border-orange-300/50 flex items-center justify-center">
                        <Shirt
                          size={72}
                          strokeWidth={1}
                          className="text-neutral-700 group-hover:text-orange-300/60 transition-colors duration-500 group-hover:scale-110 duration-700"
                        />
                        <div
                          className={
                            "absolute top-0 right-0 font-black p-3 text-lg italic " +
                            rankBg
                          }
                        >
                          #{rank}
                        </div>
                      </div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h6 className="font-bold text-sm uppercase tracking-tight">
                            {name}
                          </h6>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                            {series}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-orange-300 font-black">{revenue}</p>
                          <p className="text-[10px] text-neutral-500 uppercase">
                            Revenue
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>
        </main>
      </div>

      {/* FLOATING ACTION BUTTON */}
      <button className="fixed bottom-10 right-10 w-16 h-16 bg-orange-300 text-neutral-950 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50">
        <Plus size={28} />
      </button>
    </div>
  );
}