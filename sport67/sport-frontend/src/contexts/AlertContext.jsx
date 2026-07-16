import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const AlertContext = createContext(null);

export function useAlert() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}

export function AlertProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  // type can be 'info', 'success', 'error', 'warning'
  const showAlert = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setAlerts(prev => [...prev, { id, message, type }]);
  }, []);

  const closeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Modals Overlay */}
      {alerts.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm" />
          <div className="relative flex flex-col gap-4 max-w-sm w-full mx-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-gradient-to-b from-[#1c1b1b] to-[#131313] border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] rounded-[32px] overflow-hidden animate-modalPop flex flex-col items-center p-10 relative text-center"
              >
                {/* Icon Container */}
                <div className="mb-6 flex justify-center">
                  {alert.type === 'error' && (
                    <div className="bg-[#ff4e50] rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-[#ff4e50]/20 border border-[#ff4e50]/30">
                      <X size={40} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  {alert.type === 'success' && (
                    <div className="bg-[#4caf50] rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-[#4caf50]/20 border border-[#4caf50]/30">
                      <CheckCircle size={40} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  {alert.type === 'warning' && (
                    <div className="bg-[#ff9800] rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-[#ff9800]/20 border border-[#ff9800]/30">
                      <AlertTriangle size={40} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                  {alert.type === 'info' && (
                    <div className="bg-[#ff5719] rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-[#ff5719]/20 border border-[#ff5719]/30">
                      <Info size={40} className="text-white" strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <h3 className="text-lg md:text-xl font-bold text-white mb-8 font-inter tracking-tight leading-relaxed max-w-[280px]">
                  {alert.message}
                </h3>

                {/* Pill Button */}
                <button
                  onClick={() => closeAlert(alert.id)}
                  className="bg-[#ff5719] hover:bg-[#ff7340] text-black px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 w-full max-w-[240px] shadow-lg shadow-[#ff5719]/20 hover:scale-105"
                >
                  Ok
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}
