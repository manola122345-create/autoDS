import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile,
  sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function register(email, password, firstName, lastName) {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: `${firstName} ${lastName}` });
    await setDoc(doc(db, "users", user.uid), {
      firstName, lastName, email,
      plan: "free", createdAt: serverTimestamp(),
      settings: {
        markupType: "percentage", markupValue: 150,
        notifications: { newOrder: true, lowStock: true, shipment: true, weekly: true }
      }
    });
    return user;
  }

  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const ref = doc(db, "users", result.user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const names = (result.user.displayName || "").split(" ");
      await setDoc(ref, {
        firstName: names[0] || "", lastName: names.slice(1).join(" ") || "",
        email: result.user.email, plan: "free", createdAt: serverTimestamp(),
        settings: { markupType: "percentage", markupValue: 150, notifications: { newOrder: true, lowStock: true, shipment: true, weekly: true } }
      });
    }
    return result;
  }

  async function logout() { return signOut(auth); }
  async function resetPassword(email) { return sendPasswordResetEmail(auth, email); }

  async function loadProfile(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    if (snap.exists()) setUserProfile({ id: snap.id, ...snap.data() });
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) await loadProfile(u.uid);
      else setUserProfile(null);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, register, login, loginWithGoogle, logout, resetPassword, loadProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
