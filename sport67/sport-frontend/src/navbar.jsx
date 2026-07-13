import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({ setCurrentView, user, setUser, cart = [] }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileNavLowOpacity, setIsMobileNavLowOpacity] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [loginIdentifier, setLoginIdentifier] = useState('guest@gogo.com');
  const [loginPassword, setLoginPassword] = useState('guest123');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const updateNotifications = () => {
      const orders = JSON.parse(localStorage.getItem('gogo_orders') || '[]');
      const currentUserUsername = user ? (user.username || user.name) : 'Guest';
      const userOrders = currentUserUsername !== 'Guest' ? orders.filter(o => o.username === currentUserUsername) : orders.slice(0, 5);
      setNotifications(userOrders);
    };

    updateNotifications();

    window.addEventListener('storage', updateNotifications);
    const interval = setInterval(updateNotifications, 1000);

    return () => {
      window.removeEventListener('storage', updateNotifications);
      clearInterval(interval);
    };
  }, [user]);
  // Member Login Drawer state
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);

  // Profile dropdown state
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mega Menu state
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hideTimeoutRef = useRef(null);

  const handleMouseEnter = (category) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 150);
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => document.removeEventListener('mousedown', handleClickOutsideDropdown);
  }, []);

  const openLogin = () => {
    setIsLoginVisible(true);
    if (selectedRole === 'manager') {
      setLoginIdentifier('manager');
      setLoginPassword('manager123');
    } else if (selectedRole === 'employee') {
      setLoginIdentifier('employee');
      setLoginPassword('employee123');
    } else {
      setLoginIdentifier('guest');
      setLoginPassword('guest123');
    }
    setTimeout(() => {
      setIsLoginActive(true);
    }, 10);
  };

  const closeLoginDrawer = () => {
    setIsLoginActive(false);
    setTimeout(() => {
      setIsLoginVisible(false);
    }, 500);
  };

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const handleSearchTriggerClick = (e) => {
    if (!isSearchExpanded) {
      e.preventDefault();
      setIsSearchExpanded(true);
      if (window.innerWidth < 1024) {
        setIsMobileNavLowOpacity(true);
      }
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      if (searchValue === '') {
        setIsSearchExpanded(false);
        setIsMobileNavLowOpacity(false);
      } else {
        console.log('Searching for:', searchValue);
      }
    }
  };

  useEffect(() => {
    // Seed base users for roles if not exist
    const existingUsers = JSON.parse(localStorage.getItem("gogo_users") || "[]");
    const baseUsers = [
      { id: 1, username: 'manager', password: 'manager123', role: 'manager', isActive: true },
      { id: 2, username: 'employee', password: 'employee123', role: 'employee', isActive: true },
      { id: 3, username: 'guest', password: 'guest123', role: 'customer', isActive: true }
    ];
    let updated = false;
    baseUsers.forEach(baseUser => {
      if (!existingUsers.some(u => u.username === baseUser.username)) {
        existingUsers.push(baseUser);
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem("gogo_users", JSON.stringify(existingUsers));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target) &&
        isSearchExpanded
      ) {
        setIsSearchExpanded(false);
        setIsMobileNavLowOpacity(false);
        setSearchValue('');
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isSearchExpanded) {
        setIsSearchExpanded(false);
        setIsMobileNavLowOpacity(false);
        setSearchValue('');
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchExpanded]);

  return (
    <>
      <header className="fixed top-0 w-full z-50 transition-all duration-300 glass border-b border-white/5">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between relative">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setCurrentView && setCurrentView('home')}>
            <h1 className="text-3xl font-anybody font-black italic tracking-tighter uppercase">gogo</h1>
          </div>

          {/* Navigation Menu */}
          <nav
            className="hidden md:flex items-center space-x-8 lg:space-x-12 text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity duration-300"
            id="main-nav"
            style={{ opacity: isMobileNavLowOpacity ? 0.1 : 1 }}
          >
            {['men', 'women', 'kid', 'sport'].map((cat) => (
              <div
                key={cat}
                className="h-20 flex items-center"
                onMouseEnter={() => handleMouseEnter(cat)}
                onMouseLeave={handleMouseLeave}
              >
                <a
                  className={`hover:text-primary transition ${hoveredCategory === cat ? 'text-primary' : ''}`}
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (setCurrentView) setCurrentView(cat); }}
                >
                  {cat === 'kid' ? 'Kids' : cat}
                </a>
              </div>
            ))}
            <div className="h-20 flex items-center"
                 onMouseEnter={() => handleMouseEnter('brands')}
                 onMouseLeave={handleMouseLeave}>
              <a className={`hover:text-primary transition ${hoveredCategory === 'brands' ? 'text-primary' : ''}`} href="#" onClick={(e) => { e.preventDefault(); if (setCurrentView) setCurrentView('home'); }}>Brands</a>
            </div>
          </nav>

          {/* Dashboard Button */}
          {user && user.role !== 'customer' && user.role !== 'user' && (
            <button
              onClick={() => setCurrentView && setCurrentView('dashboard')}
              className="hidden md:flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest bg-primary/10 border border-primary/40 hover:bg-primary hover:text-white px-4 py-2 transition-all duration-300 text-primary"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Dashboard</span>
            </button>
          )}

          <div className="flex items-center space-x-8">
            {/* Search Container */}
            <div
              ref={searchContainerRef}
              className={`relative flex items-center h-10 transition-all duration-400 group ${isSearchExpanded ? 'expanded w-[280px]' : ''}`}
              id="search-container"
            >
              <input
                ref={searchInputRef}
                className="bg-white/5 border-none text-[11px] font-bold tracking-widest placeholder:text-white/30 focus:ring-1 focus:ring-primary h-full uppercase outline-none"
                id="search-input"
                placeholder="SEARCH COLLECTIONS..."
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{
                  width: isSearchExpanded ? '100%' : '0px',
                  opacity: isSearchExpanded ? 1 : 0,
                  paddingLeft: isSearchExpanded ? '1rem' : '0px',
                  paddingRight: isSearchExpanded ? '2.5rem' : '0px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              <button
                onClick={handleSearchTriggerClick}
                className="absolute right-0 hover:text-primary transition-colors flex items-center justify-center w-10 h-10"
                id="search-trigger"
              >
                <span className="material-symbols-outlined text-[22px]" id="search-icon">
                  {isSearchExpanded ? 'close' : 'search'}
                </span>
              </button>
            </div>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer text-primary bg-transparent border-none"
                >
                  <span className="material-symbols-outlined text-[22px]">person</span>
                  <span className="hidden sm:inline">{user.username || user.name}</span>
                  {user.role !== 'customer' && user.role !== 'user' && (
                    <span className="ml-2 px-1.5 py-0.5 text-[8px] bg-primary/20 text-primary border border-primary/30 rounded">{user.role}</span>
                  )}
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-6 w-48 py-2 bg-[#131313] border border-white/10 shadow-xl z-50 flex flex-col">
                    {(user.role === 'customer' || user.role === 'user') && (
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          if (setCurrentView) setCurrentView('profile');
                        }}
                        className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-primary transition-colors bg-transparent border-none w-full cursor-pointer"
                      >
                        Profile
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        localStorage.removeItem('gogo_current_user');
                        setUser(null);
                        if (setCurrentView) setCurrentView('home');
                      }}
                      className="text-left px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-white hover:bg-white/10 hover:text-primary transition-colors bg-transparent border-none w-full border-t border-white/5 cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer bg-transparent border-none text-white"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
                <span className="hidden sm:inline">Login / Register</span>
              </button>
            )}

            {/* Notification Button */}
            <div className="relative flex items-center">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative flex items-center justify-center hover:text-primary transition cursor-pointer bg-transparent border-none p-1 text-white"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-6 w-80 bg-[#131313] border border-white/10 shadow-2xl z-50">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e0e]">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest text-white">Notifications</h3>
                    <button onClick={() => setIsNotificationOpen(false)} className="text-white/50 hover:text-white cursor-pointer bg-transparent border-none">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-white/50 text-[11px] uppercase tracking-widest">
                        No recent purchases
                      </div>
                    ) : (
                      notifications.map((order, idx) => (
                        <div key={idx} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => { setIsNotificationOpen(false); if (setCurrentView) setCurrentView('profile'); }}>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] text-primary font-bold tracking-wider">{order.id}</span>
                            <span className="text-[9px] text-white/40">{order.date}</span>
                          </div>
                          <p className="text-[11px] text-white/90 leading-relaxed mb-1">
                            Purchase successful!
                          </p>
                          <p className="text-[10px] text-white/60 uppercase">
                            Status: <span className="text-white font-bold">{order.status}</span>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-white/10 bg-[#0e0e0e] text-center">
                    <button onClick={() => { setIsNotificationOpen(false); if (setCurrentView) setCurrentView('profile'); }} className="text-[10px] text-primary hover:text-white transition-colors uppercase tracking-widest font-bold bg-transparent border-none cursor-pointer">
                      View Order History
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Button */}
            {user && user.role === 'user' && (
              <button
                onClick={() => setCurrentView && setCurrentView('profile')}
                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer bg-transparent border-none"
              >
                <span className="material-symbols-outlined text-[22px]">account_circle</span>
                <span className="hidden sm:inline">Profile</span>
              </button>
            )}

            <button
              onClick={() => setCurrentView && setCurrentView('bag')}
              className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer bg-transparent border-none"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span className="hidden sm:inline">Bag ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
            </button>

            <button className="md:hidden flex items-center">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <div
          className={`absolute top-full left-0 w-full bg-neutral-950/95 backdrop-blur-xl border-b border-white/10 transition-all duration-300 overflow-hidden ${hoveredCategory ? 'max-h-[400px] opacity-100 py-12' : 'max-h-0 opacity-0 py-0'}`}
          onMouseEnter={() => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current); }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row gap-16 md:gap-32 relative z-10 pb-12">
            {/* Title / Description */}
            <div className="w-full md:w-1/3">
              <h2 className="text-5xl md:text-7xl font-anybody font-black italic uppercase text-white mb-6 tracking-tighter">
                {hoveredCategory === 'men' && "MEN'S"}
                {hoveredCategory === 'women' && "WOMEN'S"}
                {hoveredCategory === 'kid' && "KIDS'"}
                {hoveredCategory === 'sport' && "SPORT"}
                {hoveredCategory === 'brands' && "BRANDS"}
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-[250px] font-light">
                Discover the latest high-performance gear tailored for your needs.
              </p>
            </div>

            <div className="flex flex-1 gap-16 md:gap-32">
              {hoveredCategory === 'sport' ? (
                <div className="flex-1 max-w-xs">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-white/10 pb-4">Sports</h3>
                  <ul className="space-y-6">
                    {['running', 'football', 'swimming'].map(sport => (
                      <li key={sport}>
                        <a href="#" className="text-sm font-black uppercase tracking-widest text-neutral-300 hover:text-primary hover:translate-x-2 transition-all inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            setHoveredCategory(null);
                            if (setCurrentView) setCurrentView(sport);
                          }}>
                          {sport}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : hoveredCategory === 'brands' ? (
                <div className="flex-1 max-w-xs">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-white/10 pb-4">Our Brands</h3>
                  <ul className="space-y-6">
                    {['nike', 'puma', 'adidas'].map(brand => (
                      <li key={brand}>
                        <a href="#" className="text-sm font-black uppercase tracking-widest text-neutral-300 hover:text-primary hover:translate-x-2 transition-all inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            setHoveredCategory(null);
                            if (setCurrentView) setCurrentView(`brand-${brand}`);
                          }}>
                          {brand}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <>
                  {/* Clothes Categories */}
                  <div className="flex-1 max-w-xs">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-white/10 pb-4">Clothes</h3>
                    <ul className="space-y-6">
                      {['top', 'bottom', 'shoes', 'hat', 'sock'].map(type => (
                        <li key={type}>
                          <a href="#" className="text-sm font-black uppercase tracking-widest text-neutral-300 hover:text-primary hover:translate-x-2 transition-all inline-block"
                            onClick={(e) => {
                              e.preventDefault();
                              setHoveredCategory(null);
                              if (setCurrentView) setCurrentView(`${hoveredCategory}-${type}`);
                            }}>
                            {type}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Equipment Categories */}
                  <div className="flex-1 max-w-xs">
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-8 border-b border-white/10 pb-4">Equipment</h3>
                    <ul className="space-y-6">
                      <li>
                        <a href="#" className="text-sm font-black uppercase tracking-widest text-neutral-300 hover:text-primary hover:translate-x-2 transition-all inline-block"
                          onClick={(e) => {
                            e.preventDefault();
                            setHoveredCategory(null);
                            if (setCurrentView) setCurrentView(`${hoveredCategory}-equipment`);
                          }}>
                          All Equipment
                        </a>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Member Login Drawer */}
      <div
        className={`fixed inset-0 z-[100] transition-all duration-500 ${isLoginVisible ? '' : 'invisible'}`}
        id="login-drawer"
      >
        {/* Backdrop */}
        <div
          onClick={closeLoginDrawer}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isLoginActive ? 'opacity-100' : 'opacity-0'}`}
          id="login-backdrop"
        ></div>
        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 w-full max-w-md h-full bg-surface-container-highest border-l border-white/10 transition-transform duration-500 ease-out p-12 flex flex-col ${isLoginActive ? 'translate-x-0' : 'translate-x-full'}`}
          id="login-panel"
        >
          <div className="flex justify-end mb-12">
            <button
              onClick={closeLoginDrawer}
              className="hover:text-primary transition-colors cursor-pointer"
              id="close-login"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-5xl font-anybody font-black italic uppercase tracking-tighter mb-12">Member Login</h2>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                let name = "Guest User";
                let email = "guest@gogo.com";
                let role = selectedRole;

                const existingUsers = JSON.parse(localStorage.getItem("gogo_users") || "[]");

                const matchedUser = existingUsers.find(
                  u => u.username && u.username.toLowerCase() === loginIdentifier.toLowerCase()
                );

                if (!matchedUser) {
                  alert("User account not found! Please create an account first.");
                  return;
                } else if (!matchedUser.isActive) {
                  alert("Account is deactivated.");
                  return;
                } else if (matchedUser.password !== loginPassword) {
                  alert("Incorrect password! Please try again.");
                  return;
                }

                name = matchedUser.username;
                email = matchedUser.username; // keep it simple as username is the primary identifier
                role = matchedUser.role;

                setUser({ name, email, role });
                if (role === 'employee' || role === 'manager') {
                  if (setCurrentView) setCurrentView('dashboard');
                }
                closeLoginDrawer();
              }}
            >

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email or Username</label>
                <input
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase tracking-widest"
                  placeholder="EMAIL OR USERNAME"
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                <input
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase tracking-widest"
                  placeholder="ENTER PASSWORD"
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              <div className="pt-8 space-y-4">
                <button
                  className="w-full bg-primary hover:bg-orange-600 py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                  type="submit"
                >
                  Login Now
                </button>
                <button
                  onClick={() => {
                    closeLoginDrawer();
                    if (setCurrentView) setCurrentView('login');
                  }}
                  className="w-full border border-white/20 hover:bg-white hover:text-black py-5 font-anybody font-black text-sm uppercase tracking-widest transition-all duration-300 cursor-pointer"
                  type="button"
                >
                  Create Account
                </button>
              </div>
            </form>
            <div className="mt-12 pt-12 border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant leading-relaxed">
                Join the GOGO community for exclusive access to high-performance gear and member-only releases.
              </p>
            </div>
          </div>
          <div className="mt-auto">
            <h1 className="text-2xl font-anybody font-black italic tracking-tighter uppercase opacity-20">gogo</h1>
          </div>
        </div>
      </div>
    </>
  );
}
