import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Package, Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
      toast.success("Email envoyé !");
    } catch {
      toast.error("Adresse email introuvable");
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <Package className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">DropSync</h1>
        </div>
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Email envoyé !</h2>
              <p className="text-sm text-gray-500 mb-6">Vérifie ta boîte mail ({email}) pour réinitialiser ton mot de passe.</p>
              <Link to="/login" className="text-blue-600 font-bold text-sm hover:text-blue-700">← Retour à la connexion</Link>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Mot de passe oublié</h2>
              <p className="text-sm text-gray-500 mb-6">Entre ton email et on t'envoie un lien de réinitialisation.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="ton@email.com"
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Envoi...</> : "Envoyer le lien"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  <ArrowLeft className="w-4 h-4" />Retour
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
