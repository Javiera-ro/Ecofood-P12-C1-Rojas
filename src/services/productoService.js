import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const obtenerProductos = async (empresaId) => {
  const querySnapshot = await getDocs(collection(db, "productos"));
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((p) => p.empresaId === empresaId);
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
