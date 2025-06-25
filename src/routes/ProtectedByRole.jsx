import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserData } from "../services/userService";

export default function ProtectedByRole({ allowed }) {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setRole(data.tipo); // El campo "tipo" debe existir en Firestore
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
        }
      }
      setLoading(false);
    };
    fetchRole();
  }, [user]);

  if (loading) return <div>Cargando...</div>;

  if (!user || !allowed.includes(role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}
