import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Container, Row, Col, ListGroup, Badge, Form } from "react-bootstrap";
import { PRODUCTS } from "../../../data/products";
import { CATEGORIES } from "../../../data/categories";
import ProductCard from "../ProductCard/ProductCard";
import "../../../App";

function ProductCategories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoria = searchParams.get("category");
  const marcaActiva = searchParams.get("brand");
  const searchQuery = searchParams.get("q");

  // Filtrado de Categoría + Marca + Búsqueda
  const productosFiltrados = PRODUCTS.filter((p) => {
    const matchCategoria = categoria ? p.category === categoria : true;
    const matchMarca = marcaActiva ? p.brand === marcaActiva : true;
    const matchSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchCategoria && matchMarca && matchSearch;
  });

  // Marcas de los productos según la categoría seleccionada
  const productosParaMarcas = categoria
    ? PRODUCTS.filter(p => p.category === categoria)
    : PRODUCTS;

  const marcasDisponibles = [...new Set(productosParaMarcas.map(p => p.brand))];

  // Función para cambiar la marca sin borrar la categoría
  const handleMarcaClick = (brand) => {
    if (brand === marcaActiva) {
      searchParams.delete("brand");
    } else {
      searchParams.set("brand", brand);
    }
    setSearchParams(searchParams);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={3}>
          {/* Filtro Categorias */}
          <h5 className="mb-3">Categorías</h5>
          <ListGroup variant="flush" className="mb-4 shadow-sm rounded">
            <ListGroup.Item
              action
              as={Link}
              to="/catalog"
              active={!categoria}
              className="d-flex justify-content-between align-items-center"
            >
              Todos los productos
              <span className="category-counter">
                {PRODUCTS.length}
              </span>
            </ListGroup.Item>

            {CATEGORIES.map((cat) => {
              // Contar cuántos productos hay en esta categoría
              const count = PRODUCTS.filter(p => p.category === cat.id).length;
              return (
                <ListGroup.Item
                  key={cat.id}
                  action as={Link} to={`/catalog?category=${cat.id}`}
                  active={categoria === cat.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  {cat.name}
                  <span className="category-counter">
                    {count}
                  </span>
                </ListGroup.Item>
              );
            })}
          </ListGroup>

          {/* Filtro Marcas */}
          <h5 className="mb-3">Marcas</h5>
          <div className="p-3 bg-white border rounded shadow-sm">
            {marcasDisponibles.map((brand) => (
              <Form.Check
                key={brand}
                type="checkbox"
                label={`${brand}`}
                checked={marcaActiva === brand}
                onChange={() => handleMarcaClick(brand)}
                className="mb-2"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </Col>

        {/* Nombres de Categorias */}
        <Col md={9}>
          <div className="mb-4">
            <h2>
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : categoria
                  ? CATEGORIES.find(c => c.id === categoria)?.name
                  : "Todos los productos"}
            </h2>
          </div>

          <Row>
            {productosFiltrados.map((prod) => (
              <Col sm={6} lg={4} key={prod.id} className="mb-4">
                <ProductCard product={prod} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductCategories;