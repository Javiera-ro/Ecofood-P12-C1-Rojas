import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";
import NavbarSwitcher from "../components/NavbarSwitcher";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const datos = await getUserData(user.uid);
      setUserData(datos);

    if (datos.tipo === "cliente") navigate("/cliente");
      else if (datos.tipo === "empresa") navigate("/empresas");
      else if (datos.tipo === "admin") navigate("/admin");
    };

    if (user) fetch();
  }, [user]);

  if (!userData) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <>
      <NavbarSwitcher tipo={userData.tipo} />
      <div className="container mt-5 text-center">
        <h2>Bienvenida a EcoFood</h2>
        <p>Nombre: <strong>{userData.nombre}</strong></p>
        <p>Tipo de usuario: <strong>{userData.tipo}</strong></p>
        <CerrarSesion />
      </div>
    </>
  );
}
