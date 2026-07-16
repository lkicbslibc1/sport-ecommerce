import React, { useEffect, useState } from 'react';
import Navbar from '../navbar.jsx';
import { ArrowLeft, Package, Truck, Receipt, Box, XCircle, Star, MessageSquare } from 'lucide-react';
import { getStoredReviews, saveReviews, saveOrders, useProducts } from '../data/products.jsx';
import { useAlert } from '../contexts/AlertContext.jsx';

export default function OrderStatus({ onViewChange, user, setUser, cart, orderId }) {
  const { products } = useProducts();
  const [order, setOrder] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { showAlert } = useAlert();

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadOrder() {
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        const orders = res.ok ? await res.json() : [];
        const foundOrder = orderId ? orders.find(o => o.id === orderId) : orders[0];
        setOrder(foundOrder || null);
      } catch (e) {
        console.error("Failed to load order", e);
      }
    }
    loadOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-white">Loading or Order Not Found...</p>
        <button onClick={() => onViewChange('profile')} className="text-primary mt-4 underline">Back to Profile</button>
      </div>
    );
  }

  const status = order.status || 'Preparing';
  const isCancelled = status === 'Cancelled';
  
  const isPreparingActive = !isCancelled;
  const isShippedActive = status === 'Shipped' || status === 'Delivered';
  const isDeliveredActive = status === 'Delivered';

  let progressWidth = '0%';
  if (isDeliveredActive) progressWidth = '100%';
  else if (isShippedActive) progressWidth = '50%';
  else if (isPreparingActive) progressWidth = '0%';

  const handleReviewSubmit = async () => {
    if (!reviewingItem) return;

    const allReviews = await getStoredReviews() || {};
    let productId = reviewingItem.id;
    
    // Fallback if id is missing in order item (older orders)
    if (!productId) {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const allProducts = res.ok ? await res.json() : [];
        const matchedProduct = allProducts.find(p => p.name === reviewingItem.name);
        if (matchedProduct) {
          productId = matchedProduct.id;
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (!productId) {
      showAlert("Could not find product ID for review.", "error");
      return;
    }
    
    if (!allReviews[productId]) {
      allReviews[productId] = [];
    }

    const newReview = {
      user: user?.username || user?.name || 'Guest',
      rating,
      comment,
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: '2-digit' })
    };

    allReviews[productId].push(newReview);
    saveReviews(allReviews);

    // Update order item to mark as reviewed
    try {
      const res = await fetch('http://localhost:5000/api/orders');
      const orders = res.ok ? await res.json() : [];
      const updatedOrders = orders.map(o => {
        if (o.id === order.id) {
          const updatedItems = o.items.map((item, index) => {
            if (index === reviewingItem.index) {
              return { ...item, reviewed: true };
            }
            return item;
          });
          return { ...o, items: updatedItems };
        }
        return o;
      });
      await saveOrders(updatedOrders);
      
      // Update local state
      const updatedOrder = updatedOrders.find(o => o.id === order.id);
      setOrder(updatedOrder);
    } catch(e) {
      console.error(e);
    }

    setReviewModalOpen(false);
    setReviewingItem(null);
    setRating(5);
    setComment('');
  };

  return (
    <div className="selection:bg-primary selection:text-white min-h-screen bg-background text-on-background font-sans">
      <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />
      
      <main className="pt-32 pb-32 px-6 md:px-12 max-w-[1000px] mx-auto">
        <button 
          onClick={() => onViewChange('profile')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-12"
        >
          <ArrowLeft size={16} /> กลับสู่หน้าโปรไฟล์ (Back to Profile)
        </button>

        <header className="mb-16">
          <h1 className="uppercase italic tracking-tighter leading-none mb-4 font-black text-5xl md:text-7xl text-on-surface">
            ORDER <span className={isCancelled ? "text-red-500" : "text-primary"}>STATUS</span>
          </h1>
          <p className="text-[11px] tracking-widest uppercase font-bold text-on-surface-variant">
            สถานะการจัดส่งสินค้าของคุณ
          </p>
        </header>

        <div className="glass p-8 md:p-12 border border-white/10 relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1 ${isCancelled ? "bg-red-500" : "bg-primary"}`}></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-white/10 pb-8">
            <div className="flex gap-16">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">หมายเลขคำสั่งซื้อ (Order ID)</p>
                <h3 className="font-anybody font-black text-2xl uppercase">{order.id}</h3>
              </div>
              {order.shippingAddress && (
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">ที่อยู่สำหรับจัดส่ง (Shipping Address)</p>
                  <p className="font-bold text-sm text-white">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    {order.shippingAddress.streetAddress}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                    <br/>Tel: {order.shippingAddress.phone}
                  </p>
                </div>
              )}
            </div>
            <div className="md:text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">วันที่สั่งซื้อ (Order Date)</p>
              <h3 className="font-bold text-lg">{order.date}</h3>
            </div>
          </div>

          <div className="py-8 relative">
            {isCancelled ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <XCircle size={80} className="text-red-500 mb-6" />
                <h4 className="font-black italic uppercase text-3xl text-red-500 mb-2">ยกเลิกคำสั่งซื้อแล้ว</h4>
                <p className="text-sm text-on-surface-variant uppercase tracking-widest">Order Cancelled</p>
              </div>
            ) : (
              <>
                {/* Progress Line - background track */}
                <div className="absolute top-1/2 left-[5%] right-[5%] h-1 bg-white/10 -translate-y-1/2 hidden md:block"></div>
                {/* Progress Line - active fill */}
                <div
                  className="absolute top-1/2 left-[5%] right-[5%] hidden md:block"
                >
                  <div 
                    className="h-1 bg-primary -translate-y-1/2 transition-all duration-700" 
                    style={{ width: progressWidth }}
                  ></div>
                </div>

                <div className="flex flex-col md:flex-row justify-between relative gap-12 md:gap-0 z-10 px-4 md:px-0">
                  {/* Step 1: Preparing */}
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${isPreparingActive ? 'bg-primary border-background shadow-[0_0_20px_rgba(255,87,25,0.3)] text-white' : 'bg-surface-container-high border-background text-white/40'}`}>
                      <Box size={28} />
                    </div>
                    <div className={`text-center ${!isPreparingActive && 'opacity-40'}`}>
                      <h4 className={`font-black italic uppercase text-sm md:text-lg ${isPreparingActive && 'text-primary'}`}>เตรียมจัดส่ง</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Preparing</p>
                    </div>
                  </div>

                  {/* Step 3: Shipping */}
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className={`absolute -left-1/2 right-1/2 top-8 h-1 ${isShippedActive ? 'bg-primary' : 'bg-white/10'} -translate-y-1/2 md:hidden`}></div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${isShippedActive ? 'bg-primary border-background shadow-[0_0_20px_rgba(255,87,25,0.3)] text-white' : 'bg-surface-container-high border-background text-white/40'}`}>
                      <Truck size={28} />
                    </div>
                    <div className={`text-center ${!isShippedActive && 'opacity-40'}`}>
                      <h4 className={`font-black italic uppercase text-sm md:text-lg ${isShippedActive && 'text-primary'}`}>กำลังจัดส่ง</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Shipped</p>
                    </div>
                  </div>

                  {/* Step 4: Delivered */}
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className={`absolute -left-1/2 right-1/2 top-8 h-1 ${isDeliveredActive ? 'bg-primary' : 'bg-white/10'} -translate-y-1/2 md:hidden`}></div>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${isDeliveredActive ? 'bg-primary border-background shadow-[0_0_20px_rgba(255,87,25,0.3)] text-white' : 'bg-surface-container-high border-background text-white/40'}`}>
                      <Package size={28} />
                    </div>
                    <div className={`text-center ${!isDeliveredActive && 'opacity-40'}`}>
                      <h4 className={`font-black italic uppercase text-sm md:text-lg ${isDeliveredActive && 'text-primary'}`}>จัดส่งแล้ว</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Delivered</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-16 bg-white/5 p-6 border border-white/10">
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 border-b border-white/10 pb-4">รายการสินค้า (Items)</h4>
            <div className="space-y-6">
              {order.items && order.items.map((item, idx) => {
                const matchedProduct = products.find(p => p.id === item.id);
                const currentColor = item.color;
                let currentImage = item.image;

                if (matchedProduct && matchedProduct.colorImages && matchedProduct.colorImages[currentColor]) {
                  currentImage = matchedProduct.colorImages[currentColor];
                }

                return (
                <div key={idx} className="flex items-center gap-6">
                  {currentImage ? (
                    <div className="w-24 h-24 bg-surface-container flex items-center justify-center p-2">
                      <img src={currentImage} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-surface-container flex items-center justify-center p-2 text-[10px] text-white/30 text-center">
                      NO IMAGE
                    </div>
                  )}
                  <div>
                    <h5 className="font-black text-lg italic uppercase">{item.name}</h5>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">QTY: {item.qty} | SIZE: {item.size || "M"} | COLOR: {item.color || "DEFAULT"}</p>
                    <p className="text-xs text-primary font-bold italic mt-1">{item.price}</p>
                    
                    {isDeliveredActive && (
                      <div className="mt-4">
                        {item.reviewed ? (
                          <span className="text-[10px] text-green-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Star size={12} className="fill-green-400" /> Reviewed
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setReviewingItem({ ...item, index: idx });
                              setReviewModalOpen(true);
                            }}
                            className="bg-white/10 hover:bg-primary text-white text-[10px] uppercase font-bold py-2 px-4 transition-colors flex items-center gap-2"
                          >
                            <MessageSquare size={14} /> รีวิวสินค้า (Review)
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Review Modal */}
      {reviewModalOpen && reviewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setReviewModalOpen(false)}></div>
          <div className="bg-surface-container border border-white/10 w-full max-w-md relative z-10 p-8 shadow-2xl animate-in zoom-in duration-200">
            <button 
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white"
            >
              <XCircle size={24} />
            </button>
            
            <h3 className="font-anybody font-black text-xl italic uppercase text-primary mb-2">Review Product</h3>
            <p className="text-sm text-on-surface-variant mb-6 uppercase tracking-widest">{reviewingItem.name}</p>

            <div className="mb-6">
              <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={32} 
                      className={star <= rating ? "fill-primary text-primary" : "text-white/20"} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-xs uppercase font-bold tracking-widest text-on-surface-variant mb-3">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full bg-white/5 border border-white/10 p-4 text-sm text-white focus:outline-none focus:border-primary resize-none h-32"
              ></textarea>
            </div>

            <button
              onClick={handleReviewSubmit}
              disabled={!comment.trim()}
              className="w-full bg-primary hover:bg-orange-600 text-white font-anybody font-black uppercase text-sm py-4 tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
