// Service CJ Dropshipping — appelle nos serverless functions Vercel

const API = "/api/cj";

export async function cjSearchProducts(keyword, page = 1, limit = 20) {
  const r = await fetch(`${API}?action=search&keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`);
  return r.json();
}

export async function cjGetProduct(pid) {
  const r = await fetch(`${API}?action=product&pid=${pid}`);
  return r.json();
}

export async function cjGetCategories() {
  const r = await fetch(`${API}?action=categories`);
  return r.json();
}

export async function cjCreateOrder(orderData) {
  const r = await fetch(`${API}?action=create_order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });
  return r.json();
}

export async function cjGetOrderStatus(orderId) {
  const r = await fetch(`${API}?action=order_status&orderId=${orderId}`);
  return r.json();
}

export async function cjGetTracking(orderId) {
  const r = await fetch(`${API}?action=tracking&orderId=${orderId}`);
  return r.json();
}

export async function cjCheckStock(vid) {
  const r = await fetch(`${API}?action=stock&vid=${vid}`);
  return r.json();
}
