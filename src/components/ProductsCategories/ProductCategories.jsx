import React from "react";
import { useSearchParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { PRODUCTS } from "../../data/products";
import { CATEGORIES } from "../../data/categories";
import ProductCard from "../../components/ProductCard/ProductCard";

function ProductCategories() {
  const [searchParams] = useSearchParams();
  const categoria = searchParams.get("categoria");

  // Filtrado por categoría
  const productosFiltrados = categoria
    ? PRODUCTS.filter((p) => p.category === categoria)
    : PRODUCTS;

  // Buscar info de la categoría para mostrar nombre lindo
  const categoriaData = CATEGORIES.find((c) => c.id === categoria);

  return (
    <Container className="py-5">
      <h2 className="mb-4">
        {categoriaData ? categoriaData.name : "Todos los productos"}
      </h2>

      {productosFiltrados.length === 0 ? (
        <p>No hay productos en esta categoría.</p>
      ) : (
        <Row>
          {productosFiltrados.map((prod) => (
            <Col md={3} key={prod.id} className="mb-3">
              <ProductCard product={prod} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default ProductCategories;