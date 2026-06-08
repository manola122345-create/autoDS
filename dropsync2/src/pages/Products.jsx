import { useState } from "react";
import { useCollection, useFirestore } from "../hooks/useFirestore";
import toast from "react-hot-toast";
import {
  Plus, Search, Package, Trash2, Eye, X, Check, Save, Filter,
  Download, RefreshCw, Loader2, Tag, ExternalLink
} from "lucide-react";

const SUPPLIERS = ["AliExpress", "CJ Dropshipping", "Zendrop", "Spocket", "DSers", "Autre"];
const CATEGORIES = ["Electronique", "Sport", "Lifestyle", "Maison", "Mode", "Autre"];

const supplierCatalog = [
  { title: "Gaming Mechanical Keyboard RGB", supplier: "AliExpress", cost: 28.00, rating: 4.8, orders: 1250, image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&q=80", category: "Electronique" },
  { title: "Bluetooth Speaker Waterproof", supplier: "CJ Dropshipping", cost: 16.50, rating: 4.6, orders: 890, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&q=80", category: "Electronique" },
  { title: "Car Phone Holder Dashboard", supplier: "AliExpress", cost: 5.00, rating: 4.9, orders: 3400, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80", category: "Electronique" },
  { title: "Stainless Steel Water Bottle", supplier: "Zendrop", cost: 9.00, rating: 4.7, orders: 2100, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&q=80", category: "Sport" },
  { title: "Resistance Bands Set 5pcs", supplier: "CJ Dropshipping", cost: 11.00, rating: 4.5, orders: 1800, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=80&q=80", category: "Sport" },
  { title: "LED String Lights 10m", supplier: "AliExpress", cost: 7.50, rating: 4.8, orders: 4200, image: "https://images.unsplash.com/photo-1549122728-f519709caa9c?w=80&q=80", category: "Home" },
  { title: "Wireless Charging Pad 15W", supplier: "CJ Dropshipping", cost: 12.00, rating: 4.7, orders: 980, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&q=80", category: "Electronique" },
  { title: "Yoga Mat Anti-Slip Premium", supplier: "Spocket", cost: 18.00, rating: 4.6, orders: 1500, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&q=80", category: "Sport" },
];

function Badge({ status }) {
  const cfg = {
    active: "bg-green-100 text-green-800",
    draft: "bg-gray-100 text-gray-600",
    out_of_stock: "bg-red-100 text-red-700",
  };
  const labels = { active: "Actif", draft: "Brouillon", out_of_stock: "Rupture" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg[status] || cfg.draft}`}>{labels[status] || status}</span>;
}

function AddModal({ onClose, onSave }) {
  const [f, setF] = useState({ title: "", supplier: "AliExpress", cost: "", price: "", stock: "", category: "Electronique", status: "draft", image: "" });
  const [saving, setSaving] = useState(false);
  const profit = f.cost && f.price ? (parseFloat(f.price) - parseFloat(f.cost)).toFixed(2) : null;
  const margin = f.cost && f.price ? (((parseFloat(f.price) - parseFloat(f.cost)) / parseFloat(f.price)) * 100).toFixed(1) : null;

  async function handleSave() {
    if (!f.title || !f.cost || !f.price) return toast.error("Titre, coût et prix requis");
    setSaving(true);
    try {
      await onSave({ ...f, cost: parseFloat(f.cost), price: parseFloat(f.price), stock: parseInt(f.stock) || 0, orders: 0 });
      toast.success("Produit ajouté !");
      onClose();
    } catch { toast.error("Erreur lors de l'ajout"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Ajouter un produit</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nom du produit *</label>
            <input value={f.title} onChange={e => setF({ ...f, title: e.target.value })} placeholder="Ex: Wireless Headphones Pro"
              className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Fournisseur</label>
              <select value={f.supplier} onChange={e => setF({ ...f, supplier: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                {SUPPLIERS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
              <select value={f.category} onChange={e => setF({ ...f, category: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[["Coût ($) *", "cost"], ["Prix ($) *", "price"], ["Stock", "stock"]].map(([lbl, key]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label>
                <input type="number" value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} placeholder="0" step="0.01"
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>
          {profit && (
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 flex gap-6 border border-blue-100">
              <div><p className="text-xs text-blue-600 font-semibold mb-1">Profit / unité</p><p className="text-xl font-black text-blue-800">${profit}</p></div>
              <div><p className="text-xs text-emerald-600 font-semibold mb-1">Marge</p><p className="text-xl font-black text-emerald-800">{margin}%</p></div>
              <div><p className="text-xs text-purple-600 font-semibold mb-1">ROI</p><p className="text-xl font-black text-purple-800">{((parseFloat(profit) / parseFloat(f.cost)) * 100).toFixed(0)}%</p></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label>
              <select value={f.status} onChange={e => setF({ ...f, status: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">URL Image</label>
              <input value={f.image} onChange={e => setF({ ...f, image: e.target.value })} placeholder="https://..."
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Sauvegarde...</> : <><Save className="w-4 h-4" />Ajouter</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function FinderModal({ onClose, onImport }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const filtered = supplierCatalog.filter(p =>
    (cat === "All" || p.category === cat) &&
    (search === "" || p.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div><h2 className="text-lg font-bold">Trouver des produits</h2><p className="text-xs text-gray-400">Catalogue fournisseurs</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 flex gap-3 border-b border-gray-100">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <select value={cat} onChange={e => setCat(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {["All", "Electronics", "Sports", "Automotive", "Home"].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {filtered.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
              <img src={p.image} alt="" className="w-14 h-14 object-cover rounded-lg border border-gray-100" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{p.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-400">{p.supplier}</span>
                  <span className="text-xs text-yellow-600 font-medium">★ {p.rating}</span>
                  <span className="text-xs text-gray-400">{p.orders.toLocaleString()} ventes</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold text-gray-900">${p.cost}</p>
                <p className="text-xs text-emerald-600 font-semibold">Prix: ~${(p.cost * 2.5).toFixed(2)}</p>
                <button onClick={() => onImport(p)}
                  className="mt-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Importer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Products() {
  const { data: products, loading } = useCollection("products", "createdAt");
  const { add, update, remove } = useFirestore("products");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showFinder, setShowFinder] = useState(false);
  const [selected, setSelected] = useState([]);

  const filtered = products.filter(p =>
    (statusFilter === "all" || p.status === statusFilter) &&
    (p.title?.toLowerCase().includes(search.toLowerCase()) || p.supplier?.toLowerCase().includes(search.toLowerCase()))
  );

  async function handleImport(sp) {
    try {
      await add({
        title: sp.title, image: sp.image, supplier: sp.supplier,
        cost: sp.cost, price: parseFloat((sp.cost * 2.5).toFixed(2)),
        stock: 100, status: "draft", category: sp.category, orders: 0
      });
      toast.success(`"${sp.title}" importé !`);
      setShowFinder(false);
    } catch { toast.error("Erreur d'importation"); }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer ce produit ?")) return;
    try { await remove(id); toast.success("Produit supprimé"); } catch { toast.error("Erreur"); }
  }

  async function handleBulkAction(action) {
    for (const id of selected) {
      if (action === "delete") await remove(id);
      else await update(id, { status: action });
    }
    toast.success(`${selected.length} produit(s) mis à jour`);
    setSelected([]);
  }

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={add} />}
      {showFinder && <FinderModal onClose={() => setShowFinder(false)} onImport={handleImport} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-400 mt-1">{products.length} produit(s) dans votre catalogue</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowFinder(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            <Search className="w-4 h-4" />Trouver produits
          </button>
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />Ajouter
          </button>
        </div>
      </div>

      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-700 font-semibold">{selected.length} sélectionné(s)</span>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction("active")} className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white rounded-lg hover:bg-green-700">Activer</button>
            <button onClick={() => handleBulkAction("draft")} className="px-3 py-1.5 text-xs font-bold bg-gray-500 text-white rounded-lg hover:bg-gray-600">Brouillon</button>
            <button onClick={() => handleBulkAction("delete")} className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700">Supprimer</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/60">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">Tous</option><option value="active">Actif</option><option value="draft">Brouillon</option><option value="out_of_stock">Rupture</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/60">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map(p => p.id))}
                    className="rounded border-gray-300" />
                </th>
                {["Produit", "Fournisseur", "Coût", "Prix / Profit", "Stock", "Statut", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 bg-gray-100 rounded-lg animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center">
                  <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucun produit trouvé.</p>
                  <button onClick={() => setShowAdd(true)} className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Ajouter un produit</button>
                </td></tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} className="rounded border-gray-300" /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.image ? <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" /> : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300" /></div>}
                        <div><p className="text-sm font-semibold text-gray-900 max-w-[180px] truncate">{p.title}</p><p className="text-xs text-gray-400">{p.category}</p></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{p.supplier}</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">${p.cost?.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-bold text-gray-800">${p.price?.toFixed(2)}</p>
                      <p className="text-xs font-semibold text-emerald-600">+${(p.price - p.cost)?.toFixed(2)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {p.stock > 10 ? <span className="text-sm text-gray-700">{p.stock}</span> :
                        p.stock > 0 ? <span className="text-sm text-amber-600 font-semibold">{p.stock} ⚠️</span> :
                          <span className="text-sm text-red-500 font-semibold">Épuisé</span>}
                    </td>
                    <td className="px-4 py-3"><Badge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => update(p.id, { status: p.status === "active" ? "draft" : "active" })}
                          className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Changer statut">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
