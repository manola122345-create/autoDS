// =================== STORES ===================
import { useState } from "react";
import { useCollection, useFirestore } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Store, Plus, Trash2, RefreshCw, X, Loader2, Save, Check, Tag, Bell, CreditCard, Shield, Key, User } from "lucide-react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function Badge({ status }) {
  return status === "connected"
    ? <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Connecté</span>
    : <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">Déconnecté</span>;
}

function AddStoreModal({ onClose, onSave }) {
  const [f, setF] = useState({ name: "", platform: "shopify", url: "", apiKey: "", status: "connected" });
  const [saving, setSaving] = useState(false);
  const platforms = [["shopify", "Shopify", "border-green-400 text-green-700 bg-green-50"], ["woocommerce", "WooCommerce", "border-purple-400 text-purple-700 bg-purple-50"], ["ebay", "eBay", "border-yellow-400 text-yellow-700 bg-yellow-50"], ["amazon", "Amazon", "border-orange-400 text-orange-700 bg-orange-50"]];

  async function handleSave() {
    if (!f.name || !f.url) return toast.error("Nom et URL requis");
    setSaving(true);
    try {
      await onSave({ ...f, orders: 0, revenue: 0, lastSync: new Date().toISOString() });
      toast.success("Boutique connectée !");
      onClose();
    } catch { toast.error("Erreur"); }
    finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold">Connecter une boutique</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Plateforme</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(([id, lbl, cls]) => (
                <button key={id} onClick={() => setF({ ...f, platform: id })}
                  className={`py-2.5 px-3 rounded-xl text-sm font-bold border-2 transition-all ${f.platform === id ? cls : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                  {lbl}
                </button>
              ))}
            </div>
          </div>
          {[["Nom de la boutique *", "name", "Ma Super Boutique", "text"], ["URL *", "url", "mystore.myshopify.com", "text"], ["Clé API", "apiKey", "sk_xxxx...", "password"]].map(([lbl, key, ph, type]) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label>
              <input type={type} value={f[key]} onChange={e => setF({ ...f, [key]: e.target.value })} placeholder={ph}
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Annuler</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}Connecter
          </button>
        </div>
      </div>
    </div>
  );
}

export function Stores() {
  const { data: stores, loading } = useCollection("stores", "createdAt");
  const { add, update, remove } = useFirestore("stores");
  const [showAdd, setShowAdd] = useState(false);

  const pcls = { shopify: "bg-green-50 text-green-600", woocommerce: "bg-purple-50 text-purple-600", ebay: "bg-yellow-50 text-yellow-600", amazon: "bg-orange-50 text-orange-600" };

  async function handleSync(id) {
    try { await update(id, { lastSync: new Date().toISOString() }); toast.success("Boutique synchronisée !"); }
    catch { toast.error("Erreur de synchronisation"); }
  }

  async function handleDelete(id) {
    if (!confirm("Supprimer cette boutique ?")) return;
    try { await remove(id); toast.success("Boutique supprimée"); }
    catch { toast.error("Erreur"); }
  }

  return (
    <div className="space-y-6">
      {showAdd && <AddStoreModal onClose={() => setShowAdd(false)} onSave={add} />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Boutiques</h1><p className="text-sm text-gray-400 mt-1">Gérez vos canaux de vente</p></div>
        <button onClick={() => setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-sm shadow-blue-200"><Plus className="w-4 h-4" />Ajouter une boutique</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? Array(2).fill(0).map((_, i) => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />) :
          stores.map(s => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${(pcls[s.platform] || "bg-gray-50 text-gray-500").split(" ")[0]}`}>
                    <Store className={`w-6 h-6 ${(pcls[s.platform] || "bg-gray-50 text-gray-500").split(" ")[1]}`} />
                  </div>
                  <div><h3 className="font-bold text-gray-900">{s.name}</h3><p className="text-xs text-gray-400 capitalize">{s.platform}</p></div>
                </div>
                <Badge status={s.status} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Commandes</span><span className="font-semibold text-gray-800">{s.orders || 0}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Revenus</span><span className="font-semibold text-gray-800">${(s.revenue || 0).toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">URL</span><span className="text-blue-500 text-xs truncate max-w-[150px]">{s.url}</span></div>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">Sync: {s.lastSync ? format(new Date(s.lastSync), "d MMM HH:mm", { locale: fr }) : "—"}</span>
                <div className="flex gap-1">
                  <button onClick={() => handleSync(s.id)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Sync"><RefreshCw className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        <button onClick={() => setShowAdd(true)}
          className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/30 transition-all min-h-[220px]">
          <div className="p-3 rounded-full bg-white shadow-sm mb-3"><Plus className="w-6 h-6" /></div>
          <span className="font-bold text-sm">Connecter une boutique</span>
          <span className="text-xs mt-1 opacity-70">Shopify · WooCommerce · eBay · Amazon</span>
        </button>
      </div>
    </div>
  );
}

// =================== ANALYTICS ===================
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const monthlyData = [
  { month: "Jan", revenue: 3200, profit: 1400, orders: 45 },
  { month: "Fév", revenue: 4100, profit: 1800, orders: 58 },
  { month: "Mar", revenue: 3800, profit: 1650, orders: 52 },
  { month: "Avr", revenue: 5200, profit: 2300, orders: 71 },
  { month: "Mai", revenue: 6100, profit: 2750, orders: 84 },
  { month: "Jun", revenue: 7400, profit: 3300, orders: 102 },
];

const supplierData = [
  { name: "AliExpress", value: 45 }, { name: "CJ Dropshipping", value: 30 },
  { name: "Zendrop", value: 15 }, { name: "Spocket", value: 10 },
];

export function Analytics() {
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Analytics</h1><p className="text-sm text-gray-400 mt-1">Performance de votre activité</p></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[["Revenu total", "$37,800", "+18%", "bg-blue-50 text-blue-700"], ["Profit total", "$16,200", "+22%", "bg-emerald-50 text-emerald-700"], ["Commandes totales", "412", "+15%", "bg-purple-50 text-purple-700"]].map(([l, v, c, cls]) => (
          <div key={l} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-400 font-medium">{l}</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{v}</p>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${cls}`}>{c} vs l'an dernier</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Revenu & Profit (6 mois)</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} /><stop offset="95%" stopColor="#3b82f6" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gPr" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.15} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Area type="monotone" dataKey="revenue" name="Revenu" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gR)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} fill="url(#gPr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Commandes par mois</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
                <Bar dataKey="orders" name="Commandes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">Répartition par fournisseur</h2>
        <div className="space-y-3">
          {supplierData.map(s => (
            <div key={s.name} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-32">{s.name}</span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${s.value}%` }} />
              </div>
              <span className="text-sm font-bold text-gray-700 w-8 text-right">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =================== AUTOMATION ===================
export function Automation() {
  const [rules, setRules] = useState([
    { id: 1, name: "Prix automatique AliExpress", trigger: "Nouveau produit AliExpress", action: "Appliquer marge 150%", active: true },
    { id: 2, name: "Alerte stock faible", trigger: "Stock < 10 unités", action: "Envoyer notification email", active: true },
    { id: 3, name: "Auto-fulfillment", trigger: "Nouvelle commande reçue", action: "Envoyer au fournisseur", active: false },
    { id: 4, name: "Suivi automatique", trigger: "Commande expédiée", action: "Envoyer email tracking client", active: true },
  ]);

  const toggle = (id) => setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900">Automation</h1><p className="text-sm text-gray-400 mt-1">Automatisez vos tâches répétitives</p></div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700"><Plus className="w-4 h-4" />Nouvelle règle</button>
      </div>

      <div className="bg-blue-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-1">🤖 Automation intelligente</h2>
        <p className="text-blue-100 text-sm">Configurez des règles pour automatiser les prix, le fulfillment et les notifications.</p>
      </div>

      <div className="space-y-3">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`p-3 rounded-xl ${rule.active ? "bg-blue-50" : "bg-gray-50"}`}>
              <Zap className={`w-5 h-5 ${rule.active ? "text-blue-600" : "text-gray-400"}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{rule.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Si <span className="text-blue-600 font-medium">{rule.trigger}</span> → <span className="text-emerald-600 font-medium">{rule.action}</span></p>
            </div>
            <button onClick={() => toggle(rule.id)}
              className={`w-12 h-6 rounded-full transition-colors relative flex-shrink-0 ${rule.active ? "bg-blue-600" : "bg-gray-200"}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${rule.active ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =================== SETTINGS ===================
export function Settings() {
  const { user, userProfile, loadProfile } = useAuth();
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ firstName: userProfile?.firstName || "", lastName: userProfile?.lastName || "", email: user?.email || "", phone: userProfile?.phone || "", company: userProfile?.company || "" });
  const [markupType, setMarkupType] = useState(userProfile?.settings?.markupType || "percentage");
  const [markupValue, setMarkupValue] = useState(String(userProfile?.settings?.markupValue || 150));
  const [notifs, setNotifs] = useState(userProfile?.settings?.notifications || { newOrder: true, lowStock: true, shipment: true, weekly: true });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tabs = [["profile", "Profil", User], ["pricing", "Règles de prix", Tag], ["notifications", "Notifications", Bell], ["billing", "Facturation", CreditCard], ["security", "Sécurité", Shield], ["api", "API & Intégrations", Key]];

  async function saveProfile() {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { ...profile, updatedAt: serverTimestamp() });
      await loadProfile(user.uid);
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      toast.success("Profil sauvegardé !");
    } catch { toast.error("Erreur de sauvegarde"); }
    finally { setSaving(false); }
  }

  async function savePricing() {
    setSaving(true);
    try {
      await updateDoc(doc(db, "users", user.uid), { "settings.markupType": markupType, "settings.markupValue": parseFloat(markupValue), updatedAt: serverTimestamp() });
      setSaved(true); setTimeout(() => setSaved(false), 2000);
      toast.success("Règles de prix sauvegardées !");
    } catch { toast.error("Erreur"); }
    finally { setSaving(false); }
  }

  async function saveNotifs() {
    try {
      await updateDoc(doc(db, "users", user.uid), { "settings.notifications": notifs, updatedAt: serverTimestamp() });
      toast.success("Préférences sauvegardées !");
    } catch { toast.error("Erreur"); }
  }

  const calcExample = () => {
    const v = parseFloat(markupValue) || 0;
    if (markupType === "percentage") return (10 * (1 + v / 100)).toFixed(2);
    if (markupType === "multiplier") return (10 * v).toFixed(2);
    return (10 + v).toFixed(2);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div><h1 className="text-2xl font-bold text-gray-900">Paramètres</h1><p className="text-sm text-gray-400 mt-1">Gérez votre compte et préférences</p></div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-100 p-3 space-y-0.5 bg-gray-50/60">
            {tabs.map(([id, lbl, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`}>
                <Icon className={`w-4 h-4 ${tab === id ? "text-white" : "text-gray-400"}`} />{lbl}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6">
            {tab === "profile" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Informations personnelles</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[["Prénom", "firstName"], ["Nom", "lastName"]].map(([lbl, key]) => (
                    <div key={key}><label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label><input value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
                  ))}
                </div>
                {[["Email", "email", "email"], ["Entreprise", "company", "text"], ["Téléphone", "phone", "tel"]].map(([lbl, key, type]) => (
                  <div key={key}><label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label><input type={type} value={profile[key]} onChange={e => setProfile({ ...profile, [key]: e.target.value })} className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
                ))}
                <div className="flex justify-end pt-2">
                  <button onClick={saveProfile} disabled={saving}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-60`}>
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saved ? "Sauvegardé !" : "Sauvegarder"}
                  </button>
                </div>
              </div>
            )}

            {tab === "pricing" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Règles de prix automatiques</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">Calcul automatique du prix de vente à partir du coût fournisseur.</div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type de majoration</label>
                  <div className="flex gap-2">
                    {[["percentage", "Pourcentage (%)"], ["multiplier", "Multiplicateur (×)"], ["fixed", "Fixe ($+)"]].map(([v, l]) => (
                      <button key={v} onClick={() => setMarkupType(v)}
                        className={`px-3 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${markupType === v ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-sm font-semibold text-gray-700 mb-1">Valeur</label><input type="number" value={markupValue} onChange={e => setMarkupValue(e.target.value)} className="w-28 border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500" /></div>
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-sm font-semibold text-gray-700 mb-1">Exemple :</p><p className="text-sm text-gray-600">Coût <span className="font-black">$10.00</span> → Prix <span className="font-black text-blue-700">${calcExample()}</span></p></div>
                <div className="flex justify-end"><button onClick={savePricing} disabled={saving} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold ${saved ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-60`}>{saved ? <><Check className="w-4 h-4" />Sauvegardé</> : <><Save className="w-4 h-4" />Sauvegarder</>}</button></div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="space-y-1">
                <h2 className="text-base font-bold text-gray-900 mb-4">Notifications</h2>
                {[["newOrder", "Nouvelle commande", "Notifié à chaque nouvelle commande"], ["lowStock", "Stock faible", "Alerte quand stock < 10 unités"], ["shipment", "Expédition", "Mises à jour tracking colis"], ["weekly", "Rapport hebdomadaire", "Résumé chaque lundi matin"]].map(([k, l, d]) => (
                  <div key={k} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div><p className="text-sm font-semibold text-gray-900">{l}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                    <button onClick={() => { const n = { ...notifs, [k]: !notifs[k] }; setNotifs(n); saveNotifs(); }}
                      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifs[k] ? "bg-blue-600" : "bg-gray-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[k] ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {tab === "billing" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Abonnement</h2>
                <div className={`rounded-2xl p-5 ${userProfile?.plan === "pro" ? "bg-blue-600" : "bg-gray-800"} text-white`}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm opacity-70">Plan actuel</p><p className="text-2xl font-black mt-1 capitalize">{userProfile?.plan || "Gratuit"}</p></div>
                    <div className="text-right">{userProfile?.plan === "pro" && <><p className="text-3xl font-black">$29</p><p className="text-sm opacity-70">/mois</p></>}</div>
                  </div>
                </div>
                {userProfile?.plan !== "pro" && (
                  <div className="border-2 border-blue-200 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-900 mb-3">Passer à Pro 🚀</h3>
                    <div className="space-y-2 mb-4">{["Produits illimités", "Boutiques illimitées", "Auto-fulfillment", "Support prioritaire 24/7", "Analytics avancées"].map(f => <div key={f} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-green-500" />{f}</div>)}</div>
                    <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Upgrader — $29/mois</button>
                  </div>
                )}
              </div>
            )}

            {tab === "security" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Sécurité</h2>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700">Pour changer ton mot de passe, utilise "Mot de passe oublié" depuis la page de connexion.</div>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-5 h-5 text-green-600" /></div>
                  <div><p className="text-sm font-bold text-gray-900">Compte sécurisé</p><p className="text-xs text-gray-400">{user?.email}</p></div>
                </div>
              </div>
            )}

            {tab === "api" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">API & Intégrations</h2>
                {[{ name: "AliExpress", connected: false }, { name: "CJ Dropshipping", connected: false }, { name: "Zendrop", connected: false }, { name: "Spocket", connected: false }].map(api => (
                  <div key={api.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-black text-gray-600">{api.name[0]}</div>
                      <p className="text-sm font-semibold text-gray-900">{api.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${api.connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>{api.connected ? "Connecté" : "Non connecté"}</span>
                      <button className="px-3 py-1.5 text-xs font-semibold border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors">{api.connected ? "Modifier" : "Connecter"}</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
