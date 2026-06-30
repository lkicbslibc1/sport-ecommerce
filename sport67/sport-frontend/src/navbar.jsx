import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({ setCurrentView }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isMobileNavLowOpacity, setIsMobileNavLowOpacity] = useState(false);
  
  // Member Login Drawer state
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isLoginActive, setIsLoginActive] = useState(false);

  const openLogin = () => {
    setIsLoginVisible(true);
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
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('home')}>Men</a>
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('home')}>Women</a>
            <a className="hover:text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('home')}>Kids</a>
            <a className="text-primary transition" href="#" onClick={() => setCurrentView && setCurrentView('home')}>Brands</a>
          </nav>
          
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
            
            <button 
              onClick={openLogin}
              className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[22px]">person</span>
              <span className="hidden sm:inline">Login</span>
            </button>

            <a className="flex items-center gap-2 font-bold text-[11px] uppercase tracking-widest hover:text-primary transition" href="#">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span className="hidden sm:inline">Bag (0)</span>
            </a>
            
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
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase tracking-widest" 
                  placeholder="YOURNAME@GMAIL.COM" 
                  type="email" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Password</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                  placeholder="••••••••" 
                  type="password" 
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
