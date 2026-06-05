import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Package, ShoppingCart, Store, Settings,
  Bell, Search, Menu, LogOut, X, TrendingUp, Zap, ChevronDown,
  AlertCircle, RefreshCw, Shield, ShoppingBag, Plus
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { to: "/products", icon: Package, label: "Produits" },
  { to: "/orders", icon: ShoppingCart, label: "Commandes" },
  { to: "/stores", icon: Store, label: "Boutiques" },
  { to: "/cj", icon: ShoppingBag, label: "CJ Dropshipping" },
  { to: "/import", icon: Plus, label: "Importer produits" },
  { to: "/analytics", icon: TrendingUp, label: "Analytics" },
  { to: "/automation", icon: Zap, label: "Automation" },
  { to: "/settings", icon: Settings, label: "Paramètres" },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const notifRef = useRef();
  const profileRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    try { await logout(); navigate("/login"); toast.success("Déconnecté"); }
    catch { toast.error("Erreur de déconnexion"); }
  }

  const initials = userProfile
    ? `${userProfile.firstName?.[0] || ""}${userProfile.lastName?.[0] || ""}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || "?";

  const displayName = userProfile
    ? `${userProfile.firstName} ${userProfile.lastName}`
    : user?.email || "Utilisateur";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-200 lg:translate-x-0 lg:static shadow-sm ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-gray-900">DropSync</span>
          </div>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Pro badge */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            <span>Plan Pro — Accès complet</span>
            <span className="ml-auto">✨</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100"}`
              }>
              {({ isActive }) => (
                <><Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-400"}`} />{label}</>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium">
            <LogOut className="w-4 h-4" />Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-gray-600" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative hidden sm:block w-72">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input placeholder="Rechercher produits, commandes..."
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifs */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                    <button onClick={() => setShowNotifs(false)}><X className="w-4 h-4 text-gray-400" /></button>
                  </div>
                  {[
                    { text: "Nouvelle commande reçue", time: "il y a 5 min", Icon: ShoppingCart, color: "text-blue-500" },
                    { text: "Stock faible sur 2 produits", time: "il y a 1h", Icon: AlertCircle, color: "text-red-500" },
                    { text: "Boutique synchronisée", time: "il y a 2h", Icon: RefreshCw, color: "text-green-500" },
                  ].map((n, i) => (
                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 cursor-pointer">
                      <n.Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${n.color}`} />
                      <div><p className="text-sm text-gray-800">{n.text}</p><p className="text-xs text-gray-400 mt-0.5">{n.time}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                  {initials}
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield className="w-3 h-3 text-blue-500" />
                      <p className="text-xs text-blue-600 font-semibold">Plan Pro ✨</p>
                    </div>
                  </div>
                  <NavLink to="/settings" onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="w-4 h-4 text-gray-400" />Paramètres
                  </NavLink>
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
