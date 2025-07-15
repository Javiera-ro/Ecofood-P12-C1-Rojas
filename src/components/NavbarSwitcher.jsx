import { useAuth } from "../context/AuthContext";
import NavbarAdmin from "./navbars/NavbarAdmin";
import NavbarCliente from "./navbars/NavbarCliente";
import NavbarEmpresa from "./navbars/NavbarEmpresa";

export default function NavbarSwitcher() {
    const { userData } = useAuth();

    console.log("userData en NavbarSwitcher:", userData);

  if (!userData) return null;

  if (userData.tipo === "admin") return <NavbarAdmin />;
  if (userData.tipo === "cliente") return <NavbarCliente />;
  if (userData.tipo === "empresa") return <NavbarEmpresa />;

  return null;
}