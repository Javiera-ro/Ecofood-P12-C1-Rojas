function CardProducto({ nombre, precio }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">
          Precio: {precio === 0 ? "Gratis" : `$${precio}`}
        </p>
      </div>
    </div>
  );
}

export default CardProducto;
