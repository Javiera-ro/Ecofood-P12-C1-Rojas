import { useEffect, useState } from "react";
import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
import { db } from "../../services/firebase";
import { getAuth, updatePassword } from "firebase/auth";
import Swal from "sweetalert2";
import NavbarSwitcher from "../../components/NavbarSwitcher";

export default function EditarPerfil() {
  const auth = getAuth();
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    direccion: "",
    comuna: "",
    email: "",
    nuevaContraseña: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, "usuarios"));
      const clienteDoc = querySnapshot.docs.find((doc) => doc.data().uid === user.uid);
      if (clienteDoc) {
        const data = clienteDoc.data();
        setCliente({ id: clienteDoc.id, uid: user.uid, ...data });
        setForm({
          nombre: data.nombre || "",
          direccion: data.direccion || "",
          comuna: data.comuna || "",
          email: data.email || "",
          nuevaContraseña: "",
        });
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const guardarCambios = async () => {
  // Validación: evitar guardar si hay campos vacíos
  if (
    !form.nombre.trim() ||
    !form.direccion.trim() ||
    !form.comuna.trim()
  ) {
    Swal.fire("Campos incompletos", "Todos los campos deben estar completos", "warning");
    return;
  }

  // Validación: si se quiere cambiar la contraseña, que sea mínimo de 6 caracteres
  if (form.nuevaContraseña && form.nuevaContraseña.length < 6) {
    Swal.fire("Contraseña inválida", "Debe tener al menos 6 caracteres", "warning");
    return;
  }

  try {
    const docRef = doc(db, "usuarios", cliente.id);
    await updateDoc(docRef, {
      nombre: form.nombre,
      direccion: form.direccion,
      comuna: form.comuna,
      email: form.email,
      uid: cliente.uid,
    });

    if (form.nuevaContraseña) {
      await updatePassword(auth.currentUser, form.nuevaContraseña);
    }

    Swal.fire("Actualizado", "Perfil actualizado correctamente", "success");
    setCliente(prev => ({ ...prev, ...form }));
    setEditando(false);
  } catch (error) {
    Swal.fire("Error", "No se pudo actualizar el perfil", "error");
  }
};

  if (!cliente) return <div className="container mt-4">Cargando perfil...</div>;

  return (
    <>
      <NavbarSwitcher />
      <div className="container mt-4">
        <h2>Mi Perfil</h2>
        <div className="card p-4 mt-3">
          {editando ? (
            <>
              <div className="mb-3">
                <label className="form-label">Nombre:</label>
                <input type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                maxLength={50}/>
              </div>

              <div className="mb-3">
                <label className="form-label">Dirección:</label>
                <input type="text"
                className="form-control"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                maxLength={50}/>
              </div>

              <div className="mb-3">
                <label className="form-label">Comuna:</label>
                <input type="text"
                className="form-control"
                name="comuna"
                value={form.comuna}
                onChange={handleChange}
                maxLength={50}/>
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico:</label>
                <input type="email"
                className="form-control"
                value={form.email}
                disabled readOnly />
              </div>

              <div className="mb-3">
                <label className="form-label">Nueva contraseña (opcional):</label>
                <input type="password"
                className="form-control"
                name="nuevaContraseña"
                value={form.nuevaContraseña}
                onChange={handleChange} />
              </div>

              <button className="btn btn-success me-2" onClick={guardarCambios}>Guardar cambios</button>
              <button className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
            </>
          ) : (
            <>
              <p><strong>Nombre:</strong> {cliente.nombre}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}</p>
              <p><strong>Comuna:</strong> {cliente.comuna}</p>
              <p><strong>Email:</strong> {cliente.email}</p>
              <button className="btn btn-primary" onClick={() => setEditando(true)}>Editar perfil</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
