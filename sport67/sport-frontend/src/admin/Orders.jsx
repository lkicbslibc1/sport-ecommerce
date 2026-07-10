import React, { useState, useMemo } from "react";
import Sidebar from "./Sidebar.jsx";
import {
  Search,
  Bell,
  UserCircle,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Package,
} from "lucide-react";
import { getStoredOrders, saveOrders } from "../data/products.jsx";

const STATUS_STYLES = {
  Pending: "bg-neutral-700 text-neutral-200",
  Preparing: "bg-indigo-300 text-indigo-950",
  Shipped: "bg-orange-600 text-orange-50",
  Delivered: "bg-orange-300 text-orange-950",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/20"
};

const TIER_STYLES = {
  ELITE: "text-orange-400 border border-orange-400",
  PRO: "text-indigo-300 border border-indigo-300",
  MEMBER: "text-neutral-400 border border-neutral-600",
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

export default function GogoAthleticOrders({ onNavigate, onViewChange, user, setUser }) {
  const [ordersList, setOrdersList] = useState(() => {
    try {
      const stored = localStorage.getItem('gogo_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    const initialMock = [];
    return initialMock;
  });

  const [showActionModal, setShowActionModal] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const isOpen = selectedOrder !== null;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  const handleUpdateStatus = (orderId, newStatus) => {
    const updated = ordersList.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    setOrdersList(updated);
    saveOrders(updated);
  };

  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      const matchSearch =
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = selectedStatus === "All Statuses" || o.status === selectedStatus;
      return matchSearch && matchStatus;
    });
  }, [ordersList, searchQuery, selectedStatus]);

  // Dynamic statistics
  const todayOrdersCount = filteredOrders.length;
  const revenueTotal = filteredOrders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => {
      const val = parseFloat(o.total.replace(/,/g, '')) || 0;
      return sum + val;
    }, 0);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      <Sidebar
        user={user}
        setUser={setUser}
        activeItem="orders"
        onNavigate={onNavigate}
        onViewChange={onViewChange}
        actionButton={
          <button
            onClick={() => setShowActionModal(true)}
            className="w-full bg-orange-600 text-white text-[10px] font-black py-4 px-2 uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Orders Action
          </button>
        }
      />

      <div className="flex-1 min-w-0">
        {/* TOP NAVIGATION */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-6 md:px-12 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, ID, customers..."
              className="bg-neutral-900 border-none focus:ring-1 focus:ring-orange-300 text-neutral-100 text-sm pl-10 pr-4 py-2 w-56 sm:w-80 placeholder:text-neutral-600 outline-none"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-300 hover:scale-110 transition-transform duration-300">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] leading-none tracking-widest uppercase">{user?.role || 'ADMINISTRATOR'}</p>
                <p className="text-[10px] text-orange-300 mt-1">{user?.name || user?.username || 'Marcus Thorne'}</p>
              </div>
              <button className="text-orange-300 hover:scale-110 transition-transform duration-300">
                <UserCircle size={30} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="px-6 md:px-12 py-12">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-6 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl italic uppercase font-black leading-none">
                Order Management
              </h2>
              <p className="text-neutral-400 mt-4 max-w-xl text-sm leading-relaxed">
                Unified logistics interface for real-time inventory synchronization
                and fulfillment orchestration.
              </p>
            </div>
            <div className="flex gap-4">
              <GlassPanel className="px-6 py-4 flex flex-col items-center justify-center min-w-[140px]">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Filtered Orders
                </span>
                <span className="text-2xl font-black text-orange-300">{todayOrdersCount}</span>
              </GlassPanel>
              <GlassPanel className="px-6 py-4 flex flex-col items-center justify-center min-w-[160px]">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">
                  Total Revenue
                </span>
                <span className="text-2xl font-black text-orange-300">{revenueTotal.toLocaleString("th-TH")} ฿</span>
              </GlassPanel>
            </div>
          </div>

          {/* Filters HUD */}
          <GlassPanel className="p-6 mb-8 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                Filter Status:
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-neutral-900 border border-white/10 text-neutral-100 text-xs py-2 px-4 focus:ring-orange-300 focus:border-orange-300"
              >
                <option value="All Statuses" className="bg-neutral-950 text-neutral-100">All Statuses</option>
                <option value="Pending" className="bg-neutral-950 text-neutral-100">Pending</option>
                <option value="Preparing" className="bg-neutral-950 text-neutral-100">Preparing</option>
                <option value="Shipped" className="bg-neutral-950 text-neutral-100">Shipped</option>
                <option value="Delivered" className="bg-neutral-950 text-neutral-100">Delivered</option>
                <option value="Cancelled" className="bg-neutral-950 text-neutral-100">Cancelled</option>
              </select>
            </div>
          </GlassPanel>

          {/* Orders Table */}
          <div className="border border-white/10 bg-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-neutral-900 border-b border-white/10">
                  <tr>
                    {["Order ID", "Username", "Customer Name", "Date", "Total", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="p-6 text-[10px] uppercase text-neutral-400 tracking-widest"
                        >
                          {h}
                        </th>
                      )
                    )}
                    <th className="p-6 text-[10px] uppercase text-neutral-400 tracking-widest text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-600/5 hover:border-l-2 hover:border-orange-400 transition-colors"
                    >
                      <td className="p-6 text-sm text-orange-300 tracking-widest">
                        {order.id}
                      </td>
                      <td className="p-6 text-sm text-neutral-200">
                        {order.username || 'Guest'}
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <span className="font-bold uppercase tracking-tight text-sm">
                            {order.customer}
                          </span>
                          <span
                            className={
                              "px-2 py-0.5 text-[8px] font-black uppercase tracking-tighter " +
                              TIER_STYLES[order.tier || "MEMBER"]
                            }
                          >
                            {order.tier || "MEMBER"}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-neutral-400 text-xs">{order.date}</td>
                      <td className="p-6 font-bold tracking-tighter">
                        {order.total}
                      </td>
                      <td className="p-6">
                        <span
                          className={
                            "px-3 py-1 text-[10px] font-black uppercase tracking-widest " +
                            STATUS_STYLES[order.status]
                          }
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 border border-white/10 hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="bg-neutral-900 border border-white/10 text-[10px] uppercase font-black focus:ring-1 focus:ring-orange-300 cursor-pointer px-4 py-1.5 text-neutral-100"
                          >
                            <option value="Pending" className="bg-neutral-950 text-neutral-100">Pending</option>
                            <option value="Preparing" className="bg-neutral-950 text-neutral-100">Preparing</option>
                            <option value="Shipped" className="bg-neutral-950 text-neutral-100">Shipped</option>
                            <option value="Delivered" className="bg-neutral-950 text-neutral-100">Delivered</option>
                            <option value="Cancelled" className="bg-neutral-950 text-neutral-100">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-white/10 bg-neutral-900/60 flex justify-between items-center">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                Showing {filteredOrders.length} of {ordersList.length} orders
              </p>
              <div className="flex gap-2">
                <button className="p-2 border border-white/10 hover:bg-orange-600 hover:text-white transition-all">
                  <ChevronLeft size={16} />
                </button>
                <button className="p-2 border border-white/10 hover:bg-orange-600 hover:text-white transition-all">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ORDER DETAILS DRAWER */}
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-2xl"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-[500px] bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col animate-slideIn">
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div>
                <h3 className="text-2xl italic uppercase font-black text-orange-300">
                  Order Details
                </h3>
                <p className="text-[10px] text-neutral-400 tracking-widest">
                  {selectedOrder.id} / {selectedOrder.customer}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="hover:rotate-90 transition-transform duration-300"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Items */}
              <section>
                <h4 className="text-[10px] uppercase tracking-[0.2em] mb-4">
                  Cart Items ({selectedOrder.items ? selectedOrder.items.length : 0})
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-neutral-950 border border-white/10"
                    >
                      <div className="w-16 h-16 bg-neutral-800 shrink-0 flex items-center justify-center">
                        <Package size={24} className="text-neutral-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-xs uppercase">{item.name}</p>
                        <p className="text-[10px] text-neutral-400">SKU: {item.sku}</p>
                        <div className="flex justify-between items-end mt-2">
                          <span className="text-[10px] text-neutral-400">
                            Qty: {item.qty}
                          </span>
                          <span className="font-bold text-orange-300">
                            {item.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Summary */}
              <section className="bg-neutral-950 border border-white/10 p-6 space-y-2">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span>{selectedOrder.total}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Shipping</span>
                  <span className="text-orange-300">FREE</span>
                </div>
                <div className="h-px bg-white/10 my-4" />
                <div className="flex justify-between text-xl font-black">
                  <span>TOTAL</span>
                  <span>{selectedOrder.total}</span>
                </div>
              </section>
            </div>

            <div className="p-8 border-t border-white/10 grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="border border-neutral-100 text-neutral-100 text-[10px] font-black py-4 uppercase tracking-widest hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS ACTION MODAL */}
      {showActionModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-2xl"
            onClick={() => setShowActionModal(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-neutral-900 border-l border-white/10 shadow-2xl flex flex-col animate-slideIn">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl italic uppercase font-black text-orange-300">
                Orders Actions
              </h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="hover:rotate-90 transition-transform duration-300"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <button
                onClick={() => {
                  const pendingOrders = ordersList.filter(o => o.status === "Pending");
                  if (pendingOrders.length > 0) {
                    const updated = ordersList.map(o =>
                      o.status === "Pending" ? { ...o, status: "Preparing" } : o
                    );
                    setOrdersList(updated);
                    saveOrders(updated);
                  }
                  setShowActionModal(false);
                }}
                className="w-full bg-orange-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-orange-500 transition-colors"
              >
                Process All Pending Orders
              </button>
              <button
                onClick={() => {
                  const preparingOrders = ordersList.filter(o => o.status === "Preparing");
                  if (preparingOrders.length > 0) {
                    const updated = ordersList.map(o =>
                      o.status === "Preparing" ? { ...o, status: "Shipped" } : o
                    );
                    setOrdersList(updated);
                    saveOrders(updated);
                  }
                  setShowActionModal(false);
                }}
                className="w-full bg-indigo-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-indigo-500 transition-colors"
              >
                Ship All Preparing Orders
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to export all orders?")) {
                    const dataStr = JSON.stringify(ordersList, null, 2);
                    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
                    const exportFileDefaultName = 'gogo-orders-export.json';
                    let linkElement = document.createElement('a');
                    linkElement.setAttribute('href', dataUri);
                    linkElement.setAttribute('download', exportFileDefaultName);
                    linkElement.click();
                  }
                  setShowActionModal(false);
                }}
                className="w-full bg-neutral-700 text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-600 transition-colors"
              >
                Export Orders Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
