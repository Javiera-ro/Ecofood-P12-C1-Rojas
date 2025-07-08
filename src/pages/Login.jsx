import { getUserData } from "../services/userService";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      if (!cred.user.emailVerified) {
        Swal.fire(
          "Verificación requerida",
          "Debes verificar tu correo antes de iniciar sesión.",
          "warning"
        );
        return;
      }

      const datos = await getUserData(cred.user.uid);
      console.log("Bienvenido", datos.nombre, "Tipo:", datos.tipo);
      navigate("/home");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Credenciales incorrectas", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar Sesión
        </button>
        <div className="mt-3">
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
       <p className="mt-3">
          ¿Eres una empresa?{" "}
          <Link to="/registro-empresa">Regístrate aquí</Link>
        </p>
    </div>
  );
}
