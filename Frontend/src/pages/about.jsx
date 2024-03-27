import "../styles/scss/about/about.scss";

const About = () => {
  return (
    <div className="home-container">
      <div className="banner">
        <img src="https://www.touchstoneinfotech.com/wp-content/uploads/2022/10/ecommerce-banner.jpg" alt="Ciudad" />
        <div className="banner-text">
          <h1>Una brisa fresca de primavera soplaba a través de las calles adoquinadas de una pintoresca ciudad.</h1>
          <p>En una esquina bulliciosa, se encontraba una tienda de ropa llamada FashionCommerce.</p>
        </div>
      </div>
      <div className="store-description">
        <div className="image-section">
          <img src="https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2022/01/10/16418089151953.jpg" alt="Tienda de ropa" />
        </div>
        <div className="text-section">
          <h2>Descubre un mundo de estilo y tendencias en Moda Elegante</h2>
          <p>Con su fachada de cristal reluciente y luces brillantes, la tienda invita a los transeúntes a sumergirse en un mundo de estilo y tendencias.</p>
        </div>
      </div>
      <div className="interior-description">
        <div className="image-section">
          <img src="https://www.clara.es/medio/2020/09/03/los-colores-de-moda-que-hacen-que-tu-ropa-parezca-cara-aunque-no-lo-sea_5d1e38f6_800x533.jpg" alt="Interior de la tienda" />
        </div>
        <div className="text-section">
          <h2>Explora una experiencia de compra única</h2>
          <p>Los clientes son recibidos por una atmósfera moderna y sofisticada. El suave murmullo de música de fondo crea un ambiente relajante mientras exploran las últimas colecciones de moda.</p>
        </div>
      </div>
    </div>
  );
}


export default About