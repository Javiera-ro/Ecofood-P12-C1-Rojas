import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function RecuperarContrasena() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire("Correo enviado", "Revisa tu correo para restablecer tu contraseña.", "success");
      setEmail("");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-warning">Enviar correo</button>
      </form>
    </div>
  );
}
