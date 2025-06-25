import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Reportes() {
  const [clientes, setClientes] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const cargarDatos = async () => {
    const usuariosSnap = await getDocs(collection(db, "usuarios"));
    const empresasSnap = await getDocs(collection(db, "empresas"));

    const clientesList = usuariosSnap.docs
      .map((doc) => doc.data())
      .filter((u) => u.tipo === "cliente");

    setClientes(clientesList);
    setEmpresas(empresasSnap.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const data = [
    { nombre: "Clientes", cantidad: clientes.length },
    { nombre: "Empresas", cantidad: empresas.length },
  ];

  return (
    <div className="container mt-4">
      <h2>Reportes generales</h2>

      <div className="row mt-3">
        <div className="col-md-4">
          <div className="card text-bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Clientes registrados</h5>
              <p className="card-text fs-4">{clientes.length}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Empresas registradas</h5>
              <p className="card-text fs-4">{empresas.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <h4>Visualización gráfica</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cantidad" fill="#4caf50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
