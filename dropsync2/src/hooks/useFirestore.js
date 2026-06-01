import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDoc
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export function useCollection(collectionName, orderField = "createdAt") {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, collectionName),
      where("userId", "==", user.uid),
      orderBy(orderField, "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setData(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [user, collectionName, orderField]);

  return { data, loading };
}

export function useFirestore(collectionName) {
  const { user } = useAuth();

  async function add(data) {
    return addDoc(collection(db, collectionName), {
      ...data, userId: user.uid, createdAt: serverTimestamp()
    });
  }

  async function update(id, data) {
    return updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });
  }

  async function remove(id) {
    return deleteDoc(doc(db, collectionName, id));
  }

  async function getOne(id) {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  return { add, update, remove, getOne };
}
