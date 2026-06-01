import { useState } from "react";
import { useCollection, useFirestore } from "../hooks/useFirestore";
import toast from "react-hot-toast";
import { Plus, Search, ShoppingCart, Truck, X, Download, Zap, Loader2, Save, Eye } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const STATUS_CFG = {
  pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "En attente" },
  processing: { bg: "bg-blue-100", text: "text-blue-800", label: "Traitement" },
  shipped: { bg: "bg-indigo-100", text: "text-indigo-800", label: "Expédié" },
  delivered: { bg: "bg-green-100", text: "text-green-800", label: "Livré" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Annulé" },
};

function Badge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>{c.label}</span>;
}

function OrderDetailModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [tracking, setTracking] = useState(order.tracking || "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await onUpdate(order.id, { status, tracking });
      toast.success("Commande mise à jour !");
      onClose();
    } catch { toast.error("Erreur"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div><h2 className="text-lg font-bold text-gray-900">{order.orderNumber}</h2><p className="text-xs text-gray-400">{order.createdAt?.toDate ? format(order.createdAt.toDate(), "d MMM yyyy HH:mm", { locale: fr }) : "—"}</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Client</p><p className="text-sm font-semibold">{order.customerName}</p><p className="text-xs text-gray-400">{order.customerEmail}</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Fournisseur</p><p className="text-sm font-semibold">{order.supplier}</p><p className="text-xs text-gray-400">{order.store}</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl"><p className="text-xs text-blue-600 mb-1">Total</p><p className="text-xl font-black text-blue-800">${order.total?.toFixed(2)}</p></div>
            <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Coût</p><p className="text-xl font-black text-gray-700">${order.cost?.toFixed(2)}</p></div>
            <div className="text-center p-3 bg-emerald-50 rounded-xl"><p className="text-xs text-emerald-600 mb-1">Profit</p><p className="text-xl font-black text-emerald-700">${((order.total || 0) - (order.cost || 0)).toFixed(2)}</p></div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Statut</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CFG).map(([s, c]) => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all ${status === s ? `${c.bg} ${c.text} border-current` : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Numéro de suivi</label>
            <div className="relative"><Truck className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="Ex: YT2001234567" className="w-full pl-10 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Fermer</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Sauvegarde...</> : <><Save className="w-4 h-4" />Sauvegarder</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function AddOrderModal({ onClose, onSave }) {
  const [f, setF] = useState({ orderNumber: "", customerName: "", customerEmail: "", total: "", cost: "", supplier: "AliExpress", store: "", status: "pending" });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!f.orderNumber || !f.customerName || !f.total) return toast.error("Champs requis manquants");
    setSaving(true);
    try {
      await onSave({ ...f, total: parseFloat(f.total), cost: parseFloat(f.cost) || 0, tracking: "" });
      toast.success("Commande ajoutée !");
      onClose();
    } catch { toast.error("Erreur"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Ajouter une commande</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-3">
          {[["N° Commande *", "orderNumber", "#ORD-001"], ["Nom client *", "customerName", "Jean Dupont"], ["Email client", "customerEmail", "jean@email.com"], ["Boutique", "store", "My Shopify Store"]].map(([lbl, key, ph]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label>
              <input value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} placeholder={ph}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Total ($)</label><input type="number" step="0.01" value={f.total} onChange={e => setF({ ...f, total: e.target.value })} placeholder="0.00" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Coût ($)</label><input type="number" step="0.01" value={f.cost} onChange={e => setF({ ...f, cost: e.target.value })} placeholder="0.00" className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Fournisseur</label><select value={f.supplier} onChange={e => setF({ ...f, supplier: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">{["AliExpress", "CJ Dropshipping", "Zendrop", "Spocket"].map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label className="block text-sm font-semibold text-gray-700 mb-1">Statut</label><select value={f.status} onChange={e => setF({ ...f, status: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500">{Object.entries(STATUS_CFG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}</select></div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { data: orders, loading } = useCollection("orders", "createdAt");
  const { add, update } = useFirestore("orders");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = orders.filter(o =>
    (statusFilter === "all" || o.status === statusFilter) &&
    (o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase()))
  );

  const pendingCount = orders.filter(o => o.status === "pending").length;

  async function processPending() {
    const pending = orders.filter(o => o.status === "pending");
    for (const o of pending) await update(o.id, { status: "processing" });
    toast.success(`${pending.length} commande(s) passées en traitement`);
  }

  return (
    <div className="space-y-6">
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onUpdate={update} />}
      {showAdd && <AddOrderModal onClose={() => setShowAdd(false)} onSave={add} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-sm text-gray-400 mt-1">{orders.length} commande(s) au total</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50">
            <Download className="w-4 h-4" />Exporter CSV
          </button>
          {pendingCount > 0 && (
            <button onClick={processPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-bold hover:bg-amber-600 shadow-sm">
              <Zap className="w-4 h-4" />Traiter {pendingCount} commande(s)
            </button>
          )}
          <button onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200">
            <Plus className="w-4 h-4" />Ajouter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/60">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher commandes..." className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" /></div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">Tous</option>
            {Object.entries(STATUS_CFG).map(([s, c]) => <option key={s} value={s}>{c.label}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/60">
              <tr>{["N° Commande", "Date", "Client", "Fournisseur", "Statut", "Total", "Profit", ""].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? Array(4).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-8 bg-gray-100 rounded-lg animate-pulse" /></td></tr>
              )) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-16 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm">Aucune commande trouvée.</p>
                </td></tr>
              ) : filtered.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/70 cursor-pointer transition-colors" onClick={() => setSelectedOrder(o)}>
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{o.createdAt?.toDate ? format(o.createdAt.toDate(), "d MMM yyyy", { locale: fr }) : "—"}</td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-gray-900">{o.customerName}</p><p className="text-xs text-gray-400">{o.customerEmail}</p></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.supplier}</td>
                  <td className="px-4 py-3"><Badge status={o.status} /></td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">${o.total?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">+${((o.total || 0) - (o.cost || 0)).toFixed(2)}</td>
                  <td className="px-4 py-3"><Eye className="w-4 h-4 text-gray-300 hover:text-blue-400" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
