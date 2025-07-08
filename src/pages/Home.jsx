import { useEffect, useState } from "react";
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";
import Navbar from "../components/Navbar";

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
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Bienvenida a EcoFood</h2>
        {userData && (
          <>
            <p>Nombre: <strong>{userData.nombre}</strong></p>
            <p>Tipo de usuario: <strong>{userData.tipo}</strong></p>
          </>
        )}
        <CerrarSesion />
      </div>
    </>
  );
}
