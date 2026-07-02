import React, { useState } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Boxes,
  Users,
  Settings,
  HelpCircle,
  Search,
  Bell,
  UserCircle,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  PackageCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingCart },
  { label: "Inventory", icon: Package, active: true },
  { label: "Products", icon: Boxes },
  { label: "Team", icon: Users },
];

const STOCK_STYLES = {
  "In Stock": {
    dot: "bg-green-500",
    badge: "bg-green-500/10 text-green-500 border border-green-500/20",
    pulse: "animate-pulse",
  },
  "Low Stock": {
    dot: "bg-orange-500",
    badge: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    pulse: "",
  },
  "Out of Stock": {
    dot: "bg-red-400",
    badge: "bg-red-400/10 text-red-400 border border-red-400/20",
    pulse: "animate-ping",
  },
};

const INVENTORY = [
  {
    name: "Apex Carbon Runner v2",
    sku: "GA-FW-2024-001",
    category: "Footwear",
    status: "In Stock",
    qty: 450,
    price: "$285.00",
  },
  {
    name: "Titan Compression Base",
    sku: "GA-CP-2024-089",
    category: "Compression",
    status: "Low Stock",
    qty: 12,
    price: "$75.00",
  },
  {
    name: "Onyx Biometric Tracker",
    sku: "GA-WR-2024-012",
    category: "Wearables",
    status: "Out of Stock",
    qty: 0,
    price: "$499.00",
  },
  {
    name: "Precision Dumbbell Set",
    sku: "GA-EQ-2024-115",
    category: "Equipment",
    status: "In Stock",
    qty: 84,
    price: "$1,150.00",
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

export default function GogoAthleticInventory({ onNavigate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [newQty, setNewQty] = useState("");

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      {/* SIDE NAVIGATION */}
      <aside className="hidden md:flex md:w-64 shrink-0 h-screen sticky top-0 flex-col border-r border-white/5">
        <div className="p-6">
          <h1 className="text-2xl italic font-black text-orange-300 uppercase leading-none">
            GOGO ATHLETIC
          </h1>
          <p className="text-neutral-500 text-[10px] mt-1 tracking-widest">
            Admin Suite
          </p>
        </div>

        <nav className="mt-8 flex-1 space-y-2">
          {NAV_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              onClick={() => {
                if (onNavigate) {
                  if (label === "Dashboard") onNavigate("dashboard");
                  else if (label === "Orders") onNavigate("orders");
                  else if (label === "Inventory") onNavigate("inventory");
                  else if (label === "Products") onNavigate("products");
                }
              }}
              className={
                "w-full flex items-center gap-4 transition-all py-3 text-left " +
                (active
                  ? "text-orange-300 font-bold border-l-4 border-orange-300 pl-4"
                  : "text-neutral-400 font-medium pl-5 hover:text-orange-300 hover:bg-white/[0.02]")
              }
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-sm uppercase tracking-widest">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <button className="w-full bg-orange-600 text-white py-3 text-sm uppercase italic font-black hover:scale-105 transition-transform">
            New Entry
          </button>
          <div className="space-y-2">
            <a
              href="#"
              className="flex items-center gap-4 pl-2 text-neutral-400 hover:text-orange-300 transition-colors"
            >
              <Settings size={16} />
              <span className="text-[10px] uppercase tracking-widest">
                Settings
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-4 pl-2 text-neutral-400 hover:text-orange-300 transition-colors"
            >
              <HelpCircle size={16} />
              <span className="text-[10px] uppercase tracking-widest">
                Support
              </span>
            </a>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* TOP NAVIGATION */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-6 md:px-12 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
          <div className="w-full max-w-md">
            <div
              className={
                "relative transition-all duration-200 " +
                (searchFocused ? "scale-105" : "")
              }
            >
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                type="text"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="SEARCH SKUs OR PRODUCTS..."
                className={
                  "bg-transparent border-0 border-b w-full pl-10 py-2 focus:ring-0 text-sm uppercase tracking-tight placeholder:text-neutral-600 transition-colors " +
                  (searchFocused ? "border-orange-300" : "border-white/10")
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-300 hover:scale-110 transition-transform">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-right hidden sm:block">
                <p className="text-xs block leading-none">ADMIN_042</p>
                <p className="text-[10px] text-orange-300 uppercase font-bold tracking-widest mt-1">
                  Operational Manager
                </p>
              </span>
              <button className="text-orange-300">
                <UserCircle size={36} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="px-6 md:px-12 py-12">
          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl uppercase italic font-black mb-2 leading-none">
                Gear Inventory
              </h2>
              <p className="text-orange-300 tracking-[0.5em] text-[10px] uppercase font-black">
                Live Performance Stock Monitoring
              </p>
            </div>
            <div className="flex gap-4">
              <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-orange-300">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Active SKUs
                </p>
                <p className="text-3xl italic font-black">1,284</p>
              </GlassPanel>
              <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-red-400">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Low Stock
                </p>
                <p className="text-3xl italic font-black text-red-400">12</p>
              </GlassPanel>
            </div>
          </div>

          {/* Filters & Controls */}
          <GlassPanel className="p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Filter by Category
                </span>
                <select className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold">
                  <option>All Gear</option>
                  <option>Footwear</option>
                  <option>Compression</option>
                  <option>Equipment</option>
                  <option>Wearables</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Stock Status
                </span>
                <select className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold">
                  <option>All Statuses</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="border border-white/10 px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-neutral-100 hover:text-neutral-950 transition-colors">
                Export CSV
              </button>
              <button className="bg-orange-300 text-neutral-950 px-6 py-2 uppercase text-xs font-black italic tracking-widest hover:scale-105 transition-transform">
                Bulk Update
              </button>
            </div>
          </GlassPanel>

          {/* Inventory Table */}
          <GlassPanel className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-white/5 uppercase text-xs tracking-widest">
                  <tr>
                    {[
                      "Product Name",
                      "SKU",
                      "Category",
                      "Stock Level",
                      "Price",
                    ].map((h) => (
                      <th key={h} className="px-6 py-5 font-bold">
                        {h}
                      </th>
                    ))}
                    <th className="px-6 py-5 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {INVENTORY.map((item) => {
                    const s = STOCK_STYLES[item.status];
                    return (
                      <tr
                        key={item.sku}
                        className="group hover:bg-white/[0.02] hover:border-l-4 hover:border-orange-500 transition-colors"
                      >
                        <td className="px-6 py-6 flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                            <Package
                              size={20}
                              className="text-neutral-600 group-hover:text-orange-300 transition-colors"
                            />
                          </div>
                          <span className="italic font-black uppercase group-hover:text-orange-300 transition-colors">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-neutral-400 font-mono text-sm">
                          {item.sku}
                        </td>
                        <td className="px-6 py-6 uppercase text-xs font-bold">
                          {item.category}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <span
                              className={
                                "w-2 h-2 rounded-full " + s.dot + " " + s.pulse
                              }
                            />
                            <span
                              className={
                                "px-3 py-1 text-[10px] font-black uppercase tracking-widest " +
                                s.badge
                              }
                            >
                              {item.status} ({item.qty})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 italic font-bold">
                          {item.price}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => setModalOpen(true)}
                            className="bg-white/5 border border-white/10 hover:border-orange-300 p-2 transition-all hover:bg-orange-300 hover:text-neutral-950"
                          >
                            <Pencil size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
              <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
                Showing 1-10 of 1,284 Assets
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 border border-white/10 hover:bg-white/10 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="px-4 py-2 bg-orange-300 text-neutral-950 font-black italic text-xs">
                  1
                </button>
                <button className="px-4 py-2 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold">
                  2
                </button>
                <button className="px-4 py-2 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold">
                  3
                </button>
                <span className="px-2 text-neutral-500">...</span>
                <button className="px-4 py-2 border border-white/10 hover:bg-white/10 transition-colors text-xs font-bold">
                  129
                </button>
                <button className="p-2 border border-white/10 hover:bg-white/10 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </GlassPanel>
        </main>
      </div>

      {/* FLOATING QUICK ACTION */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-600 p-5 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all relative"
        >
          <PackageCheck size={28} />
          <span className="absolute -top-1 -right-1 bg-white text-neutral-950 text-[10px] font-black px-1">
            NEW
          </span>
        </button>
      </div>

      {/* QUICK STOCK UPDATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-neutral-900 border border-orange-300/20 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-orange-300 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl uppercase italic font-black mb-8 border-b-4 border-orange-300 inline-block pb-2">
                Quick Stock Update
              </h3>
              <form
                className="space-y-8"
                onSubmit={(e) => {
                  e.preventDefault();
                  setModalOpen(false);
                }}
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Select Gear Asset
                  </label>
                  <input
                    type="text"
                    placeholder="ENTER SKU OR PRODUCT NAME"
                    className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm placeholder:text-neutral-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      Current Qty
                    </label>
                    <input
                      disabled
                      type="number"
                      value={450}
                      readOnly
                      className="bg-white/5 border border-white/10 py-4 px-6 italic font-black opacity-50"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                      New Qty
                    </label>
                    <input
                      type="number"
                      placeholder="000"
                      value={newQty}
                      onChange={(e) => setNewQty(e.target.value)}
                      className="bg-neutral-800 border border-orange-300/50 focus:border-orange-300 focus:ring-0 py-4 px-6 italic font-black text-orange-300"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Reason for Adjustment
                  </label>
                  <select className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm">
                    <option>Restock Received</option>
                    <option>Return Processing</option>
                    <option>Damaged/Write-off</option>
                    <option>Cycle Count Adjustment</option>
                  </select>
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-300 text-neutral-950 py-4 uppercase italic font-black hover:scale-105 transition-transform"
                  >
                    Apply Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-8 border border-white/10 hover:bg-neutral-100 hover:text-neutral-950 transition-colors uppercase text-xs font-bold tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
