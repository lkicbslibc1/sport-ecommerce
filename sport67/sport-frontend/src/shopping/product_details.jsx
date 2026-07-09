import React, { useState, useEffect } from 'react';
import Navbar from '../navbar.jsx';

function formatPrice(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2 }) + " ฿";
}

export default function ProductDetails({ onViewChange, product, user, setUser, cart, addToCart }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedColor, setSelectedColor] = useState(product?.colorNames?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      cartId: `${product.id}-${selectedColor}-${selectedSize}`,
      selectedColor,
      selectedSize,
    };
    if (addToCart) {
      addToCart(productToAdd, quantity);
    }
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen selection:bg-primary selection:text-white pb-24">
      <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />
      
      <main className="max-w-max-width mx-auto px-6 lg:px-12 py-base pt-28">
        <nav className="py-8 flex items-center gap-2 font-label-sm text-on-surface-variant uppercase tracking-widest flex-wrap">
          <a className="hover:text-primary transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange('home'); }}>Home</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-primary transition-colors cursor-pointer" onClick={(e) => { e.preventDefault(); onViewChange && onViewChange(product.sportType?.toLowerCase() || 'sport'); }}>{product.sportType || 'Products'}</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-primary font-black truncate max-w-[200px] sm:max-w-xs">{product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16 mt-8">
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-lg aspect-square bg-surface-container border border-white/5 relative overflow-hidden flex items-center justify-center p-12 group">
              <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" />
              {product.badge && (
                <div className={`absolute top-6 left-6 ${product.badgeType === 'primary' ? 'bg-primary' : 'bg-tertiary'} text-white font-anybody font-black text-xs px-4 py-2 uppercase tracking-widest`}>
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col pt-4">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display-lg font-black italic uppercase tracking-tighter text-on-background mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant font-light mb-6 tracking-wide">{product.series}</p>
              <p className="text-3xl font-anybody font-black italic text-primary">{formatPrice(product.price)}</p>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-8"></div>

            {/* Colors */}
            {product.colorNames && product.colorNames.length > 0 && (
              <div className="mb-8">
                <h3 className="font-anybody font-black text-sm uppercase tracking-widest mb-4">Select Color: <span className="text-on-surface-variant font-medium normal-case tracking-normal">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-4">
                  {product.colorNames.map((color, idx) => {
                    const bgClass = product.colors && product.colors[idx] ? product.colors[idx] : 'bg-white/20';
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-12 h-12 rounded-full border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'} p-1 transition-all flex items-center justify-center group`}
                      >
                        <div className={`w-full h-full rounded-full ${bgClass} border border-white/10`} title={color}></div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-anybody font-black text-sm uppercase tracking-widest">Select Size</h3>
                  <a href="#" className="text-xs text-on-surface-variant underline hover:text-primary transition-colors">Size Guide</a>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-4 border font-bold uppercase transition-all ${selectedSize === size ? 'bg-primary text-white border-primary' : 'border-white/20 text-on-surface-variant hover:border-primary hover:text-primary'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-10">
               <h3 className="font-anybody font-black text-sm uppercase tracking-widest mb-4">Quantity</h3>
               <div className="flex items-center border border-white/20 w-max">
                 <button 
                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
                   className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors text-xl"
                 >
                   -
                 </button>
                 <div className="w-16 h-12 flex items-center justify-center font-bold text-lg border-x border-white/20">
                   {quantity}
                 </div>
                 <button 
                   onClick={() => setQuantity(quantity + 1)}
                   className="w-12 h-12 flex items-center justify-center hover:bg-white/5 transition-colors text-xl"
                 >
                   +
                 </button>
               </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-orange-600 text-white py-6 font-anybody font-black text-lg uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-4 mb-12 shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]"
            >
              <span className="material-symbols-outlined">shopping_bag</span>
              Add to Bag
            </button>

            {/* Product Details Section */}
            <div className="space-y-6 text-on-surface-variant text-sm font-light leading-relaxed border-t border-white/10 pt-8">
              <h3 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">info</span>
                Product Details
              </h3>
              <p className="text-base">{product.description}</p>
              
              <ul className="list-disc pl-5 space-y-3 mt-6">
                {product.brand && <li><strong className="text-on-background font-medium mr-2">Brand:</strong> {product.brand}</li>}
                {product.sportType && <li><strong className="text-on-background font-medium mr-2">Sport:</strong> {product.sportType}</li>}
                {product.fabricMaterial && <li><strong className="text-on-background font-medium mr-2">Material:</strong> <span className="capitalize">{product.fabricMaterial}</span></li>}
                {product.targetGroup && <li><strong className="text-on-background font-medium mr-2">Target Group:</strong> <span className="capitalize">{product.targetGroup}</span></li>}
                {product.sku && <li><strong className="text-on-background font-medium mr-2">SKU:</strong> {product.sku}</li>}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
