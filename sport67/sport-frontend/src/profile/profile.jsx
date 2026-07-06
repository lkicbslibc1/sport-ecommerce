import React from 'react';
import Navbar from '../navbar.jsx';

export default function Profile({ onViewChange, user, setUser, cart, addToCart }) {
  // Mock order history based on the requirements
  const orders = [
    { 
      id: 'ORD-2026-001', 
      date: '2026-07-01', 
      total: 14980, 
      status: 'Delivered', 
      items: ['XT-6 GORE-TEX', 'SALOMON XA PRO 3D'] 
    },
    { 
      id: 'ORD-2026-002', 
      date: '2026-06-15', 
      total: 5290, 
      status: 'Processing', 
      items: ['SALOMON SOLAMPHIBIAN'] 
    },
  ];

  // Split name into first and last name
  const nameParts = user.name ? user.name.split(' ') : ['Guest', 'User'];
  const firstName = nameParts[0] || 'Guest';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  return (
    <div className="selection:bg-primary selection:text-white min-h-screen bg-background text-on-background">
      <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} cart={cart} />
      
      <main className="pt-32 pb-16 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <h2 className="text-5xl md:text-7xl font-anybody font-black italic uppercase tracking-tighter mb-12">
          My <span className="text-primary">Profile</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass p-8 border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-16 h-16 bg-white/10 flex items-center justify-center rounded-full text-2xl font-bold uppercase">
                  {firstName[0]}{lastName[0]}
                </div>
                <div>
                  <h3 className="font-anybody font-black text-xl uppercase tracking-widest">{user.name}</h3>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">First Name (ชื่อ)</label>
                  <p className="font-bold text-sm">{firstName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Last Name (นามสกุล)</label>
                  <p className="font-bold text-sm">{lastName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email (อีเมล)</label>
                  <p className="font-bold text-sm">{user.email}</p>
                </div>
              </div>
              
              <button 
                onClick={() => setUser({ name: 'Guest User', email: 'guest@gogo.com', role: 'user' })}
                className="w-full mt-6 border border-white/20 hover:bg-white hover:text-black py-4 font-anybody font-black text-xs uppercase tracking-widest transition-all duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-anybody font-black italic uppercase tracking-tighter">
              ประวัติการสั่งซื้อ <span className="text-on-surface-variant text-xl">(Order History)</span>
            </h3>
            
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="glass p-6 border border-white/5 hover:border-primary/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/10 pb-4">
                    <div>
                      <h4 className="font-bold text-sm uppercase tracking-widest text-primary">{order.id}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black px-3 py-1 uppercase tracking-widest ${
                        order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-anybody font-black italic mt-2">{order.total.toLocaleString()} ฿</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Items</p>
                    <ul className="list-disc list-inside text-sm font-medium space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
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
