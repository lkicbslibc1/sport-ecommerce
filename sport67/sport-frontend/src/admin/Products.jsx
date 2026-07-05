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
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
} from "lucide-react";



const PRODUCTS = [
    {
        name: "Apex Carbon Runner v2",
        sku: "GA-FW-2024-001",
        category: "Footwear",
        price: "$285.00",
        stock: 450,
        status: "Published",
    },
    {
        name: "Titan Compression Base",
        sku: "GA-CP-2024-089",
        category: "Compression",
        price: "$75.00",
        stock: 12,
        status: "Published",
    },
    {
        name: "Onyx Biometric Tracker",
        sku: "GA-WR-2024-012",
        category: "Wearables",
        price: "$499.00",
        stock: 0,
        status: "Draft",
    },
    {
        name: "Precision Dumbbell Set",
        sku: "GA-EQ-2024-115",
        category: "Equipment",
        price: "$1,150.00",
        stock: 84,
        status: "Published",
    },
];

const STATUS_STYLES = {
    Published: "bg-green-500/10 text-green-400 border border-green-500/20",
    Draft: "bg-neutral-700/50 text-neutral-400 border border-neutral-600",
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

export default function GogoAthleticProducts({ onNavigate, onViewChange }) {
    const [searchFocused, setSearchFocused] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
            <Sidebar
                activeItem="products"
                onNavigate={onNavigate}
                onViewChange={onViewChange}
                actionButton={
                    <button
                        onClick={() => setModalOpen(true)}
                        className="w-full bg-orange-600 text-white py-3 text-sm uppercase italic font-black hover:scale-105 transition-transform flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        New Product
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
                                placeholder="SEARCH PRODUCTS..."
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
                    {/* Header */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h2 className="text-4xl sm:text-5xl uppercase italic font-black mb-2 leading-none">
                                Products
                            </h2>
                            <p className="text-orange-300 tracking-[0.5em] text-[10px] uppercase font-black">
                                Product Catalog Management
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-orange-300">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Total Products</p>
                                <p className="text-3xl italic font-black">4</p>
                            </GlassPanel>
                            <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-green-400">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Published</p>
                                <p className="text-3xl italic font-black text-green-400">3</p>
                            </GlassPanel>
                        </div>
                    </div>

                    {/* Filters */}
                    <GlassPanel className="p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Category</span>
                                <select className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold">
                                    <option>All Categories</option>
                                    <option>Footwear</option>
                                    <option>Compression</option>
                                    <option>Equipment</option>
                                    <option>Wearables</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Status</span>
                                <select className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold">
                                    <option>All Statuses</option>
                                    <option>Published</option>
                                    <option>Draft</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="border border-white/10 px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-neutral-100 hover:text-neutral-950 transition-colors">
                                Export CSV
                            </button>
                            <button
                                onClick={() => setModalOpen(true)}
                                className="bg-orange-600 text-white px-6 py-2 uppercase text-xs font-black italic tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Plus size={14} />
                                Add Product
                            </button>
                        </div>
                    </GlassPanel>

                    {/* Products Table */}
                    <GlassPanel className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="bg-white/5 uppercase text-xs tracking-widest">
                                    <tr>
                                        {["Product Name", "SKU", "Category", "Price", "Stock", "Status"].map((h) => (
                                            <th key={h} className="px-6 py-5 font-bold">{h}</th>
                                        ))}
                                        <th className="px-6 py-5 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {PRODUCTS.map((item) => (
                                        <tr
                                            key={item.sku}
                                            className="group hover:bg-white/[0.02] hover:border-l-4 hover:border-orange-500 transition-colors"
                                        >
                                            <td className="px-6 py-6 flex items-center gap-4">
                                                <div className="w-12 h-12 bg-neutral-900 border border-white/10 shrink-0 flex items-center justify-center">
                                                    <Boxes size={20} className="text-neutral-600 group-hover:text-orange-300 transition-colors" />
                                                </div>
                                                <span className="italic font-black uppercase group-hover:text-orange-300 transition-colors">
                                                    {item.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6 text-neutral-400 font-mono text-sm">{item.sku}</td>
                                            <td className="px-6 py-6 uppercase text-xs font-bold">{item.category}</td>
                                            <td className="px-6 py-6 italic font-bold text-orange-300">{item.price}</td>
                                            <td className="px-6 py-6 font-bold">{item.stock}</td>
                                            <td className="px-6 py-6">
                                                <span className={"px-3 py-1 text-[10px] font-black uppercase tracking-widest " + STATUS_STYLES[item.status]}>
                                                    {item.status}
                                                </span>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-6 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/5">
                            <p className="text-neutral-400 text-[10px] uppercase tracking-widest">
                                Showing 1-4 of 4 Products
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-white/10 hover:bg-white/10 transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <button className="px-4 py-2 bg-orange-300 text-neutral-950 font-black italic text-xs">1</button>
                                <button className="p-2 border border-white/10 hover:bg-white/10 transition-colors">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </GlassPanel>
                </main>
            </div>

            {/* ADD PRODUCT MODAL */}
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
                                Add / Edit Product
                            </h3>
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Product Name</label>
                                    <input type="text" placeholder="ENTER PRODUCT NAME" className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm placeholder:text-neutral-600" />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">SKU</label>
                                        <input type="text" placeholder="GA-XX-0000" className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 text-sm placeholder:text-neutral-600" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Price</label>
                                        <input type="text" placeholder="$0.00" className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 italic font-black text-orange-300" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Category</label>
                                    <select className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm">
                                        <option>Footwear</option>
                                        <option>Compression</option>
                                        <option>Equipment</option>
                                        <option>Wearables</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-4">
                                    <button type="submit" className="flex-1 bg-orange-300 text-neutral-950 py-4 uppercase italic font-black hover:scale-105 transition-transform">
                                        Save Product
                                    </button>
                                    <button type="button" onClick={() => setModalOpen(false)} className="px-8 border border-white/10 hover:bg-neutral-100 hover:text-neutral-950 transition-colors uppercase text-xs font-bold tracking-widest">
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
