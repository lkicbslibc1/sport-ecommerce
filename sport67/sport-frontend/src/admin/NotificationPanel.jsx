import React from 'react';
import { X, Bell, Package, ShoppingCart, AlertTriangle, TrendingUp, Clock, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext.jsx';

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  product_update: {
    icon: Package,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    dot: 'bg-blue-400',
  },
  new_order: {
    icon: ShoppingCart,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    dot: 'bg-emerald-400',
  },
  high_value_order: {
    icon: TrendingUp,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/20',
    dot: 'bg-yellow-400',
  },
  low_stock: {
    icon: AlertTriangle,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    dot: 'bg-orange-400',
  },
  out_of_stock: {
    icon: AlertTriangle,
    color: 'text-red-400',
    bg: 'bg-red-500/10 border-red-500/20',
    dot: 'bg-red-500',
  },
  stale_order: {
    icon: Clock,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    dot: 'bg-purple-400',
  },
  revenue_summary: {
    icon: TrendingUp,
    color: 'text-orange-300',
    bg: 'bg-orange-300/10 border-orange-300/20',
    dot: 'bg-orange-300',
  },
};

function relativeTime(isoString) {
  if (!isoString) return '';
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'เมื่อสักครู่';
  if (mins < 60) return `${mins} นาทีที่แล้ว`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} ชั่วโมงที่แล้ว`;
  const days = Math.floor(hrs / 24);
  return `${days} วันที่แล้ว`;
}

export default function NotificationPanel() {
  const { notifications, unreadCount, panelOpen, setPanelOpen, markAsRead, markAllAsRead, clearAll } = useNotifications();

  if (!panelOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={() => setPanelOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-[420px] bg-neutral-950 border-l border-white/10 flex flex-col shadow-2xl animate-slideInRight">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-orange-300" />
            <h2 className="font-black italic uppercase text-lg tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setPanelOpen(false)}
            className="hover:rotate-90 transition-transform duration-300 text-neutral-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02] shrink-0">
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-orange-300 transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-neutral-400 hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-neutral-600">
              <Bell size={48} strokeWidth={1} />
              <p className="text-sm uppercase tracking-widest font-bold">ไม่มีการแจ้งเตือน</p>
              <p className="text-xs text-neutral-700">No notifications yet</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {notifications.map((noti) => {
                const cfg = TYPE_CONFIG[noti.type] || TYPE_CONFIG.new_order;
                const Icon = cfg.icon;
                return (
                  <li
                    key={noti.id}
                    onClick={() => markAsRead(noti.id)}
                    className={`px-6 py-5 cursor-pointer transition-all hover:bg-white/[0.03] relative ${
                      !noti.read ? 'bg-white/[0.02]' : ''
                    }`}
                  >
                    {/* Unread indicator */}
                    {!noti.read && (
                      <span className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    )}

                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${cfg.bg}`}>
                        <Icon size={18} className={cfg.color} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm leading-tight mb-1 ${noti.read ? 'text-neutral-400' : 'text-neutral-100'}`}>
                          {noti.title}
                        </p>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {noti.message}
                        </p>
                        <p className="text-[10px] text-neutral-600 mt-2 uppercase tracking-widest">
                          {relativeTime(noti.timestamp)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 shrink-0">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest text-center">
            {notifications.length} notification{notifications.length !== 1 ? 's' : ''} • อัปเดตทุก 30 วินาที
          </p>
        </div>
      </div>
    </>
  );
}
