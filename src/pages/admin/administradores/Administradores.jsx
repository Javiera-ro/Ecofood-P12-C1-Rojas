import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc
} from "firebase/firestore";
import { db, auth } from "../../../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Swal from "sweetalert2";

export default function Administradores() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cargarAdmins = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const lista = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((user) => user.tipo === "admin");
    setAdmins(lista);
  };

  const toggleFormulario = () => {
    setMostrarFormulario(!mostrarFormulario);
    setEditandoId(null);
    setForm({ nombre: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await setDoc(doc(db, "usuarios", editandoId), {
          nombre: form.nombre,
          email: form.email,
          tipo: "admin"
        });
        Swal.fire("Actualizado", "Administrador actualizado", "success");
      } else {
        const credenciales = await createUserWithEmailAndPassword(
          auth,
          form.email,
          form.password
        );

        await setDoc(doc(db, "usuarios", credenciales.user.uid), {
          nombre: form.nombre,
          email: form.email,
          tipo: "admin"
        });

        Swal.fire("¡Éxito!", "Administrador registrado correctamente", "success");
      }

      setForm({ nombre: "", email: "", password: "" });
      setEditandoId(null);
      setMostrarFormulario(false);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Administradores</h2>

      <button className="btn btn-primary mb-3" onClick={toggleFormulario}>
        {mostrarFormulario ? "Cancelar" : editandoId ? "Cancelar edición" : "+ Agregar administrador"}
      </button>

      {mostrarFormulario && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            <div className="col">
              <input
                type="text"
                name="nombre"
                className="form-control"
                placeholder="Nombre del administrador"
                value={form.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Correo"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required={!editandoId}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3">
            {editandoId ? "Guardar Cambios" : "Crear Administrador"}
          </button>
        </form>
      )}

      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.nombre}</td>
              <td>{admin.email}</td>
              <td>
                {admin.email === "javiera.rojas72@inacapmail.cl" ? (
                  <span className="text-muted">Admin principal</span>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => {
                        setForm({ nombre: admin.nombre, email: admin.email, password: "" });
                        setEditandoId(admin.id);
                        setMostrarFormulario(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        const confirm = await Swal.fire({
                          title: "¿Eliminar administrador?",
                          text: "Esta acción no se puede deshacer.",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Sí, eliminar",
                        });

                        if (confirm.isConfirmed) {
                          await deleteDoc(doc(db, "usuarios", admin.id));
                          Swal.fire("Eliminado", "El administrador fue eliminado", "success");
                          cargarAdmins();
                        }
                      }}
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
