import NavbarSwitcher from "/src/components/NavbarSwitcher";

export default function DashboardEmpresa() {
  return (
    <>
      <div className="container mt-4">
        <h2>Bienvenido al panel de empresa</h2>
        <p>Aquí podrás gestionar tus productos y revisar solicitudes de clientes.</p>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card border-success mb-3">
              <div className="card-body">
                <h5 className="card-title">Mis Productos</h5>
                <p className="card-text">Visualiza y administra tus productos.</p>
                <a href="/empresas/productos" className="btn btn-outline-success">Ir a productos</a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card border-info mb-3">
              <div className="card-body">
                <h5 className="card-title">Solicitudes</h5>
                <p className="card-text">Revisa las solicitudes de los clientes.</p>
                <a href="/empresas/solicitudes" className="btn btn-outline-info">Ver solicitudes</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
