import { useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Store, Settings, Bell,
  Search, Menu, LogOut, Plus, Filter, Download, ExternalLink,
  Edit, Trash2, RefreshCw, TrendingUp, DollarSign,
  X, Check, ArrowUpRight, ArrowDownRight, Zap, Tag, Truck,
  AlertCircle, Eye, Save, Key, CreditCard, Shield, User
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ===================== DATA =====================
const initialProducts = [
  { id:"1", title:"Wireless Noise Cancelling Headphones", image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80", supplier:"AliExpress", cost:25.50, price:59.99, stock:145, status:"active", category:"Electronics", orders:23 },
  { id:"2", title:"Smart Fitness Watch", image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80", supplier:"CJ Dropshipping", cost:15.00, price:39.99, stock:89, status:"active", category:"Electronics", orders:45 },
  { id:"3", title:"Portable Charger 10000mAh", image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=80&q=80", supplier:"AliExpress", cost:8.50, price:24.99, stock:0, status:"out_of_stock", category:"Electronics", orders:12 },
  { id:"4", title:"Ergonomic Office Chair", image:"https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=80&q=80", supplier:"Zendrop", cost:65.00, price:149.99, stock:23, status:"active", category:"Furniture", orders:8 },
  { id:"5", title:"LED Desk Lamp", image:"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=80&q=80", supplier:"AliExpress", cost:12.00, price:35.99, stock:67, status:"active", category:"Home", orders:31 },
  { id:"6", title:"Yoga Mat Premium", image:"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=80&q=80", supplier:"CJ Dropshipping", cost:18.00, price:45.99, stock:34, status:"draft", category:"Sports", orders:0 },
];

const initialOrders = [
  { id:"1", orderNumber:"#ORD-001", customerName:"Marie Dupont", customerEmail:"marie@email.com", date:"2024-05-25T10:30:00Z", total:59.99, cost:25.50, status:"shipped", items:1, tracking:"YT2001234567", supplier:"AliExpress", store:"My Shopify Store" },
  { id:"2", orderNumber:"#ORD-002", customerName:"Jean Martin", customerEmail:"jean@email.com", date:"2024-05-26T14:15:00Z", total:119.98, cost:51.00, status:"processing", items:2, tracking:"", supplier:"CJ Dropshipping", store:"My Shopify Store" },
  { id:"3", orderNumber:"#ORD-003", customerName:"Paul Bernard", customerEmail:"paul@email.com", date:"2024-05-27T09:45:00Z", total:24.99, cost:8.50, status:"pending", items:1, tracking:"", supplier:"AliExpress", store:"eBay Deals" },
  { id:"4", orderNumber:"#ORD-004", customerName:"Sophie Leclerc", customerEmail:"sophie@email.com", date:"2024-05-23T16:20:00Z", total:149.99, cost:65.00, status:"delivered", items:1, tracking:"YT2001234123", supplier:"Zendrop", store:"My Shopify Store" },
  { id:"5", orderNumber:"#ORD-005", customerName:"Luc Moreau", customerEmail:"luc@email.com", date:"2024-05-27T11:10:00Z", total:39.99, cost:15.00, status:"pending", items:1, tracking:"", supplier:"CJ Dropshipping", store:"WooCommerce Store" },
  { id:"6", orderNumber:"#ORD-006", customerName:"Emma Petit", customerEmail:"emma@email.com", date:"2024-05-24T08:00:00Z", total:35.99, cost:12.00, status:"cancelled", items:1, tracking:"", supplier:"AliExpress", store:"My Shopify Store" },
];

const initialStores = [
  { id:"1", name:"My Shopify Store", platform:"shopify", status:"connected", lastSync:"2024-05-27T12:00:00Z", orders:156, revenue:8450.50, url:"mystore.myshopify.com" },
  { id:"2", name:"eBay Deals", platform:"ebay", status:"connected", lastSync:"2024-05-27T11:30:00Z", orders:89, revenue:3200.00, url:"ebay.com/usr/mystore" },
  { id:"3", name:"WooCommerce Store", platform:"woocommerce", status:"disconnected", lastSync:"2024-05-20T08:00:00Z", orders:34, revenue:1100.00, url:"mystore.com" },
];

const supplierProducts = [
  { id:"sp1", title:"Gaming Mechanical Keyboard RGB", supplier:"AliExpress", cost:28.00, rating:4.8, orders:1250, image:"https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=80&q=80", category:"Electronics" },
  { id:"sp2", title:"Bluetooth Speaker Waterproof", supplier:"CJ Dropshipping", cost:16.50, rating:4.6, orders:890, image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&q=80", category:"Electronics" },
  { id:"sp3", title:"Car Phone Holder Dashboard", supplier:"AliExpress", cost:5.00, rating:4.9, orders:3400, image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80", category:"Automotive" },
  { id:"sp4", title:"Stainless Steel Water Bottle", supplier:"Zendrop", cost:9.00, rating:4.7, orders:2100, image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=80&q=80", category:"Sports" },
  { id:"sp5", title:"Resistance Bands Set 5pcs", supplier:"CJ Dropshipping", cost:11.00, rating:4.5, orders:1800, image:"https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=80&q=80", category:"Sports" },
  { id:"sp6", title:"LED String Lights 10m", supplier:"AliExpress", cost:7.50, rating:4.8, orders:4200, image:"https://images.unsplash.com/photo-1549122728-f519709caa9c?w=80&q=80", category:"Home" },
];

const salesData = [
  { name:"Lun", sales:4000, profit:1800 },
  { name:"Mar", sales:3200, profit:1400 },
  { name:"Mer", sales:5100, profit:2300 },
  { name:"Jeu", sales:2800, profit:1200 },
  { name:"Ven", sales:6200, profit:2800 },
  { name:"Sam", sales:7400, profit:3300 },
  { name:"Dim", sales:5800, profit:2600 },
];

// ===================== HELPERS =====================
const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" });
const fmtTime = (d) => new Date(d).toLocaleDateString("fr-FR", { day:"numeric", month:"short", hour:"2-digit", minute:"2-digit" });

const statusCfg = {
  active:       { bg:"bg-green-100",  text:"text-green-800",  lbl:"Actif" },
  draft:        { bg:"bg-gray-100",   text:"text-gray-700",   lbl:"Brouillon" },
  out_of_stock: { bg:"bg-red-100",    text:"text-red-700",    lbl:"Rupture" },
  pending:      { bg:"bg-yellow-100", text:"text-yellow-800", lbl:"En attente" },
  processing:   { bg:"bg-blue-100",   text:"text-blue-800",   lbl:"Traitement" },
  shipped:      { bg:"bg-indigo-100", text:"text-indigo-800", lbl:"Expédié" },
  delivered:    { bg:"bg-green-100",  text:"text-green-800",  lbl:"Livré" },
  cancelled:    { bg:"bg-red-100",    text:"text-red-700",    lbl:"Annulé" },
  connected:    { bg:"bg-green-100",  text:"text-green-800",  lbl:"Connecté" },
  disconnected: { bg:"bg-red-100",    text:"text-red-700",    lbl:"Déconnecté" },
};

function Badge({ status }) {
  const c = statusCfg[status] || statusCfg.draft;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>{c.lbl}</span>;
}

// ===================== MODALS =====================
function AddProductModal({ onClose, onAdd, stores }) {
  const [f, setF] = useState({ title:"", supplier:"AliExpress", cost:"", price:"", stock:"", category:"Electronics", status:"draft", image:"", store: stores[0]?.id || "" });
  const profit = f.cost && f.price ? (parseFloat(f.price) - parseFloat(f.cost)).toFixed(2) : "—";
  const margin = f.cost && f.price ? (((parseFloat(f.price) - parseFloat(f.cost)) / parseFloat(f.price)) * 100).toFixed(1) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Ajouter un produit</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom du produit *</label>
            <input value={f.title} onChange={e => setF({...f, title:e.target.value})} placeholder="Ex: Wireless Headphones Pro" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fournisseur</label>
              <select value={f.supplier} onChange={e => setF({...f, supplier:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["AliExpress","CJ Dropshipping","Zendrop","Spocket","DSers"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select value={f.category} onChange={e => setF({...f, category:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {["Electronics","Fashion","Home","Sports","Beauty","Automotive","Furniture","Toys"].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[["Coût ($) *","cost"],["Prix de vente ($) *","price"],["Stock","stock"]].map(([lbl,key])=>(
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lbl}</label>
                <input type="number" value={f[key]} onChange={e => setF({...f,[key]:e.target.value})} placeholder="0" step="0.01" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
          {f.cost && f.price && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 flex gap-6 border border-blue-100">
              <div><p className="text-xs text-blue-600 font-medium mb-1">Profit unitaire</p><p className="text-xl font-bold text-blue-800">${profit}</p></div>
              <div><p className="text-xs text-blue-600 font-medium mb-1">Marge</p><p className="text-xl font-bold text-blue-800">{margin}%</p></div>
              <div><p className="text-xs text-blue-600 font-medium mb-1">ROI</p><p className="text-xl font-bold text-blue-800">{f.cost ? ((parseFloat(profit)/parseFloat(f.cost))*100).toFixed(0) : 0}%</p></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Boutique</label>
              <select value={f.store} onChange={e => setF({...f, store:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select value={f.status} onChange={e => setF({...f, status:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="draft">Brouillon</option>
                <option value="active">Actif</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Image (optionnel)</label>
            <input value={f.image} onChange={e => setF({...f, image:e.target.value})} placeholder="https://..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-xl hover:bg-gray-50">Annuler</button>
          <button onClick={() => { if(!f.title||!f.cost||!f.price) return; onAdd({...f,id:Date.now().toString(),cost:parseFloat(f.cost),price:parseFloat(f.price),stock:parseInt(f.stock)||0,orders:0}); onClose(); }}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700">
            Ajouter le produit
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductFinderModal({ onClose, onImport }) {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All","Electronics","Sports","Automotive","Home"];
  const filtered = supplierProducts.filter(p =>
    (cat==="All" || p.category===cat) &&
    (search==="" || p.title.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div><h2 className="text-lg font-bold text-gray-900">Trouver des produits</h2><p className="text-xs text-gray-500">Importez depuis vos fournisseurs</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 border-b border-gray-100 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher produits..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={cat} onChange={e=>setCat(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {cats.map(c=><option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="overflow-y-auto flex-1 p-4 space-y-2">
          {filtered.map(p=>(
            <div key={p.id} className="flex items-center gap-4 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
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
                <button onClick={()=>{onImport(p);onClose();}} className="mt-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700">Importer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrderModal({ order, onClose, onUpdateStatus }) {
  const statuses = [["pending","En attente"],["processing","Traitement"],["shipped","Expédié"],["delivered","Livré"],["cancelled","Annulé"]];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div><h2 className="text-lg font-bold text-gray-900">{order.orderNumber}</h2><p className="text-xs text-gray-400">{fmtDate(order.date)}</p></div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Client</p><p className="text-sm font-semibold text-gray-900">{order.customerName}</p><p className="text-xs text-gray-400">{order.customerEmail}</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400 mb-1">Boutique</p><p className="text-sm font-semibold text-gray-900">{order.store}</p><p className="text-xs text-gray-400">{order.supplier}</p></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-xl"><p className="text-xs text-blue-600 mb-1">Total</p><p className="text-lg font-bold text-blue-800">${order.total}</p></div>
            <div className="text-center p-3 bg-gray-50 rounded-xl"><p className="text-xs text-gray-500 mb-1">Coût</p><p className="text-lg font-bold text-gray-700">${order.cost}</p></div>
            <div className="text-center p-3 bg-green-50 rounded-xl"><p className="text-xs text-green-600 mb-1">Profit</p><p className="text-lg font-bold text-green-700">${(order.total-order.cost).toFixed(2)}</p></div>
          </div>
          {order.tracking && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-500" />
              <div><p className="text-xs text-indigo-500 font-medium">Suivi</p><p className="text-sm font-mono font-semibold text-indigo-700">{order.tracking}</p></div>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Mettre à jour le statut</p>
            <div className="flex flex-wrap gap-2">
              {statuses.map(([s,l])=>(
                <button key={s} onClick={()=>{onUpdateStatus(order.id,s);onClose();}}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${order.status===s?"bg-blue-600 text-white border-blue-600":"border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"}`}>{l}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5"><button onClick={onClose} className="w-full py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Fermer</button></div>
      </div>
    </div>
  );
}

function AddStoreModal({ onClose, onAdd }) {
  const [platform, setPlatform] = useState("shopify");
  const [name, setName] = useState(""); const [url, setUrl] = useState(""); const [apiKey, setApiKey] = useState("");
  const platforms = [["shopify","Shopify","bg-green-50 border-green-300 text-green-700"],["woocommerce","WooCommerce","bg-purple-50 border-purple-300 text-purple-700"],["ebay","eBay","bg-yellow-50 border-yellow-300 text-yellow-700"],["amazon","Amazon","bg-orange-50 border-orange-300 text-orange-700"]];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Connecter une boutique</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Plateforme</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map(([id,lbl,cls])=>(
                <button key={id} onClick={()=>setPlatform(id)} className={`py-2 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${platform===id?cls:"border-gray-200 text-gray-500 hover:border-gray-300"}`}>{lbl}</button>
              ))}
            </div>
          </div>
          {[["Nom de la boutique *", name, setName, "Ma Super Boutique"],["URL *", url, setUrl, "mystore.myshopify.com"],["Clé API", apiKey, setApiKey, "••••••••"]].map(([lbl,val,fn,ph])=>(
            <div key={lbl}><label className="block text-sm font-medium text-gray-700 mb-1">{lbl}</label><input value={val} onChange={e=>fn(e.target.value)} placeholder={ph} type={lbl==="Clé API"?"password":"text"} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          ))}
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Annuler</button>
          <button onClick={()=>{if(!name||!url)return;onAdd({id:Date.now().toString(),name,platform,url,status:"connected",lastSync:new Date().toISOString(),orders:0,revenue:0});onClose();}} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Connecter</button>
        </div>
      </div>
    </div>
  );
}

// ===================== PAGES =====================
function Dashboard({ products, orders, stores }) {
  const totalRevenue = orders.reduce((s,o)=>o.status!=="cancelled"?s+o.total:s,0);
  const totalProfit = orders.reduce((s,o)=>o.status!=="cancelled"?s+(o.total-o.cost):s,0);
  const pendingOrders = orders.filter(o=>o.status==="pending").length;
  const activeProducts = products.filter(p=>p.status==="active").length;
  const stats = [
    { name:"Revenu total", value:`$${totalRevenue.toFixed(2)}`, icon:DollarSign, change:"+12.5%", up:true },
    { name:"Profit net", value:`$${totalProfit.toFixed(2)}`, icon:TrendingUp, change:"+8.3%", up:true },
    { name:"Commandes en attente", value:pendingOrders.toString(), icon:ShoppingCart, change:"-2", up:false },
    { name:"Produits actifs", value:activeProducts.toString(), icon:Package, change:"+3", up:true },
  ];
  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1><p className="text-sm text-gray-400 mt-1">Vue d'ensemble de votre activité dropshipping</p></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s=>(
          <div key={s.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-gray-400 font-medium">{s.name}</p><p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p></div>
              <div className={`p-3 rounded-xl ${s.up?"bg-blue-50":"bg-red-50"}`}><s.icon className={`w-5 h-5 ${s.up?"text-blue-500":"text-red-400"}`} /></div>
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm">
              {s.up?<ArrowUpRight className="w-4 h-4 text-green-500"/>:<ArrowDownRight className="w-4 h-4 text-red-400"/>}
              <span className={`font-semibold ${s.up?"text-green-600":"text-red-500"}`}>{s.change}</span>
              <span className="text-gray-400">vs semaine dernière</span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-900">Ventes & Profit</h2>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none text-gray-600">
              <option>7 derniers jours</option><option>30 derniers jours</option><option>Cette année</option>
            </select>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{top:5,right:10,left:-20,bottom:0}}>
                <defs>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#9ca3af",fontSize:11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill:"#9ca3af",fontSize:11}} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{borderRadius:"10px",border:"1px solid #e5e7eb",fontSize:"12px",boxShadow:"0 4px 12px rgba(0,0,0,0.08)"}} />
                <Area type="monotone" dataKey="sales" name="Ventes" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gS)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2.5} fill="url(#gP)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"/>{" "}Ventes</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/>{" "}Profit</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Commandes récentes</h2>
          <div className="space-y-2">
            {orders.slice(0,5).map(o=>(
              <div key={o.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                <div><p className="text-sm font-semibold text-gray-900">{o.customerName}</p><p className="text-xs text-gray-400">{o.orderNumber}</p></div>
                <div className="text-right"><p className="text-sm font-bold text-gray-900">${o.total}</p><Badge status={o.status} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map(s=>(
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${s.platform==="shopify"?"bg-green-50":s.platform==="ebay"?"bg-yellow-50":"bg-purple-50"}`}>
              <Store className={`w-5 h-5 ${s.platform==="shopify"?"text-green-600":s.platform==="ebay"?"text-yellow-600":"text-purple-600"}`} />
            </div>
            <div className="flex-1"><p className="text-sm font-bold text-gray-900">{s.name}</p><p className="text-xs text-gray-400">{s.orders} cmd · ${s.revenue.toFixed(0)}</p></div>
            <Badge status={s.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsPage({ products, stores, onAdd, onDelete, onUpdate }) {
  const [search, setSearch] = useState(""); const [statusFilter, setStatusFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false); const [showFinder, setShowFinder] = useState(false);
  const [selected, setSelected] = useState([]);
  const filtered = products.filter(p => (statusFilter==="all"||p.status===statusFilter) && (p.title.toLowerCase().includes(search.toLowerCase())||p.supplier.toLowerCase().includes(search.toLowerCase())));
  const toggle = (id) => setSelected(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const handleImport = (sp) => onAdd({id:Date.now().toString(),title:sp.title,image:sp.image,supplier:sp.supplier,cost:sp.cost,price:parseFloat((sp.cost*2.5).toFixed(2)),stock:100,status:"draft",category:sp.category,orders:0});
  return (
    <div className="space-y-6">
      {showAdd && <AddProductModal onClose={()=>setShowAdd(false)} onAdd={p=>{onAdd(p);}} stores={stores} />}
      {showFinder && <ProductFinderModal onClose={()=>setShowFinder(false)} onImport={handleImport} />}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Produits</h1><p className="text-sm text-gray-400 mt-1">{products.length} produits dans votre catalogue</p></div>
        <div className="flex gap-2">
          <button onClick={()=>setShowFinder(true)} className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"><Search className="w-4 h-4"/>Trouver produits</button>
          <button onClick={()=>setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/>Ajouter</button>
        </div>
      </div>
      {selected.length>0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-blue-700 font-semibold">{selected.length} produit(s) sélectionné(s)</span>
          <div className="flex gap-2">
            <button onClick={()=>{selected.forEach(id=>onUpdate(id,{status:"active"}));setSelected([]);}} className="px-3 py-1 text-xs font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700">Activer</button>
            <button onClick={()=>{selected.forEach(id=>onDelete(id));setSelected([]);}} className="px-3 py-1 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700">Supprimer</button>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/60">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher produits..." className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"/></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">Tous les statuts</option><option value="active">Actif</option><option value="draft">Brouillon</option><option value="out_of_stock">Rupture</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/60">
              <tr>
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={()=>setSelected(selected.length===filtered.length?[]:filtered.map(p=>p.id))} className="rounded"/></th>
                {["Produit","Fournisseur","Coût","Prix / Profit","Stock","Statut","Commandes",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p=>(
                <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>toggle(p.id)} className="rounded"/></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-3">{p.image?<img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100"/>:<div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package className="w-4 h-4 text-gray-300"/></div>}<span className="text-sm font-semibold text-gray-900 max-w-[170px] truncate">{p.title}</span></div></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.supplier}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">${p.cost.toFixed(2)}</td>
                  <td className="px-4 py-3"><div className="text-sm text-gray-800">${p.price.toFixed(2)}</div><div className="text-xs font-semibold text-emerald-600">+${(p.price-p.cost).toFixed(2)}</div></td>
                  <td className="px-4 py-3 text-sm">{p.stock>0?<span className="text-gray-700">{p.stock}</span>:<span className="text-red-500 font-medium">Épuisé</span>}</td>
                  <td className="px-4 py-3"><Badge status={p.status}/></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{p.orders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={()=>onUpdate(p.id,{status:p.status==="active"?"draft":"active"})} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4"/></button>
                      <button onClick={()=>onDelete(p.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={9} className="px-4 py-16 text-center text-gray-300 text-sm">Aucun produit trouvé.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersPage({ orders, onUpdateStatus }) {
  const [search, setSearch] = useState(""); const [statusFilter, setStatusFilter] = useState("all"); const [sel, setSel] = useState(null);
  const filtered = orders.filter(o=>(statusFilter==="all"||o.status===statusFilter)&&(o.orderNumber.toLowerCase().includes(search.toLowerCase())||o.customerName.toLowerCase().includes(search.toLowerCase())));
  const pendingCount = orders.filter(o=>o.status==="pending").length;
  return (
    <div className="space-y-6">
      {sel && <OrderModal order={sel} onClose={()=>setSel(null)} onUpdateStatus={onUpdateStatus}/>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Commandes</h1><p className="text-sm text-gray-400 mt-1">{orders.length} commandes au total</p></div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"><Download className="w-4 h-4"/>Exporter</button>
          {pendingCount>0&&<button onClick={()=>orders.filter(o=>o.status==="pending").forEach(o=>onUpdateStatus(o.id,"processing"))} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Zap className="w-4 h-4"/>Traiter {pendingCount} cmd</button>}
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/60">
          <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher commandes..." className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"/></div>
          <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            <option value="all">Tous</option><option value="pending">En attente</option><option value="processing">Traitement</option><option value="shipped">Expédié</option><option value="delivered">Livré</option><option value="cancelled">Annulé</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/60">
              <tr>{["N° Commande","Date","Client","Boutique","Statut","Total","Profit",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(o=>(
                <tr key={o.id} className="hover:bg-gray-50/70 cursor-pointer transition-colors" onClick={()=>setSel(o)}>
                  <td className="px-4 py-3 text-sm font-bold text-blue-600">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{fmtDate(o.date)}</td>
                  <td className="px-4 py-3"><p className="text-sm font-semibold text-gray-900">{o.customerName}</p><p className="text-xs text-gray-400">{o.customerEmail}</p></td>
                  <td className="px-4 py-3 text-sm text-gray-500">{o.store}</td>
                  <td className="px-4 py-3"><Badge status={o.status}/></td>
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-emerald-600">+${(o.total-o.cost).toFixed(2)}</td>
                  <td className="px-4 py-3"><ExternalLink className="w-4 h-4 text-gray-200 hover:text-blue-400"/></td>
                </tr>
              ))}
              {filtered.length===0&&<tr><td colSpan={8} className="px-4 py-16 text-center text-gray-300 text-sm">Aucune commande trouvée.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StoresPage({ stores, onAdd, onDelete, onSync }) {
  const [showAdd, setShowAdd] = useState(false);
  const pcls = { shopify:"bg-green-50 text-green-600", woocommerce:"bg-purple-50 text-purple-600", ebay:"bg-yellow-50 text-yellow-600", amazon:"bg-orange-50 text-orange-600" };
  return (
    <div className="space-y-6">
      {showAdd && <AddStoreModal onClose={()=>setShowAdd(false)} onAdd={s=>{onAdd(s);}}/>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-900">Boutiques</h1><p className="text-sm text-gray-400 mt-1">Gérez vos canaux de vente connectés</p></div>
        <button onClick={()=>setShowAdd(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-sm"><Plus className="w-4 h-4"/>Ajouter une boutique</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {stores.map(s=>(
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${(pcls[s.platform]||"bg-gray-50 text-gray-500").split(" ")[0]}`}>
                  <Store className={`w-6 h-6 ${(pcls[s.platform]||"bg-gray-50 text-gray-500").split(" ")[1]}`} />
                </div>
                <div><h3 className="font-bold text-gray-900">{s.name}</h3><p className="text-xs text-gray-400 capitalize">{s.platform}</p></div>
              </div>
              <Badge status={s.status}/>
            </div>
            <div className="space-y-2 mb-4">
              {[["Commandes",s.orders],["Revenus",`$${s.revenue.toFixed(2)}`],["URL",s.url]].map(([k,v])=>(
                <div key={k} className="flex justify-between text-sm"><span className="text-gray-400">{k}</span><span className={`font-medium ${k==="URL"?"text-blue-500 text-xs truncate max-w-[140px]":"text-gray-800"}`}>{v}</span></div>
              ))}
            </div>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Sync: {fmtTime(s.lastSync)}</span>
              <div className="flex gap-1">
                <button onClick={()=>onSync(s.id)} className="p-1.5 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Synchroniser"><RefreshCw className="w-4 h-4"/></button>
                <button onClick={()=>onDelete(s.id)} className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          </div>
        ))}
        <button onClick={()=>setShowAdd(true)} className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50/40 transition-all min-h-[220px]">
          <div className="p-3 rounded-full bg-white shadow-sm mb-3"><Plus className="w-6 h-6"/></div>
          <span className="font-semibold text-sm">Connecter une boutique</span>
          <span className="text-xs mt-1 opacity-70">Shopify, WooCommerce, eBay, Amazon</span>
        </button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = useState("profile");
  const [profile, setProfile] = useState({ firstName:"Jean", lastName:"Dupont", email:"jean@monshop.fr", company:"MonShop SARL", phone:"+33 6 12 34 56 78" });
  const [saved, setSaved] = useState(false);
  const [markupType, setMarkupType] = useState("percentage"); const [markupValue, setMarkupValue] = useState("150");
  const [notifs, setNotifs] = useState({ newOrder:true, lowStock:true, shipment:true, profit:false, weekly:true });
  const save = ()=>{setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const tabs = [["profile","Profil",User],["pricing","Règles de prix",Tag],["notifications","Notifications",Bell],["billing","Facturation",CreditCard],["security","Sécurité",Shield],["api","API & Intégrations",Key]];
  const calcPrice = ()=>{ const v=parseFloat(markupValue)||0; return markupType==="percentage"?(10*(1+v/100)).toFixed(2):markupType==="multiplier"?(10*v).toFixed(2):(10+v).toFixed(2); };
  return (
    <div className="space-y-6 max-w-5xl">
      <div><h1 className="text-2xl font-bold text-gray-900">Paramètres</h1><p className="text-sm text-gray-400 mt-1">Gérez votre compte et vos préférences</p></div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-gray-100 p-3 space-y-0.5 bg-gray-50/60">
            {tabs.map(([id,lbl,Icon])=>(
              <button key={id} onClick={()=>setTab(id)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${tab===id?"bg-blue-600 text-white":"text-gray-600 hover:bg-gray-100"}`}>
                <Icon className={`w-4 h-4 ${tab===id?"text-white":"text-gray-400"}`}/>{lbl}
              </button>
            ))}
          </div>
          <div className="flex-1 p-6">
            {tab==="profile" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Informations du profil</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label><input value={profile.firstName} onChange={e=>setProfile({...profile,firstName:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-1">Nom</label><input value={profile.lastName} onChange={e=>setProfile({...profile,lastName:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                </div>
                {[["Email","email","email"],["Entreprise","company","text"],["Téléphone","phone","tel"]].map(([lbl,key,type])=>(
                  <div key={key}><label className="block text-sm font-medium text-gray-700 mb-1">{lbl}</label><input type={type} value={profile[key]} onChange={e=>setProfile({...profile,[key]:e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                ))}
                <div className="flex justify-end pt-2"><button onClick={save} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${saved?"bg-green-600 text-white":"bg-blue-600 text-white hover:bg-blue-700"}`}>{saved?<><Check className="w-4 h-4"/>Sauvegardé</>:<><Save className="w-4 h-4"/>Sauvegarder</>}</button></div>
              </div>
            )}
            {tab==="pricing" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Règles de prix automatiques</h2>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">Définissez des règles pour calculer automatiquement le prix de vente à partir du coût fournisseur.</div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de majoration</label>
                  <div className="flex gap-2">
                    {[["percentage","Pourcentage (%)"],["multiplier","Multiplicateur (×)"],["fixed","Fixe ($)"]].map(([v,l])=>(
                      <button key={v} onClick={()=>setMarkupType(v)} className={`px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${markupType===v?"border-blue-500 bg-blue-50 text-blue-700":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Valeur</label><div className="flex items-center gap-2"><input type="number" value={markupValue} onChange={e=>setMarkupValue(e.target.value)} className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/><span className="text-sm text-gray-500">{markupType==="percentage"?"%":markupType==="multiplier"?"×":"$"}</span></div></div>
                <div className="bg-gray-50 rounded-xl p-4"><p className="text-sm font-medium text-gray-700 mb-1">Exemple :</p><p className="text-sm text-gray-600">Coût: <span className="font-bold">$10.00</span> → Prix: <span className="font-bold text-blue-700">${calcPrice()}</span></p></div>
                <div className="flex justify-end"><button onClick={save} className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold ${saved?"bg-green-600 text-white":"bg-blue-600 text-white hover:bg-blue-700"}`}>{saved?<><Check className="w-4 h-4"/>Sauvegardé</>:<><Save className="w-4 h-4"/>Sauvegarder</>}</button></div>
              </div>
            )}
            {tab==="notifications" && (
              <div className="space-y-1">
                <h2 className="text-base font-bold text-gray-900 mb-4">Préférences de notifications</h2>
                {[["newOrder","Nouvelle commande","Soyez notifié à chaque nouvelle commande"],["lowStock","Stock faible","Alerte sous 10 unités"],["shipment","Expédition","Mises à jour de suivi colis"],["profit","Rapport de profit","Rapport quotidien de vos profits"],["weekly","Récapitulatif hebdomadaire","Résumé chaque lundi"]].map(([k,l,d])=>(
                  <div key={k} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                    <div><p className="text-sm font-semibold text-gray-900">{l}</p><p className="text-xs text-gray-400 mt-0.5">{d}</p></div>
                    <button onClick={()=>setNotifs({...notifs,[k]:!notifs[k]})} className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifs[k]?"bg-blue-600":"bg-gray-200"}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[k]?"translate-x-6":"translate-x-1"}`}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {tab==="billing" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Facturation & Abonnement</h2>
                <div className="bg-blue-600 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm opacity-70">Plan actuel</p><p className="text-2xl font-bold mt-1">Pro</p><p className="text-xs opacity-70 mt-1">Renouvellement : 27 juin 2026</p></div>
                    <div className="text-right"><p className="text-3xl font-bold">$29</p><p className="text-sm opacity-70">/mois</p></div>
                  </div>
                </div>
                <div className="space-y-2.5">{["Produits illimités","Boutiques illimitées","Auto-fulfillment","Support prioritaire","Analytics avancées"].map(f=><div key={f} className="flex items-center gap-2 text-sm text-gray-700"><Check className="w-4 h-4 text-green-500 flex-shrink-0"/>{f}</div>)}</div>
              </div>
            )}
            {tab==="security" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">Sécurité du compte</h2>
                {["Mot de passe actuel","Nouveau mot de passe","Confirmer le mot de passe"].map(l=>(
                  <div key={l}><label className="block text-sm font-medium text-gray-700 mb-1">{l}</label><input type="password" placeholder="••••••••" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/></div>
                ))}
                <div className="flex justify-end"><button className="px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700">Changer le mot de passe</button></div>
              </div>
            )}
            {tab==="api" && (
              <div className="space-y-4">
                <h2 className="text-base font-bold text-gray-900">API & Intégrations</h2>
                {[{name:"AliExpress",key:"ae_sk_xxxx...1234",connected:true},{name:"CJ Dropshipping",key:"cj_sk_xxxx...5678",connected:true},{name:"Zendrop",key:"",connected:false},{name:"Spocket",key:"",connected:false}].map(api=>(
                  <div key={api.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600">{api.name[0]}</div>
                      <div><p className="text-sm font-semibold text-gray-900">{api.name}</p>{api.connected&&<p className="text-xs text-gray-400 font-mono">{api.key}</p>}</div>
                    </div>
                    <div className="flex items-center gap-2"><Badge status={api.connected?"connected":"disconnected"}/><button className="px-3 py-1 text-xs font-medium border border-gray-200 rounded-lg hover:bg-gray-100">{api.connected?"Modifier":"Connecter"}</button></div>
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

// ===================== APP =====================
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [stores, setStores] = useState(initialStores);

  const addProduct=(p)=>setProducts(prev=>[...prev,p]);
  const updateProduct=(id,d)=>setProducts(prev=>prev.map(p=>p.id===id?{...p,...d}:p));
  const deleteProduct=(id)=>setProducts(prev=>prev.filter(p=>p.id!==id));
  const updateOrder=(id,status)=>setOrders(prev=>prev.map(o=>o.id===id?{...o,status}:o));
  const addStore=(s)=>setStores(prev=>[...prev,s]);
  const deleteStore=(id)=>setStores(prev=>prev.filter(s=>s.id!==id));
  const syncStore=(id)=>setStores(prev=>prev.map(s=>s.id===id?{...s,lastSync:new Date().toISOString()}:s));

  const pendingCount = orders.filter(o=>o.status==="pending").length;
  const navItems = [
    ["dashboard","Tableau de bord",LayoutDashboard,0],
    ["products","Produits",Package,0],
    ["orders","Commandes",ShoppingCart,pendingCount],
    ["stores","Boutiques",Store,0],
    ["settings","Paramètres",Settings,0],
  ];
  const notifList = [
    { id:1, text:"Nouvelle commande #ORD-006 reçue", time:"il y a 5 min", Icon:ShoppingCart, color:"text-blue-500" },
    { id:2, text:"Portable Charger en rupture de stock", time:"il y a 1h", Icon:AlertCircle, color:"text-red-500" },
    { id:3, text:"Boutique eBay synchronisée avec succès", time:"il y a 2h", Icon:RefreshCw, color:"text-green-500" },
    { id:4, text:"Profit de $84.50 réalisé cette semaine", time:"il y a 1 jour", Icon:TrendingUp, color:"text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{fontFamily:"system-ui,sans-serif"}}>
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static shadow-sm ${sidebarOpen?"translate-x-0":"-translate-x-full"}`}>
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm"><Package className="w-4 h-4 text-white"/></div>
            <span className="text-lg font-black text-gray-900">DropSync</span>
            <span className="px-1.5 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-lg">Pro</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map(([id,lbl,Icon,badge])=>(
            <button key={id} onClick={()=>{setPage(id);setSidebarOpen(false);}} className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${page===id?"bg-blue-600 text-white shadow-sm":"text-gray-600 hover:bg-gray-100"}`}>
              <span className="flex items-center gap-3"><Icon className={`w-4 h-4 ${page===id?"text-white":"text-gray-400"}`}/>{lbl}</span>
              {badge>0&&<span className={`px-2 py-0.5 text-xs font-bold rounded-full ${page===id?"bg-blue-400 text-white":"bg-red-500 text-white"}`}>{badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">JD</div>
            <div className="flex-1 min-w-0"><p className="text-sm font-bold text-gray-900 truncate">Jean Dupont</p><p className="text-xs text-gray-400 truncate">jean@monshop.fr</p></div>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"><LogOut className="w-4 h-4"/>Déconnexion</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={()=>setSidebarOpen(true)}><Menu className="w-6 h-6"/></button>
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"/>
              <input type="text" placeholder="Rechercher produits, commandes..." className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"/>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount>0&&(
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100" onClick={()=>setPage("orders")}>
                <AlertCircle className="w-4 h-4 text-amber-500"/><span className="text-xs font-semibold text-amber-700">{pendingCount} en attente</span>
              </div>
            )}
            <div className="relative">
              <button onClick={()=>setShowNotifs(!showNotifs)} className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5"/>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/>
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button onClick={()=>setShowNotifs(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-400"/></button>
                  </div>
                  {notifList.map(n=>(
                    <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors">
                      <n.Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.color}`}/>
                      <div><p className="text-sm text-gray-800 leading-tight">{n.text}</p><p className="text-xs text-gray-400 mt-0.5">{n.time}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs cursor-pointer">JD</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {page==="dashboard" && <Dashboard products={products} orders={orders} stores={stores}/>}
          {page==="products" && <ProductsPage products={products} stores={stores} onAdd={addProduct} onDelete={deleteProduct} onUpdate={updateProduct}/>}
          {page==="orders" && <OrdersPage orders={orders} onUpdateStatus={updateOrder}/>}
          {page==="stores" && <StoresPage stores={stores} onAdd={addStore} onDelete={deleteStore} onSync={syncStore}/>}
          {page==="settings" && <SettingsPage/>}
        </main>
      </div>
    </div>
  );
}
