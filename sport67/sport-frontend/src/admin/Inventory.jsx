import React, { useState, useMemo, useContext } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Boxes,
  Search,
  Bell,
  UserCircle,
  Pencil,
  ChevronLeft,
  ChevronRight,
  X,
  PackageCheck,
  Package,
} from "lucide-react";
import { ProductContext } from "../data/products.jsx";

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

function formatPrice(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2 }) + " ฿";
}

const getStockStatus = (amount) => {
  if (amount <= 0) return "Out of Stock";
  if (amount <= 10) return "Low Stock";
  return "In Stock";
};

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

export default function GogoAthleticInventory({ onNavigate, onViewChange, user, setUser }) {
  const { products, updateProduct } = useContext(ProductContext);
  const [productsList, setProductsList] = useState([...products]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Gear");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of products per page

  // Sync local state with context when products change
  React.useEffect(() => {
    setProductsList([...products]);
  }, [products]);

  // Modal and quick adjust state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newQty, setNewQty] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("Restock Received");

  const handleOpenAdjust = (item) => {
    setSelectedItem(item);
    setNewQty(item.amount.toString());
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!selectedItem) return;
    const qtyNum = parseInt(newQty);
    if (isNaN(qtyNum) || qtyNum < 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    updateProduct({
      id: selectedItem.id,
      amount: qtyNum
    });

    setModalOpen(false);
  };

  const filteredInventory = useMemo(() => {
    return productsList.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategory =
        selectedCategory === "All Gear" ||
        item.sportType === selectedCategory ||
        item.brand === selectedCategory;

      const itemStatus = getStockStatus(item.amount);
      const matchStatus =
        selectedStatus === "All Statuses" ||
        itemStatus === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [productsList, searchQuery, selectedCategory, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInventory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInventory, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      <Sidebar
        user={user}
        setUser={setUser}
        activeItem="inventory"
        onNavigate={onNavigate}
        onViewChange={onViewChange}
        actionButton={
          <button 
            onClick={() => handleOpenAdjust(productsList[0])}
            className="w-full bg-orange-600 text-white py-3 text-sm uppercase italic font-black hover:scale-105 transition-transform"
          >
            Adjust Stock
          </button>
        }
      />

      <div className="flex-1 min-w-0">
        {/* TOP NAVIGATION */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-6 md:px-12 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
          <div className="w-full max-w-md">
            <div className={"relative transition-all duration-200 " + (searchFocused ? "scale-105" : "")}>
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                <p className="text-[10px] text-orange-300 uppercase font-bold tracking-widest mt-1">
                  {user?.role || 'Operational Manager'}
                </p>
                <p className="text-xs block leading-none">
                  {user?.name || user?.username || 'ADMIN_042'}
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
                <p className="text-3xl italic font-black">{productsList.length}</p>
              </GlassPanel>
              <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-red-400">
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                  Low Stock
                </p>
                <p className="text-3xl italic font-black text-red-400">{productsList.filter(p => p.amount <= 10).length}</p>
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
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold bg-neutral-900 text-neutral-100"
                >
                  <option value="All Gear" className="bg-neutral-950 text-neutral-100">All Gear</option>
                  <option value="Running" className="bg-neutral-950 text-neutral-100">Running</option>
                  <option value="Football" className="bg-neutral-950 text-neutral-100">Football</option>
                  <option value="Swimming" className="bg-neutral-950 text-neutral-100">Swimming</option>
                  <option value="Nike" className="bg-neutral-950 text-neutral-100">Nike</option>
                  <option value="Adidas" className="bg-neutral-950 text-neutral-100">Adidas</option>
                  <option value="Puma" className="bg-neutral-950 text-neutral-100">Puma</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Stock Status
                </span>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold bg-neutral-900 text-neutral-100"
                >
                  <option value="All Statuses" className="bg-neutral-950 text-neutral-100">All Statuses</option>
                  <option value="In Stock" className="bg-neutral-950 text-neutral-100">In Stock</option>
                  <option value="Low Stock" className="bg-neutral-950 text-neutral-100">Low Stock</option>
                  <option value="Out of Stock" className="bg-neutral-950 text-neutral-100">Out of Stock</option>
                </select>
              </div>
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
                      "Sport / Category",
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
                  {paginatedInventory.map((item) => {
                    const statusText = getStockStatus(item.amount);
                    const s = STOCK_STYLES[statusText];
                    return (
                      <tr
                        key={item.id}
                        className="group hover:bg-white/[0.02] hover:border-l-4 hover:border-orange-500 transition-colors"
                      >
                        <td className="px-6 py-6 flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                            ) : (
                              <Package
                                size={20}
                                className="text-neutral-600 group-hover:text-orange-300 transition-colors"
                              />
                            )}
                          </div>
                          <span className="italic font-black uppercase group-hover:text-orange-300 transition-colors">
                            {item.name}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-neutral-400 font-mono text-sm">
                          {item.sku}
                        </td>
                        <td className="px-6 py-6 uppercase text-xs font-bold">
                          {item.sportType}
                        </td>
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-3">
                            <span className={"w-2 h-2 rounded-full " + s.dot + " " + s.pulse} />
                            <span className={"px-3 py-1 text-[10px] font-black uppercase tracking-widest " + s.badge}>
                              {statusText} ({item.amount})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6 italic font-bold">
                          {formatPrice(item.price)}
                        </td>
                        <td className="px-6 py-6 text-right">
                          <button
                            onClick={() => handleOpenAdjust(item)}
                            className="bg-white/5 border border-white/10 hover:border-orange-300 p-2 transition-all hover:bg-orange-300 hover:text-neutral-950"
                            title="Adjust Stock"
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
                Showing {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(currentPage * itemsPerPage, filteredInventory.length)} of {productsList.length} Assets
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 font-black italic text-xs ${
                      currentPage === page 
                        ? "bg-orange-300 text-neutral-950" 
                        : "border border-white/10 hover:bg-white/10 text-neutral-300"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="p-2 border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </GlassPanel>
        </main>
      </div>

      {/* QUICK STOCK UPDATE MODAL */}
      {modalOpen && selectedItem && (
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
              <form className="space-y-8" onSubmit={handleFormSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Gear Asset Name
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedItem.name.toUpperCase()}
                    className="bg-white/5 border border-white/10 py-4 px-6 text-sm uppercase opacity-55 w-full outline-none"
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
                      value={selectedItem.amount}
                      readOnly
                      className="bg-white/5 border border-white/10 py-4 px-6 italic font-black opacity-55 w-full outline-none"
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
                      required
                      className="bg-neutral-800 border border-orange-300/50 focus:border-orange-300 focus:ring-0 py-4 px-6 italic font-black text-orange-300 w-full outline-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                    Reason for Adjustment
                  </label>
                  <select 
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                    className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                  >
                    <option value="Restock Received" className="bg-neutral-950 text-neutral-100">Restock Received</option>
                    <option value="Return Processing" className="bg-neutral-950 text-neutral-100">Return Processing</option>
                    <option value="Damaged/Write-off" className="bg-neutral-950 text-neutral-100">Damaged/Write-off</option>
                    <option value="Cycle Count Adjustment" className="bg-neutral-950 text-neutral-100">Cycle Count Adjustment</option>
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