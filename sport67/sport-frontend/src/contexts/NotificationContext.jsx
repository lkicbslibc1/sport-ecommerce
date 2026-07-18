import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notifyStockAlert, notifyStaleOrders, notifyDailyRevenue, LOW_STOCK_THRESHOLD } from '../data/notificationService.js';

const NotificationContext = createContext(null);

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

const API_BASE = 'http://localhost:5000/api';
const POLL_INTERVAL  = 30_000;  // 30s — refresh notification list
const CHECK_INTERVAL = 5 * 60_000; // 5min — stock + stale order check

export function NotificationProvider({ user, products, children }) {
  const [notifications, setNotifications] = useState([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const lastRevenueDate = useRef(null);

  // Which noti key to read for this user
  const staffKey = user?.role === 'manager' ? '__manager__' : '__employee__';

  // ─── Fetch from API ───────────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!user || !['manager', 'employee'].includes(user.role)) return;
    try {
      const res = await fetch(`${API_BASE}/noti`);
      if (!res.ok) return;
      const all = await res.json();
      const mine = all[staffKey] || [];
      setNotifications(mine);
    } catch {/* silent */}
  }, [user, staffKey]);

  // ─── Mark as read ─────────────────────────────────────────────────────────────
  const markAsRead = useCallback(async (id) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      // persist
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/noti`);
          const all = res.ok ? await res.json() : {};
          all[staffKey] = updated;
          await fetch(`${API_BASE}/noti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(all),
          });
        } catch {/* silent */}
      })();
      return updated;
    });
  }, [staffKey]);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/noti`);
          const all = res.ok ? await res.json() : {};
          all[staffKey] = updated;
          await fetch(`${API_BASE}/noti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(all),
          });
        } catch {/* silent */}
      })();
      return updated;
    });
  }, [staffKey]);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    try {
      const res = await fetch(`${API_BASE}/noti`);
      const all = res.ok ? await res.json() : {};
      all[staffKey] = [];
      await fetch(`${API_BASE}/noti`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(all),
      });
    } catch {/* silent */}
  }, [staffKey]);

  // ─── Background checks (stock + stale orders) ─────────────────────────────────
  const runChecks = useCallback(async () => {
    if (!products || products.length === 0) return;
    // Stock alert
    await notifyStockAlert(products);
    // Stale orders
    try {
      const res = await fetch(`${API_BASE}/orders`);
      const orders = res.ok ? await res.json() : [];
      await notifyStaleOrders(orders);
    } catch {/* silent */}
    // Refresh our local list after checks
    await fetchNotifications();
  }, [products, fetchNotifications]);

  // ─── Daily revenue for manager ─────────────────────────────────────────────────
  const checkDailyRevenue = useCallback(async () => {
    if (user?.role !== 'manager') return;
    const todayStr = new Date().toDateString();
    if (lastRevenueDate.current === todayStr) return;
    lastRevenueDate.current = todayStr;

    try {
      const res = await fetch(`${API_BASE}/orders`);
      const orders = res.ok ? await res.json() : [];
      const todayLabel = new Date()
        .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        .toUpperCase();
      const todayOrders = orders.filter(
        o => o.date && o.date.toUpperCase() === todayLabel && o.status !== 'Cancelled'
      );
      const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      await notifyDailyRevenue(todayRevenue, todayOrders.length, todayLabel);
      await fetchNotifications();
    } catch {/* silent */}
  }, [user, fetchNotifications]);

  // ─── Polling ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !['manager', 'employee'].includes(user.role)) return;

    fetchNotifications();
    checkDailyRevenue();

    const pollTimer = setInterval(fetchNotifications, POLL_INTERVAL);
    const checkTimer = setInterval(runChecks, CHECK_INTERVAL);

    // Run first check after 5s to avoid blocking initial render
    const firstCheck = setTimeout(runChecks, 5000);

    return () => {
      clearInterval(pollTimer);
      clearInterval(checkTimer);
      clearTimeout(firstCheck);
    };
  }, [user, fetchNotifications, runChecks, checkDailyRevenue]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      panelOpen,
      setPanelOpen,
      markAsRead,
      markAllAsRead,
      clearAll,
      fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
