import React, { useState, useMemo, useContext } from "react";
import Sidebar from "./Sidebar.jsx";
import {
    Search,
    Bell,
    UserCircle,
    Pencil,
    ChevronLeft,
    ChevronRight,
    X,
    Plus,
    Trash2,
    Package,
    ArrowUpDown,
    ChevronUp,
    ChevronDown,
    Upload,
    ImageIcon
} from "lucide-react";
import { ProductContext, getSizeOptions, getTotalStock } from "../data/products.jsx";
import { useAlert } from "../contexts/AlertContext.jsx";
import { useNotifications } from "../contexts/NotificationContext.jsx";
import NotificationPanel from "./NotificationPanel.jsx";
import { notifyProductChange } from "../data/notificationService.js";

const STATUS_STYLES = {
    Published: "bg-green-500/10 text-green-400 border border-green-500/20",
    Draft: "bg-neutral-700/50 text-neutral-400 border border-neutral-600",
};

const STOCK_STYLES = {
    "In Stock": {
        dot: "bg-green-500",
        pulse: "animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]",
        badge: "text-green-400 bg-green-500/10 border border-green-500/20",
    },
    "Low Stock": {
        dot: "bg-red-500",
        pulse: "animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]",
        badge: "text-red-400 bg-red-500/10 border border-red-500/20",
    },
    "Out of Stock": {
        dot: "bg-neutral-500",
        pulse: "",
        badge: "text-neutral-400 bg-neutral-500/10 border border-neutral-500/20",
    },
};

const HighlightText = ({ text, query }) => {
    if (!query) return <>{text}</>;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = String(text).split(regex);
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <span key={i} className="text-orange-500 bg-orange-500/20 px-1 rounded">{part}</span>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
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

// Default empty color variant
const makeEmptyVariant = (color = "") => ({
    color,
    colorClass: COLOR_CLASSES[color] || "bg-white",
    image: "",
    amount: 0,       // used when no sizes (equipment)
    stock: {}        // { "S": 10, "M": 5, ... } or { "38": 3, ... }
});

export default function GogoAthleticProducts({ onNavigate, onViewChange, user, setUser, highlightId }) {
    const { showAlert } = useAlert();
    const { unreadCount, setPanelOpen } = useNotifications();
    const { products, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [selectedStatus, setSelectedStatus] = useState("All Statuses");
    const [selectedStockStatus, setSelectedStockStatus] = useState("All Statuses");
    const [sortField, setSortField] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [stockModalOpen, setStockModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustQtyColor, setAdjustQtyColor] = useState("");
    const [adjustQtySize, setAdjustQtySize] = useState("");
    const [newQty, setNewQty] = useState("");
    const [adjustmentReason, setAdjustmentReason] = useState("Restock Received");

    // Color variants: array of { color, colorClass, image, amount, stock: {size: qty} }
    const [colorVariants, setColorVariants] = useState([makeEmptyVariant()]);

    const [formFields, setFormFields] = useState({
        name: "",
        sku: "",
        price: "",
        brand: "Nike",
        sportType: "Running",
        targetGroup: "men",
        description: "",
        status: "Published",
        productType: "clothes",
        clothesType: "shoes"
    });

    // Compute sizes for current form selection
    const currentSizes = useMemo(() => getSizeOptions(formFields.productType, formFields.clothesType), [formFields.productType, formFields.clothesType]);

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
        setColorVariants([makeEmptyVariant("orange")]);
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
            description: product.description || "",
            status: product.status || "Published",
            productType: product.productType || "clothes",
            clothesType: product.clothesType || "shoes"
        });
        // Restore colorVariants from product data
        if (product.colorVariants && product.colorVariants.length > 0) {
            setColorVariants(product.colorVariants.map(v => ({ ...v, stock: v.stock || {}, amount: v.amount || 0 })));
        } else {
            // Fallback: build from old colorNames
            const oldColors = product.colorNames ? product.colorNames.map(c => c.toLowerCase()) : ["black"];
            const sizes = getSizeOptions(product.productType, product.clothesType);
            setColorVariants(oldColors.map(color => {
                const variant = makeEmptyVariant(color);
                variant.image = product.colorImages?.[color] || product.image || "";
                if (sizes.length > 0) {
                    variant.stock = Object.fromEntries(sizes.map(s => [s, Math.floor((product.amount || 0) / (oldColors.length * sizes.length))])); 
                } else {
                    variant.amount = Math.floor((product.amount || 0) / oldColors.length);
                }
                return variant;
            }));
        }
        setModalOpen(true);
    };

    const handleOpenAdjust = (item) => {
        setSelectedItem(item);
        const firstVariant = item.colorVariants?.[0];
        const initColor = firstVariant?.color || item.colorNames?.[0]?.toLowerCase() || "";
        setAdjustQtyColor(initColor);
        const sizes = getSizeOptions(item.productType, item.clothesType);
        setAdjustQtySize(sizes[0] || "");
        const initStock = firstVariant?.stock?.[sizes[0]] ?? firstVariant?.amount ?? item.amount;
        setNewQty(String(initStock));
        setStockModalOpen(true);
    };

    // ---- Variant helpers ----
    const handleVariantColorChange = (idx, color) => {
        setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, color, colorClass: COLOR_CLASSES[color] || "bg-white" } : v));
    };

    const handleVariantImageFile = (idx, e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result;
            // Show local preview immediately
            setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, image: base64Data } : v));
            try {
                const res = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ image: base64Data })
                });
                const data = await res.json();
                if (data.success) {
                    // Update variant image with server URL
                    setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, image: data.url } : v));
                } else {
                    showAlert(data.message || 'Image upload failed', 'error');
                }
            } catch (err) {
                console.error("Upload error:", err);
                showAlert('Failed to upload image', 'error');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleVariantImageUrl = (idx, url) => {
        setColorVariants(prev => prev.map((v, i) => i === idx ? { ...v, image: url } : v));
    };

    const handleVariantStockChange = (idx, size, value) => {
        setColorVariants(prev => prev.map((v, i) => {
            if (i !== idx) return v;
            if (size === "__amount") return { ...v, amount: parseInt(value) || 0 };
            return { ...v, stock: { ...v.stock, [size]: parseInt(value) || 0 } };
        }));
    };

    const handleAddVariant = () => {
        const usedColors = colorVariants.map(v => v.color);
        const nextColor = COLOR_NAMES.find(c => !usedColors.includes(c)) || "";
        setColorVariants(prev => [...prev, makeEmptyVariant(nextColor)]);
    };

    const handleRemoveVariant = (idx) => {
        if (colorVariants.length <= 1) { showAlert("At least one color variant is required.", "warning"); return; }
        setColorVariants(prev => prev.filter((_, i) => i !== idx));
    };

    const handleStockFormSubmit = (e) => {
        e.preventDefault();
        if (!selectedItem) return;
        const qtyNum = parseInt(newQty);
        if (isNaN(qtyNum) || qtyNum < 0) {
            showAlert("Please enter a valid stock quantity.", "warning");
            return;
        }
        const sizes = getSizeOptions(selectedItem.productType, selectedItem.clothesType);
        let updatedVariants = (selectedItem.colorVariants || []).map(v => ({ ...v, stock: { ...v.stock } }));
        const variantIdx = updatedVariants.findIndex(v => v.color === adjustQtyColor);
        if (variantIdx === -1) {
            showAlert("Color variant not found.", "warning");
            return;
        }
        if (sizes.length === 0) {
            updatedVariants[variantIdx].amount = qtyNum;
        } else {
            updatedVariants[variantIdx].stock[adjustQtySize] = qtyNum;
        }
        // Recalculate total amount
        let total = 0;
        updatedVariants.forEach(v => {
            if (sizes.length === 0) { total += v.amount || 0; }
            else { Object.values(v.stock || {}).forEach(q => { total += parseInt(q) || 0; }); }
        });
        updateProduct({ id: selectedItem.id, colorVariants: updatedVariants, amount: total });
        
        // Notify with detailed stock changes
        const oldQty = sizes.length === 0 ? (selectedItem.colorVariants[variantIdx].amount || 0) : (selectedItem.colorVariants[variantIdx].stock[adjustQtySize] || 0);
        const diffText = sizes.length === 0 
          ? `ปรับสต็อกสี ${adjustQtyColor} จาก ${oldQty} เป็น ${qtyNum}`
          : `ปรับสต็อกสี ${adjustQtyColor} ไซส์ ${adjustQtySize} จาก ${oldQty} เป็น ${qtyNum}`;
        notifyProductChange('updated', selectedItem.name, diffText);

        setStockModalOpen(false);
        showAlert("Stock updated successfully.", "success");
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Validate: every variant must have an image
        const missingImage = colorVariants.some(v => !v.image);
        if (missingImage) {
            showAlert("Please upload or enter an image for every color variant.", "warning");
            return;
        }
        if (colorVariants.length === 0) {
            showAlert("Please add at least one color variant.", "warning");
            return;
        }

        // Validate duplicate name
        const isDuplicateName = products.some(p => p.name.toLowerCase().trim() === formFields.name.toLowerCase().trim() && p.id !== currentProduct?.id);
        if (isDuplicateName) {
            showAlert("A product with this name already exists.", "error");
            return;
        }

        const priceNum = parseFloat(formFields.price) || 0;
        const sizes = getSizeOptions(formFields.productType, formFields.clothesType);

        // Compute total amount from variants
        let totalAmount = 0;
        colorVariants.forEach(v => {
            if (sizes.length === 0) { totalAmount += v.amount || 0; }
            else { Object.values(v.stock || {}).forEach(q => { totalAmount += parseInt(q) || 0; }); }
        });

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

        // Validate duplicate SKU
        const isDuplicateSku = products.some(p => p.sku.toLowerCase().trim() === generatedSku.toLowerCase().trim() && p.id !== currentProduct?.id);
        if (isDuplicateSku) {
            showAlert("A product with this SKU already exists.", "error");
            return;
        }

        const productData = {
            name: formFields.name,
            sku: generatedSku,
            price: priceNum,
            brand: formFields.brand,
            sportType: formFields.sportType,
            targetGroup: formFields.targetGroup,
            amount: totalAmount,
            // Legacy fields for backward-compat with old shopping pages
            image: colorVariants[0]?.image || "",
            colorNames: colorVariants.map(v => v.color.charAt(0).toUpperCase() + v.color.slice(1)),
            colors: colorVariants.map(v => v.colorClass || COLOR_CLASSES[v.color] || "bg-white"),
            colorImages: Object.fromEntries(colorVariants.map(v => [v.color, v.image])),
            sizes: sizes.length > 0 ? sizes : ["One Size"],
            description: formFields.description,
            status: formFields.status,
            productType: formFields.productType,
            clothesType: formFields.productType === "clothes" ? formFields.clothesType : "",
            // New variant model
            colorVariants: colorVariants.map(v => ({
                color: v.color,
                colorClass: v.colorClass || COLOR_CLASSES[v.color] || "bg-white",
                image: v.image,
                amount: v.amount || 0,
                stock: v.stock || {}
            }))
        };

        if (currentProduct) {
            let changes = [];
            if (currentProduct.name !== productData.name) changes.push(`ชื่อ: ${currentProduct.name} -> ${productData.name}`);
            if (currentProduct.price !== productData.price) changes.push(`ราคา: ${currentProduct.price} -> ${productData.price}`);
            if (currentProduct.status !== productData.status) changes.push(`สถานะ: ${currentProduct.status} -> ${productData.status}`);
            if (currentProduct.brand !== productData.brand) changes.push(`แบรนด์: ${currentProduct.brand} -> ${productData.brand}`);
            
            // Basic check for color additions/removals
            const oldColors = currentProduct.colorVariants.map(v => v.color).join(', ');
            const newColors = productData.colorVariants.map(v => v.color).join(', ');
            if (oldColors !== newColors) changes.push(`สี: ${oldColors || 'ไม่มี'} -> ${newColors || 'ไม่มี'}`);
            
            if (currentProduct.amount !== productData.amount) {
                changes.push(`จำนวนรวม: ${currentProduct.amount || 0} -> ${productData.amount}`);
            }
            
            productData.colorVariants.forEach(newV => {
                const oldV = currentProduct.colorVariants.find(v => v.color === newV.color);
                if (oldV) {
                    if (sizes.length === 0) {
                        if (oldV.amount !== newV.amount) changes.push(`สต็อกสี ${newV.color}: ${oldV.amount || 0} -> ${newV.amount}`);
                    } else {
                        Object.keys(newV.stock || {}).forEach(sz => {
                            if (oldV.stock[sz] !== newV.stock[sz]) {
                                changes.push(`สี ${newV.color} ไซส์ ${sz}: ${oldV.stock[sz] || 0} -> ${newV.stock[sz]}`);
                            }
                        });
                    }
                }
            });
            
            const detailsText = changes.length > 0 ? changes.join(' | ') : 'แก้ไขข้อมูลทั่วไป';
            
            updateProduct({ ...currentProduct, ...productData });
            notifyProductChange('updated', formFields.name, detailsText);
        } else {
            addProduct({
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                ...productData
            });
            notifyProductChange('added', formFields.name, "เพิ่มสินค้าใหม่เข้าสู่ระบบ");
        }
        showAlert(currentProduct ? "Product updated!" : "Product added!", "success");
        setModalOpen(false);
    };

    const handleDelete = (id) => {
        const productToDelete = products.find(p => p.id === id);
        if (window.confirm("Are you sure you want to delete this product?")) {
            deleteProduct(id);
            setModalOpen(false);
            if (productToDelete) notifyProductChange('deleted', productToDelete.name, "ลบสินค้าออกจากระบบ");
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

    const handleSort = (key) => {
        if (!key) return;
        if (sortField === `${key}-asc`) {
            setSortField(`${key}-desc`);
        } else {
            setSortField(`${key}-asc`);
        }
    };

    const sortedProducts = useMemo(() => {
        let result = [...filteredProducts];
        if (sortField === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortField === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortField === "name-asc") {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortField === "name-desc") {
            result.sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortField === "stock-asc") {
            result.sort((a, b) => a.amount - b.amount);
        } else if (sortField === "stock-desc") {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortField === "sport-asc") {
            result.sort((a, b) => (a.sportType || "").localeCompare(b.sportType || ""));
        } else if (sortField === "sport-desc") {
            result.sort((a, b) => (b.sportType || "").localeCompare(a.sportType || ""));
        } else if (sortField === "brand-asc") {
            result.sort((a, b) => (a.brand || "").localeCompare(b.brand || ""));
        } else if (sortField === "brand-desc") {
            result.sort((a, b) => (b.brand || "").localeCompare(a.brand || ""));
        }
        return result;
    }, [filteredProducts, sortField]);

    // Pagination logic
    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedProducts, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, selectedStatus, selectedStockStatus, sortField]);

    React.useEffect(() => {
        if (highlightId && filteredProducts.length > 0) {
            const index = sortedProducts.findIndex(p => p.id === parseInt(highlightId));
            if (index !== -1) {
                const page = Math.floor(index / itemsPerPage) + 1;
                setCurrentPage(page);
                setTimeout(() => {
                    const el = document.getElementById(`product-row-${highlightId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 300);
            }
        }
    }, [highlightId, sortedProducts, itemsPerPage]);

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-100 flex">
            <NotificationPanel onNavigate={onNavigate} />
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
                    <div></div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setPanelOpen(true)}
                            className="text-neutral-300 hover:scale-110 transition-transform relative"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
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

                    {/* Filters */}
                    <GlassPanel className="p-6 mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6">
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

                        <div className="flex flex-col sm:flex-row sm:items-end gap-6 w-full xl:w-auto mt-4 xl:mt-0">
                            <div className="flex flex-col gap-1 w-full sm:w-80">
                                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Search Products</span>
                                <div className={"relative transition-all duration-200 " + (searchFocused ? "scale-105" : "")}>
                                    <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-orange-400" />
                                    <input
                                        type="text"
                                        onFocus={() => setSearchFocused(true)}
                                        onBlur={() => setSearchFocused(false)}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Name, SKU, Brand..."
                                        className={
                                            "bg-transparent border-0 border-b pl-8 py-2 focus:ring-0 text-sm tracking-widest font-bold placeholder:text-neutral-600 transition-colors w-full text-neutral-100 uppercase " +
                                            (searchFocused ? "border-orange-400" : "border-orange-400/50")
                                        }
                                    />
                                </div>
                            </div>
                            
                            {user && user.role === "manager" ? (
                                <button
                                    onClick={handleOpenAdd}
                                    className="bg-orange-600 text-white px-6 py-2 uppercase text-sm font-black italic tracking-widest hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap h-10"
                                >
                                    <Plus size={16} />
                                    Add Product
                                </button>
                            ) : (
                                <div className="text-[10px] text-neutral-500 uppercase tracking-widest whitespace-nowrap h-10 flex items-center">
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
                                        {[
                                            { label: "Product Name", key: "name" },
                                            { label: "SKU", key: null },
                                            { label: "Sport / Category", key: "sport" },
                                            { label: "Brand", key: "brand" },
                                            { label: "Price", key: "price" },
                                            { label: "Stock Level", key: "stock" },
                                            { label: "Status", key: null }
                                        ].map((h) => (
                                            <th 
                                                key={h.label} 
                                                className={`px-6 py-5 font-bold ${h.key ? "cursor-pointer hover:text-orange-300 select-none" : ""}`}
                                                onClick={() => handleSort(h.key)}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {h.label}
                                                    {h.key && (
                                                        <span className="text-neutral-500">
                                                            {sortField === `${h.key}-asc` ? <ChevronUp size={14} className="text-orange-300"/> :
                                                             sortField === `${h.key}-desc` ? <ChevronDown size={14} className="text-orange-300"/> :
                                                             <ArrowUpDown size={14} />}
                                                        </span>
                                                    )}
                                                </div>
                                            </th>
                                        ))}
                                        {user && user.role === "manager" && <th className="px-6 py-5 font-bold text-right">Actions</th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {paginatedProducts.map((item) => {
                                        const stockStatusText = getStockStatus(item.amount);
                                        const s = STOCK_STYLES[stockStatusText];
                                        const isHighlighted = item.id === parseInt(highlightId);
                                        return (
                                            <tr
                                                key={item.id}
                                                id={`product-row-${item.id}`}
                                                className={`group transition-all duration-500 ${isHighlighted ? 'bg-orange-500/20 border-l-4 border-orange-400 shadow-[inset_0_0_20px_rgba(249,115,22,0.3)]' : 'hover:bg-white/[0.02] hover:border-l-4 hover:border-orange-500'}`}
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
                                                            <HighlightText text={item.name} query={searchQuery} />
                                                        </span>
                                                        <span className="text-[9px] text-neutral-500 tracking-wider">
                                                            {item.targetGroup} / {item.productType}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-neutral-400 font-mono text-sm">
                                                    <HighlightText text={item.sku} query={searchQuery} />
                                                </td>
                                                <td className="px-6 py-6 uppercase text-xs font-bold">{item.sportType}</td>
                                                <td className="px-6 py-6 uppercase text-xs font-bold text-neutral-400">
                                                    <HighlightText text={item.brand} query={searchQuery} />
                                                </td>
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
                                                {user && user.role === "manager" && (
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
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="bg-white/5 border border-white/10 hover:border-red-500 p-2 transition-all hover:bg-red-500 hover:text-neutral-950 text-red-400"
                                                                title="Delete Product"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
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
                                {Math.min(currentPage * itemsPerPage, sortedProducts.length)} of {sortedProducts.length} Products
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
                    <div className="w-full max-w-3xl bg-neutral-900 border border-orange-300/20 relative flex flex-col max-h-[90vh] my-auto">
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

                                {/* Color Variants & Stock */}
                                <div className="flex flex-col gap-4 mt-6 border-t border-white/10 pt-6">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm uppercase tracking-widest text-neutral-100 font-black italic">
                                            Color Variants & Stock
                                        </label>
                                        <button type="button" onClick={handleAddVariant} className="flex items-center gap-2 text-xs uppercase font-black text-orange-300 hover:text-orange-400">
                                            <Plus size={14} /> Add Color
                                        </button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {colorVariants.map((variant, index) => (
                                            <div key={index} className="bg-white/5 border border-white/10 p-6 flex flex-col gap-6 relative">
                                                <button type="button" onClick={() => handleRemoveVariant(index)} className="absolute top-4 right-4 text-neutral-500 hover:text-red-400">
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Color Select */}
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Color</label>
                                                        <select 
                                                            value={variant.color}
                                                            onChange={(e) => handleVariantColorChange(index, e.target.value)}
                                                            className="bg-neutral-900 border border-white/10 py-3 px-4 uppercase text-sm"
                                                        >
                                                            <option value="">Select Color</option>
                                                            {COLOR_NAMES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                    </div>
                                                    
                                                    {/* Image Upload */}
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Image (Required)</label>
                                                        <div className="flex gap-2">
                                                            <label className="flex-1 bg-neutral-900 border border-white/10 py-3 px-4 flex items-center justify-center gap-2 cursor-pointer hover:border-orange-300 transition-colors">
                                                                <Upload size={14} className="text-neutral-400" />
                                                                <span className="text-xs uppercase text-neutral-400 font-bold">Upload</span>
                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleVariantImageFile(index, e)} />
                                                            </label>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => {
                                                                    const url = prompt("Enter Image URL:", variant.image);
                                                                    if (url !== null) handleVariantImageUrl(index, url);
                                                                }}
                                                                className="flex-1 bg-neutral-900 border border-white/10 py-3 px-4 flex items-center justify-center gap-2 hover:border-orange-300 transition-colors"
                                                            >
                                                                <ImageIcon size={14} className="text-neutral-400" />
                                                                <span className="text-xs uppercase text-neutral-400 font-bold">URL</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Image Preview */}
                                                {variant.image && (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-neutral-950 border border-white/10 p-1">
                                                            <img src={variant.image} className="w-full h-full object-cover" alt="Variant" />
                                                        </div>
                                                        <span className="text-[10px] text-green-400 uppercase font-bold">Image Ready</span>
                                                    </div>
                                                )}

                                                {/* Stock Input */}
                                                <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
                                                    <label className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                                                        {currentSizes.length > 0 ? "Stock per Size" : "Total Stock"}
                                                    </label>
                                                    
                                                    {currentSizes.length > 0 ? (
                                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                                            {currentSizes.map(size => (
                                                                <div key={size} className="flex flex-col gap-1">
                                                                    <span className="text-[10px] text-center text-neutral-500 font-black">{size}</span>
                                                                    <input 
                                                                        type="number"
                                                                        min="0"
                                                                        value={variant.stock[size] || ""}
                                                                        onChange={(e) => handleVariantStockChange(index, size, e.target.value)}
                                                                        className="bg-neutral-900 border border-white/10 py-2 px-2 text-center text-sm w-full outline-none focus:border-orange-300"
                                                                        placeholder="0"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <input 
                                                            type="number"
                                                            min="0"
                                                            value={variant.amount || ""}
                                                            onChange={(e) => handleVariantStockChange(index, "__amount", e.target.value)}
                                                            className="bg-neutral-900 border border-white/10 py-3 px-4 text-sm w-full md:w-1/3 outline-none focus:border-orange-300"
                                                            placeholder="0"
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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