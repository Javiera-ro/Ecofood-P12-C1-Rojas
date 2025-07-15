import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "/src/services/firebase";
import { useAuth } from "/src/context/AuthContext";
import NavbarSwitcher from "/src/components/NavbarSwitcher";

export default function MisPedidos() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const { user } = useAuth();

  const cargarSolicitudes = async () => {
    setCargando(true);
    const q = query(collection(db, "solicitudes"), where("clienteId", "==", user.uid));
    const snapshot = await getDocs(q);
    const lista = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Obtener nombre del producto
      const productoSnap = await getDoc(doc(db, "productos", data.productoId));
      const nombreProducto = productoSnap.exists() ? productoSnap.data().nombre : "Producto eliminado";

      // Obtener nombre de la empresa
      const empresaSnap = await getDoc(doc(db, "usuarios", data.empresaId));
      const nombreEmpresa = empresaSnap.exists() ? empresaSnap.data().nombre : "Empresa desconocida";

      lista.push({
        id: docSnap.id,
        ...data,
        nombreProducto,
        nombreEmpresa,
      });
    }

    setSolicitudes(lista);
    setCargando(false);
  };

  const cancelarSolicitud = async (id) => {
    try {
      await updateDoc(doc(db, "solicitudes", id), { estado: "cancelado" });
      alert("Solicitud cancelada con éxito 🗑️");
      cargarSolicitudes(); // refrescar lista
    } catch (error) {
      console.error("Error al cancelar solicitud:", error);
      alert("Hubo un error al cancelar la solicitud 😓");
    }
  };

  useEffect(() => {
    if (user?.uid) cargarSolicitudes();
  }, [user]);

  return (
    <>
    <NavbarSwitcher />
    <div className="container mt-4">
      <h2>Mis solicitudes</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <p>No tienes solicitudes registradas.</p>
      ) : (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Empresa</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {solicitudes.map((sol) => (
              <tr key={sol.id}>
                <td>{sol.nombreProducto}</td>
                <td>{sol.nombreEmpresa}</td>
                <td>{sol.cantidadSolicitada}</td>
                <td>{sol.fecha}</td>
                <td>{sol.estado}</td>
                <td>
                  {sol.estado === "pendiente" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => cancelarSolicitud(sol.id)}
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    </>
  );
}
