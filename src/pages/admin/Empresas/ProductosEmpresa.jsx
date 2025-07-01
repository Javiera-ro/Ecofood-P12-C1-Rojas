import { useEffect, useState } from "react";
import { db } from "../../../services/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import Swal from "sweetalert2";
import ProductoModal from "../../../components/ProductoModal";

export default function ProductosEmpresa() {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");

  const cargarProductos = async () => {
    const snapshot = await getDocs(collection(db, "productos"));
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProductos(lista);
  };

  const abrirModal = (producto = null) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setProductoSeleccionado(null);
    setMostrarModal(false);
  };

  const guardarProducto = async (producto) => {
    try {
      if (producto.id) {
        await updateDoc(doc(db, "productos", producto.id), producto);
        Swal.fire("Editado", "Producto actualizado correctamente", "success");
      } else {
        await addDoc(collection(db, "productos"), producto);
        Swal.fire("Agregado", "Producto creado exitosamente", "success");
      }
      cerrarModal();
      cargarProductos();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const eliminarProducto = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "productos", id));
      Swal.fire("Eliminado", "Producto eliminado correctamente", "success");
      cargarProductos();
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Gestión de productos</h2>
      <button className="btn btn-success mb-3" onClick={() => abrirModal(null)}>
        Agregar producto
      </button>

        <div className="mb-3">
        <label className="form-label">Filtrar por estado:</label>
        <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="por vencer">Por vencer</option>
            <option value="agotado">Agotado</option>
        </select>
        </div>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Vencimiento</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos
          .filter((producto) => {
            if (filtroEstado === "") return true;
            if (filtroEstado === "gratuito") return producto.precio === 0;
            return producto.estado === filtroEstado;
                })
          .map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td> {producto.vencimiento}
                {new Date(producto.vencimiento) - new Date() <= 3 * 24 * 60 * 60 * 1000 && (
                    <span className="badge bg-warning ms-2">¡Por vencer!</span>
                )} </td>
              <td>{producto.cantidad}</td>

              <td>{Number(producto.precio) === 0 ? (
                <span className="badge bg-success">Gratis</span>
              ) : (
                <>${producto.precio}</>
              )}
              </td>

              <td>{producto.estado}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => abrirModal(producto)}>
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <ProductoModal
          show={mostrarModal}
          onHide={cerrarModal}
          producto={productoSeleccionado}
          setProducto={setProductoSeleccionado}
          onSubmit={() => guardarProducto(productoSeleccionado)}
        />
      )}
    </div>
  );
}
