import { useCollection } from "../hooks/useFirestore";
import { useAuth } from "../contexts/AuthContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, Package, ArrowUpRight, ArrowDownRight, Zap, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const weekData = [
  { name: "Lun", sales: 4200, profit: 1900 },
  { name: "Mar", sales: 3800, profit: 1700 },
  { name: "Mer", sales: 5600, profit: 2500 },
  { name: "Jeu", sales: 3100, profit: 1400 },
  { name: "Ven", sales: 6800, profit: 3100 },
  { name: "Sam", sales: 7900, profit: 3600 },
  { name: "Dim", sales: 6200, profit: 2800 },
];

function StatCard({ name, value, icon: Icon, change, up, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{name}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-sm">
        {up ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-400" />}
        <span className={`font-semibold ${up ? "text-green-600" : "text-red-500"}`}>{change}</span>
        <span className="text-gray-400">vs semaine dernière</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { userProfile } = useAuth();
  const { data: orders, loading: loadingOrders } = useCollection("orders", "createdAt");
  const { data: products } = useCollection("products", "createdAt");
  const { data: stores } = useCollection("stores", "createdAt");

  const validOrders = orders.filter(o => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((s, o) => s + (o.total || 0), 0);
  const totalProfit = validOrders.reduce((s, o) => s + ((o.total || 0) - (o.cost || 0)), 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const lowStock = products.filter(p => p.stock < 10 && p.stock > 0);

  const stats = [
    { name: "Revenu total", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, change: "+12.5%", up: true, color: "bg-blue-50 text-blue-500" },
    { name: "Profit net", value: `$${totalProfit.toFixed(2)}`, icon: TrendingUp, change: "+8.3%", up: true, color: "bg-emerald-50 text-emerald-500" },
    { name: "Commandes en attente", value: pendingOrders.toString(), icon: ShoppingCart, change: pendingOrders > 0 ? `+${pendingOrders}` : "0", up: false, color: "bg-amber-50 text-amber-500" },
    { name: "Produits actifs", value: activeProducts.toString(), icon: Package, change: "+3", up: true, color: "bg-purple-50 text-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour {userProfile?.firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        {pendingOrders > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">{pendingOrders} commande(s) en attente</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => <StatCard key={s.name} {...s} />)}
      </div>

      {/* Chart + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-gray-900">Ventes & Profit</h2>
            <select className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none text-gray-600 bg-gray-50">
              <option>7 derniers jours</option>
              <option>30 jours</option>
              <option>Cette année</option>
            </select>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11 }} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }} />
                <Area type="monotone" dataKey="sales" name="Ventes ($)" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gS)" />
                <Area type="monotone" dataKey="profit" name="Profit ($)" stroke="#10b981" strokeWidth={2.5} fill="url(#gP)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-5 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Ventes</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Profit</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">Commandes récentes</h2>
          {loadingOrders ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune commande encore</p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 6).map(o => (
                <div key={o.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{o.customerName}</p>
                    <p className="text-xs text-gray-400">{o.orderNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${o.total?.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      o.status === "delivered" ? "bg-green-100 text-green-700" :
                      o.status === "shipped" ? "bg-indigo-100 text-indigo-700" :
                      o.status === "processing" ? "bg-blue-100 text-blue-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {(lowStock.length > 0 || stores.some(s => s.status === "disconnected")) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />Alertes
          </h2>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-amber-800 font-medium">{p.title}</span>
                <span className="text-amber-600 ml-auto">Stock : {p.stock} restant(s)</span>
              </div>
            ))}
            {stores.filter(s => s.status === "disconnected").map(s => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span className="text-red-800 font-medium">Boutique déconnectée :</span>
                <span className="text-red-600">{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick start if empty */}
      {products.length === 0 && orders.length === 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-2">🚀 Commence maintenant !</h2>
          <p className="text-blue-100 text-sm mb-4">Ton espace est vide. Ajoute tes premiers produits et connecte ta boutique pour démarrer.</p>
          <div className="flex gap-3">
            <a href="/products" className="px-4 py-2 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-colors">Ajouter des produits</a>
            <a href="/stores" className="px-4 py-2 bg-blue-500 text-white font-bold text-sm rounded-xl hover:bg-blue-400 transition-colors">Connecter une boutique</a>
          </div>
        </div>
      )}
    </div>
  );
}
