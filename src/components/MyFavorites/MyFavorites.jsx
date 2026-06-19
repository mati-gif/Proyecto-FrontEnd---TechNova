import React, { useContext } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { X, ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { favoritesContext } from "../Context/FavoritesContext/favoritesContext";
import { cartContext } from "../Context/CartContext/cartContext";
import { formatPrice } from "../utils/formatPrice";

function MyFavorites() {
  // Consumimos los contextos globales
  const { favorites, handleToggleFavorite } = useContext(favoritesContext);
  const { cart, handleAddToCart, handleDecreaseQuantity } =
    useContext(cartContext);

  return (
    <Container className="py-4 py-lg-5">
      <h1
        className="fw-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Mis Favoritos
      </h1>
      <p className="text-secondary mb-4">
        Tus productos guardados y deseados en TechNova
      </p>

      {/* CASO VACÍO */}
      {!favorites || favorites.length === 0 ? (
        <Card
          className="border text-center p-5 mx-auto"
          style={{ maxWidth: 600 }}
        >
          <div
            className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}
          >
            <Heart size={32} className="text-secondary" />
          </div>
          <h2 className="h5 fw-bold mb-2">Aún no tenés favoritos</h2>
          <p className="text-secondary mb-3">
            Guardá los productos que te interesen para verlos acá más tarde.
          </p>
          <div>
            <Button as={Link} to="/catalog" variant="primary">
              Explorar productos
            </Button>
          </div>
        </Card>
      ) : (
        /* CASO CON CONTENIDO: Grilla de tarjetas chicas */
        <Row xs={2} sm={2} md={3} lg={4} xl={5} className="g-3">
          {favorites.map((product) => {
            // Buscamos si el producto ya está en el carrito para obtener su cantidad exacta
            const cartItem =
              cart && cart.find((item) => item.id === product.id);
            const quantity = cartItem ? cartItem.cantidad : 0;

            return (
              <Col key={product.id}>
                <Card
                  className="h-100 shadow-sm border position-relative d-flex flex-column justify-content-between tn-fav-card"
                  style={{ borderRadius: "8px", overflow: "hidden" }}
                >
                  {/* Botón Eliminar */}
                  <Button
                    variant="light"
                    className="position-absolute top-0 end-0 m-2 shadow-sm p-0 p-1.5 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 5, width: "30px", height: "30px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleFavorite(product);
                    }}
                    title="Eliminar de favoritos"
                  >
                    <X size={20} className="text-danger" />
                  </Button>

                  {/* ZONA CLICKEABLE: Imagen + Nombre */}
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-decoration-none text-dark d-flex flex-column h-100"
                  >
                    {/* Contenedor de la Imagen */}
                    <div
                      className="p-2 bg-light d-flex align-items-center justify-content-center"
                      style={{ height: "140px" }}
                    >
                      <Card.Img
                        variant="top"
                        src={product.image}
                        alt={product.name}
                        style={{
                          maxHeight: "100%",
                          maxWidth: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>

                    {/* Cuerpo de la Tarjeta */}
                    <Card.Body className="p-2 d-flex flex-column justify-content-between flex-grow-1">
                      <div>
                        {product.brand && (
                          <div
                            className="text-uppercase text-muted fw-semibold mb-1"
                            style={{ fontSize: "10px" }}
                          >
                            {product.brand}
                          </div>
                        )}
                        <Card.Title
                          className="fs-6 fw-semibold m-0 text-dark"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            height: "38px",
                            lineHeight: "19px",
                          }}
                        >
                          {product.name}
                        </Card.Title>
                      </div>

                      {/* Precio */}
                      <div className="mt-2">
                        <div className="fw-bold text-dark fs-5">
                          {formatPrice
                            ? formatPrice(product.price)
                            : `$${product.price}`}
                        </div>
                      </div>
                    </Card.Body>
                  </Link>

                  {/* ACCIÓN: Botón simple o Selector de Cantidades (- 1 +) */}
                  <div className="p-2 pt-0">
                    {quantity > 0 ? (
                      /* Estado: YA AGREGADO (Muestra la botonera - QTY +) */
                      <div
                        className="d-flex align-items-center justify-content-between border rounded bg-light"
                        style={{ height: "31px" }}
                      >
                        {/* Botón Restar */}
                        <Button
                          variant="light"
                          size="sm"
                          className="border-0 bg-transparent px-2 h-100 d-flex align-items-center justify-content-center text-secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDecreaseQuantity &&
                              handleDecreaseQuantity(product.id);
                          }}
                        >
                          <Minus size={12} />
                        </Button>

                        {/* Cantidad Actual en el Carrito */}
                        <span className="fw-bold text-dark small">
                          {quantity}
                        </span>

                        {/* Botón Sumar */}
                        <Button
                          variant="light"
                          size="sm"
                          className="border-0 bg-transparent px-2 h-100 d-flex align-items-center justify-content-center text-success"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart && handleAddToCart(product);
                          }}
                        >
                          <Plus size={12} />
                        </Button>
                      </div>
                    ) : (
                      /* Estado: NO AGREGADO (Muestra botón original Añadir) */
                      <Button
                        variant="success"
                        size="sm"
                        className="w-100 d-flex align-items-center justify-content-center gap-1 py-1.5 fs-7"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart && handleAddToCart(product);
                        }}
                      >
                        <ShoppingCart size={13} />
                        <span>Añadir</span>
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default MyFavorites;
