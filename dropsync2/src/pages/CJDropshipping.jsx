import { useState } from "react";
import { useFirestore } from "../hooks/useFirestore";
import { cjSearchProducts } from "../services/cjService";
import toast from "react-hot-toast";
import { Search, Package, Plus, Star, Loader2, X, ShoppingBag, RefreshCw, ExternalLink, Check } from "lucide-react";

function ImportModal({ product, onClose, onImport }) {
  const [markup, setMarkup] = useState(150);
  const cost = product.sellPrice || product.productPrice || 0;
  const price = parseFloat((cost * (1 + markup / 100)).toFixed(2));
  const profit = (price - cost).toFixed(2);
  const [importing, setImporting] = useState(false);

  async function handleImport() {
    setImporting(true);
    try {
      await onImport({
        title: product.productNameEn || product.productName,
        image: product.productImage || product.imgUrl,
        supplier: "CJ Dropshipping",
        cost: parseFloat(cost),
        price,
        stock: product.inventory || 100,
        category: product.categoryName || "Electronique",
        status: "draft",
        orders: 0,
        cjPid: product.pid,
        description: product.description || "",
        badge: "Nouveau"
      });
      toast.success("Produit importé dans DropSync !");
      onClose();
    } catch { toast.error("Erreur d'importation"); }
    finally { setImporting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Importer le produit</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3 items-start">
            <img src={product.productImage || product.imgUrl} alt="" className="w-20 h-20 object-cover rounded-xl border border-gray-100" />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 line-clamp-2">{product.productNameEn || product.productName}</p>
              <p className="text-xs text-gray-400 mt-1">{product.categoryName}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Coût CJ</span>
              <span className="font-bold text-gray-900">${parseFloat(cost).toFixed(2)}</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Majoration</span>
                <span className="font-bold text-blue-600">{markup}%</span>
              </div>
              <input type="range" min={50} max={500} value={markup} onChange={e => setMarkup(Number(e.target.value))}
                className="w-full accent-blue-600" />
            </div>
            <div className="border-t border-gray-200 pt-3 grid grid-cols-2 gap-3">
              <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-blue-500 mb-1">Prix de vente</p>
                <p className="text-lg font-black text-blue-700">${price}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-green-500 mb-1">Profit</p>
                <p className="text-lg font-black text-green-700">+${profit}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50">Annuler</button>
          <button onClick={handleImport} disabled={importing}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
            {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Importer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CJDropshipping() {
  const { add } = useFirestore("products");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(1);

  const trending = ["Écouteurs bluetooth", "Montre connectée", "Résistance élastique", "Chargeur rapide", "Support téléphone", "Lampe LED", "Bouteille thermos", "Clavier mécanique"];

  async function handleSearch(kw, p = 1) {
    const keyword = kw || search;
    if (!keyword.trim()) return toast.error("Entre un mot-clé");
    setLoading(true);
    setSearched(true);
    try {
      const data = await cjSearchProducts(keyword, p);
      if (data.result && data.data?.list) {
        setProducts(p === 1 ? data.data.list : [...products, ...data.data.list]);
        setPage(p);
      } else {
        toast.error("Aucun résultat ou erreur API");
        setProducts([]);
      }
    } catch (e) {
      toast.error("Erreur de connexion CJ");
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      {selectedProduct && (
        <ImportModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onImport={add}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CJ Dropshipping</h1>
          <p className="text-sm text-gray-400 mt-1">Recherchez et importez des produits depuis CJ</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-green-700">API Connectée</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Ex: écouteurs bluetooth, montre sport, lampe LED..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <button onClick={() => handleSearch()} disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2 text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Rechercher
          </button>
        </div>

        {/* Trending keywords */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">🔥 Tendances :</p>
          <div className="flex flex-wrap gap-2">
            {trending.map(kw => (
              <button key={kw} onClick={() => { setSearch(kw); handleSearch(kw); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && !products.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-xl" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !searched ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Trouvez vos produits gagnants</h3>
          <p className="text-gray-400 text-sm">Recherchez parmi des millions de produits CJ Dropshipping</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">Aucun résultat</h3>
          <p className="text-gray-400 text-sm">Essaie un autre mot-clé</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 font-medium">{products.length} produit(s) trouvé(s)</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p, i) => {
              const cost = parseFloat(p.sellPrice || p.productPrice || 0);
              const suggestedPrice = parseFloat((cost * 2.5).toFixed(2));
              const profit = (suggestedPrice - cost).toFixed(2);

              return (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img src={p.productImage || p.imgUrl} alt=""
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">CJ</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-blue-500 font-semibold mb-1">{p.categoryName || "Produit"}</p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 leading-snug">
                      {p.productNameEn || p.productName}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s<=4?"fill-amber-400 text-amber-400":"fill-gray-200 text-gray-200"}`} />)}
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-3 mb-3 grid grid-cols-3 gap-1 text-center">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Coût</p>
                        <p className="text-sm font-black text-gray-900">${cost.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Prix</p>
                        <p className="text-sm font-black text-blue-600">${suggestedPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Profit</p>
                        <p className="text-sm font-black text-green-600">+${profit}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setSelectedProduct(p)}
                        className="flex-1 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 flex items-center justify-center gap-1.5">
                        <Plus className="w-3.5 h-3.5" />Importer
                      </button>
                      {p.pid && (
                        <a href={`https://cjdropshipping.com/product/-p-${p.pid}.html`} target="_blank" rel="noreferrer"
                          className="p-2.5 border-2 border-gray-200 text-gray-500 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load more */}
          <div className="text-center">
            <button onClick={() => handleSearch(search, page + 1)} disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-60 text-sm">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Charger plus
            </button>
          </div>
        </>
      )}
    </div>
  );
}
