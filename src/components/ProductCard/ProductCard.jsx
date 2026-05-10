import React,{useContext} from 'react'
import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { cartContext } from '../Context/cartContext';


function ProductCard({ product }) {

   const {cart,handleAddToCart} = useContext(cartContext)
    

    
    const outOfStock = product.stock <= 0;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

        console.log(cart);
        
        
        
    return (
        <Card className="h-100 tn-card-hover">

            {/* IMAGEN */}
            <Link to={`/producto/${product.slug}`}>
                <div className="position-relative">
                    <Card.Img
                        variant="top"
                        src={product.image}
                        className="tn-product-image"
                    />

                    {/* BADGES */}
                    <div className="position-absolute top-0 start-0 p-2 d-flex flex-column gap-1">
                        {product.isNew && (
                            <Badge bg="warning" text="dark">Nuevo</Badge>
                        )}

                        {discount > 0 && (
                            <Badge bg="danger">-{discount}%</Badge>
                        )}
                    </div>

                    {/* SIN STOCK */}
                    {outOfStock && (
                        <div className="position-absolute top-50 start-50 translate-middle bg-dark text-white px-3 py-1 rounded">
                            Sin stock
                        </div>
                    )}
                </div>
            </Link>

            {/* INFO */}
            <Card.Body className="d-flex flex-column">

                <small className="text-secondary">{product.brand}</small>

                <Link
                    to={`/producto/${product.slug}`}
                    className="text-decoration-none text-dark fw-bold"
                >
                    {product.name}
                </Link>

                {/* RATING */}
                <div className="d-flex align-items-center gap-1 mt-1">
                    <Star size={14} fill="gold" />
                    <span>{product.rating}</span>
                </div>

                {/* PRECIO */}
                <div className="mt-2">
                    <span className="fw-bold">
                        ${product.price.toLocaleString()}
                    </span>

                    {product.originalPrice && (
                        <span className="text-decoration-line-through text-secondary ms-2">
                            ${product.originalPrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* STOCK */}
                <small className="mt-1">
                    {outOfStock ? (
                        <span className="text-danger">Agotado</span>
                    ) : (
                        <>Stock: {product.stock}</>
                    )}
                </small>

                {/* BOTÓN */}
                <Button
                    className="mt-auto"
                    variant="primary"
                    disabled={outOfStock}
                    onClick={() =>handleAddToCart(product)}
                >
                    <ShoppingCart  size={16} /> Agregar
                </Button>

            </Card.Body>
        </Card>
    )
}

export default ProductCard