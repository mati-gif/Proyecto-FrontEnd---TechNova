import React, { useContext } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { cartContext } from '../../Context/CartContext/cartContext';
import { formatPrice } from '../../utils/formatPrice';


function Cart() {
    const navigate = useNavigate();

    //carrito real
    const { cart, handleAddToCart, handleDecreaseQuantity, totalPrice, handleDeleteProduct } = useContext(cartContext)
    console.log(cart);



    //  constantes de envío 
    const shippingThreshold = 500000; // Monto para envío gratis
    const shippingCost = totalPrice >= shippingThreshold ? 0 : 5000;
    const finalTotal = totalPrice + shippingCost;

    if (!cart || cart.length === 0) {
        return (
            <Container className="py-5 text-center" style={{ maxWidth: 480 }}>
                <div
                    className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: 80, height: 80 }}
                >
                    <ShoppingBag size={36} className="text-secondary" />
                </div>
                <h1 className="h3 fw-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Tu carrito está vacío
                </h1>
                <p className="text-secondary mb-4">¡Descubrí lo último en tecnología!</p>
                <Button as={Link} to="/catalog" size="lg" variant="primary">
                    Explorar productos
                </Button>
            </Container>
        );
    }

    return (
        <Container className="py-4 py-lg-5">
            <h1 className="fw-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Tu carrito <span className="text-secondary fs-4">
                    ({cart.length})
                </span>
            </h1>

            <Row className="g-4">
                <Col lg={8}>
                    <div className="d-flex flex-column gap-3">
                        {cart.map((product) => (
                            <Card
                                key={product.id}
                                className="border">
                                <Card.Body className="d-flex gap-3">
                                    <Link
                                        to={`/product/${product.slug}`}
                                        className="flex-shrink-0">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            width={112}
                                            height={112}
                                            loading="lazy"
                                            className="rounded-3 bg-light"
                                            style={{ width: 112, height: 112, objectFit: "cover" }}
                                        />
                                    </Link>

                                    <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
                                        <div className="text-uppercase text-secondary small fw-medium" style={{ fontSize: 11 }}>
                                            {product.brand}
                                        </div>
                                        <Link
                                            to={`/product/${product.slug}`}
                                            className="text-decoration-none text-dark fw-semibold">
                                            {product.name}
                                        </Link>
                                        <div className="text-secondary" style={{ fontSize: 12 }}>
                                            Stock disponible:
                                            {product.stock}
                                        </div>

                                        <div className="mt-auto pt-2 d-flex justify-content-between align-items-center flex-wrap gap-2">
                                            <div className="d-inline-flex align-items-center border rounded overflow-hidden">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(product.id)}
                                                    variant="link"
                                                    className="text-dark p-0"
                                                    style={{ width: '34px', height: '34px', textDecoration: 'none', background: 'transparent', border: 'none' }}
                                                    aria-label="Disminuir">
                                                    <Minus size={14} />
                                                </button>
                                                <span className='fw-semibold text-center' style={{ width: '38px', fontSize: '.9rem' }}>{product.cantidad}</span>
                                                <button aria-label="Aumentar" variant="link"
                                                    onClick={() => handleAddToCart(product)}
                                                    className="text-dark p-0"
                                                    style={{ width: '34px', height: '34px', textDecoration: 'none', background: 'transparent', border: 'none' }}>
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <div className="d-flex align-items-center gap-3">
                                                <div className="text-end">
                                                    <div className="fw-bold">{formatPrice(product.price * product.cantidad)}</div>
                                                    {product.cantidad > 1 && (
                                                        <div className="text-secondary" style={{ fontSize: 12 }}>
                                                            {formatPrice(product.price)} c/u
                                                        </div>

                                                    )}
                                                </div>
                                                <Button
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    variant="link" className="text-secondary p-2" aria-label="Eliminar">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                        ))}
                    </div>
                </Col>

                <Col lg={4}>
                    <div className="position-sticky" style={{ top: 90 }}>
                        <Card className="border">
                            <Card.Body>
                                <h2 className="fs-5 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Resumen
                                </h2>
                                <div className="small">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Subtotal</span>
                                        <span className="fw-medium">{formatPrice(totalPrice)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-secondary">Envío</span>
                                        <span className="fw-medium"><span className="fw-medium">
                                            {shippingCost === 0
                                                ? <span className="text-success">Gratis</span>
                                                : formatPrice(shippingCost)}
                                        </span> </span>
                                    </div>
                                    {shippingCost > 0 && (
                                        <p className="text-secondary mb-0" style={{ fontSize: 12 }}>
                                            Te faltan {formatPrice(shippingThreshold - totalPrice)} para envío gratis
                                        </p>
                                    )}
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-baseline">
                                    <span className="fw-semibold">Total</span>
                                    <span className="fs-3 fw-bold">{formatPrice(finalTotal)}</span>
                                </div>
                                <Button
                                    as={Link}
                                    to="/checkout"
                                    size="lg"
                                    variant="primary"
                                    className="w-100 mt-3 d-flex align-items-center justify-content-center gap-2 shadow-glow">
                                    {/* {user ? "Continuar compra" : "Iniciar sesión y pagar"} */}
                                    <ArrowRight size={16} />
                                </Button>
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="w-100 mt-2 text-secondary text-decoration-none">
                                    Seguir comprando
                                </Button>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Cart;