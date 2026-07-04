import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../navbar.jsx';

const PRODUCTS = [
  {
    id: 1,
    name: "Gogo Aero-Run V1",
    series: "Racing Series / Hyper-Responsive",
    price: "4,500.00 ฿",
    badge: "Best Seller",
    badgeType: "primary",
    colors: ["bg-primary", "bg-surface-container-highest", "bg-white"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY",
  },
  {
    id: 2,
    name: "Pro Performance Tee",
    series: "Compression Fit / Moisture-Wicking",
    price: "1,250.00 ฿",
    colors: ["bg-surface-container-highest", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn76oCMWziwU-o3V95aYlmHIkqh4LQQ0EP71hXDYfYnTuJ93tofPdZGB5Ad2-C1ZI5CmJKCkhjt_Bgw-HneHBXKWNwJxvTolx9WDIuqcJT2ujt0rkrsilBz0nVV4deckTmoDBoBLjKiGmK-sVJ3MMgQSbcTl7zyEaQnvTi2E_dnK4bYOD9XDYD7Dx0neZNm50TGWa2JeBZ46JqOdC4jXZmcJ5Ft6Gvz6c97j06Izxi9Cc24I-hQeXucQctNrHTPmK19UNZ-zR6xWk",
  },
  {
    id: 3,
    name: "Endurance Flight Shorts",
    series: "Ultra-Lightweight / 5-Inch Inseam",
    price: "1,800.00 ฿",
    badge: "New Arrival",
    badgeType: "tertiary",
    colors: ["bg-primary", "bg-tertiary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVVa5LGRxDJqIDf1aNvUdUZjJwrcK4Z-0HcTkSlHJQzAnvxA1L9cWMwLl5tlYkMoh9NKFAlzlH2WpKKBVSQAnlTWIHIuOpZrMT7TqNZ-IkrKH7AynPTL7pFRpj8ffiJbJAbj2IvUwJuC2nF4zZmmZQhLGapIiLAOEowvajHojGzPDWuuIuxs1yY6Zm_KSnPW8-SyUnAk9c3IgBJITD4hghRR3yiH4UJRZAoJQTfJkFvESJfpQ-hGextcuV4aZFDFnOaDLsIQ0_CPU",
  },
  {
    id: 4,
    name: "Cloud Strike V3",
    series: "Recovery Series / Max Cushioning",
    price: "3,900.00 ฿",
    colors: ["bg-white", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlVYH6ikzf5bxQCYE53SYSRoS5l8txvds81jk9f5Qv3aUhwrb1RQHCwU4nk2NGfVkV0otOrpumXSpPUy_pdwkpSnm6OqCtQexqOFr7RY0-9WxL04JWi9ToIFSRF2BEycoIHT5YQqFgB6Cqzii4O2865S_SHbh-UNtRExTKpxnCcqxGylVP_4NDIKJBVvndJ8PPNA15TQsyqdAZCSq0mRX6_uWICHigPmCIg1rEL1iSn1bMZVwhpZQO5fet7dxOTSmz4Aas8l6VIxY",
  },
  {
    id: 5,
    name: "Elite Grip Socks",
    series: "Anatomical Fit / Zero Blister Tech",
    price: "650.00 ฿",
    colors: ["bg-primary", "bg-secondary"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpTuORnCViF6OIjKpyhLSpFHkEKShjyk2wlpf-5oUQVvQp7EGpllRNoisMKYUo3pl8te_QoyEUQcJQCZITFhtwitZCQ8l5EJz-qQcINXOoDxrMPehLlk7uRB3fkbzjFNkSPiKX7a0gRvi5vGDiiKva8EhVh9yXnLhCBIoEnfeQhQQ3Dlvdi0lr8x5TzsTxXhiliBryHrLpwuhvUPcEruaKAo-i8wp1apxkQAGzYt43FfCV38pbTyrwXzaUt5ic3gW_XsnOr6qcu4",
  },
  {
    id: 6,
    name: "Gogo Pulse Tracker",
    series: "GPS Multisport / Heart Rate Monitoring",
    price: "12,500.00 ฿",
    colors: ["bg-surface-container-highest"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZX6vjb4OdKismLrui_Wv8pVC6izuolQeLiBvkpev0Y7Q1ZQoR2RKRrdG47sh_E-27fPhk92_4FvCiuqr7pJOfm88cF1pWRdJXZX5h2VTjsv9WxdTrwQU9HpdBH3Wus0bBMVcs2_yX_6xTWyRPzHhhCRo0z6OXMSImaceXRMhOjqfsc3D0f_4QDQjoUjbNv6K1J2qG_2dwMknpqUw6B9PKqFeezLgWMwrDyrFpqiH5AwoL7oYG-kIUuwPCuogbbHJOLazQAkFhMs4",
  }
];

export default function Football({ onViewChange }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
      {/* TopNavBar */}
      <Navbar setCurrentView={onViewChange} />

      <main className="max-w-max-width mx-auto px-6 lg:px-12 py-base pt-28">
        {/* Breadcrumbs */}
        <nav className="py-8 flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('home'); }}>Home</a>
          <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
          <a class="hover:text-primary transition-colors" href="#">Men</a>
          
          
        </nav>

        {/* Category Title */}
        <div class="mb-10">
          <h1 className="font-display-lg text-7xl md:text-8xl font-black italic tracking-tighter uppercase text-on-background">
            Men
          </h1>
          <p className="text-on-surface-variant max-w-xl mt-4 font-body-lg font-light leading-relaxed">
            Discover the latest collection of men's apparel, footwear, and accessories. Engineered for performance and style.
          </p>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-white/5 mb-12 gap-gutter">
          <div className="flex items-center gap-8 font-label-sm uppercase tracking-widest text-on-surface">
            <button className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
              Price <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
            </button>
            <button className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
              Collection <span class="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
            </button>
            <button className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
              Size <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
            </button>
            <button className="flex items-center gap-2 font-bold hover:text-primary transition-colors">
              Color <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>expand_more</span>
            </button>
          </div>
          <div className="font-label-sm text-on-surface-variant tracking-widest">
            <span className="font-black text-on-background">36</span> ITEMS FOUND
          </div>
        </div>

        {/* Product Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-gutter mb-24">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="product-card group cursor-pointer flex flex-col">
              <div className="relative overflow-hidden aspect-[4/5] bg-surface-container border border-white/5">
                <img 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  src={product.image} 
                  alt={product.alt} 
                />
                {product.badge && (
                  <div className={`absolute top-4 left-4 ${product.badgeType === 'primary' ? 'bg-primary' : 'bg-tertiary'} text-white font-anybody font-black text-[10px] px-3 py-1 uppercase tracking-widest`}>
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="pt-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  {product.colors.map((color, idx) => (
                    <div key={idx} className={`w-3 h-3 rounded-full ${color} border border-white/10`}></div>
                  ))}
                </div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-background mb-1">{product.name}</h3>
                <p className="font-body-md text-on-surface-variant text-sm mb-4 font-light">{product.series}</p>
                <div className="mt-auto">
                  <p className="font-anybody font-black italic text-primary text-lg mb-4">{product.price}</p>
                  <button className="buy-button w-full py-4 border border-white/20 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center justify-center gap-8 py-16 border-t border-white/5 mb-24">
          <p className="font-anybody font-bold italic tracking-widest uppercase text-on-surface-variant text-xs">
            Page 1 of 12
          </p>
          <button className="flex items-center gap-4 bg-primary text-white px-12 py-5 font-anybody font-black text-sm italic tracking-widest uppercase hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 group">
            Next <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 w-full max-w-max-width mx-auto px-6 lg:px-12 py-32">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display-lg text-3xl text-on-background font-black italic tracking-tighter uppercase mb-8">
              Gogo
            </div>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">
              Engineered for Performance. Elevating athletes since 2020.
            </p>
          </div>
          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background">Shop</h4>
            <ul className="flex flex-col gap-4 text-on-surface-variant text-xs font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">New Arrivals</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Best Sellers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Men's Shoes</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Women's Gear</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background">Help</h4>
            <ul className="flex flex-col gap-4 text-on-surface-variant text-xs font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">Returns &amp; Exchanges</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Size Guide</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Store Locator</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background">About</h4>
            <ul className="flex flex-col gap-4 text-on-surface-variant text-xs font-medium">
              <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Careers</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Sustainability</a></li>
              <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
            </ul>
          </div>
          <div className="space-y-6 col-span-2 lg:col-span-2">
            <h4 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background">Connect</h4>
            <div className="flex gap-4 mb-8">
              <a className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/5" href="#">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>public</span>
              </a>
              <a className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/5" href="#">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>share</span>
              </a>
              <a className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/5" href="#">
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>mail</span>
              </a>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              © 2026 Gogo Athletic.&nbsp;
              <div className="inline-block">Engineered for&nbsp;</div>
              <div className="inline-block">Performance.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
