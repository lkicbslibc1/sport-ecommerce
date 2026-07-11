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
    Plus,
    Trash2,
    Package
} from "lucide-react";
import { ProductContext } from "../data/products.jsx";

const STATUS_STYLES = {
    Published: "bg-green-500/10 text-green-400 border border-green-500/20",
    Draft: "bg-neutral-700/50 text-neutral-400 border border-neutral-600",
};

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

const COLOR_CLASSES = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-400",
    black: "bg-black border border-white/20",
    white: "bg-white",
    purple: "bg-purple-500",
    green: "bg-green-500",
    orange: "bg-primary",
    pink: "bg-pink-400",
    beige: "bg-[#f5f5dc]",
    brown: "bg-[#8b4513]",
    grey: "bg-gray-500",
    mixed: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
};

const COLOR_NAMES = [
    "red", "blue", "yellow", "black", "white", "purple", 
    "green", "orange", "pink", "beige", "brown", "grey", "mixed"
];

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser }) {
    const { products, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [selectedStockStatus, setSelectedStockStatus] = useState("All Statuses");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newQty, setNewQty] = useState("");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock Received");
    const [selectedColors, setSelectedColors] = useState([]);

    const [formFields, setFormFields] = useState({
        name: "",
        sku: "",
        price: "",
        brand: "Nike",
        sportType: "Running",
        targetGroup: "men",
        amount: "100",
        image: "",
        description: "",
        status: "Published",
        productType: "clothes",
        clothesType: "shoes"
    });

    const handleOpenAdd = () => {
        setCurrentProduct(null);
        setFormFields({
            name: "",
            sku: "",
            price: "",
            brand: "Nike",
            sportType: "Running",
            targetGroup: "men",
            amount: "100",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY",
            description: "Elite high-performance gear built for athletes.",
            status: "Published",
            productType: "clothes",
            clothesType: "shoes"
        });
        setSelectedColors(["orange", "black"]);
        setModalOpen(true);
    };

    const handleOpenEdit = (product) => {
        setCurrentProduct(product);
        setFormFields({
            name: product.name || "",
            sku: product.sku || "",
            price: product.price ? product.price.toString() : "",
            brand: product.brand || "Nike",
            sportType: product.sportType || "Running",
            targetGroup: product.targetGroup || "men",
            amount: product.amount ? product.amount.toString() : "100",
            image: product.image || "",
            description: product.description || "",
            status: product.status || "Published",
            productType: product.productType || "clothes",
            clothesType: product.clothesType || ""
        });
        const initialColors = product.colorNames 
            ? product.colorNames.map(c => c.toLowerCase()) 
            : [];
        setSelectedColors(initialColors);
        setModalOpen(true);
    };

    const handleOpenAdjust = (item) => {
        setSelectedItem(item);
        setNewQty(item.amount.toString());
        setStockModalOpen(true);
    };

    const handleStockFormSubmit = (e) => {
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

        setStockModalOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleToggleColor = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter(c => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormFields(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!formFields.image) {
            alert("Please upload an image file or enter an image URL.");
            return;
        }
        const priceNum = parseFloat(formFields.price) || 0;
        const amountNum = parseInt(formFields.amount) || 0;

        let generatedSku = formFields.sku;
        if (!generatedSku) {
            let catCode = "EQ";
            if (formFields.productType === "clothes") {
                if (formFields.clothesType === "shoes") catCode = "FW";
                else if (formFields.clothesType === "top") catCode = "TP";
                else if (formFields.clothesType === "bottom") catCode = "BT";
                else if (formFields.clothesType === "sock") catCode = "SK";
                else if (formFields.clothesType === "hat") catCode = "HT";
            } else {
                if (formFields.sportType === "Running") catCode = "RN";
                else if (formFields.sportType === "Football") catCode = "FB";
                else if (formFields.sportType === "Swimming") catCode = "SW";
            }
            const currentYear = new Date().getFullYear();
            const seqStr = String(products.length + 1).padStart(3, '0');
            generatedSku = `GA-${catCode}-${currentYear}-${seqStr}`;
        }

        const productData = {
            name: formFields.name,
            sku: generatedSku,
            price: priceNum,
            brand: formFields.brand,
            sportType: formFields.sportType,
            targetGroup: formFields.targetGroup,
            amount: amountNum,
            image: formFields.image,
            description: formFields.description,
            status: formFields.status,
            productType: formFields.productType,
            clothesType: formFields.productType === "clothes" ? formFields.clothesType : "",
            colorNames: selectedColors.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            colors: selectedColors.map(c => COLOR_CLASSES[c] || "bg-white"),
            sizes: formFields.productType === "clothes" && formFields.clothesType !== "hat" 
                ? ["S", "M", "L", "XL"] 
                : ["M"]
        };

        if (currentProduct) {
            updateProduct({ ...currentProduct, ...productData });
        } else {
            addProduct({
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                ...productData
            });
        }

        setModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
            setModalOpen(false);
        }
    };

    // Filter logic - รวมการฟิลเตอร์สถานะสต็อก
    const filteredProducts = useMemo(() => {
        return products.filter((item) => {
            const matchSearch =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.brand.toLowerCase().includes(searchQuery.toLowerCase());
            
            const matchCategory =
                selectedCategory === "All Categories" ||
                item.sportType === selectedCategory ||
                item.brand === selectedCategory;

            const matchStatus =
                selectedStatus === "All Statuses" ||
                item.status === selectedStatus;

            const itemStockStatus = getStockStatus(item.amount);
            const matchStockStatus =
                selectedStockStatus === "All Statuses" ||
                itemStockStatus === selectedStockStatus;

            return matchSearch && matchCategory && matchStatus && matchStockStatus;
        });
    }, [products, searchQuery, selectedCategory, selectedStatus, selectedStockStatus]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProducts, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus, selectedStockStatus]);

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
            <Sidebar
                user={user}
                setUser={setUser}
                activeItem="products"
                onNavigate={onNavigate}
                onViewChange={onViewChange}
                actionButton={
                    user && user.role === "manager" ? (
                        <button
                            onClick={handleOpenAdd}
                            className="w-full bg-orange-600 text-white py-3 text-sm uppercase italic font-black hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            <Plus size={16} />
                            New Product
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
                    <div className="w-full max-w-md">
                        <div className={"relative transition-all duration-200 " + (searchFocused ? "scale-105" : "")}>
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="text"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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
                                <p className="text-xs block leading-none">{user?.name || user?.username || 'ADMIN_042'}</p>
                                <p className="text-[10px] text-orange-300 uppercase font-bold tracking-widest mt-1">
                                    {user?.role || 'Operational Manager'}
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
                                <p className="text-3xl italic font-black">{products.length}</p>
                            </GlassPanel>
                            <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-green-400">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Published</p>
                                <p className="text-3xl italic font-black text-green-400">{products.filter(p => p.status === 'Published').length}</p>
                            </GlassPanel>
                            <GlassPanel className="px-6 py-4 flex flex-col items-end border-r-4 border-red-400">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Low Stock</p>
                                <p className="text-3xl italic font-black text-red-400">{products.filter(p => p.amount <= 10).length}</p>
                            </GlassPanel>
                        </div>
                    </div>

                    {/* Filters - เพิ่มฟิลเตอร์สถานะสต็อก */}
                    <GlassPanel className="p-6 mb-8 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Sport Type / Category</span>
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold bg-neutral-900 text-neutral-100"
                                >
                                    <option value="All Categories" className="bg-neutral-950 text-neutral-100">All Categories</option>
                                    <option value="Running" className="bg-neutral-950 text-neutral-100">Running</option>
                                    <option value="Football" className="bg-neutral-950 text-neutral-100">Football</option>
                                    <option value="Swimming" className="bg-neutral-950 text-neutral-100">Swimming</option>
                                    <option value="Nike" className="bg-neutral-950 text-neutral-100">Nike</option>
                                    <option value="Adidas" className="bg-neutral-950 text-neutral-100">Adidas</option>
                                    <option value="Puma" className="bg-neutral-950 text-neutral-100">Puma</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Status</span>
                                <select 
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold bg-neutral-900 text-neutral-100"
                                >
                                    <option value="All Statuses" className="bg-neutral-950 text-neutral-100">All Statuses</option>
                                    <option value="Published" className="bg-neutral-950 text-neutral-100">Published</option>
                                    <option value="Draft" className="bg-neutral-950 text-neutral-100">Draft</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Stock Status</span>
                                <select 
                                    value={selectedStockStatus}
                                    onChange={(e) => setSelectedStockStatus(e.target.value)}
                                    className="bg-transparent border-0 border-b border-orange-300/30 text-xs uppercase py-1 focus:ring-0 focus:border-orange-300 pr-8 tracking-widest font-bold bg-neutral-900 text-neutral-100"
                                >
                                    <option value="All Statuses" className="bg-neutral-950 text-neutral-100">All Statuses</option>
                                    <option value="In Stock" className="bg-neutral-950 text-neutral-100">In Stock</option>
                                    <option value="Low Stock" className="bg-neutral-950 text-neutral-100">Low Stock</option>
                                    <option value="Out of Stock" className="bg-neutral-950 text-neutral-100">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {user && user.role === "manager" ? (
                                <button
                                    onClick={handleOpenAdd}
                                    className="bg-orange-600 text-white px-6 py-2 uppercase text-xs font-black italic tracking-widest hover:scale-105 transition-transform flex items-center gap-2"
                                >
                                    <Plus size={14} />
                                    Add Product
                                </button>
                            ) : (
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
                                    Viewing Mode Only
                                </div>
                            )}
                        </div>
                    </GlassPanel>

                    {/* Products Table - แสดงสถานะสต็อก */}
                    <GlassPanel className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[1000px]">
                                <thead className="bg-white/5 uppercase text-xs tracking-widest">
                                    <tr>
                                        {["Product Name", "SKU", "Sport / Category", "Brand", "Price", "Stock Level", "Status"].map((h) => (
                                            <th key={h} className="px-6 py-5 font-bold">{h}</th>
                                        ))}
                                        <th className="px-6 py-5 font-bold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedProducts.map((item) => {
                                        const stockStatusText = getStockStatus(item.amount);
                                        const s = STOCK_STYLES[stockStatusText];
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
                                                            <Package size={20} className="text-neutral-600 group-hover:text-orange-300 transition-colors" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="italic font-black uppercase group-hover:text-orange-300 transition-colors">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-[9px] text-neutral-500 tracking-wider">
                                                            {item.targetGroup} / {item.productType}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-neutral-400 font-mono text-sm">{item.sku}</td>
                                                <td className="px-6 py-6 uppercase text-xs font-bold">{item.sportType}</td>
                                                <td className="px-6 py-6 uppercase text-xs font-bold text-neutral-400">{item.brand}</td>
                                                <td className="px-6 py-6 italic font-bold text-orange-300">{formatPrice(item.price)}</td>
                                                <td className="px-6 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <span className={"w-2 h-2 rounded-full " + s.dot + " " + s.pulse} />
                                                        <span className={"px-3 py-1 text-[10px] font-black uppercase tracking-widest " + s.badge}>
                                                            {stockStatusText} ({item.amount})
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <span className={"px-3 py-1 text-[10px] font-black uppercase tracking-widest " + STATUS_STYLES[item.status || "Published"]}>
                                                        {item.status || "Published"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenEdit(item)}
                                                            className="bg-white/5 border border-white/10 hover:border-orange-300 p-2 transition-all hover:bg-orange-300 hover:text-neutral-950"
                                                            title="Edit Product"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleOpenAdjust(item)}
                                                            className="bg-white/5 border border-white/10 hover:border-orange-300 p-2 transition-all hover:bg-orange-300 hover:text-neutral-950"
                                                            title="Adjust Stock"
                                                        >
                                                            <Package size={16} />
                                                        </button>
                                                        {user && user.role === "manager" && (
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-white/5 border border-white/10 hover:border-red-500 p-2 transition-all hover:bg-red-500 hover:text-neutral-950 text-red-400"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
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
                                {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {products.length} Products
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

            {/* ADD / EDIT PRODUCT MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-neutral-900 border border-orange-300/20 relative flex flex-col max-h-[90vh] my-auto">
                        <div className="p-8 sm:px-12 sm:pt-10 pb-4 border-b border-white/5 flex justify-between items-center shrink-0">
                            <h3 className="text-2xl sm:text-3xl uppercase italic font-black border-b-4 border-orange-300 inline-block pb-2">
                                {currentProduct ? "Edit Product" : "Add Product"}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-neutral-400 hover:text-orange-300 transition-colors"
                            >
                                <X size={32} />
                            </button>
                        </div>
                        <form className="flex-grow flex flex-col min-h-0" onSubmit={handleFormSubmit}>
                            <div className="flex-grow overflow-y-auto p-8 sm:px-12 space-y-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Product Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formFields.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="ENTER PRODUCT NAME" 
                                        className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm placeholder:text-neutral-600 w-full outline-none" 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Product Type</label>
                                        <select 
                                            name="productType"
                                            value={formFields.productType}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                                        >
                                            <option value="clothes" className="bg-neutral-950 text-neutral-100">Clothes</option>
                                            <option value="equipment" className="bg-neutral-950 text-neutral-100">Equipment</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Clothes Type</label>
                                        <select 
                                            name="clothesType"
                                            value={formFields.clothesType}
                                            onChange={handleInputChange}
                                            disabled={formFields.productType !== "clothes"}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100 disabled:opacity-30"
                                        >
                                            <option value="shoes" className="bg-neutral-950 text-neutral-100">Shoes</option>
                                            <option value="top" className="bg-neutral-950 text-neutral-100">Top</option>
                                            <option value="bottom" className="bg-neutral-950 text-neutral-100">Bottom</option>
                                            <option value="sock" className="bg-neutral-950 text-neutral-100">Sock</option>
                                            <option value="hat" className="bg-neutral-950 text-neutral-100">Hat</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">SKU</label>
                                        <input 
                                            type="text" 
                                            name="sku"
                                            value={formFields.sku}
                                            onChange={handleInputChange}
                                            placeholder="GA-XX-0000 (AUTO IF BLANK)" 
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 text-sm placeholder:text-neutral-600 w-full outline-none" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Price (฿)</label>
                                        <input 
                                            type="number" 
                                            name="price"
                                            value={formFields.price}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="0" 
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 italic font-black text-orange-300 w-full outline-none" 
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Brand</label>
                                        <select 
                                            name="brand"
                                            value={formFields.brand}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                                        >
                                            <option value="Nike" className="bg-neutral-950 text-neutral-100">Nike</option>
                                            <option value="Adidas" className="bg-neutral-950 text-neutral-100">Adidas</option>
                                            <option value="Puma" className="bg-neutral-950 text-neutral-100">Puma</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Sport Type</label>
                                        <select 
                                            name="sportType"
                                            value={formFields.sportType}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                                        >
                                            <option value="Running" className="bg-neutral-950 text-neutral-100">Running</option>
                                            <option value="Football" className="bg-neutral-950 text-neutral-100">Football</option>
                                            <option value="Swimming" className="bg-neutral-950 text-neutral-100">Swimming</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Target Group</label>
                                        <select 
                                            name="targetGroup"
                                            value={formFields.targetGroup}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                                        >
                                            <option value="men" className="bg-neutral-950 text-neutral-100">Men</option>
                                            <option value="women" className="bg-neutral-950 text-neutral-100">Women</option>
                                            <option value="kid" className="bg-neutral-950 text-neutral-100">Kids</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Stock Amount</label>
                                        <input 
                                            type="number" 
                                            name="amount"
                                            value={formFields.amount}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="100" 
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 text-sm w-full outline-none" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Status</label>
                                        <select 
                                            name="status"
                                            value={formFields.status}
                                            onChange={handleInputChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm w-full bg-neutral-900 text-neutral-100"
                                        >
                                            <option value="Published" className="bg-neutral-950 text-neutral-100">Published</option>
                                            <option value="Draft" className="bg-neutral-950 text-neutral-100">Draft</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Available Colors (Select multiple)</label>
                                    <div className="flex flex-wrap gap-3 bg-white/5 p-6 border border-white/5">
                                        {COLOR_NAMES.map(color => {
                                            const isSelected = selectedColors.includes(color);
                                            const bgClass = COLOR_CLASSES[color];
                                            return (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    onClick={() => handleToggleColor(color)}
                                                    className={`px-3 py-1.5 flex items-center gap-2 text-xs uppercase font-black transition-all border ${
                                                        isSelected 
                                                            ? "border-orange-300 text-orange-300 bg-white/5" 
                                                            : "border-white/10 text-neutral-400 hover:border-white/30"
                                                    }`}
                                                >
                                                    <span className={`w-3.5 h-3.5 rounded-full ${bgClass}`} />
                                                    {color}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Upload Image File</label>
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-3.5 px-6 text-xs w-full outline-none file:mr-4 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-black file:bg-orange-300 file:text-neutral-950 hover:file:bg-orange-400 cursor-pointer" 
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Or Image URL</label>
                                        <input 
                                            type="text" 
                                            name="image"
                                            value={formFields.image}
                                            onChange={handleInputChange}
                                            placeholder="HTTPS://..." 
                                            className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 text-sm w-full outline-none" 
                                        />
                                    </div>
                                </div>
                                {formFields.image && (
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 p-4">
                                        <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Image Preview:</span>
                                        <div className="w-16 h-16 bg-neutral-950 border border-white/10 overflow-hidden flex items-center justify-center">
                                            <img src={formFields.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => setFormFields(prev => ({ ...prev, image: "" }))}
                                            className="text-red-400 text-[10px] uppercase tracking-widest font-black underline ml-auto"
                                        >
                                            Clear Image
                                        </button>
                                    </div>
                                )}
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Description / Series</label>
                                    <textarea 
                                        name="description"
                                        value={formFields.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        placeholder="ENTER BRIEF DESCRIPTION" 
                                        className="bg-white/5 border border-white/10 focus:border-orange-300 focus:ring-0 py-4 px-6 uppercase text-sm placeholder:text-neutral-600 w-full outline-none resize-none"
                                    />
                                </div>
                            </div>
                            <div className="p-8 sm:px-12 sm:pb-10 pt-4 border-t border-white/5 flex gap-4 shrink-0 bg-neutral-900">
                                <button type="submit" className="flex-1 bg-orange-300 text-neutral-950 py-4 uppercase italic font-black hover:scale-105 transition-transform">
                                    Save Product
                                </button>
                                <button type="button" onClick={() => setModalOpen(false)} className="px-8 border border-white/10 hover:bg-white hover:text-black transition-colors uppercase text-xs font-bold tracking-widest">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* QUICK STOCK UPDATE MODAL - จาก Inventory */}
            {stockModalOpen && selectedItem && (
                <div className="fixed inset-0 bg-neutral-950/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6">
                    <div className="w-full max-w-2xl bg-neutral-900 border border-orange-300/20 relative">
                        <button
                            onClick={() => setStockModalOpen(false)}
                            className="absolute top-6 right-6 text-neutral-400 hover:text-orange-300 transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <div className="p-8 sm:p-12">
                            <h3 className="text-2xl sm:text-3xl uppercase italic font-black mb-8 border-b-4 border-orange-300 inline-block pb-2">
                                Quick Stock Update
                            </h3>
                            <form className="space-y-8" onSubmit={handleStockFormSubmit}>
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
                                        onClick={() => setStockModalOpen(false)}
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