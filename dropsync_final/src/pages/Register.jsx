import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Package, Eye, EyeOff, Loader2, Check } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const checks = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    match: form.password === form.confirm && form.confirm.length > 0
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!checks.length || !checks.match) return toast.error("Vérifie ton mot de passe");
    if (!form.firstName || !form.lastName) return toast.error("Remplis ton prénom et nom");
    setLoading(true);
    try {
      await register(form.email, form.password, form.firstName, form.lastName);
      toast.success("Compte créé avec succès ! 🎉");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") toast.error("Cet email est déjà utilisé");
      else toast.error("Erreur : " + err.message);
    } finally { setLoading(false); }
  }

  async function handleGoogle() {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) { toast.error("Erreur Google"); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">DropSync</h1>
          <p className="text-gray-500 mt-1 text-sm">Commence gratuitement aujourd'hui</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Créer un compte</h2>

          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all mb-4">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continuer avec Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {[["Prénom", "firstName", "Jean"], ["Nom", "lastName", "Dupont"]].map(([lbl, key, ph]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">{lbl}</label>
                  <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={ph} required
                    className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="ton@email.com" required
                className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full border-2 border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-3 text-gray-400">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {[["length", "8 caractères minimum"], ["upper", "Une majuscule"], ["number", "Un chiffre"]].map(([k, l]) => (
                    <div key={k} className={`flex items-center gap-1.5 text-xs ${checks[k] ? "text-green-600" : "text-gray-400"}`}>
                      <Check className="w-3 h-3" />{l}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmer le mot de passe</label>
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••" required
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${form.confirm && !checks.match ? "border-red-400 focus:border-red-500" : "border-gray-200 focus:border-blue-500"}`} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2 shadow-sm shadow-blue-200">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Création...</> : "Créer mon compte gratuit"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
