import React, { useState } from "react";
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
} from "lucide-react";



const STATUS_STYLES = {
  Active: "bg-green-500/10 text-green-500 border border-green-500/20",
  Away: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  Offline: "bg-neutral-500/10 text-neutral-400 border border-neutral-800",
};

const ROLE_STYLES = {
  Administrator: "text-orange-400 border border-orange-400/30 bg-orange-400/5",
  Manager: "text-indigo-300 border border-indigo-300/30 bg-indigo-300/5",
  Logistics: "text-blue-400 border border-blue-400/30 bg-blue-400/5",
  Support: "text-emerald-400 border border-emerald-400/30 bg-emerald-400/5",
  Customer: "text-pink-400 border border-pink-400/30 bg-pink-400/5",
};

const INITIAL_TEAM = [
  {
    id: 1,
    name: "Marcus Thorne",
    email: "marcus@gogoathletic.com",
    role: "Administrator",
    status: "Active",
    joined: "JAN 12, 2023",
  },
  {
    id: 2,
    name: "Dominic Toretto",
    email: "dom@gogoathletic.com",
    role: "Manager",
    status: "Active",
    joined: "FEB 18, 2023",
  },
  {
    id: 3,
    name: "Letty Ortiz",
    email: "letty@gogoathletic.com",
    role: "Logistics",
    status: "Away",
    joined: "MAR 05, 2023",
  },
  {
    id: 4,
    name: "Mia Toretto",
    email: "mia@gogoathletic.com",
    role: "Manager",
    status: "Offline",
    joined: "APR 22, 2023",
  },
  {
    id: 5,
    name: "Brian O'Conner",
    email: "brian@gogoathletic.com",
    role: "Support",
    status: "Active",
    joined: "MAY 15, 2023",
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

export default function GogoAthleticTeam({ onNavigate, onViewChange, user }) {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("gogo_staff");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("gogo_staff", JSON.stringify(INITIAL_TEAM));
    return INITIAL_TEAM;
  });

  const [customers, setCustomers] = useState(() => {
    return JSON.parse(localStorage.getItem("gogo_users") || "[]");
  });

  const [activeTab, setActiveTab] = useState("staff"); // "staff" or "customers"
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({ name: "", email: "", role: "Support", status: "Active" });

  // Sync customers dynamically when the component mounts or when localstorage changes
  React.useEffect(() => {
    const handleStorageChange = () => {
      setCustomers(JSON.parse(localStorage.getItem("gogo_users") || "[]"));
    };
    window.addEventListener("storage", handleStorageChange);
    // Poll to keep it instantly synchronized
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDelete = (id) => {
    const updated = team.filter((member) => member.id !== id);
    setTeam(updated);
    localStorage.setItem("gogo_staff", JSON.stringify(updated));
  };

  const handleDeleteCustomer = (email) => {
    const updated = customers.filter((c) => c.email !== email);
    setCustomers(updated);
    localStorage.setItem("gogo_users", JSON.stringify(updated));
  };

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) return;

    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();

    const updated = [
      ...team,
      {
        id: Date.now(),
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        status: newMember.status,
        joined: date,
      },
    ];
    setTeam(updated);
    localStorage.setItem("gogo_staff", JSON.stringify(updated));
    setNewMember({ name: "", email: "", role: "Support", status: "Active" });
    setIsModalOpen(false);
  };

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
      <Sidebar
        activeItem="team"
        onNavigate={onNavigate}
        onViewChange={onViewChange}
        actionButton={
          user && user.role === "manager" ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-orange-600 text-white text-[10px] font-black py-4 px-2 uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              Invite Member
            </button>
          ) : (
            <div className="text-[10px] text-center text-neutral-500 uppercase tracking-widest border border-white/5 py-4 px-2">
              Viewing Mode Only
            </div>
          )
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
              placeholder="Search team members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-neutral-900 border-none focus:ring-1 focus:ring-orange-300 text-neutral-100 text-sm pl-10 pr-4 py-2 w-56 sm:w-80 placeholder:text-neutral-600"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="text-neutral-300 hover:scale-110 transition-transform duration-300">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] leading-none tracking-widest">ADMINISTRATOR</p>
                <p className="text-[10px] text-orange-300 mt-1">Marcus Thorne</p>
              </div>
              <button className="text-orange-300 hover:scale-110 transition-transform duration-300">
                <UserCircle size={30} />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="p-6 md:p-12 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10 flex flex-col sm:flex-row justify-between sm:items-end gap-6">
            <div>
              <h2 className="text-4xl italic uppercase font-black tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                TEAM DIRECTORY
              </h2>
              <h3 className="text-2xl uppercase font-black -mt-1 text-orange-300">
                Roster & Operations
              </h3>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex border border-white/10 p-1 bg-neutral-900/50">
                <button
                  onClick={() => setActiveTab("staff")}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest font-black transition-all ${
                    activeTab === "staff"
                      ? "bg-orange-300 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Staff
                </button>
                <button
                  onClick={() => setActiveTab("customers")}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest font-black transition-all ${
                    activeTab === "customers"
                      ? "bg-orange-300 text-neutral-950"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Customers ({customers.length})
                </button>
              </div>
              {activeTab === "staff" && (
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-neutral-900 border border-white/10 text-neutral-300 text-xs px-4 py-2 focus:ring-1 focus:ring-orange-300 text-neutral-100"
                >
                  <option value="All" className="bg-neutral-950 text-neutral-100">All Roles</option>
                  <option value="Administrator" className="bg-neutral-950 text-neutral-100">Administrator</option>
                  <option value="Manager" className="bg-neutral-950 text-neutral-100">Manager</option>
                  <option value="Logistics" className="bg-neutral-950 text-neutral-100">Logistics</option>
                  <option value="Support" className="bg-neutral-950 text-neutral-100">Support</option>
                </select>
              )}
            </div>
          </div>

          {/* KPI Summary Grid */}
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
                  {customers.length}
                </h4>
              </div>
              <Shield size={32} className="text-neutral-600" />
            </GlassPanel>
            <GlassPanel className="p-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Awaiting Invite</p>
                <h4 className="text-3xl font-black italic text-indigo-300 mt-1">1</h4>
              </div>
              <Clock size={32} className="text-neutral-600" />
            </GlassPanel>
          </div>

          {/* Members Table */}
          <GlassPanel className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/5 text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                  <th className="py-5 px-6">Name</th>
                  <th className="py-5 px-6">Role</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6">Joined</th>
                  <th className="py-5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {activeTab === "staff" ? (
                  filteredTeam.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-neutral-900 border border-white/10 rounded-none flex items-center justify-center">
                            <UserCircle size={20} className="text-neutral-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-wide">{member.name}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                              <Mail size={12} />
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        {user && user.role === "manager" ? (
                          <select
                            value={member.role}
                            onChange={(e) => {
                              const updatedRole = e.target.value;
                              setTeam(
                                team.map((t) =>
                                  t.id === member.id ? { ...t, role: updatedRole } : t
                                )
                              );
                            }}
                            className={`text-[10px] px-2 py-1 font-bold uppercase tracking-wider bg-neutral-900 border border-white/10 rounded focus:ring-1 focus:ring-orange-300 ${ROLE_STYLES[member.role] || "text-neutral-300"}`}
                          >
                            <option value="Administrator" className="bg-neutral-950 text-neutral-100">Administrator</option>
                            <option value="Manager" className="bg-neutral-950 text-neutral-100">Manager</option>
                            <option value="Logistics" className="bg-neutral-950 text-neutral-100">Logistics</option>
                            <option value="Support" className="bg-neutral-950 text-neutral-100">Support</option>
                          </select>
                        ) : (
                          <span className={`text-[10px] px-3 py-1 font-bold uppercase tracking-wider ${ROLE_STYLES[member.role]}`}>
                            {member.role}
                          </span>
                        )}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider ${STATUS_STYLES[member.status]}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-xs text-neutral-400 font-mono">
                        {member.joined}
                      </td>
                      <td className="py-5 px-6 text-right">
                        {user && user.role === "manager" && (
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Member"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id || customer.email} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-neutral-900 border border-white/10 rounded-none flex items-center justify-center">
                            <UserCircle size={20} className="text-neutral-400" />
                          </div>
                          <div>
                            <p className="font-bold text-sm uppercase tracking-wide">{customer.name}</p>
                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                              <Mail size={12} />
                              {customer.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`text-[10px] px-3 py-1 font-bold uppercase tracking-wider ${ROLE_STYLES.Customer}`}>
                          Customer
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className={`text-[10px] px-2.5 py-0.5 font-bold uppercase tracking-wider ${STATUS_STYLES.Active}`}>
                          Active
                        </span>
                      </td>
                      <td className="py-5 px-6 text-xs text-neutral-400 font-mono">
                        {customer.joined || "N/A"}
                      </td>
                      <td className="py-5 px-6 text-right">
                        {user && user.role === "manager" && (
                          <button
                            onClick={() => handleDeleteCustomer(customer.email)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            title="Remove Customer"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
                {((activeTab === "staff" && filteredTeam.length === 0) || (activeTab === "customers" && filteredCustomers.length === 0)) && (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-neutral-500 text-sm">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </GlassPanel>
        </main>
      </div>

      {/* INVITE MEMBER MODAL */}
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
              Invite Team Member
            </h4>
            <form onSubmit={handleAddMember} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luke Hobbs"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-100 text-sm px-4 py-3 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. luke@gogoathletic.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 text-neutral-100 text-sm px-4 py-3 focus:ring-1 focus:ring-orange-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                    Role
                  </label>
                  <select
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 text-neutral-300 text-xs px-4 py-3 focus:ring-1 focus:ring-orange-300"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Manager">Manager</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-2 font-bold">
                    Status
                  </label>
                  <select
                    value={newMember.status}
                    onChange={(e) => setNewMember({ ...newMember, status: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 text-neutral-300 text-xs px-4 py-3 focus:ring-1 focus:ring-orange-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Away">Away</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-4 uppercase text-xs tracking-widest hover:bg-orange-700 transition-colors"
              >
                Send Invite
              </button>
            </form>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
