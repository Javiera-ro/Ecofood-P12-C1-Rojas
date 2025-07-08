import { useEffect, useState } from "react";
import { doc, getDocs, updateDoc, collection } from "firebase/firestore";
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
    console.log("UID actual:", user?.uid);
    if (!user) return;
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    const empresaDoc = querySnapshot.docs.find((doc) => doc.data().uid === user.uid);
    if (empresaDoc) {
      const data = empresaDoc.data();
      setEmpresa({ id: empresaDoc.id, uid: user.uid, ...data });
      setForm({
        nombre: data.nombre || "",
        direccion: data.direccion || "",
        comuna: data.comuna || "",
        rut: data.rut || "",
        email: data.email || "",
        telefono: data.telefono || "",
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
    const docRef = doc(db, "usuarios", empresa.id);
    await updateDoc(docRef, {
      ...form,
      uid: empresa.uid,
    });
    Swal.fire("Actualizado", "Datos actualizados correctamente", "success");
    setEmpresa(prev =>({...prev, ...form }));
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
    maxLength={50}
  />
</div>
<div className="mb-2">
  <label>RUT:</label>
  <input
    type="text"
    className="form-control"
    name="rut"
    value={form.rut}
    onChange={handleChange}
    maxLength={12}
  />
</div>
<div className="mb-2">
  <label>Dirección:</label>
  <input
    type="text"
    className="form-control"
    name="direccion"
    value={form.direccion}
    onChange={handleChange}
    maxLength={100}
  />
</div>
<div className="mb-2">
  <label>Comuna:</label>
  <input
    type="text"
    className="form-control"
    name="comuna"
    value={form.comuna}
    onChange={handleChange}
    maxLength={50}
  />
</div>
<div className="mb-2">
  <label>Email:</label>
  <input
    type="email"
    className="form-control"
    name="email"
    value={form.email}
    disabled
    readOnly
  />
</div>
<div className="mb-2">
  <label>Teléfono:</label>
  <input
    type="text"
    className="form-control"
    name="telefono"
    value={form.telefono}
    onChange={handleChange}
    maxLength={15}
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
    <p><strong>RUT:</strong> {empresa.rut}</p>
    <p><strong>Dirección:</strong> {empresa.direccion}</p>
    <p><strong>Comuna:</strong> {empresa.comuna}</p>
    <p><strong>Email:</strong> {empresa.email}</p>
    <p><strong>Teléfono:</strong> {empresa.telefono}</p>
    <button className="btn btn-primary" onClick={() => setEditando(true)}>
      Editar Perfil
    </button>
  </>
)}

      </div>
    </div>
  );
}