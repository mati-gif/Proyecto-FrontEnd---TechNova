import { useParams } from "react-router-dom";
import { PRODUCTS } from "../../data/products";
import { Container } from "react-bootstrap";

function SingleProduct() {
  const { slug } = useParams();

  const producto = PRODUCTS.find(p => p.slug === slug);

  if (!producto) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <Container className="py-5">
      <h1>{producto.name}</h1>
      <img src={producto.image} style={{ width: "500px", height: "500px" }} alt={producto.name}/>
      <p>Marca: {producto.brand}</p>
      <p>Precio: ${producto.price}</p>
      <p>Descripción: {producto.description}</p>
      <p>Calificación: {producto.rating}/5</p>
    </Container>
  );
}

export default SingleProduct;
