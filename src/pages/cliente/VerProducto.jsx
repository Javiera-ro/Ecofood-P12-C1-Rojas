import { useEffect, useState } from "react";
import { collection, getDocs, query, where, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "/src/services/firebase.js";
import { useAuth } from "/src/context/AuthContext";
import NavbarSwitcher from "/src/components/NavbarSwitcher";
import Swal from "sweetalert2";

export default function VerProducto() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 9;
  const [cantidades, setCantidades] = useState({});
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroComuna, setFiltroComuna] = useState("");
  const [filtroEstadoPrecio, setFiltroEstadoPrecio] = useState("Todos");
  const { user } = useAuth();

  useEffect(() => {
    const cargarProductos = async () => {
      const q = query(collection(db, "productos"), where("estado", "==", "disponible"));
      const snapshot = await getDocs(q);

      const lista = await Promise.all(snapshot.docs.map(async (docSnap) => {
  const data = docSnap.data();
  let empresaNombre = "";
  let empresaComuna = "";

  try {
    const empresaRef = doc(db, "usuarios", data.empresaId);
    const empresaSnap = await getDoc(empresaRef);
    const empresa = empresaSnap.exists() ? empresaSnap.data() : {};
    empresaNombre = empresa.nombre || "";
    empresaComuna = empresa.comuna || "";
  } catch (error) {
    console.error("Error obteniendo datos de empresa:", error);
  }

  return {
    id: docSnap.id,
    ...data,
    empresaNombre,
    empresaComuna,
  };
}));
      setProductos(lista);
    };

    cargarProductos();
  }, []);



  const handleCantidadChange = (productoId, valor) => {
    setCantidades((prev) => ({
      ...prev,
      [productoId]: valor
    }));
  };

  const handleSolicitud = async (producto) => {
    const cantidad = cantidades[producto.id];

    if (!cantidad || cantidad < 1 || cantidad > producto.cantidad) {
  Swal.fire({
    icon: 'error',
    title: 'Cantidad inválida',
    text: `Debes seleccionar una cantidad entre 1 y ${producto.cantidad}.`,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Entendido'
  });
  return;
}

    try {
      const nuevaSolicitud = {
        clienteId: user.uid,
        productoId: producto.id,
        empresaId: producto.empresaId,
        cantidadSolicitada: cantidad,
        fecha: new Date().toISOString().split("T")[0],
        estado: "pendiente",
      };

      await addDoc(collection(db, "solicitudes"), nuevaSolicitud);
      Swal.fire({
        icon: 'success',
        title: '¡Solicitud enviada!',
        text: 'Tu pedido ha sido registrado correctamente.',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Aceptar'
      });

      setCantidades((prev) => ({
        ...prev,
        [producto.id]: "",
      }));

    } catch (error) {
      console.error("Error al registrar solicitud:", error);
      alert("Error al registrar la solicitud");
    }
  };

 const filtrarProductos = () => {
  return productos
    .filter((p) =>
      (p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
       p.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    )
    .filter((p) => {
      if (filtroEmpresa && !p.empresaNombre?.toLowerCase().includes(filtroEmpresa.toLowerCase())) return false;
      if (filtroComuna && !p.empresaComuna?.toLowerCase().includes(filtroComuna.toLowerCase())) return false;
      if (filtroEstadoPrecio === "gratuito" && p.precio > 0) return false;
      if (filtroEstadoPrecio === "pago" && p.precio === 0) return false;
      return true;
    });
};
  const productosFiltrados = filtrarProductos();
  const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
  const indiceInicio = (paginaActual - 1) * productosPorPagina;
  const productosPagina = productosFiltrados.slice(indiceInicio, indiceInicio + productosPorPagina);

  return (
    <>
      <NavbarSwitcher />
      <div className="container mt-4">
        <h2>Productos disponibles</h2>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre o descripción"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />
        </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por empresa"
            value={filtroEmpresa}
            onChange={(e) => setFiltroEmpresa(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filtrar por comuna"
            value={filtroComuna}
            onChange={(e) => setFiltroComuna(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filtroEstadoPrecio}
            onChange={(e) => setFiltroEstadoPrecio(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="gratuito">Gratuito</option>
            <option value="pago">Pago</option>
          </select>
        </div>
      </div>

        <div className="row">
          {productosPagina.map((producto) => (
            <div key={producto.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{producto.nombre}</h5>
                  <p className="card-text">{producto.descripcion}</p>
                  <p><strong>Vence:</strong> {producto.vencimiento}</p>
                  <p><strong>Precio:</strong> {producto.precio === 0 ? "Gratis" : `$${producto.precio}`}</p>
                  <p><strong>Cantidad disponible:</strong> {producto.cantidad}</p>
                  <p><strong>Empresa:</strong> {producto.empresaNombre}</p>
                  <p><strong>Ubicación:</strong> {producto.empresaComuna}</p>

                  <div className="mb-2">
                    <input
                      type="number"
                      className="form-control"
                      min={1}
                      max={Number(producto.cantidad)}
                      placeholder="Cantidad"
                      value={cantidades[producto.id] || ""}
                      onChange={(e) =>
                        handleCantidadChange(producto.id, Number(e.target.value))
                      }
                    />
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSolicitud(producto)}
                  >
                    Solicitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPaginas > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {[...Array(totalPaginas)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${paginaActual === i + 1 ? "active" : ""}`}
                  onClick={() => setPaginaActual(i + 1)}
                >
                  <button className="page-link">{i + 1}</button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
