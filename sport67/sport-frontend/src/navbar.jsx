import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({ setCurrentView, user, setUser, cart = [] }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileNavLowOpacity, setIsMobileNavLowOpacity] = useState(false);
  const [selectedRole, setSelectedRole] = useState('user');
  const [loginIdentifier, setLoginIdentifier] = useState('guest@gogo.com');
  const [loginPassword, setLoginPassword] = useState('guest123');

  // Member Login Drawer state
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);

  const openLogin = () => {
    setIsLoginVisible(true);
    if (selectedRole === 'manager') {
      setLoginIdentifier('marcus@gogoathletic.com');
      setLoginPassword('marcus123');
    } else if (selectedRole === 'employee') {
      setLoginIdentifier('dom@gogoathletic.com');
      setLoginPassword('dom123');
    } else {
      setLoginIdentifier('guest@gogo.com');
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
            className="hidden md:flex items-center space-x-12 text-[11px] font-bold uppercase tracking-[0.2em] transition-opacity duration-300"
            id="main-nav"
            style={{ opacity: isMobileNavLowOpacity ? 0.1 : 1 }}
          >
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('men')}>Men</a>
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('women')}>Women</a>
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('kid')}>Kids</a>
            <a className="text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('home')}>Brands</a>
          </nav>

          {/* Dashboard Button */}
          {user && user.role !== 'user' && (
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

            {user && user.role !== 'user' ? (
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-primary/20 text-primary border border-primary/30 px-2.5 py-1 font-bold uppercase tracking-wider">
                  {user.role}
                </span>
                <span className="hidden sm:inline text-[11px] font-bold uppercase tracking-widest text-white">
                  {user.name}
                </span>
                <button
                  onClick={() => setUser({ name: 'Guest User', email: 'guest@gogo.com', role: 'user' })}
                  className="text-white hover:text-primary text-[10px] font-bold uppercase tracking-widest border border-white/20 hover:border-primary px-3 py-1 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : user && user.name !== 'Guest User' ? (
              <button
                onClick={() => {
                  if (window.confirm("Do you want to logout?")) {
                    setUser({ name: 'Guest User', email: 'guest@gogo.com', role: 'user' });
                  }
                }}
                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer text-primary"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
                <span className="hidden sm:inline">{user.name}</span>
              </button>
            ) : (
              <button
                onClick={openLogin}
                className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">person</span>
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

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

                // Check for simulated manager
                if (selectedRole === 'manager') {
                  const isIdentifierMatch = loginIdentifier.toLowerCase() === 'marcus@gogoathletic.com' || loginIdentifier.toLowerCase() === 'marcus';
                  const isPasswordMatch = loginPassword === 'marcus123';
                  if (isIdentifierMatch && isPasswordMatch) {
                    name = "Marcus Thorne";
                    email = "marcus@gogoathletic.com";
                  } else {
                    alert("Invalid Administrator credentials! Try: marcus / marcus123");
                    return;
                  }
                } 
                // Check for simulated employee
                else if (selectedRole === 'employee') {
                  const isIdentifierMatch = loginIdentifier.toLowerCase() === 'dom@gogoathletic.com' || loginIdentifier.toLowerCase() === 'dom';
                  const isPasswordMatch = loginPassword === 'dom123';
                  if (isIdentifierMatch && isPasswordMatch) {
                    name = "Dominic Toretto";
                    email = "dom@gogoathletic.com";
                  } else {
                    alert("Invalid Employee credentials! Try: dom / dom123");
                    return;
                  }
                } 
                // Check for Customer login
                else {
                  const matchedUser = existingUsers.find(
                    u => u.email.toLowerCase() === loginIdentifier.toLowerCase() ||
                         (u.username && u.username.toLowerCase() === loginIdentifier.toLowerCase())
                  );

                  if (!matchedUser) {
                    // Check if it's the default guest demo values, then we can allow it as a quick demo bypass
                    if (loginIdentifier.toLowerCase() === 'guest@gogo.com' && loginPassword === 'guest123') {
                      name = "Guest User";
                      email = "guest@gogo.com";
                    } else {
                      alert("User account not found! Please create an account first.");
                      return;
                    }
                  } else {
                    if (matchedUser.password && matchedUser.password !== loginPassword) {
                      alert("Incorrect password! Please try again.");
                      return;
                    }
                    name = matchedUser.name;
                    email = matchedUser.email;
                  }
                }

                setUser({ name, email, role });
                closeLoginDrawer();
              }}
            >
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Simulate Role Select</label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    const r = e.target.value;
                    setSelectedRole(r);
                    if (r === 'manager') {
                      setLoginIdentifier('marcus@gogoathletic.com');
                      setLoginPassword('marcus123');
                    } else if (r === 'employee') {
                      setLoginIdentifier('dom@gogoathletic.com');
                      setLoginPassword('dom123');
                    } else {
                      setLoginIdentifier('guest@gogo.com');
                      setLoginPassword('guest123');
                    }
                  }}
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase tracking-widest"
                >
                  <option value="user" className="bg-neutral-950 text-neutral-100">User (Customer)</option>
                  <option value="employee" className="bg-neutral-950 text-neutral-100">Employee</option>
                  <option value="manager" className="bg-neutral-950 text-neutral-100">Manager</option>
                </select>
              </div>
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
