import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../navbar.jsx';

const COLLECTIONS = ["Nike", "Puma", "Adidas"];
const SIZES = ["S", "M", "L", "XL"];
const COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#e53935" },
  { name: "Blue", hex: "#1e88e5" },
  { name: "Orange", hex: "#fb8c00" },
];

const PRODUCTS = [
  { id: 1, name: "Gogo Aero-Run V1", series: "Racing Series / Hyper-Responsive", price: 4500, brand: "Nike", sizes: ["M","L","XL"], colorNames: ["Orange","Black"], badge: "Best Seller", badgeType: "primary", colors: ["bg-primary","bg-surface-container-highest","bg-white"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTnM-8DY9lYLdkxbB1u6YF0F_XEernIKhjHIViEc8ldLCsZhf-fNZmZhXqL5JWQGpt0zshAUhkv0D9NeJfVGLBOlwtsSvml3hEi7mqzGQSRr5xIW_iY_vX_qLvle52Pze3b-LwdLe5VVWQ_xIkIZSwPNePlUyFkWjQeyAA-vONzbLl7aPxcMXWZtrNvagtkoXWTHC_8KRWaAoUkdmZf9j5ikWe0_4orj6UGhV8afvKO-w-n9D0fjDgED3LeWUmsgWa_5QCUBtizvY" },
  { id: 2, name: "Pro Performance Tee", series: "Compression Fit / Moisture-Wicking", price: 1250, brand: "Adidas", sizes: ["S","M","L"], colorNames: ["Black","Blue"], colors: ["bg-surface-container-highest","bg-secondary"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBn76oCMWziwU-o3V95aYlmHIkqh4LQQ0EP71hXDYfYnTuJ93tofPdZGB5Ad2-C1ZI5CmJKCkhjt_Bgw-HneHBXKWNwJxvTolx9WDIuqcJT2ujt0rkrsilBz0nVV4deckTmoDBoBLjKiGmK-sVJ3MMgQSbcTl7zyEaQnvTi2E_dnK4bYOD9XDYD7Dx0neZNm50TGWa2JeBZ46JqOdC4jXZmcJ5Ft6Gvz6c97j06Izxi9Cc24I-hQeXucQctNrHTPmK19UNZ-zR6xWk" },
  { id: 3, name: "Endurance Flight Shorts", series: "Ultra-Lightweight / 5-Inch Inseam", price: 1800, brand: "Puma", sizes: ["S","M","XL"], colorNames: ["Orange","Red"], badge: "New Arrival", badgeType: "tertiary", colors: ["bg-primary","bg-tertiary"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDVVa5LGRxDJqIDf1aNvUdUZjJwrcK4Z-0HcTkSlHJQzAnvxA1L9cWMwLl5tlYkMoh9NKFAlzlH2WpKKBVSQAnlTWIHIuOpZrMT7TqNZ-IkrKH7AynPTL7pFRpj8ffiJbJAbj2IvUwJuC2nF4zZmmZQhLGapIiLAOEowvajHojGzPDWuuIuxs1yY6Zm_KSnPW8-SyUnAk9c3IgBJITD4hghRR3yiH4UJRZAoJQTfJkFvESJfpQ-hGextcuV4aZFDFnOaDLsIQ0_CPU" },
  { id: 4, name: "Cloud Strike V3", series: "Recovery Series / Max Cushioning", price: 3900, brand: "Nike", sizes: ["M","L"], colorNames: ["White","Blue"], colors: ["bg-white","bg-secondary"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBlVYH6ikzf5bxQCYE53SYSRoS5l8txvds81jk9f5Qv3aUhwrb1RQHCwU4nk2NGfVkV0otOrpumXSpPUy_pdwkpSnm6OqCtQexqOFr7RY0-9WxL04JWi9ToIFSRF2BEycoIHT5YQqFgB6Cqzii4O2865S_SHbh-UNtRExTKpxnCcqxGylVP_4NDIKJBVvndJ8PPNA15TQsyqdAZCSq0mRX6_uWICHigPmCIg1rEL1iSn1bMZVwhpZQO5fet7dxOTSmz4Aas8l6VIxY" },
  { id: 5, name: "Elite Grip Socks", series: "Anatomical Fit / Zero Blister Tech", price: 650, brand: "Puma", sizes: ["S","M","L","XL"], colorNames: ["Orange","Blue"], colors: ["bg-primary","bg-secondary"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCgpTuORnCViF6OIjKpyhLSpFHkEKShjyk2wlpf-5oUQVvQp7EGpllRNoisMKYUo3pl8te_QoyEUQcJQCZITFhtwitZCQ8l5EJz-qQcINXOoDxrMPehLlk7uRB3fkbzjFNkSPiKX7a0gRvi5vGDiiKva8EhVh9yXnLhCBIoEnfeQhQQ3Dlvdi0lr8x5TzsTxXhiliBryHrLpwuhvUPcEruaKAo-i8wp1apxkQAGzYt43FfCV38pbTyrwXzaUt5ic3gW_XsnOr6qcu4" },
  { id: 6, name: "Gogo Pulse Tracker", series: "GPS Multisport / Heart Rate Monitoring", price: 4500, brand: "Puma", sizes: ["M"], colorNames: ["Black"], colors: ["bg-surface-container-highest"], image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZX6vjb4OdKismLrui_Wv8pVC6izuolQeLiBvkpev0Y7Q1ZQoR2RKRrdG47sh_E-27fPhk92_4FvCiuqr7pJOfm88cF1pWRdJXZX5h2VTjsv9WxdTrwQU9HpdBH3Wus0bBMVcs2_yX_6xTWyRPzHhhCRo0z6OXMSImaceXRMhOjqfsc3D0f_4QDQjoUjbNv6K1J2qG_2dwMknpqUw6B9PKqFeezLgWMwrDyrFpqiH5AwoL7oYG-kIUuwPCuogbbHJOLazQAkFhMs4" },
];

function formatPrice(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2 }) + " ฿";
}

function FilterDropdown({ name, label, openFilter, setOpenFilter, activeCount, children }) {
  const isOpen = openFilter === name;
  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpenFilter(isOpen ? null : name)}
        className={`flex items-center gap-2 font-bold hover:text-primary transition-colors ${activeCount > 0 ? "text-primary" : ""}`}
      >
        {label}
        {activeCount > 0 && (
          <span className="bg-primary text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
            {activeCount}
          </span>
        )}
        <span className="material-symbols-outlined transition-transform" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
          expand_more
        </span>
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-3 w-64 bg-surface-container-lowest border border-white/10 shadow-xl p-5 z-30 normal-case tracking-normal">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Football({ onViewChange, user, setUser, cart, addToCart }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [openFilter, setOpenFilter] = useState(null);
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  const toggleValue = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearAll = () => {
    setPriceRange(5000);
    setSelectedCollections([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchPrice = p.price <= priceRange;
      const matchCollection = selectedCollections.length === 0 || selectedCollections.includes(p.brand);
      const matchSize = selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s));
      const matchColor = selectedColors.length === 0 || p.colorNames.some((c) => selectedColors.includes(c));
      return matchPrice && matchCollection && matchSize && matchColor;
    });
  }, [priceRange, selectedCollections, selectedSizes, selectedColors]);

  const activeFilterCount =
    (priceRange < 5000 ? 1 : 0) + selectedCollections.length + selectedSizes.length + selectedColors.length;

  return (
    <div
      className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden selection:bg-primary selection:text-white"
      onClick={() => openFilter && setOpenFilter(null)}
    >
      <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />

      <main className="max-w-max-width mx-auto px-6 lg:px-12 py-base pt-28">
        <nav className="py-8 flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest">
          <a className="hover:text-primary transition-colors" href="#" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('home'); }}>Home</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          
          <span className="text-primary font-black">Men</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-display-lg text-7xl md:text-8xl font-black italic tracking-tighter uppercase text-on-background">Men</h1>
          <p className="text-on-surface-variant max-w-xl mt-4 font-body-lg font-light leading-relaxed">
            Engineered for precision. Built for control. Explore our latest Men's shoes and performance apparel.
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-y border-white/5 mb-12 gap-gutter">
          <div className="flex items-center gap-8 font-label-sm uppercase tracking-widest text-on-surface">
            <FilterDropdown name="price" label="Price" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={priceRange < 5000 ? 1 : 0}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Price range</p>
              <input type="range" min="0" max="5000" step="50" value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-on-surface-variant mt-2 font-medium">
                <span>0 ฿</span>
                <span className="text-primary font-bold">{formatPrice(priceRange)}</span>
              </div>
            </FilterDropdown>

            <FilterDropdown name="collection" label="Collection" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedCollections.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Collection</p>
              <div className="flex flex-col gap-3">
                {COLLECTIONS.map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={selectedCollections.includes(brand)}
                      onChange={() => toggleValue(selectedCollections, setSelectedCollections, brand)} />
                    {brand}
                  </label>
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown name="size" label="Size" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedSizes.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Size</p>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((size) => {
                  const active = selectedSizes.includes(size);
                  return (
                    <button key={size} type="button" onClick={() => toggleValue(selectedSizes, setSelectedSizes, size)}
                      className={`py-2 border text-xs font-bold uppercase transition-colors ${active ? "bg-primary text-white border-primary" : "border-white/20 text-on-surface-variant hover:border-primary hover:text-primary"}`}>
                      {size}
                    </button>
                  );
                })}
              </div>
            </FilterDropdown>

            <FilterDropdown name="color" label="Color" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedColors.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Color</p>
              <div className="flex flex-col gap-3">
                {COLORS.map((c) => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <label key={c.name} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                      <input type="checkbox" className="accent-primary w-4 h-4" checked={active}
                        onChange={() => toggleValue(selectedColors, setSelectedColors, c.name)} />
                      <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c.hex }}></span>
                      {c.name}
                    </label>
                  );
                })}
              </div>
            </FilterDropdown>

            {activeFilterCount > 0 && (
              <button type="button" onClick={clearAll} className="text-xs text-on-surface-variant hover:text-primary transition-colors normal-case tracking-normal font-medium">
                Clear filters
              </button>
            )}
          </div>
          <div className="font-label-sm text-on-surface-variant tracking-widest">
            <span className="font-black text-on-background">{filteredProducts.length}</span> ITEMS FOUND
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-gutter mb-24">
          {filteredProducts.map((product) => (
            <article key={product.id} className="product-card group cursor-pointer flex flex-col">
              <div className="relative overflow-hidden aspect-[4/5] bg-surface-container border border-white/5">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src={product.image} alt={product.name} />
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
                  <p className="font-anybody font-black italic text-primary text-lg mb-4">{formatPrice(product.price)}</p>
                  <button 
                    onClick={() => addToCart && addToCart(product)}
                    className="buy-button w-full py-4 border border-white/20 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] group-hover:bg-primary group-hover:text-white group-hover:border-primary"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-on-surface-variant py-24">No products match your filters.</p>
          )}
        </section>

        <div className="flex flex-col items-center justify-center gap-8 py-16 border-t border-white/5 mb-24">
          <p className="font-anybody font-bold italic tracking-widest uppercase text-on-surface-variant text-xs">Page 1 of 12</p>
          <button className="flex items-center gap-4 bg-primary text-white px-12 py-5 font-anybody font-black text-sm italic tracking-widest uppercase hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 group">
            Next <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>
        </div>
      </main>

      <footer className="bg-surface-container-lowest border-t border-white/5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 w-full max-w-max-width mx-auto px-6 lg:px-12 py-32">
          <div className="col-span-2 lg:col-span-1">
            <div className="font-display-lg text-3xl text-on-background font-black italic tracking-tighter uppercase mb-8">Gogo</div>
            <p className="text-on-surface-variant font-light text-sm leading-relaxed">Engineered for Performance. Elevating athletes since 2020.</p>
          </div>
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
                <span className="material-symbols-outlined text-lg">public</span>
              </a>
              <a className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/5" href="#">
                <span className="material-symbols-outlined text-lg">share</span>
              </a>
              <a className="w-10 h-10 bg-white/5 flex items-center justify-center hover:bg-primary transition-colors border border-white/5" href="#">
                <span className="material-symbols-outlined text-lg">mail</span>
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