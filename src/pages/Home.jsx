import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";

export default function Home() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const datos = await getUserData(user.uid);
      setUserData(datos);
    };
    if (user) fetch();
  }, [user]);

  return (
    <div className="container mt-5">
      <h2>Bienvenido/a a EcoFood</h2>
      {userData && (
        <>
          <p>Nombre: {userData.nombre}</p>
          <p>Tipo de usuario: {userData.tipo}</p>
        </>
      )}
      <CerrarSesion />
    </div>
  );
}
