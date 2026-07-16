import React, { useState, useEffect } from 'react';
import Navbar from './navbar.jsx';

export default function Login({ onViewChange, user, setUser }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: false
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const date = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).toUpperCase();

    const newUser = {
      id: Date.now(),
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: 'customer',
      isActive: true,
      joined: date
    };

    // Save to gogo_users in localStorage
    const existingUsers = JSON.parse(localStorage.getItem("gogo_users") || "[]");

    // Check if username or email already exists
    const usernameExists = existingUsers.some(u => u.username.toLowerCase() === formData.username.toLowerCase());
    const emailExists = existingUsers.some(u => u.email && u.email.toLowerCase() === formData.email.toLowerCase());

    if (usernameExists) {
      alert("Username already exists!");
    } else if (emailExists) {
      alert("Email already exists!");
    } else {
      existingUsers.push(newUser);
      localStorage.setItem("gogo_users", JSON.stringify(existingUsers));

      if (setUser) {
        setUser({
          username: formData.username,
          email: formData.email,
          role: 'customer'
        });
      }
      alert(`Account created successfully for ${formData.username}!`);
      if (onViewChange) {
        onViewChange('home');
      }
    }
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Shared Header Navigation */}
      <Navbar setCurrentView={onViewChange} user={user} setUser={setUser} />

      <main className="min-h-screen pt-24 pb-32 flex items-center justify-center relative overflow-hidden">
        {/* Background Asset */}
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="https://lh3.googleusercontent.com/aida/AP1WRLuirDahRI53WH2PY_geVyGFdvgvLJyt4hxRJWnSxxHlJX3jyxKgZ74ROyCAURFJwW8EHw5hztk_VfMkY5RHDuSggHNS0VyLu6AUKmOEIQjfYMCe5LaYgukEQBz38VGAIl37xvG4Of1OOUCyMgJ68QFqbLI5dlS6hTE7vK8ggOU0iTp2F4Z6jVz9srcyCrhlV_1Bpjh-FHcZg2FFXNAO2dLeBCQ1SkyplgV7KOkrQDY35B8Og3mz-x4Lfcw"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale contrast-125"
            alt="Background Runner"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#131313] via-transparent to-[#131313]"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Narrative/Brand */}
          <div className="hidden lg:block lg:col-span-6">
            <h1 className="font-display-xl text-display-xl italic uppercase mb-4 leading-[0.8] kinetic-skew">
              UNLEASH<br />
              <span className="text-[#ffb59e]">ELITE</span><br />
              POWER
            </h1>
            <p className="font-body-md text-[#a1a1a1] max-w-md tracking-wide">
              Join the global collective of high-performance athletes. Engineering-led gear for those who refuse to settle.
            </p>
          </div>

          {/* Right Side: Registration Form */}
          <div className="lg:col-span-6 flex items-center justify-center lg:justify-end">
            <div className="glass-panel w-full max-w-xl p-8 md:p-12">
              <div className="mb-10">
                <h2 className="font-headline-md text-headline-md italic uppercase text-[#ffb59e]">CREATE ACCOUNT</h2>
                <p className="font-title-sm text-title-sm text-[#a1a1a1] mt-2">ACCESS THE INNER CIRCLE</p>
              </div>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="relative focus-within:scale-[1.01] transition-transform duration-200">
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-[#353534] font-label-xs text-label-xs text-[#e5e2e1] uppercase py-3 input-border-anim placeholder:text-[#bdbdba]"
                    placeholder="USERNAME"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="relative focus-within:scale-[1.01] transition-transform duration-200">
                  <input
                    className="w-full bg-transparent border-0 border-b-2 border-[#353534] font-label-xs text-label-xs text-[#e5e2e1] uppercase py-3 input-border-anim placeholder:text-[#bdbdba]"
                    placeholder="EMAIL ADDRESS"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative focus-within:scale-[1.01] transition-transform duration-200">
                    <input
                      className="w-full bg-transparent border-0 border-b-2 border-[#353534] font-label-xs text-label-xs text-[#e5e2e1] uppercase py-3 input-border-anim  placeholder:text-[#bdbdba]"
                      placeholder="PASSWORD"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="relative focus-within:scale-[1.01] transition-transform duration-200">
                    <input
                      className="w-full bg-transparent border-0 border-b-2 border-[#353534] font-label-xs text-label-xs text-[#e5e2e1] uppercase py-3 input-border-anim  placeholder:text-[#bdbdba]"
                      placeholder="CONFIRM PASSWORD"
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-[#ff4e00] text-[#5e1700] font-headline-md text-headline-md italic py-6 uppercase tracking-tighter hover:scale-[1.02] active:scale-95 transition-transform duration-200 shadow-[0_0_40px_-10px_rgba(255,78,0,0.5)] cursor-pointer"
                  >
                    JOIN THE TEAM
                  </button>
                </div>
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => onViewChange && onViewChange('home')}
                    className="font-title-sm text-title-sm text-[#a1a1a1] hover:text-[#ffb59e] transition-colors uppercase cursor-pointer bg-transparent border-none"
                  >
                    ALREADY HAVE AN ACCOUNT? LOG IN
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full mt-32 border-t border-[#5c4037] bg-[#131313]">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-12 max-w-[1440px] mx-auto">
          <div className="mb-8 md:mb-0">
            <span className="font-headline-md text-headline-md text-[#e5e2e1] italic">GOGO ATHLETIC</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
            <button onClick={() => onViewChange && onViewChange('home')} className="font-label-xs text-label-xs tracking-widest uppercase text-[#a1a1a1] hover:text-[#ffb59e] transition-colors cursor-pointer bg-transparent border-none">
              PRIVACY
            </button>
            <button onClick={() => onViewChange && onViewChange('home')} className="font-label-xs text-label-xs tracking-widest uppercase text-[#a1a1a1] hover:text-[#ffb59e] transition-colors cursor-pointer bg-transparent border-none">
              TERMS
            </button>
            <button onClick={() => onViewChange && onViewChange('home')} className="font-label-xs text-label-xs tracking-widest uppercase text-[#a1a1a1] hover:text-[#ffb59e] transition-colors cursor-pointer bg-transparent border-none">
              SHIPPING
            </button>
            <button onClick={() => onViewChange && onViewChange('home')} className="font-label-xs text-label-xs tracking-widest uppercase text-[#a1a1a1] hover:text-[#ffb59e] transition-colors cursor-pointer bg-transparent border-none">
              CAREERS
            </button>
          </div>
          <div>
            <p className="font-label-xs text-label-xs tracking-widest uppercase text-[#a1a1a1]">© 2024 GOGO ATHLETIC. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
