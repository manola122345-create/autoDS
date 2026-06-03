// api/cj.js — Vercel Serverless Function
// Gère toutes les requêtes CJ Dropshipping côté serveur

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

async function getCJToken() {
  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.CJ_EMAIL,
      password: process.env.CJ_PASSWORD
    })
  });
  const data = await res.json();
  if (!data.result) throw new Error("CJ Auth failed: " + data.message);
  return data.data.accessToken;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action } = req.query;

  try {
    const token = await getCJToken();

    // ── SEARCH PRODUCTS ──────────────────────────────
    if (action === "search") {
      const { keyword = "", page = 1, limit = 20, categoryId = "" } = req.query;
      const r = await fetch(
        `${CJ_BASE}/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=${limit}${categoryId ? `&categoryId=${categoryId}` : ""}`,
        { headers: { "CJ-Access-Token": token } }
      );
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── GET PRODUCT DETAIL ───────────────────────────
    if (action === "product") {
      const { pid } = req.query;
      const r = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── GET CATEGORIES ───────────────────────────────
    if (action === "categories") {
      const r = await fetch(`${CJ_BASE}/product/getCategory`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── CREATE ORDER ─────────────────────────────────
    if (action === "create_order" && req.method === "POST") {
      const body = req.body;
      const r = await fetch(`${CJ_BASE}/shopping/order/createOrder`, {
        method: "POST",
        headers: { "CJ-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── GET ORDER STATUS ─────────────────────────────
    if (action === "order_status") {
      const { orderId } = req.query;
      const r = await fetch(`${CJ_BASE}/shopping/order/getOrderDetail?orderId=${orderId}`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── GET TRACKING ─────────────────────────────────
    if (action === "tracking") {
      const { orderId } = req.query;
      const r = await fetch(`${CJ_BASE}/shopping/order/getOrderDetail?orderId=${orderId}`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    // ── CHECK STOCK ──────────────────────────────────
    if (action === "stock") {
      const { vid } = req.query;
      const r = await fetch(`${CJ_BASE}/product/stock/queryByVid?vid=${vid}`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }

    return res.status(400).json({ error: "Action inconnue" });

  } catch (err) {
    console.error("CJ API Error:", err);
    return res.status(500).json({ error: err.message });
  }
}
