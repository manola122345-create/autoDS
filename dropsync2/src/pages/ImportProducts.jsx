import { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import toast from "react-hot-toast";
import {
  Link2, Plus, Package, Loader2, X, Save,
  ExternalLink, ShoppingBag, Star, AlertCircle, Check
} from "lucide-react";

const CATS = ["Electronique", "Sport", "Lifestyle", "Maison", "Mode", "Autre"];
const SUPPLIERS = ["CJ Dropshipping", "AliExpress", "Zendrop", "Spocket", "Autre"];

// ── MODAL IMPORT PAR URL ──
function ImportModal({ data, onClose, onSave }) {
  const [f, setF] = useState({
    title: data.title || "",
    image: data.image || "",
    cost: data.cost || "",
    price: data.cost ? parseFloat((data.cost * 2.5).toFixed(2)) : "",
    stock: data.stock || 100,
    category: data.category || "Electronique",
    description: data.description || "",
    supplier: data.supplier || "CJ Dropshipping",
    status: "draft",
    badge: "",
    cjPid: data.cjPid || "",
    sourceUrl: data.url || ""
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const profit = f.cost && f.price
    ? (parseFloat(f.price) - parseFloat(f.cost)).toFixed(2)
    : null;
  const margin = f.cost && f.price
    ? (((parseFloat(f.price) - parseFloat(f.cost)) / parseFloat(f.price)) * 100).toFixed(0)
    : null;

  async function handleSave() {
    if (!f.title || !f.cost || !f.price) return toast.error("Titre, coût et prix requis");
    setSaving(true);
    try {
      await onSave({
        ...f,
        cost: parseFloat(f.cost),
        price: parseFloat(f.price),
        stock: parseInt(f.stock) || 100,
        orders: 0
      });
      toast.success("Produit importé dans DropSync ! ✅");
      onClose();
    } catch { toast.error("Erreur d'import"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Importer le produit</h2>
            <p className="text-xs text-gray-400 mt-0.5">Source : {data.source}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Preview */}
          {f.image && (
            <div className="flex gap-4 p-3 bg-gray-50 rounded-xl">
              <img src={f.image} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900 line-clamp-2">{f.title}</p>
                <p className="text-xs text-blue-500 mt-1 font-semibold">{data.source}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                    🎯 Catégorie détectée : {f.category}
                  </span>
                  {data.categoryOriginal && (
                    <span className="text-xs text-gray-400">({data.categoryOriginal})</span>
                  )}
                </div>
                {data.note && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-600">
                    <AlertCircle className="w-3 h-3" />{data.note}
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Nom du produit *</label>
            <input value={f.title} onChange={e => set("title", e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Fournisseur</label>
              <select value={f.supplier} onChange={e => set("supplier", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Catégorie</label>
              <select value={f.category} onChange={e => set("category", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[["Coût ($) *", "cost"], ["Prix de vente ($) *", "price"], ["Stock", "stock"]].map(([l, k]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">{l}</label>
                <input type="number" step="0.01" value={f[k]} onChange={e => set(k, e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
              </div>
            ))}
          </div>

          {profit && (
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center border border-blue-100">
              <div>
                <p className="text-xs text-blue-500 font-semibold mb-1">Profit/unité</p>
                <p className="text-xl font-black text-blue-700">${profit}</p>
              </div>
              <div>
                <p className="text-xs text-green-500 font-semibold mb-1">Marge</p>
                <p className="text-xl font-black text-green-700">{margin}%</p>
              </div>
              <div>
                <p className="text-xs text-purple-500 font-semibold mb-1">ROI</p>
                <p className="text-xl font-black text-purple-700">
                  {((parseFloat(profit) / parseFloat(f.cost)) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">URL Image</label>
            <input value={f.image} onChange={e => set("image", e.target.value)} placeholder="https://..."
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
            <textarea value={f.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white resize-none"
              placeholder="Description du produit..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Badge (ex: Nouveau)</label>
              <input value={f.badge} onChange={e => set("badge", e.target.value)} placeholder="Nouveau"
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Statut</label>
              <select value={f.status} onChange={e => set("status", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                <option value="draft">Brouillon</option>
                <option value="active">Actif (visible sur la boutique)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">
            Annuler
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Importer dans DropSync
          </button>
        </div>
      </div>
    </div>
  );
}

// ── MODAL AJOUT MANUEL ──
function ManualModal({ onClose, onSave }) {
  const [f, setF] = useState({
    title: "", image: "", cost: "", price: "", stock: "100",
    category: "Electronique", description: "", supplier: "CJ Dropshipping",
    status: "draft", badge: ""
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setF(p => ({ ...p, [k]: v }));

  const profit = f.cost && f.price
    ? (parseFloat(f.price) - parseFloat(f.cost)).toFixed(2) : null;

  async function handleSave() {
    if (!f.title || !f.cost || !f.price) return toast.error("Titre, coût et prix requis");
    setSaving(true);
    try {
      await onSave({
        ...f,
        cost: parseFloat(f.cost),
        price: parseFloat(f.price),
        stock: parseInt(f.stock) || 100,
        orders: 0
      });
      toast.success("Produit ajouté ! ✅");
      onClose();
    } catch { toast.error("Erreur"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Ajouter manuellement</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Nom du produit *</label>
            <input value={f.title} onChange={e => set("title", e.target.value)} placeholder="Ex: Écouteurs Bluetooth Pro"
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Fournisseur</label>
              <select value={f.supplier} onChange={e => set("supplier", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Catégorie</label>
              <select value={f.category} onChange={e => set("category", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[["Coût ($) *", "cost"], ["Prix de vente ($) *", "price"], ["Stock", "stock"]].map(([l, k]) => (
              <div key={k}>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">{l}</label>
                <input type="number" step="0.01" value={f[k]} onChange={e => set(k, e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
              </div>
            ))}
          </div>
          {profit && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-6 text-center">
              <div className="flex-1"><p className="text-xs text-blue-500 mb-1">Profit</p><p className="text-xl font-black text-blue-700">${profit}</p></div>
              <div className="flex-1"><p className="text-xs text-green-500 mb-1">Marge</p><p className="text-xl font-black text-green-700">{(((parseFloat(f.price)-parseFloat(f.cost))/parseFloat(f.price))*100).toFixed(0)}%</p></div>
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">URL Image (copie depuis CJ/AliExpress)</label>
            <input value={f.image} onChange={e => set("image", e.target.value)} placeholder="https://..."
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white" />
            {f.image && <img src={f.image} alt="" className="w-16 h-16 object-cover rounded-xl mt-2 border border-gray-200" />}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Description</label>
            <textarea value={f.description} onChange={e => set("description", e.target.value)} rows={3}
              className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white resize-none"
              placeholder="Décris le produit..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Badge</label>
              <input value={f.badge} onChange={e => set("badge", e.target.value)} placeholder="Nouveau, -20%..."
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Statut</label>
              <select value={f.status} onChange={e => set("status", e.target.value)}
                className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50">
                <option value="draft">Brouillon</option>
                <option value="active">Actif (visible sur la boutique)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Ajouter le produit
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ──
export default function ImportProducts() {
  const { add } = useFirestore("products");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [importData, setImportData] = useState(null);
  const [showManual, setShowManual] = useState(false);

  function detectCat(title) {
    const t = title.toLowerCase();
    if (["bluetooth","headphone","earphone","wireless","speaker","charger","laptop","tablet","smartwatch","camera","led","lamp","keyboard","mouse","usb","battery","gaming","drone","screen"].some(k=>t.includes(k))) return "Electronique";
    if (["sport","fitness","yoga","gym","running","cycling","swim","football","basketball","tennis","exercise","workout","resistance","dumbbell","training","crossfit","pilates"].some(k=>t.includes(k))) return "Sport";
    if (["fashion","bag","wallet","jewelry","beauty","skincare","perfume","makeup","hair","decor","candle","aroma","diffuser","travel","luggage","sunglasses","bracelet","ring"].some(k=>t.includes(k))) return "Lifestyle";
    return "Electronique";
  }

  async function handleUrlImport() {
    if (!url.trim()) return toast.error("Entre une URL");
    const isCJ = url.includes("cjdropshipping.com");
    const isAli = url.includes("aliexpress.com");
    if (!isCJ && !isAli) return toast.error("URL non supportée — CJ Dropshipping ou AliExpress seulement");

    setLoading(true);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);
      const r = await fetch(`/api/import?url=${encodeURIComponent(url)}`, { signal: controller.signal });
      clearTimeout(timer);
      if (r.ok) {
        const data = await r.json();
        if (!data.error) {
          setImportData(data);
          setUrl("");
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fallback — ouvre le modal pré-rempli avec ce qu'on sait
    const source = isCJ ? "CJ Dropshipping" : "AliExpress";
    const pidMatch = url.match(/\-p\-([a-zA-Z0-9]+)\.html/) || url.match(/[?&]id=([a-zA-Z0-9]+)/);
    setImportData({
      source, title: "", image: "", cost: 0,
      description: "", category: "Electronique", stock: 100,
      supplier: source, url, cjPid: pidMatch?.[1] || "",
      note: "Remplis les infos manuellement — l'API récupère les données depuis CJ"
    });
    setUrl("");
    setLoading(false);
    toast("Remplis les informations du produit 📝");
  }

  const tips = [
    { site: "CJ Dropshipping", url: "cjdropshipping.com", color: "text-orange-500", bg: "bg-orange-50", emoji: "🟠" },
    { site: "AliExpress", url: "aliexpress.com", color: "text-red-500", bg: "bg-red-50", emoji: "🔴" },
  ];

  return (
    <div className="space-y-6">
      {importData && (
        <ImportModal
          data={importData}
          onClose={() => setImportData(null)}
          onSave={add}
        />
      )}
      {showManual && (
        <ManualModal
          onClose={() => setShowManual(false)}
          onSave={add}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Importer des produits</h1>
          <p className="text-sm text-gray-400 mt-1">Via URL ou ajout manuel</p>
        </div>
        <button onClick={() => setShowManual(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all text-sm bg-white">
          <Plus className="w-4 h-4" />Ajout manuel
        </button>
      </div>

      {/* Import par URL */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Link2 className="w-5 h-5 text-blue-500" />Import par URL
        </h2>
        <p className="text-sm text-gray-400 mb-4">Colle le lien d'un produit CJ Dropshipping ou AliExpress</p>

        <div className="flex gap-3">
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleUrlImport()}
            placeholder="https://cjdropshipping.com/product/... ou https://aliexpress.com/item/..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
          />
          <button onClick={handleUrlImport} disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2 text-sm whitespace-nowrap">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
            {loading ? "Chargement..." : "Importer"}
          </button>
        </div>

        {/* Sites supportés */}
        <div className="flex gap-3 mt-4">
          {tips.map(t => (
            <div key={t.site} className={`flex items-center gap-2 px-3 py-2 ${t.bg} rounded-xl`}>
              <span>{t.emoji}</span>
              <div>
                <p className={`text-xs font-bold ${t.color}`}>{t.site}</p>
                <p className="text-xs text-gray-400">{t.url}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comment faire */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">📖 Comment importer un produit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-bold text-orange-500 mb-3 flex items-center gap-2">
              🟠 Depuis CJ Dropshipping
            </h3>
            <ol className="space-y-2">
              {[
                "Va sur cjdropshipping.com",
                "Cherche un produit",
                "Ouvre la page du produit",
                "Copie l'URL dans la barre du navigateur",
                "Colle-la ici et clique Importer"
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3 className="text-sm font-bold text-red-500 mb-3 flex items-center gap-2">
              🔴 Depuis AliExpress
            </h3>
            <ol className="space-y-2">
              {[
                "Va sur aliexpress.com",
                "Cherche un produit",
                "Ouvre la page du produit",
                "Copie l'URL dans la barre du navigateur",
                "Colle-la ici et clique Importer",
                "Vérifie le prix (parfois à entrer manuellement)"
              ].map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Ajout manuel */}
      <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer" onClick={() => setShowManual(true)}>
        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
          <Plus className="w-7 h-7 text-blue-500" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">Ajouter manuellement</h3>
        <p className="text-sm text-gray-400">Tu as déjà les infos du produit ? Ajoute-les directement</p>
        <button className="mt-4 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 text-sm">
          Ajouter un produit
        </button>
      </div>
    </div>
  );
}
