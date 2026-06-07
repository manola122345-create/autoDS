// Composant réutilisable pour gérer plusieurs images
import { useState } from "react";
import { Plus, X, Star } from "lucide-react";

export default function ImageGallery({ images, onChange }) {
  const [newUrl, setNewUrl] = useState("");

  function addImage() {
    if (!newUrl.trim()) return;
    onChange([...images, newUrl.trim()]);
    setNewUrl("");
  }

  function removeImage(index) {
    onChange(images.filter((_, i) => i !== index));
  }

  function setMain(index) {
    // Met l'image sélectionnée en première position
    const newImages = [...images];
    const [selected] = newImages.splice(index, 1);
    newImages.unshift(selected);
    onChange(newImages);
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-gray-600">
        Images du produit <span className="text-gray-400 font-normal">(la 1ère = image principale)</span>
      </label>

      {/* Grille d'images */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <div key={i} className={`relative group rounded-xl overflow-hidden border-2 ${i === 0 ? "border-blue-500" : "border-gray-200"}`}>
              <img src={img} alt="" className="w-full aspect-square object-cover" />

              {/* Badge principale */}
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-lg font-bold flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5" />Principale
                </div>
              )}

              {/* Actions au hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i !== 0 && (
                  <button onClick={() => setMain(i)}
                    className="p-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600"
                    title="Définir comme principale">
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button onClick={() => removeImage(i)}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  title="Supprimer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ajouter une image */}
      <div className="flex gap-2">
        <input
          value={newUrl}
          onChange={e => setNewUrl(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addImage()}
          placeholder="Colle l'URL d'une image..."
          className="flex-1 border-2 border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-gray-50 focus:bg-white"
        />
        <button onClick={addImage}
          className="px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center gap-1.5">
          <Plus className="w-4 h-4" />Ajouter
        </button>
      </div>

      <p className="text-xs text-gray-400">
        💡 Sur AliExpress : clic droit sur une image → "Copier l'adresse de l'image"
      </p>
    </div>
  );
}
