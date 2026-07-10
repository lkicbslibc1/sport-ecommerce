import React, { useEffect } from 'react';
import Navbar from '../navbar.jsx';
import { ArrowLeft, Package, Truck, Receipt, Box, XCircle } from 'lucide-react';

export default function OrderStatus({ onViewChange, user, setUser, cart, orderId }) {
  const [order, setOrder] = React.useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    try {
      const orders = JSON.parse(localStorage.getItem('gogo_orders')) || [];
      const foundOrder = orderId ? orders.find(o => o.id === orderId) : orders[0];
      setOrder(foundOrder || null);
    } catch (e) {
      console.error(e);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <p className="text-white">Loading or Order Not Found...</p>
        <button onClick={() => onViewChange('profile')} className="text-primary mt-4 underline">Back to Profile</button>
      </div>
    );
  }

  const status = order.status || 'Pending';
  const isCancelled = status === 'Cancelled';
  
  const isPendingActive = !isCancelled;
  const isPreparingActive = status === 'Preparing' || status === 'Shipped' || status === 'Delivered';
  const isShippedActive = status === 'Shipped' || status === 'Delivered';
  const isDeliveredActive = status === 'Delivered';

  let progressWidth = '0%';
  if (isDeliveredActive) progressWidth = '100%';
  else if (isShippedActive) progressWidth = '66%';
  else if (isPreparingActive) progressWidth = '33%';

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
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">หมายเลขคำสั่งซื้อ (Order ID)</p>
              <h3 className="font-anybody font-black text-2xl uppercase">{order.id}</h3>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant mb-1">วันที่สั่งซื้อ (Order Date)</p>
              <p className="font-bold">{order.date}</p>
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
                  {/* Step 1: Paid/Pending */}
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${isPendingActive ? 'bg-primary border-background shadow-[0_0_20px_rgba(255,87,25,0.3)] text-white' : 'bg-surface-container-high border-background text-white/40'}`}>
                      <Receipt size={28} />
                    </div>
                    <div className={`text-center ${!isPendingActive && 'opacity-40'}`}>
                      <h4 className={`font-black italic uppercase text-sm md:text-lg ${isPendingActive && 'text-primary'}`}>ชำระเงินแล้ว</h4>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Pending</p>
                    </div>
                  </div>

                  {/* Step 2: Preparing */}
                  <div className="flex flex-col items-center gap-4 relative">
                    <div className={`absolute -left-1/2 right-1/2 top-8 h-1 ${isPreparingActive ? 'bg-primary' : 'bg-white/10'} -translate-y-1/2 md:hidden`}></div>
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
              {order.items && order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-6">
                  {item.image ? (
                    <div className="w-24 h-24 bg-surface-container flex items-center justify-center p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-surface-container flex items-center justify-center p-2 text-[10px] text-white/30 text-center">
                      NO IMAGE
                    </div>
                  )}
                  <div>
                    <h5 className="font-black text-lg italic uppercase">{item.name}</h5>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">QTY: {item.qty}</p>
                    <p className="text-xs text-primary font-bold italic mt-1">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
