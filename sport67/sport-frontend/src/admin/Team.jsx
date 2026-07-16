import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
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
  Plus,
  Mail,
  Shield,
  Clock,
  Trash2,
  X,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STATUS_STYLES = {
  Active: "bg-green-500/10 text-green-500 border border-green-500/20",
  Away: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  Offline: "bg-neutral-500/10 text-neutral-400 border border-neutral-800",
  Banned: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const ROLE_STYLES = {
  manager: "text-indigo-300 border border-indigo-300/30 bg-indigo-300/5",
  employee: "text-emerald-400 border border-emerald-400/30 bg-emerald-400/5",
  customer: "text-pink-400 border border-pink-400/30 bg-pink-400/5",
  banned: "text-red-400 border border-red-400/30 bg-red-400/5",
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

export default function GogoAthleticTeam({ onNavigate, onViewChange, user, setUser }) {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "customers"
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortField, setSortField] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchFocused, setSearchFocused] = useState(false);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ username: "", email: "", password: "", role: "employee", status: "Active" });
  const [orders, setOrders] = useState([]);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState(null);

  useEffect(() => {
    const loadData = () => {
      const storedUsers = JSON.parse(localStorage.getItem('gogo_users') || '[]');
      setUsers(storedUsers);
      const storedOrders = JSON.parse(localStorage.getItem('gogo_orders') || '[]');
      setOrders(storedOrders);
    };
    loadData();

    const handleStorage = (e) => {
      if (e.key === 'gogo_users' || e.key === 'gogo_orders') loadData();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const team = users.filter(u => u.role === 'employee' || u.role === 'manager');
  const customers = users.filter(u => u.role === 'customer');

  const isManagerOrAdmin = user && user.role === "manager";

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.username) return;

    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();

    const memberData = {
      id: Date.now(),
      username: newMember.username,
      email: newMember.email || newMember.username,
      password: newMember.password || "password123",
      role: newMember.role,
      isActive: newMember.status !== "Banned",
      joined: date,
    };

    const updatedUsers = [...users, memberData];
    setUsers(updatedUsers);
    localStorage.setItem("gogo_users", JSON.stringify(updatedUsers));

    setNewMember({ username: "", email: "", password: "", role: "employee", status: "Active" });
    setIsModalOpen(false);
  };

  const handleRoleChange = (id, newRoleValue) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, role: newRoleValue };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('gogo_users', JSON.stringify(updatedUsers));
  };

  const handleToggleBan = (id, currentIsActive) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, isActive: !currentIsActive };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('gogo_users', JSON.stringify(updatedUsers));
  };

  const filteredTeam = team.filter((member) => {
    const name = member.username || member.name || "";
    const email = member.email || name;
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.username || customer.name || "";
    const email = customer.email || name;
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const sortData = (data) => {
    let result = [...data];
    if (sortField === "name-asc") {
      result.sort((a, b) => ((a.username || a.name || "").localeCompare(b.username || b.name || "")));
    } else if (sortField === "name-desc") {
      result.sort((a, b) => ((b.username || b.name || "").localeCompare(a.username || a.name || "")));
    }
    return result;
  };

  const sortedTeam = sortData(filteredTeam);
  const sortedCustomers = sortData(filteredCustomers);

  const currentDataList = activeTab === "staff" ? sortedTeam : sortedCustomers;
  const totalPages = Math.ceil(currentDataList.length / itemsPerPage);

  const paginatedData = currentDataList.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  const handleSort = (key) => {
    if (!key) return;
    if (sortField === `${key}-asc`) {
      setSortField(`${key}-desc`);
    } else {
      setSortField(`${key}-asc`);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, activeTab, sortField]);

  const renderRoleSelect = (member) => {
    if (!isManagerOrAdmin) {
      return (
        <span className={`text-[10px] px-3 py-1 font-bold uppercase tracking-wider ${ROLE_STYLES[!member.isActive ? "banned" : member.role]}`}>
          {!member.isActive ? "banned" : member.role}
        </span>
      );
    }

    return (
      <select
        value={member.role}
        onChange={(e) => handleRoleChange(member.id, e.target.value)}
        onClick={(e) => e.stopPropagation()}
        disabled={member.role === 'manager' && user && (member.username === user.username || member.name === user.name)}
        className={`w-32 text-[10px] px-2 py-1.5 font-bold uppercase tracking-wider bg-neutral-900 border border-white/10 rounded focus:ring-1 focus:ring-orange-300 ${ROLE_STYLES[member.role] || "text-neutral-300"} cursor-pointer outline-none`}
      >
        <option value="manager" className="bg-neutral-950 text-neutral-100" disabled>Manager</option>
        <option value="employee" className="bg-neutral-950 text-neutral-100">Employee</option>
        <option value="customer" className="bg-neutral-950 text-neutral-100">Customer</option>
      </select>
    );
  };

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      <Sidebar
        user={user}
        setUser={setUser}
        activeItem="team"
        onNavigate={onNavigate}
        onViewChange={onViewChange}
        actionButton={
          isManagerOrAdmin ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-600 text-white text-[10px] font-black py-4 px-2 uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Add User
            </button>
          ) : (
            <div className="text-[10px] text-center text-neutral-500 uppercase tracking-widest border border-white/5 py-4 px-2">
              Viewing Mode Only
            </div>
          )
        }
      />

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-6 md:px-12 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
          <div></div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-300 hover:scale-110 transition-transform duration-300">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] leading-none tracking-widest">{user?.role?.toUpperCase() || "MANAGER"}</p>
                <p className="text-[10px] text-orange-300 mt-1">{user?.username || user?.name || "Admin"}</p>
              </div>
              <button className="text-orange-300 hover:scale-110 transition-transform duration-300">
                <UserCircle size={30} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 md:p-12 max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
            <div>
              <h2 className="text-4xl italic uppercase font-black tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                USER DIRECTORY
              </h2>
              <h3 className="text-2xl uppercase font-black -mt-1 text-orange-300">
                Roles & Permissions
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full sm:w-auto mt-4 sm:mt-0">
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                {isManagerOrAdmin && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-orange-600 text-white px-4 py-1.5 text-xs uppercase tracking-widest font-black hover:bg-orange-700 transition-colors flex items-center gap-2 h-full"
                  >
                    <Plus size={14} />
                    Add Staff
                  </button>
                )}
                <div className="flex border border-white/10 p-1 bg-neutral-900/50">
                  <button
                    onClick={() => setActiveTab("staff")}
                    className={`px-4 py-1.5 text-xs uppercase tracking-widest font-black transition-all ${activeTab === "staff"
                      ? "bg-orange-300 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                      }`}
                  >
                    Staff ({team.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("customers")}
                    className={`px-4 py-1.5 text-xs uppercase tracking-widest font-black transition-all ${activeTab === "customers"
                      ? "bg-orange-300 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                      }`}
                  >
                    Customers ({customers.length})
                  </button>
                </div>

              </div>
              <div className={"relative transition-all duration-200 w-full sm:w-auto " + (searchFocused ? "scale-105" : "")}>
                <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-400" />
                <input
                  type="text"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH USERS..."
                  className={
                    "bg-transparent border-0 border-b pl-8 py-2 focus:ring-0 text-sm tracking-widest font-bold placeholder:text-neutral-600 transition-colors w-full sm:w-64 md:w-80 text-neutral-100 uppercase " +
                    (searchFocused ? "border-orange-400" : "border-orange-400/50")
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <GlassPanel className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Total Staff</p>
                <h4 className="text-3xl font-black italic text-orange-300 mt-1">{team.length}</h4>
              </div>
              <Users size={32} className="text-neutral-600" />
            </GlassPanel>
            <GlassPanel className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Active Customers</p>
                <h4 className="text-3xl font-black italic text-green-400 mt-1">
                  {customers.filter(c => c.isActive).length}
                </h4>
              </div>
              <Shield size={32} className="text-neutral-600" />
            </GlassPanel>
            <GlassPanel className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Banned Users</p>
                <h4 className="text-3xl font-black italic text-red-400 mt-1">
                  {users.filter(u => !u.isActive).length}
                </h4>
              </div>
              <X size={32} className="text-neutral-600" />
            </GlassPanel>
          </div>

          <GlassPanel className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                  <th
                    className="py-5 px-6 cursor-pointer hover:text-orange-300 select-none"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Username
                      <span className="text-neutral-500">
                        {sortField === 'name-asc' ? <ChevronUp size={14} className="text-orange-300" /> :
                          sortField === 'name-desc' ? <ChevronDown size={14} className="text-orange-300" /> :
                            <ArrowUpDown size={14} />}
                      </span>
                    </div>
                  </th>
                  <th className="py-5 px-6">Role</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6">Joined</th>
                  {isManagerOrAdmin && <th className="py-5 px-6 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedData.map((member) => (
                  <tr 
                    key={member.id || member.username} 
                    className={`transition-colors group ${member.role === 'customer' ? 'cursor-pointer hover:bg-white/5' : 'hover:bg-white/[0.01]'}`}
                    onClick={() => member.role === 'customer' && setSelectedCustomerOrders(member)}
                    title={member.role === 'customer' ? "View Order History" : ""}
                  >
                    <td className="py-5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-neutral-900 border border-white/10 rounded-none flex items-center justify-center">
                          <UserCircle size={20} className="text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-bold text-sm uppercase tracking-wide">{member.username || member.name}</p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Mail size={12} />
                            {member.email || member.username}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      {renderRoleSelect(member)}
                    </td>
                    <td className="py-5 px-6">
                      <span className={`text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider ${!member.isActive ? STATUS_STYLES.Banned : STATUS_STYLES.Active}`}>
                        {!member.isActive ? "Banned" : "Active"}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-xs text-neutral-400 font-mono">
                      {member.joined || "N/A"}
                    </td>
                    {isManagerOrAdmin && (
                      <td className="py-5 px-6 text-right">
                        <div className="flex justify-end items-center gap-2">
                          {!(member.role === 'manager' && user && (member.username === user.username || member.name === user.name)) && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleBan(member.id, member.isActive); }}
                              className={`text-[10px] px-3 py-1.5 font-bold uppercase tracking-wider rounded border transition-all hover:scale-105 active:scale-95 ${member.isActive
                                  ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
                                  : "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]"
                                }`}
                            >
                              {member.isActive ? "Ban" : "Unban"}
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-neutral-500 text-sm">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlassPanel>

          <div className="mt-4 p-4 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4 border border-white/5">
            <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
              Showing {(currentPage - 1) * itemsPerPage + (currentDataList.length > 0 ? 1 : 0)}-
              {Math.min(currentPage * itemsPerPage, currentDataList.length)} of {currentDataList.length} Records
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
                  className={`px-4 py-2 font-black italic text-xs ${currentPage === page
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
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassPanel className="w-full max-w-md p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h4 className="text-xl font-black italic uppercase text-orange-300 mb-6">
              Add User
            </h4>
            <form onSubmit={handleAddMember} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. luke"
                  value={newMember.username}
                  onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-100 text-sm px-4 py-3 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. luke@gogoathletic.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-100 text-sm px-4 py-3 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter temporary password"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-100 text-sm px-4 py-3 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-300 text-xs px-4 py-3 focus:ring-1 focus:ring-orange-300"
                >
                  <option value="manager">Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-4 uppercase text-xs tracking-widest hover:bg-orange-700 transition-colors"
              >
                Add User
              </button>
            </form>
          </GlassPanel>
        </div>
      )}

      {selectedCustomerOrders && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-neutral-950/95 backdrop-blur-2xl"
            onClick={() => setSelectedCustomerOrders(null)}
          />
          <GlassPanel className="w-full max-w-4xl max-h-[80vh] flex flex-col relative animate-slideIn">
            <div className="p-8 border-b border-white/10 flex justify-between items-center bg-neutral-900/50">
              <div>
                <h3 className="text-2xl italic uppercase font-black text-orange-300">
                  Order History
                </h3>
                <p className="text-[10px] text-neutral-400 tracking-widest mt-1">
                  USER: {selectedCustomerOrders.username || selectedCustomerOrders.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedCustomerOrders(null)}
                className="hover:rotate-90 hover:text-orange-400 transition-all duration-300"
              >
                <X size={28} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-black/40">
              {(() => {
                const userOrders = orders.filter(o => 
                  o.username === (selectedCustomerOrders.username || selectedCustomerOrders.name)
                );
                
                if (userOrders.length === 0) {
                  return (
                    <div className="py-12 text-center text-neutral-500 text-sm uppercase tracking-widest">
                      No orders found for this user.
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="bg-neutral-900 border border-white/10 p-6 flex flex-col sm:flex-row justify-between gap-6 hover:border-orange-500/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-black text-orange-300 tracking-widest">{order.id}</span>
                            <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                              order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                              order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                              'bg-neutral-800 text-neutral-300'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 font-mono mb-4">{order.date}</p>
                          
                          <div className="space-y-2">
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-xs text-neutral-300">
                                <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                                <span className="font-bold">{item.qty}x</span>
                                <span className="uppercase">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-end items-start sm:items-end border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6 min-w-[120px]">
                          <span className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Total</span>
                          <span className="text-xl font-black">{order.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </GlassPanel>
        </div>
      )}

    </div>
  );
}