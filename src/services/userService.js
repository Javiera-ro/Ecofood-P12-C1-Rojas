import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
/**
* 
* @param {string} uid 
*/
export const getUserData = async (uid) => {
    try {
        const ref = doc(db, "usuarios", uid);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            return snapshot.data();
        } else {
            throw new Error("Usuario no encontrado en Firestore");
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        throw error;
    }
};
/**
* Guarda los datos del usuario al momento de registrarse
* @param {string} uid
* @param {object} data 
*/
export const saveUserData = async (uid, data) => {
    try {
        await setDoc(doc(db, "usuarios", uid), data);
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        throw error;
    }
};
