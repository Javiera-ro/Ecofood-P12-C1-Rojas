import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: ""
  });
  const [editandoId, setEditandoId] = useState(null);


  const cargarEmpresas = async () => {
    const querySnapshot = await getDocs(collection(db, "empresas"));
    const lista = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setEmpresas(lista);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (editandoId) {
      await setDoc(doc(db, "empresas", editandoId), form);
      Swal.fire("Empresa actualizada", "", "success");
    } else {

      await addDoc(collection(db, "empresas"), form);
      Swal.fire("Empresa creada", "", "success");
    }

    setForm({
      nombre: "",
      rut: "",
      direccion: "",
      comuna: "",
      email: "",
      telefono: ""
    });
    setEditandoId(null);
    cargarEmpresas();
  } catch (error) {
    Swal.fire("Error", "No se pudo guardar la empresa", "error");
  }
};


  const eliminarEmpresa = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Estás segura?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "empresas", id));
      Swal.fire("Eliminado", "La empresa fue eliminada", "success");
      cargarEmpresas();
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

const editarEmpresa = (empresa) => {
  setForm({
    nombre: empresa.nombre,
    rut: empresa.rut,
    direccion: empresa.direccion,
    comuna: empresa.comuna,
    email: empresa.email,
    telefono: empresa.telefono
  });
  setEditandoId(empresa.id);
};

  return (
    <div className="container mt-4">
      <h2>Empresas registradas</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="rut"
              className="form-control"
              placeholder="RUT"
              value={form.rut}
              onChange={handleChange}
              required
              maxLength={12}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <input
              type="text"
              name="direccion"
              className="form-control"
              placeholder="Dirección"
              value={form.direccion}
              onChange={handleChange}
              required
              maxLength={50}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="comuna"
              className="form-control"
              placeholder="Comuna"
              value={form.comuna}
              onChange={handleChange}
              required
              maxLength={30}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={30}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="telefono"
              className="form-control"
              placeholder="Teléfono"
              value={form.telefono}
              onChange={handleChange}
              maxLength={10}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success mt-3">
          {editandoId ? "Guardar Cambios" : "Agregar Empresa"}
        </button>
      </form>

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>RUT</th>
            <th>Dirección</th>
            <th>Comuna</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr key={empresa.id}>
              <td>{empresa.nombre}</td>
              <td>{empresa.rut}</td>
              <td>{empresa.direccion}</td>
              <td>{empresa.comuna}</td>
              <td>{empresa.email}</td>
              <td>{empresa.telefono}</td>
              <td>
                <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editarEmpresa(empresa)}>
                Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarEmpresa(empresa.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
