// api/cj.js — Vercel Serverless Function (CommonJS)
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
  if (!data.result) throw new Error("CJ Auth failed: " + JSON.stringify(data));
  return data.data.accessToken;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action } = req.query;

  try {
    const token = await getCJToken();

    if (action === "search") {
      const { keyword = "", page = 1, limit = 20 } = req.query;
      const r = await fetch(
        `${CJ_BASE}/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=${limit}`,
        { headers: { "CJ-Access-Token": token } }
      );
      const data = await r.json();
      return res.status(200).json(data);
    }

    if (action === "product") {
      const { pid } = req.query;
      const r = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, {
        headers: { "CJ-Access-Token": token }
      });
      return res.status(200).json(await r.json());
    }

    if (action === "categories") {
      const r = await fetch(`${CJ_BASE}/product/getCategory`, {
        headers: { "CJ-Access-Token": token }
      });
      return res.status(200).json(await r.json());
    }

    if (action === "create_order" && req.method === "POST") {
      const r = await fetch(`${CJ_BASE}/shopping/order/createOrder`, {
        method: "POST",
        headers: { "CJ-Access-Token": token, "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json(await r.json());
    }

    if (action === "order_status") {
      const { orderId } = req.query;
      const r = await fetch(`${CJ_BASE}/shopping/order/getOrderDetail?orderId=${orderId}`, {
        headers: { "CJ-Access-Token": token }
      });
      return res.status(200).json(await r.json());
    }

    if (action === "tracking") {
      const { orderId } = req.query;
      const r = await fetch(`${CJ_BASE}/shopping/order/getOrderDetail?orderId=${orderId}`, {
        headers: { "CJ-Access-Token": token }
      });
      return res.status(200).json(await r.json());
    }

    if (action === "stock") {
      const { vid } = req.query;
      const r = await fetch(`${CJ_BASE}/product/stock/queryByVid?vid=${vid}`, {
        headers: { "CJ-Access-Token": token }
      });
      return res.status(200).json(await r.json());
    }

    if (action === "test") {
      return res.status(200).json({
        success: true,
        message: "API CJ fonctionne !",
        email: process.env.CJ_EMAIL ? "✅ Email configuré" : "❌ Email manquant",
        password: process.env.CJ_PASSWORD ? "✅ Password configuré" : "❌ Password manquant",
        token: token ? "✅ Token obtenu" : "❌ Token échoué"
      });
    }

    return res.status(400).json({ error: "Action inconnue: " + action });

  } catch (err) {
    console.error("CJ API Error:", err);
    return res.status(500).json({
      error: err.message,
      email: process.env.CJ_EMAIL ? "configuré" : "MANQUANT",
      password: process.env.CJ_PASSWORD ? "configuré" : "MANQUANT"
    });
  }
};
