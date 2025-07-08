import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getUserData } from "../services/userService";

export default function ProtectedByRole({ allowed, children }) {
  const { user } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        try {
          const data = await getUserData(user.uid);
          setRole(data?.tipo || null); // puede venir undefined
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setRole(null); // evitar pantalla blanca
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    };
    fetchRole();
  }, [user]);

  if (loading) return <div>Cargando...</div>;

  if (!user || !allowed.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
