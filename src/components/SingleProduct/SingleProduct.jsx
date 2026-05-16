import React, { useContext } from "react"; 
import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { ShoppingCart, Heart } from "lucide-react"; // ✔️ Corregido: Agregamos Heart aquí
import { cartContext } from "../Context/cartContext"; 

function SingleProduct() {
  const { slug } = useParams();
  
  // Contexto del carrito
  const { handleAddToCart } = useContext(cartContext);

  const producto = PRODUCTS.find(p => p.slug === slug);

  if (!producto) {
    return (
      <Container className="py-5 text-center">
        <h2 className="text-muted">Producto no encontrado</h2>
      </Container>
    );
  }

  // Validación de Stock 
  const outOfStock = producto.stock <= 0;

  // Cálculo del descuento dinámico
  const discount = producto.originalPrice
    ? Math.round(((producto.originalPrice - producto.price) / producto.originalPrice) * 100)
    : 0;

  return (
    <Container className="py-5">
      <Row className="align-items-center g-5">
        {/* Columna de la imagen */}
        <Col md={6}>
          <div className="shadow-sm rounded overflow-hidden bg-light p-3 d-flex justify-content-center align-items-center position-relative" style={{ minHeight: "450px" }}>
            <img 
              src={producto.image} 
              alt={producto.name}
              className="img-fluid" 
              style={{ maxHeight: "450px", objectFit: "contain" }}
            />
            
            {/* Nuevo o Descuento sobre la imagen */}
            <div className="position-absolute top-0 start-0 p-3 d-flex flex-column gap-2">
              {producto.isNew && (
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 shadow-sm">Nuevo</Badge>
              )}
              {discount > 0 && (
                <Badge bg="danger" className="fs-6 px-3 py-2 shadow-sm">-{discount}%</Badge>
              )}
            </div>

            {/* Cartel de Sin Stock sobre la imagen */}
            {outOfStock && (
              <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-4 py-2 rounded shadow-lg fs-5">
                Sin stock
              </div>
            )}
          </div>
        </Col>

        {/* Columna de Información */}
        <Col md={6}>
          <div className="ps-md-4">
            <span className="text-uppercase text-muted fw-bold small tracking-wider">{producto.brand}</span>
            <h1 className="display-5 fw-bold text-dark mt-1 mb-3">{producto.name}</h1>
            
            <div className="mb-4 d-flex align-items-center gap-2">
              <Badge bg="warning" text="dark" className="px-2 py-1 fs-6">
                ★ {producto.rating}
              </Badge>
            </div>

            {/* Precios con descuento visualizado */}
            <div className="d-flex align-items-baseline gap-3 mb-4">
              <h2 className="text-primary fw-bold display-6 m-0">
                ${producto.price.toLocaleString()}
              </h2>
              {producto.originalPrice && (
                <h4 className="text-decoration-line-through text-muted m-0 fs-4">
                  ${producto.originalPrice.toLocaleString()}
                </h4>
              )}
            </div>

            <hr className="my-4 text-muted" />

            <h5 className="fw-semibold text-secondary mb-3">Características principales</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-5">
              {producto.description
                .split(/[,.]/) 
                .map(item => item.trim()) 
                .filter(item => item.length > 0) 
                .map((item, index) => (
                  <li key={index} className="d-flex align-items-start text-muted" style={{ fontSize: "1.05rem" }}>
                    <span className="text-success me-2 fw-bold">✓</span>
                    <span>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </span>
                  </li>
                ))}
            </ul>

            {/* Botones */}
            <div className="d-flex gap-3 align-items-center mt-5">
              {/* Añadir al carrito */}
              <div className="flex-grow-1">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="w-100 py-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                  disabled={outOfStock}
                  onClick={() => handleAddToCart(producto)}
                >
                  <ShoppingCart size={20} /> 
                  {outOfStock ? "Agotado" : "Añadir al carrito"}
                </Button>
              </div>

              {/* Favoritos */}
              {/* <Button
                variant="outline-danger"
                size="lg"
                className="py-3 px-3 d-flex align-items-center justify-content-center shadow-sm"
                onClick={() => console.log("Agregado a favoritos:", producto.id)}
              >
                <Heart size={24} className="text-danger" />
              </Button> */}
            </div>

          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default SingleProduct;