import "../styles/scss/not-found/not-found.scss";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h2 className="not-found-title">404 - Página no encontrada</h2>
      <p className="not-found-text">
        Lo sentimos, la página que estás buscando no existe.
      </p>
    </div>
  );
};

export default NotFound;
