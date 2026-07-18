import React, { useState, useEffect } from "react";
import { ShoppingBag, User, CreditCard, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "../navbar.jsx";
import { useProducts } from "../data/products.jsx";
import { useAlert } from "../contexts/AlertContext.jsx";
import { notifyNewOrder } from "../data/notificationService.js";

const C = {
    bg: "#050505",
    surface: "#131313",
    surfaceLowest: "#0e0e0e",
    surfaceContainer: "#201f1f",
    primary: "#ffb59e",
    primaryContainer: "#ff5719",
    onPrimaryContainer: "#521300",
    onSurfaceVariant: "#e6beb2",
    outline: "#ac897e",
    outlineVariant: "#5c4037",
    onSurface: "#e5e2e1",
};

function Footer() {
    return (
        <footer
            className="w-full py-32 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t"
            style={{ backgroundColor: C.surfaceLowest, borderColor: "rgba(255,255,255,0.05)" }}
        >
            <div className="italic font-black text-2xl" style={{ color: C.onSurface }}>
                GOGO ATHLETIC
            </div>
            <div className="flex flex-wrap justify-center gap-8">
                {["PRIVACY POLICY", "TERMS OF SERVICE", "RETURNS", "SUPPORT"].map((item) => (
                    <a
                        key={item}
                        href="#"
                        className="text-[10px] uppercase underline underline-offset-4 opacity-80 hover:opacity-100 transition-opacity"
                        style={{ color: C.onSurfaceVariant }}
                    >
                        {item}
                    </a>
                ))}
            </div>
            <div className="text-[10px] uppercase opacity-60" style={{ color: C.onSurfaceVariant }}>
                © 2026 GOGO ATHLETIC. ENGINEERED FOR ELITES.
            </div>
        </footer>
    );
}

function InputField({ label, placeholder, span, type = "text", value, onChange, name, required, ...rest }) {
    const [focused, setFocused] = useState(false);
    return (
        <div className={`flex flex-col gap-2 ${span ? "md:col-span-2" : ""}`}>
            <label
                className="text-[10px] uppercase transition-colors"
                style={{ color: focused ? C.primary : C.outline }}
            >
                {label}
            </label>
            <input
                className="border-b-2 py-3 px-1 uppercase font-bold tracking-wider bg-transparent transition-all duration-300 outline-none"
                style={{
                    borderColor: focused ? C.primaryContainer : "rgba(172,137,126,0.2)",
                    color: C.onSurface,
                    backgroundColor: "#1c1b1b",
                }}
                placeholder={placeholder}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                {...rest}
            />
        </div>
    );
}

export default function KineticCheckout({ onViewChange, cart = [], setCart, user, setUser }) {
    const { showAlert } = useAlert();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { products, updateProduct } = useProducts();

    const [shipping, setShipping] = useState("standard");
    const [payMethod, setPayMethod] = useState("card");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentUserUsername = user ? (user.username || user.name) : 'Guest';
    const [addresses, setAddresses] = useState([]);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showAddNewAddressModal, setShowAddNewAddressModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [addressForm, setAddressForm] = useState({
        firstName: '', lastName: '', phone: '', streetAddress: '', city: '', zipCode: '', isDefault: false
    });

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/addresses');
            const allAddresses = res.ok ? await res.json() : {};
            let userAddrs = allAddresses[currentUserUsername] || [];

            let newAddr = { ...addressForm, id: Date.now().toString() };
            if (newAddr.isDefault || userAddrs.length === 0) {
                newAddr.isDefault = true;
                userAddrs = userAddrs.map(a => ({ ...a, isDefault: false }));
            }

            userAddrs.push(newAddr);
            allAddresses[currentUserUsername] = userAddrs;
            
            await fetch('http://localhost:5000/api/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(allAddresses)
            });

            setAddresses(userAddrs);
            setShowAddNewAddressModal(false);
            setSelectedAddress(newAddr);
            setFormData(prev => ({
                ...prev,
                firstName: newAddr.firstName,
                lastName: newAddr.lastName,
                address: newAddr.streetAddress,
                city: newAddr.city,
                zipCode: newAddr.zipCode
            }));
            setAddressForm({ firstName: '', lastName: '', phone: '', streetAddress: '', city: '', zipCode: '', isDefault: false });
        } catch (error) {
            console.error("Failed to save address:", error);
        }
    };

    useEffect(() => {
        async function fetchAddresses() {
            if (currentUserUsername !== 'Guest') {
                try {
                    const res = await fetch('http://localhost:5000/api/addresses');
                    const allAddresses = res.ok ? await res.json() : {};
                    const userAddrs = allAddresses[currentUserUsername] || [];
                    setAddresses(userAddrs);

                    const defaultAddr = userAddrs.find(a => a.isDefault) || userAddrs[0];
                    if (defaultAddr) {
                        setSelectedAddress(defaultAddr);
                        setFormData(prev => ({
                            ...prev,
                            firstName: defaultAddr.firstName,
                            lastName: defaultAddr.lastName,
                            address: defaultAddr.streetAddress,
                            city: defaultAddr.city,
                            zipCode: defaultAddr.zipCode
                        }));
                    }
                } catch (error) {
                    console.error("Failed to fetch addresses:", error);
                }
            }
        }
        fetchAddresses();
    }, [currentUserUsername]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        zipCode: "",
        cardNumber: "",
        expiry: "",
        cvv: "",
    });

    const handleInputChange = (e) => {
        let { name, value } = e.target;

        if (name === "cardNumber") {
            const digits = value.replace(/\D/g, "");
            const limitedDigits = digits.slice(0, 16);
            const formatted = limitedDigits.match(/.{1,4}/g)?.join(" ") || limitedDigits;
            value = formatted;
        } else if (name === "expiry") {
            const digits = value.replace(/\D/g, "");
            const limitedDigits = digits.slice(0, 4);
            if (limitedDigits.length > 2) {
                value = `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
            } else {
                value = limitedDigits;
            }
        } else if (name === "cvv") {
            const digits = value.replace(/\D/g, "");
            value = digits.slice(0, 3);
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = shipping === "express" ? 250 : 0;
    const tax = subtotal * 0.07;
    const total = subtotal + shippingCost + tax;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        if (!selectedAddress) {
            showAlert("กรุณาระบุที่อยู่สำหรับจัดส่งสินค้าก่อนทำการสั่งซื้อ", "warning");
            return;
        }

        if (payMethod === "card") {
            if (formData.cardNumber.length < 19) {
                showAlert("กรุณากรอกหมายเลขบัตรเครดิตให้ครบ 16 หลัก", "warning");
                return;
            }
            if (formData.expiry.length < 5) {
                showAlert("กรุณากรอกวันหมดอายุบัตรให้ครบ (MM/YY)", "warning");
                return;
            } else {
                const [monthStr, yearStr] = formData.expiry.split('/');
                const month = parseInt(monthStr, 10);
                const year = parseInt(`20${yearStr}`, 10);
                
                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;
                
                if (year < currentYear || (year === currentYear && month < currentMonth)) {
                    showAlert("บัตรเครดิตนี้หมดอายุแล้ว ไม่สามารถใช้ทำรายการได้", "error");
                    return;
                }
            }
            if (formData.cvv.length < 3) {
                showAlert("กรุณากรอกรหัส CVC ให้ครบ 3 หลัก", "warning");
                return;
            }
        }

        setIsSubmitting(true);

        try {
            const randomId = "GOGO-" + Math.floor(100000 + Math.random() * 900000);

            // Construct and save order
            const ordRes = await fetch('http://localhost:5000/api/orders');
            const existingOrders = ordRes.ok ? await ordRes.json() : [];
            const currentUsername = user ? (user.username || user.name) : 'Guest';
            
            const newOrder = {
                id: "#" + randomId,
                username: currentUsername,
                customer: `${selectedAddress.firstName} ${selectedAddress.lastName}`.trim(),
                shippingAddress: selectedAddress,
                shippingMethod: shipping,
                shippingCost: shippingCost,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
                total: Number(total.toFixed(2)),
                status: "Preparing",
                items: cart.map(i => ({
                    id: i.id,
                    color: i.selectedColor,
                    size: i.selectedSize,
                    name: i.name,
                    sku: i.sku || `GA-${i.brand.slice(0, 2).toUpperCase()}-${i.id}`,
                    qty: i.quantity,
                    price: i.price.toLocaleString("th-TH") + " ฿",
                    image: i.image
                })),
                actions: ["Update Status", "Mark Shipped", "Mark Preparing", "Cancel Order"]
            };
            
            await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify([newOrder, ...existingOrders])
            });

            if (currentUsername !== 'Guest') {
                const notiRes = await fetch('http://localhost:5000/api/noti');
                const allNotis = notiRes.ok ? await notiRes.json() : {};
                const userNotis = allNotis[currentUsername] || [];
                const newNoti = {
                    id: newOrder.id,
                    date: newOrder.date,
                    title: "Purchase successful!",
                    status: newOrder.status,
                    read: false
                };
                allNotis[currentUsername] = [newNoti, ...userNotis];
                
                await fetch('http://localhost:5000/api/noti', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(allNotis)
                });
            }

            // Notify staff about new order
            await notifyNewOrder(newOrder.id, newOrder.customer, newOrder.total);

            setOrderId(randomId);
            setIsSubmitting(false);
            setIsSubmitted(true);

            // Decrease product amount and specific variant stock
            cart.forEach(item => {
                const productInStore = products.find(p => p.id === item.id);
                if (productInStore) {
                    let updatedProduct = { ...productInStore };
                    const qty = item.quantity;
                    const currentColor = item.selectedColor || item.color || (item.colorNames ? item.colorNames[0] : null);
                    const currentSize = item.selectedSize || item.size;

                    // 1. ลด overall amount
                    updatedProduct.amount = Math.max(0, updatedProduct.amount - qty);

                    // 2. ลดยอดใน colorVariants (ถ้ามี)
                    if (updatedProduct.colorVariants && updatedProduct.colorVariants.length > 0) {
                        updatedProduct.colorVariants = updatedProduct.colorVariants.map(variant => {
                            if (currentColor && variant.color && variant.color.toLowerCase() === currentColor.toLowerCase()) {
                                let newVariant = { ...variant };
                                // ลด amount รวมของสีนี้
                                newVariant.amount = Math.max(0, newVariant.amount - qty);
                                
                                // ลด stock แยกตามไซส์
                                if (currentSize && newVariant.stock && newVariant.stock[currentSize] !== undefined) {
                                    newVariant.stock = { ...newVariant.stock };
                                    newVariant.stock[currentSize] = Math.max(0, newVariant.stock[currentSize] - qty);
                                }
                                return newVariant;
                            }
                            return variant;
                        });
                    } else if (currentSize && updatedProduct.stock && updatedProduct.stock[currentSize] !== undefined) {
                        // กรณีไม่มี colorVariants แต่มี stock แยกไซส์ที่ตัว product เลย
                        updatedProduct.stock = { ...updatedProduct.stock };
                        updatedProduct.stock[currentSize] = Math.max(0, updatedProduct.stock[currentSize] - qty);
                    }

                    updateProduct(updatedProduct);
                }
            });

            setCart([]); // Clear cart
        } catch (err) {
            console.error("Failed to save order to API", err);
            setIsSubmitting(false);
            showAlert("Error placing order. Please try again.", "error");
        }
    };

    if (isSubmitted) {
        return (
            <div style={{ backgroundColor: C.bg, color: C.onSurface, minHeight: "100vh" }} className="font-sans">
                <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={[]} />
                <main className="pt-32 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto flex items-center justify-center">
                    <div
                        className="glass max-w-xl w-full p-12 text-center border relative overflow-hidden"
                        style={{ backgroundColor: C.surface, borderColor: "rgba(255,255,255,0.05)" }}
                    >
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary" style={{ backgroundColor: C.primaryContainer }}></div>
                        <div className="mb-8 flex justify-center">
                            <CheckCircle2 size={72} className="animate-bounce" style={{ color: C.primary }} />
                        </div>
                        <h2 className="font-anybody font-black italic uppercase tracking-tighter text-4xl md:text-5xl text-white mb-4">
                            ORDER PLACED!
                        </h2>
                        <p className="font-bold text-xs uppercase tracking-widest mb-8" style={{ color: C.primary }}>
                            ORDER ID: {orderId}
                        </p>
                        <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-10" style={{ color: C.onSurfaceVariant }}>
                            Thank you for your purchase. We are preparing your elite performance gear. An email confirmation has been sent to your registered address.
                        </p>
                        <button
                            onClick={() => onViewChange("home")}
                            className="bg-primary hover:bg-orange-600 px-12 py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-105 cursor-pointer border-none text-black"
                            style={{ backgroundColor: C.primary }}
                        >
                            Back to Home
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: C.bg, color: C.onSurface, minHeight: "100vh" }} className="font-sans">
            <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />
            <main className="pt-32 pb-32 px-6 md:px-12 max-w-[1440px] mx-auto">
                <div className="mb-12">
                    <h1 className="italic uppercase font-black text-5xl md:text-6xl" style={{ color: C.onSurface }}>
                        CHECKOUT
                    </h1>
                    <p className="text-[11px] tracking-[0.3em] mt-2" style={{ color: C.primary }}>
                        SECURE ENCRYPTED TRANSACTION
                    </p>
                </div>

                {!user ? (
                    <div className="flex flex-col items-center justify-center py-24 border" style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <p className="text-sm uppercase tracking-widest mb-8 opacity-60">PLEASE LOGIN TO CONTINUE CHECKOUT.</p>
                        <button
                            onClick={() => onViewChange('login')}
                            className="border font-black uppercase px-8 py-4 text-[11px] italic transition-all duration-300 cursor-pointer bg-transparent"
                            style={{ borderColor: C.primary, color: C.primary }}
                        >
                            Login / Register
                        </button>
                    </div>
                ) : cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 border" style={{ borderColor: "rgba(255,255,255,0.05)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <p className="text-sm uppercase tracking-widest mb-8 opacity-60">Checkout is empty.</p>
                        <button
                            onClick={() => onViewChange('home')}
                            className="border font-black uppercase px-8 py-4 text-[11px] italic transition-all duration-300 cursor-pointer bg-transparent"
                            style={{ borderColor: C.primary, color: C.primary }}
                        >
                            Shop Collections
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <div className="lg:col-span-7 space-y-16">
                            {/* Shipping Address */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span
                                        className="w-8 h-8 flex items-center justify-center font-black italic"
                                        style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                                    >
                                        01
                                    </span>
                                    <div className="flex-1 flex justify-between items-center">
                                        <h2 className="italic uppercase font-black text-2xl" style={{ color: C.onSurface }}>
                                            SHIPPING ADDRESS
                                        </h2>
                                        {addresses.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressModal(true)}
                                                className="text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white/10 transition-colors cursor-pointer bg-transparent"
                                                style={{ color: C.primary }}
                                            >
                                                Change Address
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {addresses.length > 0 && selectedAddress ? (
                                    <div className="p-6 border border-white/10 bg-[#1c1b1b] relative">
                                        <p className="font-bold text-sm text-white">{selectedAddress.firstName} {selectedAddress.lastName} | <span className="text-on-surface-variant font-light">{selectedAddress.phone}</span></p>
                                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{selectedAddress.streetAddress}<br />{selectedAddress.city}, {selectedAddress.zipCode}</p>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddNewAddressModal(true)}
                                        className="w-full border border-primary text-primary hover:bg-primary hover:text-black py-4 font-anybody font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-transparent"
                                    >
                                        + เพิ่มที่อยู่ใหม่
                                    </button>
                                )}
                            </section>

                            {/* Shipping Method */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span
                                        className="w-8 h-8 flex items-center justify-center font-black italic"
                                        style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                                    >
                                        02
                                    </span>
                                    <h2 className="italic uppercase font-black text-2xl" style={{ color: C.onSurface }}>
                                        SHIPPING METHOD
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        { id: "standard", label: "Standard", sub: "4-6 BUSINESS DAYS", price: "FREE" },
                                        { id: "express", label: "Express", sub: "NEXT DAY AIR", price: "250.00 ฿" },
                                    ].map((opt) => (
                                        <label key={opt.id} className="relative group cursor-pointer">
                                            <input
                                                type="radio"
                                                name="shipping"
                                                value={opt.id}
                                                checked={shipping === opt.id}
                                                onChange={() => setShipping(opt.id)}
                                                className="hidden"
                                            />
                                            <div
                                                className="p-6 border flex justify-between items-center transition-all duration-300"
                                                style={{
                                                    backgroundColor: shipping === opt.id ? "rgba(255,87,25,0.1)" : "#1c1b1b",
                                                    borderColor: shipping === opt.id ? C.primaryContainer : "rgba(255,255,255,0.05)",
                                                }}
                                            >
                                                <div>
                                                    <div className="font-bold uppercase" style={{ color: C.onSurface }}>
                                                        {opt.label}
                                                    </div>
                                                    <div className="text-[10px]" style={{ color: C.onSurfaceVariant }}>
                                                        {opt.sub}
                                                    </div>
                                                </div>
                                                <div className="font-black italic" style={{ color: C.primary }}>
                                                    {opt.price}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            {/* Payment Method */}
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <span
                                        className="w-8 h-8 flex items-center justify-center font-black italic"
                                        style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                                    >
                                        03
                                    </span>
                                    <h2 className="italic uppercase font-black text-2xl" style={{ color: C.onSurface }}>
                                        PAYMENT METHOD
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex gap-4 mb-8">
                                        {[
                                            { id: "card", label: "CREDIT CARD", icon: CreditCard }
                                        ].map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setPayMethod(opt.id)}
                                                className="flex-1 py-4 flex items-center justify-center gap-3 transition-all border-none border-b-4 cursor-pointer"
                                                style={{
                                                    backgroundColor: payMethod === opt.id ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)",
                                                    borderBottom: payMethod === opt.id ? `4px solid ${C.primaryContainer}` : "4px solid transparent",
                                                    color: C.onSurface,
                                                }}
                                            >
                                                <opt.icon size={18} />
                                                <span className="text-[11px] uppercase tracking-widest">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {payMethod === "card" ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <InputField label="Card Number" placeholder="0000 0000 0000 0000" span name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required minLength={19} maxLength={19} pattern="^(\d{4}\s?){4}$" title="กรุณากรอกเลขบัตรเครดิตให้ครบ 16 หลัก" />
                                            <InputField label="Expiration (MM/YY)" placeholder="12/28" name="expiry" value={formData.expiry} onChange={handleInputChange} required minLength={5} maxLength={5} pattern="^(0[1-9]|1[0-2])\/?([0-9]{2})$" title="กรุณากรอกเดือน 01-12 และปี 2 หลัก" />
                                            <InputField label="CVC" placeholder="***" type="password" name="cvv" value={formData.cvv} onChange={handleInputChange} required minLength={3} maxLength={3} pattern="^\d{3}$" title="กรุณากรอกตัวเลข CVC 3 หลัก" />
                                        </div>
                                    ) : (
                                        <div className="p-6 border flex flex-col items-center justify-center gap-4" style={{ backgroundColor: C.surfaceContainer, borderColor: "rgba(255,255,255,0.05)" }}>
                                            <p className="text-xs uppercase tracking-widest text-center" style={{ color: C.onSurfaceVariant }}>Digital Wallet mock integration.</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                            <div
                                className="p-8 border relative overflow-hidden"
                                style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.05)" }}
                            >
                                <div
                                    className="absolute -top-24 -right-24 w-48 h-48 rounded-full"
                                    style={{ backgroundColor: "rgba(255,87,25,0.2)", filter: "blur(100px)" }}
                                />
                                <h2 className="italic uppercase font-black text-2xl mb-8 relative z-10" style={{ color: C.onSurface }}>
                                    ORDER SUMMARY
                                </h2>
                                <div className="space-y-6 mb-10 relative z-10 max-h-[320px] overflow-y-auto pr-2">
                                    {cart.map((item) => {
                                        const currentColor = item.selectedColor || item.color || (item.colorNames ? item.colorNames[0] : null);
                                        const currentImage = (item.colorImages && currentColor && item.colorImages[currentColor]) 
                                            ? item.colorImages[currentColor] 
                                            : item.image;
                                        
                                        return (
                                        <div className="flex gap-4" key={item.cartId || item.id}>
                                            <div
                                                className="w-24 h-24 border overflow-hidden flex-shrink-0"
                                                style={{ backgroundColor: C.surfaceLowest, borderColor: "rgba(255,255,255,0.05)" }}
                                            >
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={currentImage}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="font-bold uppercase text-sm" style={{ color: C.onSurface }}>
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[10px] mt-1 uppercase" style={{ color: C.onSurfaceVariant }}>
                                                        QTY: {item.quantity} | SIZE: {item.selectedSize || item.size || "M"} | COLOR: {currentColor || "DEFAULT"}
                                                    </p>
                                                </div>
                                                <div className="font-black italic" style={{ color: C.primary }}>
                                                    {(item.price * item.quantity).toLocaleString("th-TH")} ฿
                                                </div>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                                <div className="space-y-4 border-t pt-8 relative z-10" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                                    <div className="flex justify-between text-[10px]" style={{ color: C.onSurfaceVariant }}>
                                        <span>SUBTOTAL</span>
                                        <span>{subtotal.toLocaleString("th-TH")} ฿</span>
                                    </div>
                                    <div className="flex justify-between text-[10px]" style={{ color: C.onSurfaceVariant }}>
                                        <span>SHIPPING ({shipping.toUpperCase()})</span>
                                        <span style={{ color: shippingCost === 0 ? C.primary : C.onSurfaceVariant }}>
                                            {shippingCost === 0 ? "FREE" : `${shippingCost.toLocaleString("th-TH")} ฿`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[10px]" style={{ color: C.onSurfaceVariant }}>
                                        <span>ESTIMATED TAXES (7%)</span>
                                        <span>{tax.toLocaleString("th-TH")} ฿</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-4">
                                        <span className="italic uppercase font-black text-2xl leading-none" style={{ color: C.primary }}>
                                            TOTAL
                                        </span>
                                        <span className="italic uppercase font-black text-2xl leading-none" style={{ color: C.onSurface }}>
                                            {total.toLocaleString("th-TH")} ฿
                                        </span>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full mt-10 py-5 italic uppercase font-black text-2xl transition-all duration-300 relative z-10 hover:scale-105 active:scale-95 border-none cursor-pointer text-center"
                                    style={{ backgroundColor: C.primaryContainer, color: C.onPrimaryContainer }}
                                >
                                    {isSubmitting ? "PROCESSING..." : "COMPLETE PURCHASE"}
                                </button>

                            </div>


                        </div>
                    </form>
                )}

                {/* Address Selection Modal */}
                {showAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#131313] border border-white/10 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
                            <h3 className="text-2xl font-anybody font-black italic uppercase mb-6 text-white">เลือกที่อยู่จัดส่ง</h3>
                            <div className="space-y-4">
                                {addresses.map((addr, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            setSelectedAddress(addr);
                                            setFormData(prev => ({
                                                ...prev,
                                                firstName: addr.firstName,
                                                lastName: addr.lastName,
                                                address: addr.streetAddress,
                                                city: addr.city,
                                                zipCode: addr.zipCode
                                            }));
                                            setShowAddressModal(false);
                                        }}
                                        className={`p-4 border cursor-pointer hover:border-primary transition-colors relative ${selectedAddress?.id === addr.id ? 'border-primary' : 'border-white/10'}`}
                                    >
                                        {addr.isDefault && <span className="absolute top-2 right-2 text-[10px] text-primary border border-primary px-2 py-0.5">ค่าเริ่มต้น</span>}
                                        <p className="font-bold text-sm text-white">{addr.firstName} {addr.lastName} | <span className="text-on-surface-variant font-light">{addr.phone}</span></p>
                                        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">{addr.streetAddress}<br />{addr.city}, {addr.zipCode}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-between items-center">
                                <button type="button" onClick={() => { setShowAddressModal(false); setShowAddNewAddressModal(true); }} className="text-[10px] uppercase font-bold text-primary hover:underline bg-transparent border-none cursor-pointer">+ เพิ่มที่อยู่ใหม่</button>
                                <button type="button" onClick={() => setShowAddressModal(false)} className="py-3 px-8 border border-white/20 text-white uppercase text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer bg-transparent">ปิด (Close)</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add New Address Modal */}
                {showAddNewAddressModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-[#131313] border border-white/10 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                            <h3 className="text-2xl font-anybody font-black italic uppercase mb-6 text-white">เพิ่มที่อยู่ใหม่</h3>
                            <form onSubmit={handleSaveAddress} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">First Name</label>
                                        <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.firstName} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, firstName: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Last Name</label>
                                        <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.lastName} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, lastName: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Phone Number</label>
                                    <input required type="tel" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.phone} onChange={e => { const v = e.target.value; if (/^\d*$/.test(v)) setAddressForm({ ...addressForm, phone: v }) }} minLength={10} maxLength={10} pattern="\d{10}" title="กรุณากรอกเบอร์โทรศัพท์ตัวเลข 10 หลัก" />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Street Address</label>
                                    <textarea required className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary resize-none h-20" value={addressForm.streetAddress} onChange={e => setAddressForm({ ...addressForm, streetAddress: e.target.value })}></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">City</label>
                                        <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.city} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, city: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Zip Code</label>
                                        <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.zipCode} onChange={e => { const v = e.target.value; if (/^\d*$/.test(v)) setAddressForm({ ...addressForm, zipCode: v }) }} minLength={5} maxLength={5} pattern="\d{5}" title="กรุณากรอกรหัสไปรษณีย์ตัวเลข 5 หลัก" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-4">
                                    <input type="checkbox" id="isDefault" className="w-4 h-4 accent-primary" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                                    <label htmlFor="isDefault" className="text-sm text-white cursor-pointer">ตั้งเป็นที่อยู่หลัก (Set as default)</label>
                                </div>
                                <div className="flex gap-4 pt-6">
                                    <button type="button" onClick={() => { setShowAddNewAddressModal(false); if (addresses.length > 0) setShowAddressModal(true); }} className="flex-1 py-4 border border-white/20 text-white uppercase text-xs font-bold hover:bg-white/5 transition-colors cursor-pointer">ยกเลิก</button>
                                    <button type="submit" className="flex-1 py-4 bg-primary text-black uppercase text-xs font-bold hover:bg-orange-500 transition-colors border-none cursor-pointer">บันทึก</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}