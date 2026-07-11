import React, { useState, useEffect } from "react";
import { ShoppingBag, User, CreditCard, Wallet, ShieldCheck, CheckCircle2 } from "lucide-react";
import Navbar from "../navbar.jsx";
import { useProducts } from "../data/products.jsx";

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
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const { products, updateProduct } = useProducts();

    const [shipping, setShipping] = useState("standard");
    const [payMethod, setPayMethod] = useState("card");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            const randomId = "GOGO-" + Math.floor(100000 + Math.random() * 900000);

            // Construct and save order
            try {
                const existingOrders = JSON.parse(localStorage.getItem('gogo_orders') || '[]');
                const newOrder = {
                    id: "#" + randomId,
                    username: user ? (user.username || user.name) : 'Guest',
                    customer: `${formData.firstName} ${formData.lastName}`.trim(),
                    tier: user ? 'MEMBER' : 'PRO',
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
                    total: total.toLocaleString("th-TH") + " ฿",
                    status: "Pending",
                    items: cart.map(i => ({
                        name: i.name,
                        sku: i.sku || `GA-${i.brand.slice(0, 2).toUpperCase()}-${i.id}`,
                        qty: i.quantity,
                        price: i.price.toLocaleString("th-TH") + " ฿",
                        image: i.image
                    })),
                    actions: ["Update Status", "Mark Shipped", "Mark Preparing", "Cancel Order"]
                };
                localStorage.setItem('gogo_orders', JSON.stringify([newOrder, ...existingOrders]));
            } catch (err) {
                console.error("Failed to save order to localStorage", err);
            }

            setOrderId(randomId);
            setIsSubmitting(false);
            setIsSubmitted(true);
            
            // Decrease product amount in local storage
            cart.forEach(item => {
                const productInStore = products.find(p => p.id === item.id);
                if (productInStore) {
                    updateProduct({ id: productInStore.id, amount: Math.max(0, productInStore.amount - item.quantity) });
                }
            });

            setCart([]); // Clear cart
        }, 1500);
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
                                    <h2 className="italic uppercase font-black text-2xl" style={{ color: C.onSurface }}>
                                        SHIPPING ADDRESS
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                    <InputField label="First Name" placeholder="ELIAS" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                                    <InputField label="Last Name" placeholder="VANCE" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                                    <InputField label="Street Address" placeholder="101 HIGH-PERFORMANCE WAY" span name="address" value={formData.address} onChange={handleInputChange} required />
                                    <InputField label="City" placeholder="NEO TOKYO" name="city" value={formData.city} onChange={handleInputChange} required />
                                    <InputField label="Zip Code" placeholder="90210-K" name="zipCode" value={formData.zipCode} onChange={handleInputChange} required />
                                </div>
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
                                            { id: "card", label: "CREDIT CARD", icon: CreditCard },
                                            { id: "wallet", label: "Digital Wallet", icon: Wallet },
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
                                            <InputField label="Card Number" placeholder="0000 0000 0000 0000" span name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} required maxLength={19} />
                                            <InputField label="Expiration (MM/YY)" placeholder="12/28" name="expiry" value={formData.expiry} onChange={handleInputChange} required maxLength={5} />
                                            <InputField label="CVC" placeholder="***" type="password" name="cvv" value={formData.cvv} onChange={handleInputChange} required maxLength={3} />
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
                                    {cart.map((item) => (
                                        <div className="flex gap-4" key={item.id}>
                                            <div
                                                className="w-24 h-24 border overflow-hidden flex-shrink-0"
                                                style={{ backgroundColor: C.surfaceLowest, borderColor: "rgba(255,255,255,0.05)" }}
                                            >
                                                <img
                                                    className="w-full h-full object-cover"
                                                    src={item.image}
                                                    alt={item.name}
                                                />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div>
                                                    <h4 className="font-bold uppercase text-sm" style={{ color: C.onSurface }}>
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[10px] mt-1" style={{ color: C.onSurfaceVariant }}>
                                                        QTY: {item.quantity} | SIZE: {item.size || "M"}
                                                    </p>
                                                </div>
                                                <div className="font-black italic" style={{ color: C.primary }}>
                                                    {(item.price * item.quantity).toLocaleString("th-TH")} ฿
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
                                <p className="text-center text-[10px] mt-6 uppercase tracking-widest relative z-10" style={{ color: C.outline }}>
                                    SECURE PAYMENTS BY KINETIC-SHIELD™
                                </p>
                            </div>

                            <div className="p-6 border flex gap-4" style={{ backgroundColor: C.surfaceContainer, borderColor: "rgba(255,255,255,0.05)" }}>
                                <input
                                    className="flex-grow border-b py-2 font-bold uppercase tracking-widest text-sm bg-transparent outline-none"
                                    style={{ borderColor: "rgba(172,137,126,0.3)", color: C.onSurface }}
                                    placeholder="PROMO CODE"
                                    type="text"
                                />
                                <button type="button" className="text-[10px] font-black uppercase hover:underline bg-transparent border-none cursor-pointer" style={{ color: C.primary }}>
                                    APPLY
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </main>
            <Footer />
        </div>
    );
}