import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export default function RutaEmpresa({ children }) {
  const [cargando, setCargando] = useState(true);
  const [esEmpresa, setEsEmpresa] = useState(false);
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const verificarEmpresa = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setCargando(false);
        return;
      }

      const snapshot = await getDocs(collection(db, "empresas"));
      const empresaEncontrada = snapshot.docs.find(
        (doc) => doc.data().uid === user.uid
      );

      setEsEmpresa(!!empresaEncontrada);
      setVerificado(true);
      setCargando(false);
    };

    verificarEmpresa();
  }, []);

  if (cargando) {
    return <div className="container mt-4">Cargando...</div>;
  }

  if (!esEmpresa && verificado) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">Acceso restringido</h4>
        <p>Esta sección está disponible solo para empresas registradas en el sistema.</p>
      </div>
    );
  }

  return children;
}
