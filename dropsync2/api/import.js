// api/import.js — Import produit depuis URL CJ ou AliExpress
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
  if (!data.result) throw new Error("Auth failed");
  return data.data.accessToken;
}

// Détection automatique de catégorie
function detectCategory(title, cjCategory) {
  const text = (title + " " + (cjCategory || "")).toLowerCase();

  const rules = [
    {
      cat: "Electronique",
      keywords: [
        "phone","headphone","earphone","bluetooth","wireless","speaker","charger",
        "laptop","computer","tablet","watch","smartwatch","camera","led","light",
        "lamp","keyboard","mouse","cable","usb","battery","power bank","écouteur",
        "casque","montre","chargeur","lampe","clavier","enceinte","électronique",
        "electronic","gadget","tech","wifi","smart","rgb","gaming","drone","tv","screen"
      ]
    },
    {
      cat: "Sport",
      keywords: [
        "sport","fitness","yoga","gym","running","cycling","bike","swim","football",
        "basketball","tennis","hiking","outdoor","exercise","workout","resistance",
        "band","dumbbell","weight","protein","jump rope","mat","gloves","shoes",
        "sportswear","jersey","training","muscle","crossfit","pilates","stretching"
      ]
    },
    {
      cat: "Lifestyle",
      keywords: [
        "lifestyle","fashion","bag","wallet","watch","jewelry","accessory","beauty",
        "skincare","perfume","makeup","hair","nail","decor","home","candle","aroma",
        "diffuser","plant","photo","frame","art","travel","luggage","sunglasses",
        "clothes","shirt","dress","pants","shoes","hat","scarf","bracelet","ring"
      ]
    }
  ];

  // Compte les correspondances pour chaque catégorie
  const scores = rules.map(r => ({
    cat: r.cat,
    score: r.keywords.filter(k => text.includes(k)).length
  }));

  // Retourne la catégorie avec le score le plus élevé
  const best = scores.sort((a, b) => b.score - a.score)[0];
  return best.score > 0 ? best.cat : "Electronique"; // Electronique par défaut
}

function extractCJPid(url) {
  // Formats: /product/name-p-XXXXX.html ou /product-detail.html?id=XXXXX
  const match1 = url.match(/\-p\-([a-zA-Z0-9]+)\.html/);
  const match2 = url.match(/[?&]id=([a-zA-Z0-9]+)/);
  const match3 = url.match(/\/([a-zA-Z0-9]{20,})/);
  return match1?.[1] || match2?.[1] || match3?.[1] || null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL manquante" });

  try {
    const decodedUrl = decodeURIComponent(url);

    // ── CJ Dropshipping ──
    if (decodedUrl.includes("cjdropshipping.com")) {
      const pid = extractCJPid(decodedUrl);
      if (!pid) return res.status(400).json({ error: "ID produit CJ introuvable dans l'URL" });

      const token = await getCJToken();
      const r = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, {
        headers: { "CJ-Access-Token": token }
      });
      const data = await r.json();

      if (!data.result || !data.data) {
        return res.status(404).json({ error: "Produit CJ introuvable", pid });
      }

      const p = data.data;
      const detectedCategory = detectCategory(
        p.productNameEn || p.productName,
        p.categoryName
      );
      return res.status(200).json({
        source: "CJ Dropshipping",
        title: p.productNameEn || p.productName,
        image: p.productImage || p.imgUrl,
        cost: parseFloat(p.sellPrice || p.productPrice || 0),
        description: p.description || "",
        category: detectedCategory,
        categoryOriginal: p.categoryName || "",
        stock: p.inventory || 100,
        cjPid: pid,
        supplier: "CJ Dropshipping",
        url: decodedUrl
      });
    }

    // ── AliExpress (scraping basique via métadonnées) ──
    if (decodedUrl.includes("aliexpress.com")) {
      // Récupère les métadonnées Open Graph de la page
      const r = await fetch(decodedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8"
        }
      });
      const html = await r.text();

      // Extraire les données
      const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
      const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
      const priceMatch = html.match(/\"price\":\s*\"?([0-9.]+)\"?/) ||
                        html.match(/originalPrice[^>]*>.*?([0-9]+\.?[0-9]*)/);
      const descMatch = html.match(/<meta property="og:description" content="([^"]+)"/);

      const title = titleMatch?.[1]?.replace(/\s*-\s*AliExpress.*$/i, "").trim() || "Produit AliExpress";
      const image = imageMatch?.[1] || "";
      const cost = parseFloat(priceMatch?.[1] || 0);
      const description = descMatch?.[1] || "";
      const detectedCategory = detectCategory(title, "");

      return res.status(200).json({
        source: "AliExpress",
        title,
        image,
        cost,
        description,
        category: detectedCategory,
        stock: 100,
        supplier: "AliExpress",
        url: decodedUrl,
        note: cost === 0 ? "Prix non trouvé — entre-le manuellement" : null
      });
    }

    return res.status(400).json({
      error: "URL non supportée. Utilise une URL CJ Dropshipping ou AliExpress."
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
