import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { saveUserData } from "../../services/userService";

export default function RegistroEmpresa() {
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const tipo = "empresa";
  const navigate = useNavigate();

  const validarPassword = (pwd) => {
    return pwd.length >= 6 && /[a-zA-Z]/.test(pwd) && /\d/.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validarPassword(password)) {
      Swal.fire("Contraseña débil", "Debe tener al menos 6 caracteres, letras y números", "warning");
      return;
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

     /* await addDoc(collection(db, "usuarios"), {
        uid: cred.user.uid,
        nombre,
        rut,
        email,
        direccion,
        comuna,
        telefono,
        tipo,
      });*/

      await saveUserData(cred.user.uid, {
        uid: cred.user.uid,
        nombre,
        rut,
        email,
        direccion,
        comuna,
        telefono,
        tipo,
      });

      Swal.fire("Registro exitoso", "Revisa tu correo para verificar tu cuenta", "info");
      navigate("/login");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Empresa</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre de la empresa</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={50}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input
            type="text"
            className="form-control"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            maxLength={12}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            maxLength={20}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            maxLength={40}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            maxLength={20}
          />
        </div>
        <button type="submit" className="btn btn-success">Registrar Empresa</button>
      </form>
    </div>
  );
}
