# DropSync — Automatisation Dropshipping

Clone complet d'AutoDS avec Firebase (Auth + Firestore en temps réel).

## 🚀 Installation

```bash
npm install
npm run dev
```

## 🔥 Configuration Firebase (OBLIGATOIRE)

### 1. Créer un projet Firebase
1. Va sur https://console.firebase.google.com
2. Clique **"Créer un projet"**
3. Donne un nom (ex: `dropsync-app`)

### 2. Activer Authentication
1. Dans Firebase Console → **Authentication** → **Sign-in method**
2. Active **Email/Password**
3. Active **Google**

### 3. Activer Firestore
1. **Firestore Database** → **Créer une base de données**
2. Choisis **mode production**
3. Sélectionne une région (ex: `europe-west1`)
4. **Règles** → copie le contenu de `firestore.rules`

### 4. Créer les index Firestore
Dans Firebase Console → Firestore → **Index** → Créer ces index composites :

| Collection | Champ 1 | Champ 2 | Ordre |
|-----------|---------|---------|-------|
| products | userId (ASC) | createdAt (DESC) | — |
| orders | userId (ASC) | createdAt (DESC) | — |
| stores | userId (ASC) | createdAt (DESC) | — |

### 5. Récupérer la config
1. **Paramètres du projet** (icône ⚙️) → **Vos applications** → **Web**
2. Copie la config `firebaseConfig`

### 6. Coller dans le code
Ouvre `src/firebase.js` et remplace :
```js
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",           // ← remplace
  authDomain: "VOTRE_PROJECT...",    // ← remplace
  projectId: "VOTRE_PROJECT_ID",     // ← remplace
  storageBucket: "VOTRE_PROJECT...", // ← remplace
  messagingSenderId: "XXXXX",        // ← remplace
  appId: "1:XXXXX:web:XXXXX"        // ← remplace
};
```

## 🌐 Déploiement Vercel

1. Push sur GitHub
2. Vercel → Import → sélectionne le repo
3. **Root Directory** → laisser vide (ou `.`)
4. **Framework** → Vite
5. **Build Command** → `npm run build`
6. **Output Directory** → `dist`
7. Deploy !

## ✅ Fonctionnalités

- 🔐 Inscription / Connexion (Email + Google)
- 📊 Dashboard temps réel (Firestore)
- 📦 Produits — CRUD complet + importation catalogue fournisseurs
- 🛒 Commandes — CRUD + mise à jour statut + numéro suivi
- 🏪 Boutiques — Connexion Shopify/WooCommerce/eBay/Amazon
- 📈 Analytics — Graphiques revenus, profits, commandes
- 🤖 Automation — Règles automatiques (prix, stock, fulfillment)
- ⚙️ Paramètres — Profil, règles de prix, notifications (sauvegardés en BDD)
- 📱 Responsive — Mobile + Desktop
