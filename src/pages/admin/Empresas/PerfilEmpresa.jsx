import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const auth = getAuth();
  const [empresa, setEmpresa] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEmpresa(docSnap.data());
        setForm({
          nombre: docSnap.data().nombre || "",
          ubicacion: docSnap.data().ubicacion || "",
        });
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardarCambios = async () => {
    try {
      const user = auth.currentUser;
      const docRef = doc(db, "usuarios", user.uid);
      await updateDoc(docRef, {
        nombre: form.nombre,
        ubicacion: form.ubicacion,
      });
      Swal.fire("Actualizado", "Datos actualizados correctamente", "success");
      setEmpresa({ ...empresa, ...form });
      setEditando(false);
    } catch (error) {
      Swal.fire("Error", "No se pudieron actualizar los datos", "error");
    }
  };

  if (!empresa) return <div className="container mt-4">Cargando...</div>;

  return (
    <div className="container mt-4">
      <h2>Perfil de Empresa</h2>

      <div className="card p-3 mt-3">
        <p><strong>Correo:</strong> {empresa.email}</p>
        {editando ? (
          <>
            <div className="mb-2">
              <label>Nombre:</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>
            <div className="mb-2">
              <label>Ubicación:</label>
              <input
                type="text"
                className="form-control"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </div>
            <button className="btn btn-success me-2" onClick={guardarCambios}>
              Guardar
            </button>
            <button className="btn btn-secondary" onClick={() => setEditando(false)}>
              Cancelar
            </button>
          </>
        ) : (
          <>
            <p><strong>Nombre:</strong> {empresa.nombre}</p>
            <p><strong>Ubicación:</strong> {empresa.ubicacion}</p>
            <button className="btn btn-primary" onClick={() => setEditando(true)}>
              Editar Perfil
            </button>
          </>
        )}
      </div>
    </div>
  );
}