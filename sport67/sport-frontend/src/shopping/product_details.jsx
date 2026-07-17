import React, { useState, useEffect } from 'react';
import Navbar from '../navbar.jsx';
import { getStoredReviews, getVariantImage, getVariantStock, getSizeOptions } from '../data/products.jsx';
import { Star, UserCircle } from 'lucide-react';

function formatPrice(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2 }) + " ฿";
}

export default function ProductDetails({ onViewChange, product, user, setUser, cart, addToCart }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Use colorVariants if present, fall back to legacy colorNames
  const colorVariants = product?.colorVariants || [];
  const hasVariants = colorVariants.length > 0;
  const firstColor = hasVariants ? colorVariants[0].color : (product?.colorNames?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(firstColor);

  // Compute sizes based on productType/clothesType
  const sizes = getSizeOptions(product?.productType, product?.clothesType);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  if (!product) return null;

  // Get image for currently selected color
  const currentImage = hasVariants
    ? getVariantImage(product, selectedColor)
    : (product.colorImages && product.colorImages[selectedColor] ? product.colorImages[selectedColor] : product.image);

  // Get stock for selected color + size
  const currentStock = hasVariants
    ? getVariantStock(product, selectedColor, selectedSize)
    : product.amount;

  const [reviews, setReviews] = useState({});

  useEffect(() => {
    async function fetchReviews() {
      const data = await getStoredReviews();
      if (data) setReviews(data);
    }
    fetchReviews();
  }, []);

  const productReviews = reviews[product?.id] || [];

  let averageRating;
  let reviewCountText;
  if (productReviews.length > 0) {
    const totalUserRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    averageRating = (totalUserRating / productReviews.length).toFixed(1);
    reviewCountText = `${productReviews.length} Review${productReviews.length > 1 ? 's' : ''}`;
  } else {
    averageRating = "0.0";
    reviewCountText = "0 Reviews";
  }


  const handleAddToCart = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    if (currentStock <= 0) return;
    const productToAdd = {
      ...product,
      cartId: `${product.id}-${selectedColor}-${selectedSize}`,
      selectedColor,
      selectedSize,
      image: currentImage,
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
          <div className="w-full lg:w-1/2 flex justify-center items-start">
            <div className="w-full max-w-lg relative overflow-hidden group">
              <img src={currentImage} alt={product.name} className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-700" />
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
              <p className="text-lg md:text-xl text-on-surface-variant font-light mb-4 tracking-wide">{product.series}</p>
              <div className="flex items-center gap-2 mb-6 text-sm">
                <Star size={16} className="fill-primary text-primary" />
                <span className="font-bold">{averageRating}</span>
                <span className="text-on-surface-variant">({reviewCountText})</span>
              </div>
              <div className="flex items-end gap-6">
                <p className="text-3xl font-anybody font-black italic text-primary">{formatPrice(product.price * quantity)}</p>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest font-bold mb-1">
                  {currentStock > 0 ? `${currentStock} in stock` : <span className="text-[#ffb4ab]">Out of Stock</span>}
                </p>
              </div>
            </div>

            <div className="w-full h-[1px] bg-white/10 mb-8"></div>

            {/* Colors */}
            {hasVariants ? (
              <div className="mb-8">
                <h3 className="font-anybody font-black text-sm uppercase tracking-widest mb-4">
                  Select Color: <span className="text-on-surface-variant font-medium normal-case tracking-normal capitalize">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-4">
                  {colorVariants.map((v) => (
                    <button
                      key={v.color}
                      onClick={() => {
                        setSelectedColor(v.color);
                        // Reset size selection to first available size for this color
                        const firstAvailSize = sizes.find(s => (v.stock?.[s] || 0) > 0) || sizes[0] || '';
                        setSelectedSize(firstAvailSize);
                        setQuantity(1);
                      }}
                      className={`w-12 h-12 rounded-full border-2 ${selectedColor === v.color ? 'border-primary' : 'border-transparent'} p-1 transition-all flex items-center justify-center group`}
                    >
                      <div
                        className={`w-full h-full rounded-full ${v.colorClass || 'bg-white/20'} border border-white/10`}
                        title={v.color}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : product.colorNames && product.colorNames.length > 0 && (
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
            {sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-anybody font-black text-sm uppercase tracking-widest">Select Size</h3>
                  <a href="#" className="text-xs text-on-surface-variant underline hover:text-primary transition-colors">Size Guide</a>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {sizes.map((size) => {
                    const sizeStock = hasVariants ? getVariantStock(product, selectedColor, size) : (product.amount || 0);
                    const outOfStock = sizeStock <= 0;
                    return (
                      <button
                        key={size}
                        onClick={() => { if (!outOfStock) { setSelectedSize(size); setQuantity(1); } }}
                        disabled={outOfStock}
                        title={outOfStock ? 'Out of Stock' : `${sizeStock} left`}
                        className={`py-4 border font-bold uppercase transition-all relative ${
                          outOfStock
                            ? 'border-white/10 text-white/20 cursor-not-allowed line-through'
                            : selectedSize === size
                              ? 'bg-primary text-white border-primary'
                              : 'border-white/20 text-on-surface-variant hover:border-primary hover:text-primary'
                        }`}
                      >
                        {size}
                        {!outOfStock && hasVariants && (
                          <span className="absolute top-0.5 right-1 text-[8px] text-on-surface-variant font-normal">{sizeStock}</span>
                        )}
                      </button>
                    );
                  })}
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
                 <input
                   type="text"
                   value={quantity}
                   onChange={(e) => {
                     let val = e.target.value.replace(/\D/g, '');
                     if (val !== '') {
                       let num = parseInt(val, 10);
                       if (num > currentStock) num = currentStock;
                       setQuantity(num);
                     } else {
                       setQuantity('');
                     }
                   }}
                   onBlur={() => {
                     if (quantity === '' || quantity < 1) setQuantity(1);
                   }}
                   className="w-16 h-12 text-center font-bold text-lg border-x border-white/20 bg-transparent outline-none focus:bg-white/5 transition-colors"
                 />
                 <button
                   onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                   disabled={quantity >= currentStock}
                   className={`w-12 h-12 flex items-center justify-center transition-colors text-xl ${quantity >= currentStock ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5'}`}
                 >
                   +
                 </button>
               </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={currentStock === 0}
              className={`w-full py-6 font-anybody font-black text-lg uppercase tracking-widest transition-all duration-300 transform flex items-center justify-center gap-4 mb-12 ${currentStock > 0 ? 'bg-primary hover:bg-orange-600 text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:shadow-[0_0_30px_rgba(255,107,0,0.5)]' : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed border border-white/10'}`}
            >
              <span className="material-symbols-outlined">{!user ? 'lock' : (currentStock > 0 ? 'shopping_bag' : 'remove_shopping_cart')}</span>
              {!user ? 'Login Required' : (currentStock > 0 ? 'Add to Bag' : 'Out of Stock')}
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
            
            {/* User Reviews Section */}
            <div className="mt-12 border-t border-white/10 pt-8">
              <h3 className="font-anybody font-black text-sm uppercase tracking-widest text-on-background mb-6 flex items-center gap-2">
                <Star size={18} />
                Customer Reviews
              </h3>
              
              <div className="space-y-6">
                {productReviews.length === 0 ? (
                  <p className="text-sm text-on-surface-variant italic">No user reviews yet. Buy this product to be the first to review!</p>
                ) : (
                  productReviews.map((rev, idx) => (
                    <div key={idx} className="bg-white/5 p-6 border border-white/10 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <UserCircle size={24} className="text-on-surface-variant" />
                          <div>
                            <p className="font-bold text-sm uppercase">{rev.user}</p>
                            <p className="text-[10px] text-on-surface-variant">{rev.date}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= rev.rating ? "fill-primary text-primary" : "text-white/20"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed mt-2">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginPopup(false)}
          />
          <div className="relative bg-surface-container border border-white/10 p-10 max-w-sm w-full shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-3xl">lock</span>
            </div>
            <h2 className="font-anybody font-black text-2xl uppercase tracking-widest text-on-background mb-4">Login Required</h2>
            <p className="text-on-surface-variant font-light mb-8">
              กรุณาเข้าสู่ระบบ หรือสมัครสมาชิกก่อนทำการสั่งซื้อสินค้า
            </p>
            <div className="w-full space-y-4">
              <button 
                onClick={() => {
                  setShowLoginPopup(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-primary text-white font-anybody font-black uppercase tracking-widest hover:bg-orange-600 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
