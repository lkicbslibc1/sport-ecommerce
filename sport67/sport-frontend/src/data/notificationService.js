// notificationService.js
// Standalone helpers for pushing notifications to staff (__manager__ / __employee__)
// Can be called from anywhere without React context.

const API_BASE = 'http://localhost:5000/api';
const LOW_STOCK_THRESHOLD = 5;

// ─── Core API helpers ──────────────────────────────────────────────────────────

async function fetchNoti() {
  try {
    const res = await fetch(`${API_BASE}/noti`);
    return res.ok ? await res.json() : {};
  } catch {
    return {};
  }
}

async function saveNoti(data) {
  try {
    await fetch(`${API_BASE}/noti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.error('[Noti] Failed to save:', err);
  }
}

function makeId() {
  return `noti_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Push helpers ──────────────────────────────────────────────────────────────

/**
 * Push a notification to one or more target keys (__manager__, __employee__, or username)
 * @param {string|string[]} targets  e.g. '__employee__' or ['__manager__','__employee__']
 * @param {object}          noti     notification payload (without id/timestamp/read)
 */
export async function pushNoti(targets, noti) {
  const allNotis = await fetchNoti();
  const arr = Array.isArray(targets) ? targets : [targets];
  const full = { id: makeId(), timestamp: new Date().toISOString(), read: false, ...noti };
  arr.forEach(key => {
    allNotis[key] = [full, ...(allNotis[key] || [])];
  });
  await saveNoti(allNotis);
}

// ─── Domain-specific senders ───────────────────────────────────────────────────

/** Notify employees: Manager added/edited/deleted a product */
export async function notifyProductChange(action, productName, details = "") {
  // action: 'added' | 'updated' | 'deleted'
  const actionLabel = action === 'added' ? 'เพิ่ม' : action === 'updated' ? 'แก้ไข' : 'ลบ';
  const icon = action === 'added' ? '🟢' : action === 'updated' ? '🟡' : '🔴';
  await pushNoti('__employee__', {
    type: 'product_update',
    action,
    title: `${icon} Manager ${actionLabel}สินค้า`,
    message: `"${productName}" ถูก${actionLabel}โดย Manager${details ? `\nรายละเอียด: ${details}` : ''}`,
  });
}

/** Notify staff: New order placed */
export async function notifyNewOrder(orderId, customer, total) {
  const payload = {
    type: 'new_order',
    title: '🛒 ออเดอร์ใหม่เข้ามาแล้ว!',
    message: `Order ${orderId} จาก ${customer} — ฿${total.toLocaleString('th-TH')}`,
    orderId,
  };
  const targets = ['__employee__', '__manager__'];
  await pushNoti(targets, payload);
}

/** Notify both roles: Low stock / Out of stock */
export async function notifyStockAlert(products) {
  if (!products || products.length === 0) return;

  const allNotis = await fetchNoti();

  const outOfStock = products.filter(p => p.amount === 0);
  const lowStock   = products.filter(p => p.amount > 0 && p.amount < LOW_STOCK_THRESHOLD);

  const makeId = () => `noti_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // Helper: check if we've already sent this alert recently (within 1 hour) to avoid spam
  const alreadySent = (key, productId, type) => {
    const existing = allNotis[key] || [];
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return existing.some(n =>
      n.type === type &&
      n.productId === productId &&
      new Date(n.timestamp).getTime() > oneHourAgo
    );
  };

  const targets = ['__manager__', '__employee__'];

  for (const p of outOfStock) {
    for (const key of targets) {
      if (!alreadySent(key, p.id, 'out_of_stock')) {
        allNotis[key] = [
          {
            id: makeId(),
            timestamp: now,
            read: false,
            type: 'out_of_stock',
            title: '🚫 สินค้าหมด Stock!',
            message: `"${p.name}" หมด stock แล้ว — กรุณาเติมสินค้า`,
            productId: p.id,
          },
          ...(allNotis[key] || []),
        ];
      }
    }
  }

  for (const p of lowStock) {
    for (const key of targets) {
      if (!alreadySent(key, p.id, 'low_stock')) {
        allNotis[key] = [
          {
            id: makeId(),
            timestamp: now,
            read: false,
            type: 'low_stock',
            title: '⚠️ สินค้าใกล้หมด Stock!',
            message: `"${p.name}" เหลือแค่ ${p.amount} ชิ้น`,
            productId: p.id,
          },
          ...(allNotis[key] || []),
        ];
      }
    }
  }

  await saveNoti(allNotis);
}

/** Notify both roles: Orders stale > 3 days (Preparing or Shipped, no update) */
export async function notifyStaleOrders(orders) {
  if (!orders || orders.length === 0) return;

  const allNotis = await fetchNoti();
  const now = new Date();
  const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
  const makeId = () => `noti_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const nowIso = now.toISOString();

  const staleOrders = orders.filter(o => {
    if (!['Preparing', 'Shipped'].includes(o.status)) return false;
    // Parse order date — format: "JUL 18, 2026"
    const parsed = new Date(o.date);
    if (isNaN(parsed.getTime())) return false;
    return now.getTime() - parsed.getTime() > THREE_DAYS_MS;
  });

  const targets = ['__manager__', '__employee__'];

  const alreadySent = (key, orderId) => {
    const existing = allNotis[key] || [];
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return existing.some(n =>
      n.type === 'stale_order' &&
      n.orderId === orderId &&
      new Date(n.timestamp).getTime() > oneDayAgo
    );
  };

  for (const o of staleOrders) {
    for (const key of targets) {
      if (!alreadySent(key, o.id)) {
        allNotis[key] = [
          {
            id: makeId(),
            timestamp: nowIso,
            read: false,
            type: 'stale_order',
            title: '⏰ ออเดอร์ค้างนานกว่า 3 วัน!',
            message: `Order ${o.id} (${o.customer}) ยังเป็น "${o.status}" — ไม่ได้รับการอัปเดตมากกว่า 3 วัน`,
            orderId: o.id,
          },
          ...(allNotis[key] || []),
        ];
      }
    }
  }

  await saveNoti(allNotis);
}


export { LOW_STOCK_THRESHOLD };
