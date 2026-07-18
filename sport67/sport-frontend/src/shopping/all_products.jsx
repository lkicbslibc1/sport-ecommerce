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
  { name: "Yellow", hex: "#eeff00ff" },
];

const TARGET_GROUPS = [
  { id: 'men', label: 'Men' },
  { id: 'women', label: 'Women' },
  { id: 'kid', label: 'Kids' }
];

const SPORTS = ["Running", "Football", "Swimming"];
const CLOTHES_TYPES = ["top", "bottom", "shoes", "hat", "sock"];
const PRODUCT_TYPES = ["clothes", "equipment"];

import { useProducts, getStoredReviews, getColorStyle } from '../data/products.jsx';

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

export default function AllProducts({ onViewChange, setSelectedProduct, user, setUser, cart, addToCart, initialCategory, initialSubCategory }) {
  const { products } = useProducts();
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    async function fetchReviews() {
      const data = await getStoredReviews();
      if (data) setReviews(data);
    }
    fetchReviews();
    window.scrollTo(0, 0);
  }, [initialCategory]);

  const getProductRating = (productId) => {
    const productReviews = reviews[productId];
    if (!productReviews || productReviews.length === 0) return { avg: 0, count: 0 };
    const avg = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
    return { avg, count: productReviews.length };
  };

  const [openFilter, setOpenFilter] = useState(null);
  const [priceRange, setPriceRange] = useState(100000);
  const [selectedCollections, setSelectedCollections] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedTargetGroups, setSelectedTargetGroups] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedProductTypes, setSelectedProductTypes] = useState(PRODUCT_TYPES);
  const [selectedClothesTypes, setSelectedClothesTypes] = useState(CLOTHES_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const toggleValue = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const clearAll = () => {
    setPriceRange(100000);
    setSelectedCollections([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedTargetGroups([]);
    setSelectedSports([]);
    setSelectedProductTypes(PRODUCT_TYPES);
    setSelectedClothesTypes(CLOTHES_TYPES);
    setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    setSelectedTargetGroups([]);
    setSelectedSports([]);
    setSelectedProductTypes(PRODUCT_TYPES);
    setSelectedClothesTypes(CLOTHES_TYPES);
    setSearchQuery('');
    setCurrentPage(1);
    
    if (initialCategory) {
      if (['men', 'women', 'kid'].includes(initialCategory)) {
        setSelectedTargetGroups([initialCategory]);
      } else if (['running', 'football', 'swimming'].includes(initialCategory)) {
        const sport = initialCategory.charAt(0).toUpperCase() + initialCategory.slice(1);
        setSelectedSports([sport]);
      } else if (initialCategory === 'brand' && initialSubCategory) {
        const brand = initialSubCategory.charAt(0).toUpperCase() + initialSubCategory.slice(1);
        setSelectedCollections([brand]);
      }
    }

    if (initialCategory === 'brand') {
      setSelectedProductTypes(PRODUCT_TYPES);
      setSelectedClothesTypes(CLOTHES_TYPES);
    } else if (initialSubCategory) {
      if (initialSubCategory === 'equipment') {
        setSelectedProductTypes(['equipment']);
        setSelectedClothesTypes(CLOTHES_TYPES);
      } else {
        setSelectedProductTypes(['clothes']);
        setSelectedClothesTypes([initialSubCategory]);
      }
    } else {
      setSelectedProductTypes(PRODUCT_TYPES);
      setSelectedClothesTypes(CLOTHES_TYPES);
    }
  }, [initialCategory, initialSubCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, selectedCollections, selectedSizes, selectedColors, selectedTargetGroups, selectedSports, selectedProductTypes, selectedClothesTypes, searchQuery]);

  // Show all products without targetGroup filter
  const categoryProducts = useMemo(() => {
    return products;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((p) => {
      const matchPrice = p.price <= priceRange;
      const matchCollection = selectedCollections.length === 0 || selectedCollections.includes(p.brand);
      const matchSize = selectedSizes.length === 0 || p.sizes.some((s) => selectedSizes.includes(s));
      const matchColor = selectedColors.length === 0 || p.colorNames.some((c) => selectedColors.includes(c));
      const matchTargetGroup = selectedTargetGroups.length === 0 || selectedTargetGroups.includes(p.targetGroup);
      const matchSport = selectedSports.length === 0 || selectedSports.includes(p.sportType);
      const matchProductType = selectedProductTypes.includes(p.productType);
      const matchClothesType = p.productType !== 'clothes' || selectedClothesTypes.includes(p.clothesType);
      const searchLower = searchQuery.toLowerCase();
      const matchSearch = searchQuery === '' ||
        (p.name || '').toLowerCase().includes(searchLower) ||
        (p.series || '').toLowerCase().includes(searchLower) ||
        (p.brand || '').toLowerCase().includes(searchLower);
      return matchPrice && matchCollection && matchSize && matchColor && matchTargetGroup && matchSport && matchProductType && matchClothesType && matchSearch;
    });
  }, [categoryProducts, priceRange, selectedCollections, selectedSizes, selectedColors, selectedTargetGroups, selectedSports, selectedProductTypes, selectedClothesTypes, searchQuery]);

  const activeFilterCount =
    (priceRange < 100000 ? 1 : 0) + selectedCollections.length + selectedSizes.length + selectedColors.length + selectedTargetGroups.length + selectedSports.length + (selectedProductTypes.length < PRODUCT_TYPES.length ? 1 : 0) + (selectedClothesTypes.length < CLOTHES_TYPES.length ? 1 : 0) + (searchQuery ? 1 : 0);

  const pageTitle = useMemo(() => {
    let titleParts = [];

    if (selectedTargetGroups.length > 0) {
      const tgLabels = selectedTargetGroups.map(id => {
        const tg = TARGET_GROUPS.find(g => g.id === id);
        return tg ? tg.label : id;
      });
      titleParts.push(tgLabels.join(' & '));
    }

    if (selectedSports.length > 0) {
      if (selectedSports.length === SPORTS.length) {
        titleParts.push("All Sports");
      } else {
        titleParts.push(selectedSports.join(' & '));
      }
    }

    if (titleParts.length === 2) {
      let genderPart = titleParts[0];
      if (genderPart.endsWith('s')) {
        genderPart += "'";
      } else {
        genderPart += "'s";
      }
      return `${genderPart} ${titleParts[1]}`;
    } else if (titleParts.length === 1) {
      return titleParts[0];
    }
    
    return "All Sports";
  }, [selectedTargetGroups, selectedSports]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

          <span className="text-primary font-black">{pageTitle}</span>
        </nav>

        <div className="mb-10">
          <h1 className="font-display-lg text-7xl md:text-8xl font-black italic tracking-tighter uppercase text-on-background">{pageTitle}</h1>
          <p className="text-on-surface-variant max-w-xl mt-4 font-body-lg font-light leading-relaxed mb-10">
            Engineered for precision. Built for control. Explore our complete collection of high-performance gear.
          </p>

          {/* Large Search Bar */}
          <div className="relative group w-full">
            <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-white/40 text-3xl group-focus-within:text-primary transition-colors">search</span>
            <input
              type="text"
              placeholder="SEARCH PRODUCTS, SERIES, OR BRANDS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container border border-white/10 pl-20 pr-8 py-6 text-xl md:text-2xl font-anybody font-black italic uppercase tracking-tighter text-white placeholder:text-white/20 focus:border-primary focus:bg-white/5 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-b border-white/5 mb-12 gap-gutter">
          <div className="flex items-center gap-8 font-label-sm uppercase tracking-widest text-on-surface">
            <FilterDropdown name="price" label="Price" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={priceRange < 100000 ? 1 : 0}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Price range</p>
              <input type="range" min="0" max="100000" step="50" value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-on-surface-variant mt-2 font-medium">
                <span>0 ฿</span>
                <span className="text-primary font-bold">{formatPrice(priceRange)}</span>
              </div>
            </FilterDropdown>

            <FilterDropdown name="gender" label="Gender" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedTargetGroups.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Gender</p>
              <div className="flex flex-col gap-3">
                {TARGET_GROUPS.map((tg) => (
                  <label key={tg.id} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={selectedTargetGroups.includes(tg.id)}
                      onChange={() => toggleValue(selectedTargetGroups, setSelectedTargetGroups, tg.id)} />
                    {tg.label}
                  </label>
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown name="sport" label="Sport" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedSports.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Sport</p>
              <div className="flex flex-col gap-3">
                {SPORTS.map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={selectedSports.includes(s)}
                      onChange={() => toggleValue(selectedSports, setSelectedSports, s)} />
                    {s}
                  </label>
                ))}
              </div>
            </FilterDropdown>

            <FilterDropdown name="type" label="Type" openFilter={openFilter} setOpenFilter={setOpenFilter} activeCount={selectedProductTypes.length + selectedClothesTypes.length}>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Product Type</p>
              <div className="flex flex-col gap-3 mb-6">
                {PRODUCT_TYPES.map((pt) => (
                  <label key={pt} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={selectedProductTypes.includes(pt)}
                      onChange={() => toggleValue(selectedProductTypes, setSelectedProductTypes, pt)} />
                    {pt === 'clothes' ? 'Clothes' : 'Equipment'}
                  </label>
                ))}
              </div>
              <p className="font-anybody font-black text-xs uppercase tracking-widest mb-4 text-on-background">Clothes Type</p>
              <div className="flex flex-col gap-3">
                {CLOTHES_TYPES.map((ct) => (
                  <label key={ct} className="flex items-center gap-3 cursor-pointer text-sm text-on-surface-variant hover:text-on-background">
                    <input type="checkbox" className="accent-primary w-4 h-4" checked={selectedClothesTypes.includes(ct)}
                      onChange={() => {
                        toggleValue(selectedClothesTypes, setSelectedClothesTypes, ct);
                        if (!selectedClothesTypes.includes(ct)) {
                          setSelectedProductTypes(prev => prev.includes('clothes') ? prev : [...prev, 'clothes']);
                        }
                      }} />
                    {ct.charAt(0).toUpperCase() + ct.slice(1)}
                  </label>
                ))}
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
          <div className="font-label-sm text-on-surface-variant tracking-widest mt-4 md:mt-0">
            <span className="font-black text-on-background">{filteredProducts.length}</span> ITEMS FOUND
          </div>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-16 gap-x-6 mb-24">
          {currentProducts.map((product) => (
            <article key={product.id} onClick={() => { if (setSelectedProduct) setSelectedProduct(product); if (onViewChange) onViewChange('product_details'); }} className="product-card group cursor-pointer flex flex-col">
              <div className="relative overflow-hidden aspect-square bg-surface-container border border-white/5">
                <img className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700" src={product.image} alt={product.name} />
                {product.badge && (
                  <div className={`absolute top-4 left-4 ${product.badgeType === 'primary' ? 'bg-primary' : 'bg-tertiary'} text-white font-anybody font-black text-[10px] px-3 py-1 uppercase tracking-widest`}>
                    {product.badge}
                  </div>
                )}
              </div>
              <div className="pt-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  {product.colors.map((color, idx) => (
                    <div key={idx} className={`w-3 h-3 rounded-full ${color} border border-white/10`} style={getColorStyle(color)}></div>
                  ))}
                </div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-on-background mb-1">{product.name}</h3>
                <p className="font-body-md text-on-surface-variant text-sm mb-2 font-light">{product.series}</p>
                
                <div className="flex items-center gap-1 mb-4">
                  <span className="material-symbols-outlined text-[14px] text-orange-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold text-on-background">{getProductRating(product.id).avg.toFixed(1)}</span>
                  <span className="text-[10px] text-on-surface-variant ml-1">({getProductRating(product.id).count})</span>
                </div>

                <div className="mt-auto flex justify-between items-end">
                  <p className="font-anybody font-black italic text-primary text-lg mb-4">{formatPrice(product.price)}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mb-4">
                    {product.amount > 0 ? `${product.amount} Left` : <span className="text-[#ffb4ab]">Out of Stock</span>}
                  </p>
                </div>
              </div>
            </article>
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-center text-on-surface-variant py-24">No products match your filters.</p>
          )}
        </section>

        <div className="flex flex-col items-center justify-center gap-8 py-16 border-t border-white/5 mb-24">
          <p className="font-anybody font-bold italic tracking-widest uppercase text-on-surface-variant text-xs">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`flex items-center gap-4 px-8 py-4 font-anybody font-black text-sm italic tracking-widest uppercase transition-all duration-300 transform group ${currentPage === 1 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-transparent border border-white/20 text-white hover:bg-white hover:text-black hover:scale-105'}`}>
              <span className="material-symbols-outlined group-hover:-translate-x-2 transition-transform">arrow_back</span> Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`flex items-center gap-4 px-8 py-4 font-anybody font-black text-sm italic tracking-widest uppercase transition-all duration-300 transform group ${currentPage === totalPages || totalPages === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-primary text-white hover:bg-orange-600 hover:scale-105'}`}>
              Next <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
          </div>
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
