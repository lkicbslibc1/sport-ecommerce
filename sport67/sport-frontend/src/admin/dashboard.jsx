import React, { useState, useMemo, useContext } from "react";
import {
  TrendingUp,
  Truck,
  AlertTriangle,
  Plus,
  Package,
  Banknote,
  Boxes,
  Bell,
  Search,
  ShoppingCart
} from "lucide-react";
import GogoAthleticOrders from "./Orders.jsx";
import GogoAthleticProducts from "./Products.jsx";
import GogoAthleticTeam from "./Team.jsx";
import Sidebar from "./Sidebar.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import { ProductContext, getStoredOrders } from "../data/products.jsx";
import { TeamProvider } from "../data/team.jsx";
import { NotificationProvider, useNotifications } from "../contexts/NotificationContext.jsx";



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

export default function GogoAthleticDashboard({ onViewChange, user, setUser }) {
  const { products } = useContext(ProductContext);
  return (
    <NotificationProvider user={user} products={products}>
      <DashboardInner onViewChange={onViewChange} user={user} setUser={setUser} />
    </NotificationProvider>
  );
}

function DashboardInner({ onViewChange, user, setUser }) {
  const [range, setRange] = useState("daily");
  const [currentPage, setCurrentPage] = useState(user?.role === 'employee' ? "orders" : "dashboard");

// Restrict employee access
  React.useEffect(() => {
    if (user?.role === 'employee' && !["orders", "products"].includes(currentPage)) {
      setCurrentPage("orders");
    }
  }, [user, currentPage]);


  // Get products and orders from context and localStorage
  const { products } = useContext(ProductContext);

  const [ordersList, setOrdersList] = useState([]);
  
  React.useEffect(() => {
    const loadOrders = async () => {
      const fetchedOrders = await getStoredOrders();
      setOrdersList(fetchedOrders || []);
    };
    loadOrders();
    // Poll for real-time updates every 5 seconds
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Metrics - now using products from context
  const totalRevenue = useMemo(() => {
    return ordersList
      .filter(o => o.status !== 'Cancelled')
      .reduce((sum, o) => {
        const val = o.total || 0;
        return sum + val;
      }, 0);
  }, [ordersList]);

  const activeShipments = useMemo(() => {
    return ordersList.filter(o => o.status === 'Preparing' || o.status === 'Shipped').length;
  }, [ordersList]);

  const criticalProducts = useMemo(() => {
    return products.filter(p => p.amount <= 10);
  }, [products]);

  const stockEfficiency = useMemo(() => {
    if (products.length === 0) return "100%";
    const optimalCount = products.filter(p => p.amount > 10).length;
    return ((optimalCount / products.length) * 100).toFixed(1) + "%";
  }, [products]);

  const dynamicAlerts = useMemo(() => {
    return criticalProducts.map(p => ({
      name: p.name,
      sku: p.sku || `GA-PROD-${p.id}`,
      status: p.amount === 0 ? "OUT OF STOCK" : `${p.amount} LEFT`
    })).slice(0, 5);
  }, [criticalProducts]);

  // Compute last 7 days or 7 weeks of revenue from real orders
  const chartData = useMemo(() => {
    const today = new Date();
    
    if (range === "daily") {
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        return d;
      });

      const results = days.map((d, i) => {
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateKey = d.toLocaleDateString("en-US", {
          month: "short", day: "2-digit", year: "numeric"
        }).toUpperCase();
        const dayOrders = ordersList.filter(
          o => o.date && o.date.toUpperCase() === dateKey && o.status !== "Cancelled"
        );
        const total = dayOrders.reduce((sum, o) => {
          return sum + (o.total || 0);
        }, 0);
        return { label: dayName, total, isCurrent: i === 6 };
      });
      return results;
    } else {
      // weekly
      const weeks = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - ((6 - i) * 7));
        return d;
      });

      const results = weeks.map((weekEnd, i) => {
        const weekStart = new Date(weekEnd);
        weekStart.setDate(weekEnd.getDate() - 6);
        
        let label = "";
        if (i === 6) label = "THIS WK";
        else if (i === 5) label = "LAST WK";
        else label = `W-${6 - i}`;
        
        const weekOrders = ordersList.filter(o => {
            if (o.status === "Cancelled" || !o.date) return false;
            const orderDate = new Date(o.date);
            const orderTime = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate()).getTime();
            const startTime = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate()).getTime();
            const endTime = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate()).getTime();
            
            return orderTime >= startTime && orderTime <= endTime;
        });

        const total = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);
        return { label, total, isCurrent: i === 6 };
      });
      return results;
    }
  }, [ordersList, range]);

  const displayData = useMemo(() => {
    const maxTotal = Math.max(...chartData.map(r => r.total), 1);
    return chartData.map(r => ({
      label: r.label,
      amount: r.total > 0 ? r.total.toLocaleString("th-TH") + " ฿" : "0 ฿",
      heightPct: Math.max(5, Math.round((r.total / maxTotal) * 100)),
      isCurrent: r.isCurrent
    }));
  }, [chartData]);

  // Best Sellers - calculated from real order data
  const bestSellers = useMemo(() => {
    // Calculate revenue from actual orders
    const productRevenue = {};
    
    ordersList.forEach(order => {
      if (order.status !== 'Cancelled' && order.items) {
        order.items.forEach(item => {
          // Match by product id or sku
          const productId = item.id || item.sku;
          if (productId) {
            const price = parseFloat((item.price || "0").replace(/,/g, '').replace(' ฿', '')) || 0;
            const qty = item.qty || 1;
            const revenue = price * qty;
            
            if (!productRevenue[productId]) {
              productRevenue[productId] = {
                totalRevenue: 0,
                totalQty: 0
              };
            }
            productRevenue[productId].totalRevenue += revenue;
            productRevenue[productId].totalQty += qty;
          }
        });
      }
    });
    
    // Create product lookup by id and sku
    const productMap = {};
    products.forEach(p => {
      productMap[p.id] = p;
      if (p.sku) productMap[p.sku] = p;
    });
    
    // Sort products by revenue and get top 4
    const sortedProducts = Object.entries(productRevenue)
      .map(([key, data]) => {
        const product = productMap[key];
        if (product) {
          return {
            product,
            totalRevenue: data.totalRevenue,
            totalQty: data.totalQty
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 4);
    
    return sortedProducts.map((item, idx) => ({
      rank: idx + 1,
      name: item.product.name,
      series: item.product.series || item.product.description || "Core Technical Gear",
      revenue: item.totalRevenue.toLocaleString("th-TH") + " ฿",
      image: item.product.image,
      rankBg: idx === 0
        ? "bg-orange-300 text-neutral-950"
        : idx === 1
          ? "bg-neutral-300 text-neutral-950"
          : idx === 2
            ? "bg-neutral-500 text-neutral-950"
            : "bg-neutral-700 text-neutral-100"
    }));
  }, [products, ordersList]);

  const { unreadCount, setPanelOpen } = useNotifications();

  if (currentPage === "orders") {
    return <GogoAthleticOrders onNavigate={setCurrentPage} onViewChange={onViewChange} user={user} setUser={setUser} />;
  }
  if (currentPage === "products") {
    return <GogoAthleticProducts onNavigate={setCurrentPage} onViewChange={onViewChange} user={user} setUser={setUser} />;
  }
  if (currentPage === "team") {
    return (
      <TeamProvider>
        <GogoAthleticTeam onNavigate={setCurrentPage} onViewChange={onViewChange} user={user} setUser={setUser} />
      </TeamProvider>
    );
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      <NotificationPanel />
      <Sidebar
        user={user}
        setUser={setUser}
        activeItem="dashboard"
        onNavigate={setCurrentPage}
        onViewChange={onViewChange}
        actionButton={
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setCurrentPage("products")}
              className="w-full bg-orange-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              New Product
            </button>
            <button
              onClick={() => setCurrentPage("orders")}
              className="w-full bg-indigo-600 text-white py-3 text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <ShoppingCart size={16} />
              View Orders
            </button>
          </div>
        }
      />

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
              <button
                onClick={() => setPanelOpen(true)}
                className="text-neutral-400 hover:text-orange-300 transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 animate-pulse">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              <div className="h-10 w-10 bg-neutral-800 border border-white/10 flex items-center justify-center overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  alt="Admin avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz-ybs2SMIcKqNd6cA5Y6eKUmJZuqUPoX89kMmLEUiYQo8aAMzIwB-BItNxUOPJWePJeqxJ8QByoD7yzUoNE2hYtRjsdBgEkKsTLO4jQE-m3DiArhxZCUV0mpDXagf8JKsRr7L2nVuRiv9KCnEoEnpw9aREw7V8ovWk-qYLSfu5CCbg-mCGxX28R2SM_ocNMsjzBol7TsfXGC9Z9CsjLLCy3wS2XyxPmYwOdawfJQyyHpWA_Io6vqw4ivfZknBwGk5selvwIiApQA"
                />
              </div>
              <button
                onClick={() => {
                  if (setUser) setUser(null);
                  if (onViewChange) onViewChange('home');
                }}
                className="ml-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-orange-300 border border-white/10 px-4 py-2 hover:border-orange-300 transition-colors"
              >
                Logout
              </button>
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
            {[
              {
                label: "Store Revenue",
                value: totalRevenue.toLocaleString("th-TH") + " ฿",
                icon: Banknote,
                trend: `From ${ordersList.length} total orders`,
                trendIcon: TrendingUp,
                trendColor: "text-orange-300",
              },
              {
                label: "Active Shipments",
                value: activeShipments.toString(),
                icon: Truck,
                trend: "Fulfillment In Progress",
                trendIcon: Truck,
                trendColor: "text-indigo-300",
              },
              {
                label: "Stock Efficiency",
                value: stockEfficiency,
                icon: Package,
                trend: `${criticalProducts.length} items critical`,
                trendIcon: AlertTriangle,
                trendColor: criticalProducts.length > 0 ? "text-red-400" : "text-green-400",
              }
            ].map(
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
                      {range === 'daily' ? '7-Day Transaction Volume' : '7-Week Transaction Volume'}
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
                  {displayData.map(({ label, heightPct, amount, isCurrent }) => (
                    <div
                      key={label}
                      className={
                        "flex-1 relative group cursor-pointer transition-colors border-t-2 " +
                        (isCurrent
                          ? "bg-orange-300 border-white"
                          : "bg-orange-300/20 hover:bg-orange-300/40 border-orange-300")
                      }
                      style={{ height: heightPct + "%" }}
                    >
                      <div
                        className={
                          "absolute -top-8 left-1/2 -translate-x-1/2 transition-opacity text-[10px] px-2 py-1 font-bold whitespace-nowrap z-10 " +
                          (isCurrent
                            ? "opacity-100 bg-white text-neutral-950 italic"
                            : "opacity-0 group-hover:opacity-100 bg-orange-300 text-neutral-950")
                        }
                      >
                        {isCurrent ? `${range === 'daily' ? 'TODAY' : 'THIS WK'}: ${amount}` : `${label.toUpperCase()}: ${amount}`}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-500 uppercase tracking-widest opacity-70">
                  {displayData.map(({ label }) => (
                    <span key={label}>{label}</span>
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
                    {criticalProducts.length} SKUs
                  </span>
                </div>
                <div className="space-y-4">
                  {dynamicAlerts.length > 0 ? (
                    dynamicAlerts.map(({ name, sku, status }) => (
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
<button
                            onClick={() => setCurrentPage("products")}
                            className="text-orange-300 text-[10px] font-bold underline uppercase tracking-widest"
                        >
                            Restock
                        </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-xs italic">All stock levels normal.</p>
                  )}
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
                  <button
                    onClick={() => setCurrentPage("products")}
                    className="text-neutral-400 hover:text-orange-300 text-xs font-bold uppercase tracking-widest border-b border-neutral-500"
                  >
                    View Full Catalog
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {bestSellers.map(({ rank, name, series, revenue, image, rankBg }) => (
                    <div key={rank} className="group">
                      <div className="relative aspect-square bg-neutral-900 overflow-hidden mb-4 border border-white/5 transition-all duration-500 group-hover:border-orange-300/50 flex items-center justify-center">
                        {image ? (
                          <img src={image} className="w-full h-full object-cover group-hover:scale-110 duration-700 transition-transform" alt={name} />
                        ) : (
                          <Boxes
                            size={72}
                            strokeWidth={1}
                            className="text-neutral-700 group-hover:text-orange-300/60 transition-colors duration-500 group-hover:scale-110 duration-700"
                          />
                        )}
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
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
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
      <button
        onClick={() => setCurrentPage("products")}
        className="fixed bottom-10 right-10 w-16 h-16 bg-orange-300 text-neutral-950 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}