import React, { useState, useEffect, useRef } from 'react';
import runningBannerImg from './assets/running_banner1.png';
import ballSportsBannerImg from './assets/ball_sports_banner1.png';
import swimmingBannerImg from './assets/swimming_banner1.png';
import runningHeroBannerImg from './assets/running_hero_banner.png';
import AllProducts from './shopping/all_products.jsx';
import Navbar from './navbar.jsx';
import Dashboard from './admin/dashboard.jsx';
import Login from './login.jsx';
import Nike from './brand/nike.jsx';
import Puma from './brand/puma.jsx';
import Adidas from './brand/adidas.jsx';
import GoGoBag from './bag/gogobag.jsx';
import KineticCheckout from './checkout/KineticCheckout.jsx';
import Profile from './profile/profile.jsx';
import OrderStatus from './profile/OrderStatus.jsx';
import { ProductProvider, useProducts } from './data/products.jsx';
import ProductDetails from './shopping/product_details.jsx';
import { useAlert } from './contexts/AlertContext.jsx';

const HERO_SLIDES = [
  {
    image: runningHeroBannerImg,
    badge: "Hot Release",
    title: "UNLEASH THE INNER PRO",
    description: "Experience the next generation of high-performance compression gear designed for maximum mobility and endurance.",
    buttonText: "Shop Now",
    targetView: "running"
  },
  {
    image: ballSportsBannerImg,
    badge: "Elite Gear",
    title: "DOMINATE THE PITCH",
    description: "Elevate your game with elite football boots and equipment engineered for ultimate speed, control, and precision.",
    buttonText: "Explore Gear",
    targetView: "football"
  },
  {
    image: swimmingBannerImg,
    badge: "Performance Specs",
    title: "BREAK THE SURFACE",
    description: "Dive into speed with hydrodynamic swimwear and high-performance goggles crafted for champion swimmers.",
    buttonText: "View Performance",
    targetView: "swimming"
  }
];

export default function MainPage() {
  return (
    <ProductProvider>
      <MainPageContent />
    </ProductProvider>
  );
}

// Helper: get username for cart storage
const getUsername = (u) => {
  return u?.username || u?.name || 'guest';
};

function MainPageContent() {
  const { showAlert } = useAlert();
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState('men');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gogo_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gogo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gogo_current_user');
    }
  }, [user]);

  const [cart, setCart] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const [orders, setOrders] = useState([]);

  // When user changes (login / logout), load that user's cart from API
  useEffect(() => {
    async function fetchCart() {
      try {
        const username = getUsername(user);
        const res = await fetch('http://localhost:5000/api/cart');
        const allCarts = res.ok ? await res.json() : {};
        const safeAllCarts = Array.isArray(allCarts) ? {} : allCarts;
        setCart(safeAllCarts[username] || []);
        setIsCartLoaded(true);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setCart([]);
        setIsCartLoaded(true);
      }
    }
    setIsCartLoaded(false);
    fetchCart();
  }, [user]);

  // Load orders for trending products calculation
  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    }
    fetchOrders();
  }, []);

  // Calculate trending fashion products based on order count
  const filteredTrendingProducts = React.useMemo(() => {
    // Calculate order count for each product
    const productOrderCount = {};
    
    orders.forEach(order => {
      if (order.status !== 'Cancelled' && order.items) {
        order.items.forEach(item => {
          const productId = item.id || item.sku;
          if (productId) {
            if (!productOrderCount[productId]) {
              productOrderCount[productId] = 0;
            }
            productOrderCount[productId] += item.qty || 1;
          }
        });
      }
    });

    // Create product lookup by id and sku
    const productMap = {};
    (products || []).forEach(p => {
      productMap[p.id] = p;
      if (p.sku) productMap[p.sku] = p;
    });

    // Filter fashion products (clothes) and sort by order count
    return (products || [])
      .filter(product => {
        // Filter by target group
        if (activeCategory === 'men' && product.targetGroup !== 'men') return false;
        if (activeCategory === 'women' && product.targetGroup !== 'women') return false;
        if (activeCategory === 'kids' && product.targetGroup !== 'kid') return false;
        // Filter only fashion products (clothes)
        return product.productType === 'clothes';
      })
      .map(product => ({
        ...product,
        orderCount: productOrderCount[product.id] || productOrderCount[product.sku] || 0
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 4);
  }, [products, orders, activeCategory]);

  // Save cart to the global cart object under current user's name
  useEffect(() => {
    if (!isCartLoaded) return;
    async function saveCart() {
      try {
        const username = getUsername(user);
        const res = await fetch('http://localhost:5000/api/cart');
        const allCarts = res.ok ? await res.json() : {};
        const safeAllCarts = Array.isArray(allCarts) ? {} : allCarts;
        safeAllCarts[username] = cart;
        await fetch('http://localhost:5000/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(safeAllCarts)
        });
      } catch (e) {
        console.error("Failed to save cart:", e);
      }
    }
    saveCart();
  }, [cart, user, isCartLoaded]);

  const addToCart = (product, quantity = 1) => {
    if (!user) {
      showAlert("กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อสินค้า (Please login to add items to your bag)", "warning");
      setCurrentView('login');
      return;
    }
    setCart(prevCart => {
      // Use custom cartId if provided (to differentiate colors/sizes), otherwise fallback to product.id
      const cartId = product.cartId || product.id;
      const existingItem = prevCart.find(item => (item.cartId || item.id) === cartId);
      if (existingItem) {
        return prevCart.map(item =>
          (item.cartId || item.id) === cartId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity, cartId }];
    });
    showAlert(`${product.name} has been added to your shopping bag!`, "success");
  };

  useEffect(() => {
    if (window.location.hash !== `#${currentView}`) {
      window.history.pushState(null, '', `#${currentView}`);
    }
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    const handlePopState = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentView(hash || 'home');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (user && (user.role === 'manager' || user.role === 'employee') && currentView !== 'dashboard') {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  const baseView = currentView.split('-')[0];

  if (user && (user.role === 'manager' || user.role === 'employee')) {
    return <Dashboard onViewChange={setCurrentView} user={user} setUser={setUser} />;
  }

  if (['running', 'football', 'swimming', 'sport', 'men', 'women', 'kid', 'brand'].includes(baseView)) {
    const subCategory = currentView.includes('-') ? currentView.split('-')[1] : null;
    return <AllProducts onViewChange={setCurrentView} setSelectedProduct={setSelectedProduct} user={user} setUser={setUser} cart={cart} addToCart={addToCart} initialCategory={baseView} initialSubCategory={subCategory} />;
  }
  if (currentView === 'product_details' && selectedProduct) {
    return <ProductDetails onViewChange={setCurrentView} product={selectedProduct} user={user} setUser={setUser} cart={cart} addToCart={addToCart} />;
  }
  if (currentView === 'dashboard') {
    if (!user || user.role === 'customer' || user.role === 'user') {
      setCurrentView('home');
      return null;
    }
    return <Dashboard onViewChange={setCurrentView} user={user} />;
  }
  if (currentView === 'login') {
    return <Login onViewChange={setCurrentView} user={user} setUser={setUser} />;
  }
  if (currentView === 'nike') {
    return <Nike onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} addToCart={addToCart} />;
  }
  if (currentView === 'puma') {
    return <Puma onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} addToCart={addToCart} />;
  }
  if (currentView === 'adidas') {
    return <Adidas onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} addToCart={addToCart} />;
  }
  if (currentView === 'bag') {
    return <GoGoBag onViewChange={setCurrentView} cart={cart} setCart={setCart} user={user} setUser={setUser} setSelectedProduct={setSelectedProduct} />;
  }
  if (currentView === 'checkout') {
    return <KineticCheckout onViewChange={setCurrentView} cart={cart} setCart={setCart} user={user} setUser={setUser} />;
  }
  if (currentView === 'profile') {
    if (!user) {
      setCurrentView('home');
      return null;
    }
    return <Profile onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} addToCart={addToCart} setSelectedOrder={setSelectedOrder} />;
  }
  if (currentView.startsWith('order_status')) {
    const orderId = currentView.replace('order_status-', '');
    const finalOrderId = orderId === 'order_status' ? null : orderId;
    return <OrderStatus onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} orderId={finalOrderId} />;
  }

  return (
    <div className="selection:bg-primary selection:text-white min-h-screen bg-background text-on-background">
      {/* BEGIN: MainHeader */}
      <Navbar setCurrentView={setCurrentView} user={user} setUser={setUser} cart={cart} />
      {/* END: MainHeader */}

      <main className="pt-20">
        {/* BEGIN: HeroSection */}
        <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden hero-slider-container bg-black">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={idx}
              className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <img
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover hero-slide-img"
                src={slide.image}
              />
              <div className="absolute inset-0 hero-gradient flex items-center">
                <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-white">
                  <div className="overflow-hidden mb-6">
                    <span className="inline-block bg-primary text-[10px] font-black px-3 py-1 uppercase tracking-widest animate-slide-up-fade">
                      {slide.badge}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-8xl lg:text-9xl font-anybody font-black leading-[0.85] italic uppercase tracking-tighter mb-8 animate-slide-up-fade delay-150">
                    {slide.title.includes('INNER') ? (
                      <>
                        UNLEASH<br />THE <span className="text-stroke">INNER</span><br />PRO
                      </>
                    ) : slide.title.includes('PITCH') ? (
                      <>
                        DOMINATE<br />THE <span className="text-stroke">ELITE</span><br />PITCH
                      </>
                    ) : (
                      <>
                        BREAK<br />THE <span className="text-stroke">DEEP</span><br />SURFACE
                      </>
                    )}
                  </h2>
                  <p className="max-w-md text-base text-gray-300 mb-10 leading-relaxed font-light animate-slide-up-fade delay-300">
                    {slide.description}
                  </p>
                  <div className="flex flex-wrap gap-6 animate-slide-up-fade delay-450">
                    <button
                      onClick={() => setCurrentView(slide.targetView)}
                      className="bg-primary hover:bg-orange-600 px-12 py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-105"
                    >
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-primary/80 border border-white/10 text-white transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 hover:bg-primary/80 border border-white/10 text-white transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Hero Navigation Indicator */}
          <div className="absolute bottom-12 right-6 lg:right-12 z-20 flex items-center gap-6">
            <div className="flex gap-3">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-[3px] transition-all duration-500 cursor-pointer ${idx === currentSlide ? 'w-16 bg-primary' : 'w-8 bg-white/30 hover:bg-white/60'
                    }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="font-anybody font-bold text-xs tracking-widest text-white">
              0{currentSlide + 1} / 0{HERO_SLIDES.length}
            </span>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: CategoryBanners */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 space-y-16">
          <div className="grid grid-cols-1 gap-12">
            {/* Running Banner */}
            <div onClick={() => setCurrentView('running')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500">
              <img
                alt="Running"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={runningBannerImg}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent group-hover:via-black/30 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-12 transition-all duration-500 max-w-[90%] md:max-w-md">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 drop-shadow-md">High Endurance</span>
                <h3 className="text-white text-4xl md:text-6xl font-anybody font-black italic uppercase tracking-tighter leading-none mb-4 drop-shadow-lg">วิ่ง / RUNNING</h3>
                <div className="flex items-center gap-4 text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden">
                  <span className="group-hover:text-primary transition-colors duration-300 drop-shadow-md">Shop Collection</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300 drop-shadow-md">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Ball Sports Banner */}
            <div onClick={() => setCurrentView('football')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500">
              <img
                alt="Ball Sports"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={ballSportsBannerImg}
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-black/90 via-black/40 to-transparent group-hover:via-black/30 transition-all duration-500"></div>
              <div className="absolute bottom-12 right-12 p-2 text-right transition-all duration-500 max-w-[90%] md:max-w-md">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 drop-shadow-md">Speed & Control</span>
                <h3 className="text-white text-4xl md:text-6xl font-anybody font-black italic uppercase tracking-tighter leading-none mb-4 drop-shadow-lg">บอล / BALL SPORTS</h3>
                <div className="flex items-center justify-end gap-4 text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden">
                  <span className="group-hover:text-primary transition-colors duration-300 drop-shadow-md">Explore Gear</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300 drop-shadow-md">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Swimming Banner */}
            <div onClick={() => setCurrentView('swimming')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500">
              <img
                alt="Swimming"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={swimmingBannerImg}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/40 to-transparent group-hover:via-black/30 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-12 transition-all duration-500 max-w-[90%] md:max-w-md">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-2 drop-shadow-md">Aquatic Power</span>
                <h3 className="text-white text-4xl md:text-6xl font-anybody font-black italic uppercase tracking-tighter leading-none mb-4 drop-shadow-lg">ว่ายน้ำ / SWIMMING</h3>
                <div className="flex items-center gap-4 text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden">
                  <span className="group-hover:text-primary transition-colors duration-300 drop-shadow-md">View Performance</span>
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform duration-300 drop-shadow-md">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: CategoryBanners */}

        {/* BEGIN: TrendingSection */}
        <section className="bg-surface-container py-32">
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
              <div>
                <h4 className="text-4xl md:text-6xl font-anybody font-black italic uppercase tracking-tighter strikethrough-accent inline-block">แฟชั่นที่กำลังเป็นที่นิยม</h4>
                <p className="text-on-surface-variant mt-4 text-sm font-light tracking-wide">TRENDING PERFORMANCE FOOTWEAR &amp; APPAREL</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCategory('men')}
                  className={`font-bold text-[10px] px-8 py-3.5 uppercase tracking-widest trending-tab-pill ${activeCategory === 'men' ? 'active text-white' : 'glass text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Men / ผู้ชาย
                </button>
                <button
                  onClick={() => setActiveCategory('women')}
                  className={`font-bold text-[10px] px-8 py-3.5 uppercase tracking-widest trending-tab-pill ${activeCategory === 'women' ? 'active text-white' : 'glass text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Women / ผู้หญิง
                </button>
                <button
                  onClick={() => setActiveCategory('kids')}
                  className={`font-bold text-[10px] px-8 py-3.5 uppercase tracking-widest trending-tab-pill ${activeCategory === 'kids' ? 'active text-white' : 'glass text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Kids / เด็ก
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredTrendingProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentView('product_details');
                  }}
                  className="group cursor-pointer premium-border-hover border border-white/5 bg-surface-container p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/5] bg-black/40 mb-6 relative overflow-hidden flex items-center justify-center p-6 border border-white/5">
                      <img
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                        src={product.image}
                      />
                      <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="w-full py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          Quick Add
                        </button>
                        <button
                          className="w-full py-3 bg-transparent border border-white/20 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                    <h5 className="text-xs font-bold uppercase tracking-widest line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors duration-300">{product.name}</h5>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-anybody font-black text-primary italic">
                        {product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })} ฿ THB
                      </p>
                      {product.orderCount > 0 && (
                        <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                          สั่งซื้อแล้ว {product.orderCount.toLocaleString("th-TH")} ชิ้น
                        </p>
                      )}
                    </div>
                    <span className="material-symbols-outlined text-sm text-gray-500 group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
                </div>
              ))}
              {filteredTrendingProducts.length === 0 && (
                <p className="col-span-full text-center text-on-surface-variant py-12">
                  ไม่มีสินค้าในหมวดหมู่นี้ (No products in this category)
                </p>
              )}
            </div>
          </div>
        </section>
        {/* END: TrendingSection */}

        {/* BEGIN: ShopByApparel */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-primary font-anybody font-black text-xs uppercase tracking-[0.3em] block mb-2">EXPLORE CATEGORIES</span>
              <h4 className="text-4xl lg:text-5xl font-anybody font-black italic uppercase tracking-tighter text-white">Shop by Apparel</h4>
            </div>
            <div className="h-[1px] flex-grow mx-12 bg-white/10 hidden md:block"></div>
            <button 
              onClick={() => setCurrentView('sport')} 
              className="text-xs font-anybody font-bold uppercase tracking-[0.3em] text-white/70 hover:text-primary transition-colors flex items-center gap-2"
            >
              View All Apparel <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 h-auto md:h-[580px]">
            {/* Top */}
            <div 
              onClick={() => setCurrentView('sport-top')} 
              className="relative h-[280px] md:h-full group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-surface-container-low transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <img
                alt="Top"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                src="image/top.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                <span className="text-[10px] font-anybody font-black tracking-widest text-primary uppercase">01 / APPAREL</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                <h5 className="text-2xl lg:text-3xl font-anybody font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-primary transition-colors duration-300">
                  Top
                </h5>
                <p className="text-[11px] text-white/60 font-medium mb-3">เสื้อกีฬา / Tops & Tees</p>
                <div className="flex items-center gap-1.5 text-[10px] font-anybody font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div 
              onClick={() => setCurrentView('sport-bottom')} 
              className="relative h-[280px] md:h-full group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-surface-container-low transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <img
                alt="Bottom"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                src="image/bottom.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                <span className="text-[10px] font-anybody font-black tracking-widest text-primary uppercase">02 / APPAREL</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                <h5 className="text-2xl lg:text-3xl font-anybody font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-primary transition-colors duration-300">
                  Bottom
                </h5>
                <p className="text-[11px] text-white/60 font-medium mb-3">กางเกงกีฬา / Shorts & Pants</p>
                <div className="flex items-center gap-1.5 text-[10px] font-anybody font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Shoes */}
            <div 
              onClick={() => setCurrentView('sport-shoes')} 
              className="relative h-[280px] md:h-full group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-surface-container-low transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <img
                alt="Shoes"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                src="https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/if_w_gt_800,w_800/global_fw26_adizero_evo_sl_running_fw26_sustain_evo_sl_zip_hp_mw_card_teaser_d_35108ec2d0.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                <span className="text-[10px] font-anybody font-black tracking-widest text-primary uppercase">03 / APPAREL</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                <h5 className="text-2xl lg:text-3xl font-anybody font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-primary transition-colors duration-300">
                  Shoes
                </h5>
                <p className="text-[11px] text-white/60 font-medium mb-3">รองเท้ากีฬา / Footwear</p>
                <div className="flex items-center gap-1.5 text-[10px] font-anybody font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Hat */}
            <div 
              onClick={() => setCurrentView('sport-hat')} 
              className="relative h-[280px] md:h-full group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-surface-container-low transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <img
                alt="Hat"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8rfrlpqn4qhvV3faLLDTEIMS5w97qGp7vMQ74qfYnCLWcaah5kmiEUrgv&s=10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                <span className="text-[10px] font-anybody font-black tracking-widest text-primary uppercase">04 / APPAREL</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                <h5 className="text-2xl lg:text-3xl font-anybody font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-primary transition-colors duration-300">
                  Hat
                </h5>
                <p className="text-[11px] text-white/60 font-medium mb-3">หมวกกีฬา / Caps & Headwear</p>
                <div className="flex items-center gap-1.5 text-[10px] font-anybody font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Sock */}
            <div 
              onClick={() => setCurrentView('sport-sock')} 
              className="relative h-[280px] md:h-full group cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-surface-container-low transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.25)]"
            >
              <img
                alt="Sock"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                src="image/sock.png"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500"></div>
              
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
                <span className="text-[10px] font-anybody font-black tracking-widest text-primary uppercase">05 / APPAREL</span>
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex flex-col justify-end">
                <h5 className="text-2xl lg:text-3xl font-anybody font-black italic uppercase tracking-tighter text-white mb-1 group-hover:text-primary transition-colors duration-300">
                  Sock
                </h5>
                <p className="text-[11px] text-white/60 font-medium mb-3">ถุงเท้ากีฬา / Socks & Accessories</p>
                <div className="flex items-center gap-1.5 text-[10px] font-anybody font-black uppercase tracking-widest text-white group-hover:text-primary transition-colors">
                  <span>Shop Now</span>
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform duration-300">arrow_forward</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: ShopByApparel */}

        {/* BEGIN: BrandsSection */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-primary font-anybody font-black text-xs uppercase tracking-[0.3em] block mb-2">OFFICIAL PARTNERS</span>
              <h4 className="text-3xl lg:text-4xl font-anybody font-black italic uppercase tracking-tighter text-white">แบรนด์ / BRANDS</h4>
            </div>
            <button 
              onClick={() => setCurrentView('brand')} 
              className="text-xs font-anybody font-bold uppercase tracking-[0.3em] text-white/70 hover:text-primary transition-colors flex items-center gap-2"
            >
              See All Brands <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Nike */}
            <div 
              onClick={() => setCurrentView('brand-nike')} 
              className="group cursor-pointer bg-surface-container-low/60 border border-white/10 hover:border-primary/50 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,0,0.2)] backdrop-blur-md"
            >
              <div 
                className="h-24 md:h-28 w-40 md:w-48 bg-contain bg-center bg-no-repeat transition-all duration-500 filter invert brightness-200 opacity-90 group-hover:opacity-100 group-hover:scale-110" 
                style={{ backgroundImage: "url('/image/nike.png')" }}
              ></div>
              <span className="font-anybody font-black text-sm uppercase tracking-widest text-white/70 group-hover:text-primary transition-colors">Nike</span>
            </div>

            {/* Puma */}
            <div 
              onClick={() => setCurrentView('brand-puma')} 
              className="group cursor-pointer bg-surface-container-low/60 border border-white/10 hover:border-primary/50 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,0,0.2)] backdrop-blur-md"
            >
              <div 
                className="h-24 md:h-28 w-40 md:w-48 bg-contain bg-center bg-no-repeat transition-all duration-500 filter invert brightness-200 opacity-90 group-hover:opacity-100 group-hover:scale-110" 
                style={{ backgroundImage: "url('/image/puma.png')" }}
              ></div>
              <span className="font-anybody font-black text-sm uppercase tracking-widest text-white/70 group-hover:text-primary transition-colors">Puma</span>
            </div>

            {/* Adidas */}
            <div 
              onClick={() => setCurrentView('brand-adidas')} 
              className="group cursor-pointer bg-surface-container-low/60 border border-white/10 hover:border-primary/50 rounded-2xl p-10 flex flex-col items-center justify-center gap-6 transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,0,0.2)] backdrop-blur-md"
            >
              <div 
                className="h-24 md:h-28 w-40 md:w-48 bg-contain bg-center bg-no-repeat transition-all duration-500 filter invert brightness-200 opacity-90 group-hover:opacity-100 group-hover:scale-110" 
                style={{ backgroundImage: "url('/image/adidas.png')" }}
              ></div>
              <span className="font-anybody font-black text-sm uppercase tracking-widest text-white/70 group-hover:text-primary transition-colors">Adidas</span>
            </div>
          </div>
        </section>
        {/* END: BrandsSection */}
      </main>

      {/* BEGIN: MainFooter */}
      <footer className="bg-surface-container-lowest pt-32 pb-16 border-t border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 mb-32">
            {/* Products */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Products</h5>
              <ul className="space-y-4 text-on-surface-variant text-xs font-medium">
                <li><a className="hover:text-primary transition-colors" href="#">Shoes</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Clothing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">New Arrivals</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Brand Exclusives</a></li>
              </ul>
            </div>

            {/* Sports */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Sports</h5>
              <ul className="space-y-4 text-on-surface-variant text-xs font-medium">
                <li><a className="hover:text-primary transition-colors" href="#">Running</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Football</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Swimming</a></li>
              </ul>
            </div>

            {/* Collections */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Collections</h5>
              <ul className="space-y-4 text-on-surface-variant text-xs font-medium">
                <li><a className="hover:text-primary transition-colors" href="#">Summer 2026</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Spring Training</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Company</h5>
              <ul className="space-y-4 text-on-surface-variant text-xs font-medium">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">News</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Support</h5>
              <ul className="space-y-4 text-on-surface-variant text-xs font-medium">
                <li><a className="hover:text-primary transition-colors" href="#">Customer Service</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Store Finder</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Size Guide</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Payment</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Returns &amp; Refunds</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Promotions</a></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-6">
              <h5 className="font-anybody font-black text-sm uppercase tracking-widest">Contact Us</h5>
              <div className="flex flex-wrap gap-4">
                <a className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">public</span>
                </a>
                <a className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">alternate_email</span>
                </a>
                <a className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">share</span>
                </a>
                <a className="w-8 h-8 bg-white/10 flex items-center justify-center hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">chat</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <h1 className="text-2xl font-anybody font-black italic tracking-tighter uppercase">gogo</h1>
            <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
              © 2026 gogo sports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}
