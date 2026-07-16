import React from 'react';
import Navbar from '../navbar.jsx';

export default function Profile({ onViewChange, user, setUser, cart, addToCart, setSelectedOrder }) {
  const currentUserUsername = user?.username || user?.name || 'Guest';

  // Fetch real order history from localStorage
  const [orders, setOrders] = React.useState([]);
  const [addresses, setAddresses] = React.useState([]);
  const [showAddressModal, setShowAddressModal] = React.useState(false);
  const [addressForm, setAddressForm] = React.useState({
    firstName: '', lastName: '', phone: '', streetAddress: '', city: '', zipCode: '', isDefault: false
  });
  const [orderFilter, setOrderFilter] = React.useState('All');

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, addressesRes] = await Promise.all([
          fetch('http://localhost:5000/api/orders'),
          fetch('http://localhost:5000/api/addresses')
        ]);

        if (ordersRes.ok) {
          const allOrders = await ordersRes.json();
          const userOrders = allOrders.filter(o => o.username === currentUserUsername);
          setOrders(userOrders);
        }

        if (addressesRes.ok) {
          const allAddresses = await addressesRes.json();
          setAddresses(allAddresses[currentUserUsername] || []);
        }
      } catch (e) {
        console.error("Failed to load data", e);
      }
    }
    if (currentUserUsername !== 'Guest') {
      fetchData();
    }
  }, [currentUserUsername]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/addresses');
      const allAddresses = res.ok ? await res.json() : {};
      let userAddrs = allAddresses[currentUserUsername] || [];

      let newAddr = { ...addressForm, id: Date.now().toString() };
      if (newAddr.isDefault || userAddrs.length === 0) {
        newAddr.isDefault = true;
        userAddrs = userAddrs.map(a => ({ ...a, isDefault: false }));
      }

      userAddrs.push(newAddr);
      allAddresses[currentUserUsername] = userAddrs;

      await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allAddresses)
      });

      setAddresses(userAddrs);
      setShowAddressModal(false);
      setAddressForm({ firstName: '', lastName: '', phone: '', streetAddress: '', city: '', zipCode: '', isDefault: false });
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  const handleSetDefaultAddress = async (addressId, index) => {
    try {
      const res = await fetch('http://localhost:5000/api/addresses');
      const allAddresses = res.ok ? await res.json() : {};
      let userAddrs = allAddresses[currentUserUsername] || [];
      userAddrs = userAddrs.map((a, i) => {
        const isMatch = a.id ? a.id === addressId : i === index;
        return {
          ...a,
          isDefault: isMatch
        };
      });
      allAddresses[currentUserUsername] = userAddrs;

      await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allAddresses)
      });

      setAddresses(userAddrs);
    } catch (err) {
      console.error("Failed to set default address:", err);
    }
  };

  const handleDeleteAddress = async (addressId, index) => {
    try {
      const res = await fetch('http://localhost:5000/api/addresses');
      const allAddresses = res.ok ? await res.json() : {};
      let userAddrs = allAddresses[currentUserUsername] || [];
      userAddrs = userAddrs.filter((a, i) => {
        return a.id ? a.id !== addressId : i !== index;
      });
      if (userAddrs.length > 0 && !userAddrs.some(a => a.isDefault)) {
        userAddrs[0].isDefault = true;
      }
      allAddresses[currentUserUsername] = userAddrs;

      await fetch('http://localhost:5000/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(allAddresses)
      });

      setAddresses(userAddrs);
    } catch (err) {
      console.error("Failed to delete address:", err);
    }
  };

  const filteredOrders = orders.filter(order => orderFilter === 'All' || order.status.toLowerCase() === orderFilter.toLowerCase());


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

                <div>
                  <h3 className="font-anybody font-black text-xl uppercase tracking-widest">{user.name}</h3>
                  <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Username (ชื่อบัญชี)</label>
                  <p className="font-bold text-sm">{user.username}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email (อีเมล)</label>
                  <p className="font-bold text-sm">{user.email}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setUser(null);
                  onViewChange('home');
                }}
                className="w-full mt-6 border border-white/20 hover:bg-white hover:text-black py-4 font-anybody font-black text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>

            {/* Addresses Section */}
            <div className="glass p-8 border border-white/5 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
              <h3 className="font-anybody font-black text-xl uppercase tracking-widest border-b border-white/10 pb-6">My Addresses</h3>

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <p className="text-sm text-on-surface-variant font-light">คุณยังไม่มีที่อยู่ (No addresses found)</p>
                ) : (
                  addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 border border-white/10 relative mt-4">
                      <div className="absolute top-4 right-4 flex gap-2">
                        {addr.isDefault ? (
                          <span className="text-[10px] text-primary border border-primary px-2 py-0.5">ค่าเริ่มต้น</span>
                        ) : (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id, idx)}
                            className="text-[10px] text-white border border-white/20 px-2 py-0.5 hover:bg-white/10 transition-colors cursor-pointer bg-transparent"
                          >
                            ตั้งเป็นค่าเริ่มต้น
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAddress(addr.id, idx)}
                          className="text-[10px] text-red-500 border border-red-500/20 px-2 py-0.5 hover:bg-red-500/10 transition-colors cursor-pointer bg-transparent"
                        >
                          ลบ
                        </button>
                      </div>
                      <p className="font-bold text-sm text-white w-[70%]">{addr.firstName} {addr.lastName} | <span className="text-on-surface-variant font-light">{addr.phone}</span></p>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed w-[70%]">{addr.streetAddress}<br />{addr.city}, {addr.zipCode}</p>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowAddressModal(true)}
                className="w-full mt-6 border border-primary text-primary hover:bg-primary hover:text-black py-4 font-anybody font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer bg-transparent"
              >
                + เพิ่มที่อยู่ใหม่
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-3xl font-anybody font-black italic uppercase tracking-tighter">
              ประวัติการสั่งซื้อ <span className="text-on-surface-variant text-xl">(Order History)</span>
            </h3>

            {/* Filter Bar */}
            <div className="flex w-full mb-8 border-b border-white/10">
              {['All', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border-b-4 bg-transparent ${orderFilter === status
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-white hover:bg-white/5 hover:text-primary/70'
                    }`}
                >
                  {status === 'All' ? 'All' : status}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {filteredOrders.length === 0 ? (
                <p className="text-sm text-on-surface-variant font-light">คุณยังไม่มีประวัติการสั่งซื้อ (No order history found)</p>
              ) : (
                filteredOrders.map(order => (
                  <div key={order.id} onClick={() => onViewChange(`order_status-${order.id}`)} className="glass p-6 border border-white/5 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-white/10 pb-4">
                      <div>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-primary">{order.id}</h4>
                        <p className="text-xs text-on-surface-variant mt-1">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-3 py-1 uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                            order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                              order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                'bg-orange-500/20 text-orange-400'
                          }`}>
                          {order.status}
                        </span>
                        <p className="font-anybody font-black italic mt-2">
                          {(order.total || 0).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Items</p>
                      <ul className="list-disc list-inside text-sm font-medium space-y-1">
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {typeof item === 'string' ? item : `${item.name} (x${item.qty})`}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#131313] border border-white/10 p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-anybody font-black italic uppercase mb-6 text-white">เพิ่มที่อยู่ใหม่</h3>
            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">First Name</label>
                  <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.firstName} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, firstName: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Last Name</label>
                  <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.lastName} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, lastName: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Phone Number</label>
                <input required type="tel" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.phone} onChange={e => { const v = e.target.value; if (/^\d*$/.test(v)) setAddressForm({ ...addressForm, phone: v }) }} minLength={10} maxLength={10} pattern="\d{10}" title="กรุณากรอกเบอร์โทรศัพท์ตัวเลข 10 หลัก" />
              </div>
              <div>
                <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Street Address</label>
                <textarea required className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary resize-none h-20" value={addressForm.streetAddress} onChange={e => setAddressForm({ ...addressForm, streetAddress: e.target.value })}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">City</label>
                  <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.city} onChange={e => { const v = e.target.value; if (/^[A-Za-zก-๙\s]*$/.test(v)) setAddressForm({ ...addressForm, city: v }) }} pattern="^[A-Za-zก-๙\s]+$" title="กรุณากรอกเฉพาะตัวอักษร" />
                </div>
                <div>
                  <label className="text-[10px] uppercase text-on-surface-variant mb-1 block">Postal Code</label>
                  <input required type="text" className="w-full bg-[#1c1b1b] border-b-2 border-white/10 p-3 text-white outline-none focus:border-primary" value={addressForm.zipCode} onChange={e => { const v = e.target.value; if (/^\d*$/.test(v)) setAddressForm({ ...addressForm, zipCode: v }) }} minLength={5} maxLength={5} pattern="\d{5}" title="กรุณากรอกรหัสไปรษณีย์ตัวเลข 5 หลัก" />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="isDefault" className="w-4 h-4 accent-primary" checked={addressForm.isDefault} onChange={e => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                <label htmlFor="isDefault" className="text-sm text-white cursor-pointer">ตั้งเป็นที่อยู่หลัก (Set as default)</label>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setShowAddressModal(false)} className="flex-1 py-4 border border-white/20 text-white uppercase text-xs font-bold hover:bg-white/5 transition-colors">ยกเลิก</button>
                <button type="submit" className="flex-1 py-4 bg-primary text-black uppercase text-xs font-bold hover:bg-orange-500 transition-colors border-none">บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
