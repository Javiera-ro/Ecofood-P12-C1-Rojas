import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

export const obtenerProductos = async (empresaId) => {
  const q = query(
    collection(db, "productos"),
    where("empresaId", "==", empresaId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const crearProducto = async (producto) => {
  return await addDoc(collection(db, "productos"), producto);
};

export const actualizarProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  return await updateDoc(ref, data);
};

export const eliminarProducto = async (id) => {
  return await deleteDoc(doc(db, "productos", id));
};
