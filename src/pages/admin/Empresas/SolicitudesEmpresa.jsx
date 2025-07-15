import { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "/src/services/firebase.js";
import { getAuth } from "firebase/auth";

export default function SolicitudesEmpresa() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarSolicitudes = async () => {
    setCargando(true);
    const auth = getAuth();
    const user = auth.currentUser;

    const q = query(
      collection(db, "solicitudes"),
      where("empresaId", "==", user.uid),
      where("estado", "==", "pendiente")
    );

    const snapshot = await getDocs(q);
    const lista = [];

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();

      // Obtener nombre del cliente
      const clienteSnap = await getDoc(doc(db, "usuarios", data.clienteId));
      const nombreCliente = clienteSnap.exists() ? clienteSnap.data().nombre : "Desconocido";

      // Obtener nombre del producto
      const productoSnap = await getDoc(doc(db, "productos", data.productoId));
      const nombreProducto = productoSnap.exists() ? productoSnap.data().nombre : "Producto eliminado";

      lista.push({
        id: docSnap.id,
        ...data,
        nombreCliente,
        nombreProducto,
      });
    }

    setSolicitudes(lista);
    setCargando(false);
  };

  // 👇 LÓGICA DE APROBAR SOLICITUD
  const aprobarSolicitud = async (solicitud) => {
    try {
      const productoRef = doc(db, "productos", solicitud.productoId);
      const productoSnap = await getDoc(productoRef);

      if (!productoSnap.exists()) {
        alert("Producto no encontrado.");
        return;
      }

      const producto = productoSnap.data();

      if (producto.cantidad < solicitud.cantidadSolicitada) {
        alert("No hay suficiente stock.");
        return;
      }

      const nuevaCantidad = producto.cantidad - solicitud.cantidadSolicitada;

      await updateDoc(productoRef, {
        cantidad: nuevaCantidad,
        ...(nuevaCantidad === 0 && { estado: "agotado" }) // opcional
      });

      await updateDoc(doc(db, "solicitudes", solicitud.id), {
        estado: "aprobado"
      });

      alert("Solicitud aprobada.");
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al aprobar:", error);
      alert("Hubo un error al aprobar.");
    }
  };

  // 👇 LÓGICA DE RECHAZAR SOLICITUD
  const rechazarSolicitud = async (idSolicitud) => {
    try {
      await updateDoc(doc(db, "solicitudes", idSolicitud), {
        estado: "rechazado"
      });

      alert("Solicitud rechazada.");
      cargarSolicitudes();
    } catch (error) {
      console.error("Error al rechazar:", error);
      alert("Hubo un error al rechazar.");
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Solicitudes pendientes</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : solicitudes.length === 0 ? (
        <p>No hay solicitudes pendientes.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cliente</th>
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
                <td>{sol.nombreCliente}</td>
                <td>{sol.cantidadSolicitada}</td>
                <td>{sol.fecha}</td>
                <td>{sol.estado}</td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={() => aprobarSolicitud(sol)}>
                    Aprobar
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => rechazarSolicitud(sol.id)}>
                    Rechazar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
