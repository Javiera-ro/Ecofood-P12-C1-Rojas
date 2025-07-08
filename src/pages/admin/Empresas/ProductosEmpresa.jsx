import { useEffect, useState } from "react";
import { db } from "../../../services/firebase";
import Navbar from "../../../components/Navbar";
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
import { getAuth } from "firebase/auth";

export default function ProductosEmpresa() {
  const [productos, setProductos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 5;

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
  const auth = getAuth();
  const user = auth.currentUser;

  try {
    if (producto.id) {
      await updateDoc(doc(db, "productos", producto.id), producto);
      Swal.fire("Editado", "Producto actualizado correctamente", "success");
    } else {
      await addDoc(collection(db, "productos"), {
        ...producto,
        empresaId: user.uid,
        precio: parseFloat(producto.precio),
        cantidad: parseInt(producto.cantidad),
      });
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

    const indiceUltimoProducto = paginaActual * productosPorPagina;
    const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;

    const productosFiltrados = productos.filter((producto) => {
      const coincideEstado =
        filtroEstado === "" ||
        (filtroEstado === "gratuito" ? producto.precio === 0 : producto.estado === filtroEstado);
      const coincideBusqueda =
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda);
      return coincideEstado && coincideBusqueda;
    });

    const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);

 return (
  <>
    <Navbar />
    <div className="container mt-4">
      <h2>Gestión de productos</h2>

      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-success" onClick={() => abrirModal(null)}>
          Agregar producto
        </button>
        <button className="btn btn-primary" onClick={cargarProductos}>
          Actualizar productos
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Buscar por nombre o descripción:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value.toLowerCase())}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Filtrar por estado:</label>
        <select
          className="form-select"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
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
        {productosPaginados.map((producto) => (
        <tr key={producto.id}>
          <td>{producto.nombre}</td>
          <td>{producto.descripcion}</td>
          <td>
            {producto.vencimiento}
            {new Date(producto.vencimiento) - new Date() <= 3 * 24 * 60 * 60 * 1000 && (
              <span className="badge bg-warning ms-2">¡Por vencer!</span>
            )}
          </td>
          <td>{producto.cantidad}</td>
          <td>
            {Number(producto.precio) === 0 ? (
              <span className="badge bg-success">Gratis</span>
            ) : (
              <>${producto.precio}</>
            )}
          </td>
          <td>{producto.estado}</td>
          <td>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => abrirModal(producto)}
            >
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

<div className="d-flex justify-content-center mt-3">
  <nav>
    <ul className="pagination">
      {[...Array(totalPaginas)].map((_, i) => (
        <li
          key={i}
          className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setPaginaActual(i + 1)}>
            {i + 1}
          </button>
        </li>
      ))}
    </ul>
  </nav>
</div>

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
  </>
);}