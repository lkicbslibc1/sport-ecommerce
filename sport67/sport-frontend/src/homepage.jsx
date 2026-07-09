import React, { useState, useEffect, useRef } from 'react';
import runningBannerImg from './assets/running_banner.png';
import ballSportsBannerImg from './assets/ball_sports_banner.png';
import swimmingBannerImg from './assets/swimming_banner.png';
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
import { ProductProvider } from './data/products.jsx';
import ProductDetails from './shopping/product_details.jsx';

export default function MainPage() {
  return (
    <ProductProvider>
      <MainPageContent />
    </ProductProvider>
  );
}

function MainPageContent() {
  const [activeCategory, setActiveCategory] = useState('men');
  const [currentView, setCurrentView] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gogo_current_user')) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gogo_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gogo_current_user');
    }
  }, [user]);

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('gogo_cart') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gogo_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
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
    alert(`${product.name} has been added to your shopping bag!`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (['running', 'football', 'swimming', 'sport', 'men', 'women', 'kid'].includes(currentView)) {
    return <AllProducts onViewChange={setCurrentView} setSelectedProduct={setSelectedProduct} user={user} setUser={setUser} cart={cart} addToCart={addToCart} initialCategory={currentView} />;
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
    return <GoGoBag onViewChange={setCurrentView} cart={cart} setCart={setCart} user={user} setUser={setUser} />;
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
  if (currentView === 'order_status') {
    return <OrderStatus onViewChange={setCurrentView} user={user} setUser={setUser} cart={cart} selectedOrder={selectedOrder} />;
  }

  return (
    <div className="selection:bg-primary selection:text-white min-h-screen bg-background text-on-background">
      {/* BEGIN: MainHeader */}
      <Navbar setCurrentView={setCurrentView} user={user} setUser={setUser} cart={cart} />
      {/* END: MainHeader */}

      <main className="pt-20">
        {/* BEGIN: HeroSection */}
        <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden">
          <img
            alt="Hero Runner"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvnyX2uWeWErduCcq6jGLNvAq-RdhA4hl5IIkz-m1I1LBulRb10pDPzwKy7v9WoGRbplpUE7SYXWQgnkbPcVCV3od0Wce07Jl7Qo5NaGCSr0NCym_hrURV5Zm5Z0OhmPzQBEFpZsNk3J22mEWjhp58473X49LNl5fuWJzGewGDyzEGlyIBIbWRW6QHoZ7QForMXenC6XFvGMXdJmnZQEfrKfnhemT_5o8Ex3LQEeh6oWmun53HfsPP2Wc4oKZnTxdeaokyLXbjcns"
          />
          <div className="absolute inset-0 hero-gradient flex items-center">
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12 w-full text-white">
              <div className="overflow-hidden mb-6">
                <span className="inline-block bg-primary text-[10px] font-black px-3 py-1 uppercase tracking-widest transform translate-y-0">Hot Release</span>
              </div>
              <h2 className="text-7xl md:text-9xl font-anybody font-black leading-[0.85] italic uppercase tracking-tighter mb-8">
                UNLEASH<br />THE <span className="text-stroke">INNER</span><br />PRO
              </h2>
              <p className="max-w-md text-base text-gray-300 mb-10 leading-relaxed font-light">
                Experience the next generation of high-performance compression gear designed for maximum mobility and endurance.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="bg-primary hover:bg-orange-600 px-12 py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-105">Shop Now</button>
                <button className="bg-transparent border border-white/30 hover:bg-white hover:text-black px-12 py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300">View Lookbook</button>
              </div>
            </div>
          </div>
          {/* Hero Navigation */}
          <div className="absolute bottom-12 right-12 flex items-center gap-6">
            <div className="flex gap-3">
              <div className="w-12 h-[2px] bg-white"></div>
              <div className="w-12 h-[2px] bg-white/20"></div>
              <div className="w-12 h-[2px] bg-white/20"></div>
            </div>
            <span className="font-anybody font-bold text-xs tracking-widest text-white">01 / 03</span>
          </div>
        </section>
        {/* END: HeroSection */}

        {/* BEGIN: CategoryBanners */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 space-y-16">
          <div className="grid grid-cols-1 gap-12">
            {/* Running Banner */}
            <div onClick={() => setCurrentView('running')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Running"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={runningBannerImg}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-12">
                <h3 className="text-white text-5xl md:text-7xl font-anybody font-black italic uppercase tracking-tighter">วิ่ง / RUNNING</h3>
                <div className="mt-6 flex items-center gap-4 text-white font-bold text-xs uppercase tracking-[0.3em] overflow-hidden">
                  <span className="group-hover:translate-x-0 -translate-x-4 transition-transform duration-300">Shop Collection</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Ball Sports Banner */}
            <div onClick={() => setCurrentView('football')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Ball Sports"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={ballSportsBannerImg}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="absolute bottom-12 right-12 text-right">
                <h3 className="text-white text-5xl md:text-7xl font-anybody font-black italic uppercase tracking-tighter">บอล / BALL SPORTS</h3>
                <div className="mt-6 flex items-center justify-end gap-4 text-white font-bold text-xs uppercase tracking-[0.3em]">
                  <span>Explore Gear</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </div>
              </div>
            </div>

            {/* Swimming Banner */}
            <div onClick={() => setCurrentView('swimming')} className="relative h-[450px] group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Swimming"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={swimmingBannerImg}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500"></div>
              <div className="absolute bottom-12 left-12">
                <h3 className="text-white text-5xl md:text-7xl font-anybody font-black italic uppercase tracking-tighter">ว่ายน้ำ / SWIMMING</h3>
                <div className="mt-6 flex items-center gap-4 text-white font-bold text-xs uppercase tracking-[0.3em]">
                  <span>View Performance</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
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
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCategory('men')}
                  className={`font-bold text-[10px] px-8 py-3 uppercase tracking-widest transition-all ${activeCategory === 'men' ? 'bg-primary text-white' : 'glass text-white hover:bg-white/10'
                    }`}
                >
                  Men / ผู้ชาย
                </button>
                <button
                  onClick={() => setActiveCategory('women')}
                  className={`font-bold text-[10px] px-8 py-3 uppercase tracking-widest transition-all ${activeCategory === 'women' ? 'bg-primary text-white' : 'glass text-white hover:bg-white/10'
                    }`}
                >
                  Women / ผู้หญิง
                </button>
                <button
                  onClick={() => setActiveCategory('kids')}
                  className={`font-bold text-[10px] px-8 py-3 uppercase tracking-widest transition-all ${activeCategory === 'kids' ? 'bg-primary text-white' : 'glass text-white hover:bg-white/10'
                    }`}
                >
                  Kids / เด็ก
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Product 1 */}
              <div className="group">
                <div className="aspect-[4/5] bg-[#111] mb-6 relative overflow-hidden flex items-center justify-center p-8 border border-white/5">
                  <img
                    alt="Salomon XT-6"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUvCVnJTx-gEfawY8-FNPOPr00pKOBMvmflTb-xYd8__gKctCW26c1LaYIcCaq16LWFoTHmQpesUOqaqwlpBvKGxnXS2r3WPxFr_SNDjGnYvMXsP7cTh7ubn8ov9wu8eZQM_Cx4TobM4_TmamPyteS3DI3t4NT82KjajcGOYAlOHvaZRixRLMRGNFcI1yr6nghM7n3yF-4XVNs4NZeFiXNPVCZtgbksZCXySqnAF2FS_FNABYcR1gkp_F57g8IsnunmENM-V82bhg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                    </button>
                    <button className="w-12 h-12 glass text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                      <span className="material-symbols-outlined text-[20px]">favorite</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest">XT-6 GORE-TEX (ALL COLORWAYS)</h5>
                  <p className="text-sm font-anybody font-black text-primary italic">8,690.00 ฿ THB</p>
                </div>
              </div>

              {/* Product 2 */}
              <div className="group">
                <div className="aspect-[4/5] bg-[#111] mb-6 relative overflow-hidden flex items-center justify-center p-8 border border-white/5">
                  <img
                    alt="Salomon XA PRO"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvDlfDKJ6M6AvtB8Wjm5TXBYFTejSvC00Mi7xXb-OUwDa-UcgKHj7oSV9zwsF3qbH_XWY4VyD4BRAhk9tejEjV89PiRb6sXZqWA_zWYY2QV-5V3EMwQ7E1IpDtfakV3Q888sH4iyzmC0I0yUdG0fIDz9czCAsdlE5GuFLBtK7zggqqLthgO9Q6u-hCrmuhokAEM9LIj9K-69k7bhZTi8y8T9CHvZ8xUEaiVhPmtcMpaPTUQD84jD_fH7RMVqa-PzS9oOyFwfI6q3Y"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Quick Add</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest">SALOMON XA PRO 3D</h5>
                  <p className="text-sm font-anybody font-black text-primary italic">6,090.00 ฿ THB</p>
                </div>
              </div>

              {/* Product 3 */}
              <div className="group">
                <div className="aspect-[4/5] bg-[#111] mb-6 relative overflow-hidden flex items-center justify-center p-8 border border-white/5">
                  <img
                    alt="Solamphibian"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYC0irg4q1tFBSf5CRVa9CNPvXLRkb34BE5N0qBpo0U5KHttTas2tpwBr4QBoCntDuOVL78tkJDf6Y_nO0Vj86T0_B1L1-I0rIVOmvbBNsUxonKn-JC4x9ImrmcC5_VSgrvnX8cn3KwWUjOWFOKnYc7uZr0yqJjZ0p-iWTyx6dsUz50UahnY-5DFE9bD4KIrquc44L3EcOr8Lo_0aMERQTBsNuRVgVeGao_KYw1k8T-QGI8mu6OKPvKxI-UXQqKrNXu0kuu9BKPjo"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Quick Add</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest">SALOMON SOLAMPHIBIAN</h5>
                  <p className="text-sm font-anybody font-black text-primary italic">5,290.00 ฿ THB</p>
                </div>
              </div>

              {/* Product 4 */}
              <div className="group">
                <div className="aspect-[4/5] bg-[#111] mb-6 relative overflow-hidden flex items-center justify-center p-8 border border-white/5">
                  <img
                    alt="XT-6 White"
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPkmZVK4JCzWO1WtwoD85bsMpwvTPU2P4godiD-X2aDw6oj9A5NX8aIHfikh3YW9QTBrTQaXkYCs7CcEfBm_UHQ-PUFmDQcrMMqOSz7TCK57ILOAGNPi62HfXMpjJ07AWtaAG2eLvuQbBRgz4Dm4ZKyE2TOWG6SJif8kmCvTrmlcPor5tuDMHG8dqXW41wSFig-DpBZaUwscOvwwWLCTiKMOK6V8zUM9A_jxVfL5DWS2E6vruJBnhxmBDPyk-oyWdIx9-3LW2Fzk8"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Quick Add</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-widest">SALOMON XT-6</h5>
                  <p className="text-sm font-anybody font-black text-primary italic">7,790.00 ฿ THB</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* END: TrendingSection */}

        {/* BEGIN: ShopByActivity */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32">
          <div className="flex items-center justify-between mb-16">
            <h4 className="text-4xl font-anybody font-black italic uppercase tracking-tighter">Shop by Activity</h4>
            <div className="h-[1px] flex-grow mx-12 bg-white/10 hidden md:block"></div>
            <a className="text-[10px] font-bold uppercase tracking-[0.3em] hover:text-primary" href="#">View All</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[600px]">
            {/* Gravel */}
            <div className="relative group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Gravel"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwI1BJkcmMfFeHFHjL9hGFa114fWssQJ1ZV1k5-QGR7rvpTnzh0FxWHzIWCzvtKUe8g5bj1mKSgQc-_TBVnbwo4UNJKiU7d1zYk7LiEYmY0RhjPqmnaSiqN984BN4umgnHOME544H71UeP6nzDAb1bvQNwnz8IeI0UcEb-B52roEISKJ6_wr-fdG3byAzSsYMEjZuD_xv2d0veukGDMpG_O9UvnJBBlySpdYWfYHXLKZagrNnpUw4af0NOO0tQ5Kkwpnf-hEDrQEw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-anybody font-black text-lg uppercase tracking-tighter italic">Gravel</span>
              </div>
            </div>

            {/* Trail Running */}
            <div className="relative group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Trail Running"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC--eJwzzF_DIGIN03c_n27fJ28usAuxwfxm9TFLO4XYv0T1x1z92-CjChPdPbyp8RlbsaHFplKVlsOvBMz9FcYpIdTTbPLtC_oE9Ei4rq7ReNJWbpQjFnKUM_3umf3698xYTQrr7hl_tfUum_uxgnmKUiTNFcQm9vqo02KvuR9bqO5XPz3V-XBS3U8tXWVwdk_LLhEau3iC0XB1yEuRAkhhFDSaY3KlZDTOW0KB6VcPYi2hi4jJh0TeAMV6BoxyGegj0l7gIWpp_Y"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-anybody font-black text-lg uppercase tracking-tighter italic">Trail Running</span>
              </div>
            </div>

            {/* Road Running */}
            <div className="relative group cursor-pointer overflow-hidden border border-white/5 md:col-span-1">
              <img
                alt="Road Running"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZhb-q_KAYbqBH6599uwZ6hkkqxYG15hXMpjUOSOXUvI3supurXQp37FA-K-qJLGQF6afWoGFQkFtaZT38aOuUbwQ7eDgyfFTxGt1MdzKxagVWszJ8RPeGu7uvVZlZf8C8h-l4UJ3iclI1WJJKwfrCIjkMf6yEsUTbnBb5BzPcd2-pq78BZgNuz1KjVL7ZH7LO4C76VUImcOFjis3kDaf-FsSiW5ed2dHE1-BnRpk6k2pTgf-qeivmRxQfYoFlsx5Em-UGuiTgIl4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-anybody font-black text-lg uppercase tracking-tighter italic">Road Running</span>
              </div>
            </div>

            {/* Sportstyle */}
            <div className="relative group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Sportstyle"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvWxfAp9lr8iEB7K51T_XKXUg2vlac7IHU8HUFuI6XqzF7NCGXOFDqXCrIMpunWzhRPVsTG8jsNq6bhsJdoAXbw_Fqr9jHN8SIpmY_TXYKe4twX5ns8NW9rYUU7YlCcGHeAyao8bURnrNhPPbtmzJijh5Hg77XouU4T3K-AP9SBeUp_Hc3eYVEQGJQPvCcktUUl5dwBKm578ZFIzL49702ZluC3u5q3gmHV9jvuSw1VIFZ6iKhToVYV2ziANQi4055Z0suzycVYxo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-anybody font-black text-lg uppercase tracking-tighter italic">Sportstyle</span>
              </div>
            </div>

            {/* Outdoor */}
            <div className="relative group cursor-pointer overflow-hidden border border-white/5">
              <img
                alt="Outdoor"
                className="w-full h-full object-cover transition duration-1000 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAQBZiEffmZVFsytTv0jaiwLF3NIN33A2fYhx2hemY0InuMgaGNGf6PyuwVk5wCixk0-qo-Tx53yg85R5Wg7P-ozGfj8hAzeHPXQd0_rZUrPDxdjYe2fjd-jaG8wLMACIRmDIBqIkxXwld2HyfNIEJLQxPALBBfz8rwSdEPqL3iMVsubWuET6inMWwtY8o3xEtWiX7f6RURdzQjq_KZyrP1jIk26z010mCoJ2Ht5ldt5ch_dlNdI6jbMC_CMjdlBw81_x0nThij8Qo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-white font-anybody font-black text-lg uppercase tracking-tighter italic">Outdoor</span>
              </div>
            </div>
          </div>
        </section>
        {/* END: ShopByActivity */}

        {/* BEGIN: BrandsSection */}
        <section className="max-w-[1440px] mx-auto px-6 lg:px-12 py-32 border-t border-white/5">
          <div className="flex items-center justify-between mb-16">
            <h4 className="text-2xl font-anybody font-black italic uppercase tracking-tighter strikethrough-accent">แบรนด์ / BRANDS</h4>
            <a className="text-[10px] font-bold uppercase underline tracking-[0.3em] hover:text-primary transition" href="#">See All</a>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 max-w-3xl mx-auto">
            <div onClick={() => setCurrentView('nike')} className="h-12 w-24 bg-contain bg-center bg-no-repeat grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer" style={{ backgroundImage: "url('/image/nike.png')" }}></div>
            <div onClick={() => setCurrentView('puma')} className="h-12 w-24 bg-contain bg-center bg-no-repeat grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer" style={{ backgroundImage: "url('/image/puma.png')" }}></div>
            <div onClick={() => setCurrentView('adidas')} className="h-12 w-24 bg-contain bg-center bg-no-repeat grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer" style={{ backgroundImage: "url('/image/adidas.png')" }}></div>
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
