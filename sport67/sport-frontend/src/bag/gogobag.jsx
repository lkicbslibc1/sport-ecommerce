import React, { useEffect } from "react";
import {
    Trash2,
    ArrowRight,
    Plus,
    Minus,
    CreditCard,
    Wallet,
    ShieldCheck,
} from "lucide-react";
import Navbar from "../navbar.jsx";
import { useAlert } from "../contexts/AlertContext.jsx";
import { getSizeOptions } from "../data/products.jsx";

const C = {
    bg: "#050505",
    surface: "#131313",
    surfaceLowest: "#0e0e0e",
    surfaceContainer: "#1c1b1b",
    surfaceContainerHigh: "#2a2a2a",
    primary: "#ffb59e",
    primaryContainer: "#ff5719",
    onSurfaceVariant: "#e6beb2",
    outlineVariant: "#5c4037",
    onSurface: "#e5e2e1",
};

function Footer() {
    return (
        <footer
            className="w-full mt-32 border-t py-20 flex flex-col items-center gap-8"
            style={{ borderColor: C.outlineVariant, backgroundColor: C.surfaceLowest }}
        >
            <div
                className="italic font-black select-none pointer-events-none text-5xl"
                style={{ color: "rgba(229,226,225,0.1)" }}
            >
                GOGO ATHLETIC
            </div>
            <div className="flex flex-wrap justify-center gap-8 px-6">
                {["PRIVACY POLICY", "TERMS OF SERVICE", "SHIPPING & RETURNS", "CONTACT"].map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="uppercase tracking-widest text-sm hover:opacity-80 transition-opacity"
                        style={{ color: C.onSurfaceVariant }}
                    >
                        {item}
                    </a>
                ))}
            </div>
            <div className="text-xs tracking-widest text-center mt-8" style={{ color: C.onSurfaceVariant }}>
                ©2026 GOGO ATHLETIC. ENGINEERED FOR PERFORMANCE.
            </div>
        </footer>
    );
}

function BagItem({ item, updateQuantity, removeItem, updateItemAttribute, onViewChange, setSelectedProduct }) {
    const currentColor = item.selectedColor || item.color || (item.colorNames ? item.colorNames[0] : null);
    const currentImage = (item.colorImages && currentColor && item.colorImages[currentColor]) 
        ? item.colorImages[currentColor] 
        : item.image;
        
    const itemSizes = item.sizes || getSizeOptions(item.productType, item.clothesType) || [];

    return (
        <div
            className="p-6 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden group border"
            style={{
                backgroundColor: "rgba(255,255,255,0.03)",
                borderColor: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
            }}
        >
            <div
                className="w-full md:w-48 h-48 overflow-hidden cursor-pointer"
                style={{ backgroundColor: C.surfaceContainer }}
                onClick={() => {
                    if (setSelectedProduct && onViewChange) {
                        setSelectedProduct(item);
                        onViewChange('product_details');
                    }
                }}
            >
                <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={currentImage}
                    alt={item.name}
                />
            </div>
            <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <h3
                            className="text-2xl md:text-3xl uppercase italic font-black mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ color: C.onSurface }}
                            onClick={() => {
                                if (setSelectedProduct && onViewChange) {
                                    setSelectedProduct(item);
                                    onViewChange('product_details');
                                }
                            }}
                        >
                            {item.name}
                        </h3>
                        <p className="text-[10px] tracking-widest uppercase" style={{ color: C.onSurfaceVariant }}>
                            {item.series || item.brand}
                        </p>
                    </div>
                    <span className="text-2xl md:text-3xl italic font-black" style={{ color: C.primary }}>
                        {(item.price * item.quantity).toLocaleString("th-TH")} ฿
                    </span>
                </div>
                <div className="mt-4 grid grid-cols-2 md:flex gap-4 md:gap-12">
                    <div>
                        <p className="text-[10px] uppercase mb-1" style={{ color: C.onSurfaceVariant }}>
                            SIZE
                        </p>
                        {itemSizes && itemSizes.length > 0 ? (
                            <div className="relative w-fit group">
                                <select
                                    value={item.selectedSize || item.size || itemSizes[0]}
                                    onChange={(e) => updateItemAttribute(item.cartId || item.id, 'selectedSize', e.target.value)}
                                    className="font-black italic px-3 py-1 border outline-none cursor-pointer appearance-none pr-8 transition-colors hover:border-primary focus:border-primary"
                                    style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant, color: C.onSurface }}
                                >
                                    {itemSizes.map(size => (
                                        <option key={size} value={size} className="bg-[#1c1b1b] text-white not-italic">{size}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-white/50 group-hover:text-primary transition-colors">expand_more</span>
                            </div>
                        ) : (
                            <p className="font-black italic mt-1" style={{ color: C.onSurface }}>
                                {item.selectedSize || item.size || "M"}
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-[10px] uppercase mb-1" style={{ color: C.onSurfaceVariant }}>
                            COLOR
                        </p>
                        {item.colorVariants && item.colorVariants.length > 0 ? (
                            <div className="relative w-fit group">
                                <select
                                    value={item.selectedColor || item.color || item.colorVariants[0].color}
                                    onChange={(e) => updateItemAttribute(item.cartId || item.id, 'selectedColor', e.target.value)}
                                    className="font-black italic px-3 py-1 border outline-none cursor-pointer appearance-none pr-8 transition-colors hover:border-primary focus:border-primary "
                                    style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant, color: C.onSurface }}
                                >
                                    {item.colorVariants.map(variant => (
                                        <option key={variant.color} value={variant.color} className="bg-[#1c1b1b] text-white not-italic">{variant.color}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-white/50 group-hover:text-primary transition-colors">expand_more</span>
                            </div>
                        ) : item.colorNames && item.colorNames.length > 0 ? (
                            <div className="relative w-fit group">
                                <select
                                    value={item.selectedColor || item.color || item.colorNames[0]}
                                    onChange={(e) => updateItemAttribute(item.cartId || item.id, 'selectedColor', e.target.value)}
                                    className="font-black italic px-3 py-1 border outline-none cursor-pointer appearance-none pr-8 transition-colors hover:border-primary focus:border-primary "
                                    style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant, color: C.onSurface }}
                                >
                                    {item.colorNames.map(color => (
                                        <option key={color} value={color} className="bg-[#1c1b1b] text-white not-italic">{color}</option>
                                    ))}
                                </select>
                                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[16px] text-white/50 group-hover:text-primary transition-colors">expand_more</span>
                            </div>
                        ) : (
                            <p className="font-black italic mt-1" style={{ color: C.onSurface }}>
                                {item.selectedColor || item.color || "DEFAULT"}
                            </p>
                        )}
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-[10px] uppercase mb-2" style={{ color: C.onSurfaceVariant }}>
                            QUANTITY
                        </p>
                        <div
                            className="flex items-center gap-4 w-fit px-3 py-1 border"
                            style={{ backgroundColor: C.surfaceContainerHigh, borderColor: C.outlineVariant }}
                        >
                            <button
                                type="button"
                                onClick={() => updateQuantity(item.cartId || item.id, item.quantity - 1)}
                                className="hover:opacity-70 transition-opacity bg-transparent border-none text-white cursor-pointer"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="font-black text-sm w-4 text-center" style={{ color: C.onSurface }}>
                                {item.quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() => updateQuantity(item.cartId || item.id, item.quantity + 1)}
                                className="hover:opacity-70 transition-opacity bg-transparent border-none text-white cursor-pointer"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex gap-6">
                    <button
                        type="button"
                        onClick={() => removeItem(item.cartId || item.id)}
                        className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer"
                        style={{ color: "#ffb4ab" }}
                    >
                        <Trash2 size={16} /> REMOVE
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GoGoBag({ onViewChange, cart = [], setCart, user, setUser, setSelectedProduct }) {
    const { showAlert } = useAlert();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const updateQuantity = (cartId, newQty) => {
        if (newQty < 1) {
            removeItem(cartId);
        } else {
            setCart(prev => prev.map(i => (i.cartId || i.id) === cartId ? { ...i, quantity: newQty } : i));
        }
    };

    const removeItem = (cartId) => {
        setCart(prev => prev.filter(i => (i.cartId || i.id) !== cartId));
    };

    const updateItemAttribute = (cartId, attribute, value) => {
        setCart(prev => prev.map(i => (i.cartId || i.id) === cartId ? { ...i, [attribute]: value } : i));
    };

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const tax = subtotal * 0.07;
    const total = subtotal + tax;

    return (
        <div style={{ backgroundColor: C.bg, color: C.onSurface, minHeight: "100vh" }} className="font-sans">
            <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />
            <main className="pt-32 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
                <header className="mb-16">
                    <h1
                        className="uppercase italic tracking-tighter leading-none mb-4 font-black text-6xl md:text-8xl"
                        style={{ color: C.onSurface }}
                    >
                        YOUR{" "}
                        <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)", color: "transparent" }}>BAG</span>
                    </h1>
                    <p className="text-[11px] tracking-widest uppercase font-bold" style={{ color: C.primary }}>
                        {cart.length} ITEMS IN YOUR HIGH-PERFORMANCE ARSENAL
                    </p>
                </header>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 border" style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <p className="text-sm uppercase tracking-widest mb-8 opacity-60">Your shopping bag is empty.</p>
                        <button
                            onClick={() => onViewChange('home')}
                            className="border font-black uppercase px-8 py-4 text-[11px] italic transition-all duration-300 cursor-pointer"
                            style={{ borderColor: C.primary, color: C.primary, backgroundColor: "transparent" }}
                        >
                            Explore Gear
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        <div className="lg:col-span-8 space-y-8">
                            {cart.map((item) => (
                                <BagItem
                                    key={item.cartId || item.id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeItem}
                                    updateItemAttribute={updateItemAttribute}
                                    onViewChange={onViewChange}
                                    setSelectedProduct={setSelectedProduct}
                                />
                            ))}


                        </div>

                        <aside className="lg:col-span-4">
                            <div className="sticky top-32 space-y-6">
                                <div
                                    className="p-8 border"
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    <h2
                                        className="uppercase italic mb-8 border-b pb-4 font-black text-2xl"
                                        style={{ color: C.onSurface, borderColor: C.outlineVariant }}
                                    >
                                        SUMMARY
                                    </h2>
                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center" style={{ color: C.onSurfaceVariant }}>
                                            <span className="text-[10px] uppercase tracking-widest">SUBTOTAL</span>
                                            <span className="font-black">{subtotal.toLocaleString("th-TH")} ฿</span>
                                        </div>
                                        <div className="flex justify-between items-center" style={{ color: C.onSurfaceVariant }}>
                                            <span className="text-[10px] uppercase tracking-widest">SHIPPING</span>
                                            <span className="font-black" style={{ color: C.primary }}>
                                                NOT CHOOSE YET
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center" style={{ color: C.onSurfaceVariant }}>
                                            <span className="text-[10px] uppercase tracking-widest">EST. TAX (7%)</span>
                                            <span className="font-black">{tax.toLocaleString("th-TH")} ฿</span>
                                        </div>
                                    </div>
                                    <div className="border-t pt-6 mb-10" style={{ borderColor: C.outlineVariant }}>
                                        <div className="flex justify-between items-end">
                                            <span className="uppercase italic font-black text-2xl" style={{ color: C.onSurface }}>
                                                TOTAL
                                            </span>
                                            <span className="italic font-black text-2xl" style={{ color: C.primary }}>
                                                {total.toLocaleString("th-TH")} ฿
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!user) {
                                                showAlert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า (Please login before checking out)", "warning");
                                                onViewChange('login');
                                            } else {
                                                onViewChange('checkout');
                                            }
                                        }}
                                        className="w-full py-5 italic font-black uppercase flex items-center justify-center gap-4 group text-2xl transition-all border-none cursor-pointer"
                                        style={{ backgroundColor: "#ff4e00", color: "white" }}
                                    >
                                        CHECKOUT
                                        <ArrowRight className="group-hover:translate-x-2 transition-transform" size={22} />
                                    </button>
                                    <div className="mt-8 pt-8 border-t" style={{ borderColor: C.outlineVariant }}>
                                        <p className="text-[10px] uppercase mb-4 tracking-widest" style={{ color: C.onSurfaceVariant }}>
                                            ACCEPTED PAYMENTS
                                        </p>
                                        <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" style={{ color: C.onSurface }}>
                                            <CreditCard size={20} />
                                            <Wallet size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="p-6 flex items-center gap-4 border"
                                    style={{
                                        backgroundColor: "rgba(255,255,255,0.03)",
                                        borderColor: "rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(12px)",
                                    }}
                                >
                                    <ShieldCheck size={30} style={{ color: C.primary }} />
                                    <div>
                                        <p className="font-black text-sm uppercase italic" style={{ color: C.onSurface }}>
                                            GOGO PERFORMANCE GUARANTEE
                                        </p>
                                        <p className="text-xs uppercase mt-1" style={{ color: C.onSurfaceVariant }}>
                                            30-day sweat-tested return policy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}