import { useState, useEffect, useContext } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { Lock, CreditCard, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { formatPrice } from "../utils/formatPrice";
import { cartContext } from "../Context/CartContext/cartContext";
import { AuthContext } from "../Context/AuthContext/authContext";
import { errorToast, successToast } from "../shared/toast/toast";
import { ShippingAddressContext } from "../Context/ShippingAddressContext/shippingAddressContext";

function Payment() {

    const [errors, setErrors] = useState(false)
    const navigate = useNavigate()

    const { shippingThreshold, shippingCost, finalTotal, cart, totalPrice } = useContext(cartContext)
    const { user, token } = useContext(AuthContext)
    console.log(cart);

    const [address, setAddress] = useState([])

    const { shippingAddress } = useContext(ShippingAddressContext)

    const [processing, setProcessing] = useState(false);

    console.log(shippingAddress);

    const [form, setForm] = useState({
        cardNumber: "",
        cardName: "",
        expiry: "",
        cvc: ""
    });


    const validateErrors = () => {

        const newErrors = {}
        if (form.cardNumber.trim() === "") {
            newErrors.cardNumber = "El numero de tarjeta no puede estar vacio"
        }
        if (form.cardName.trim() === "") {
            newErrors.cardName = "el nombre no puede estar vacio";
        }
        if (form.expiry.trim() === "") {
            newErrors.expiry = "La fecha de vencimiento es obligatoria";
        }
        if (form.cvc.trim() === "") {
            newErrors.cvc = "Los tres numeros detras de la tarjeta no pueden estar vacíos";
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }



    const handleFormChange = (event) => {

        //hago destructuring con los atributos del input para que sean variables
        const { name, value } = event.target
        setForm({
            ...form,
            [name]: value
        })

    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const isValid = validateErrors();

        if (!isValid) {
            errorToast("Hay errores en el formulario")
            return;
        }
        const datosParaEnviar = {
            ...form
        };

        handleCreateOrder(datosParaEnviar)
        console.log(form);
        console.log("Datos para enviar ", datosParaEnviar);


    }

    const handleCreateOrder = async (datosParaEnviar) => {

        setProcessing(true);

        try {

            const orderData = {
                userId: user.userId,
                shippingAddressId: shippingAddress.id,
                subtotal: totalPrice,
                shippingCost,
                totalPrice: finalTotal,
                iva:21,
                paymentMethod: "CreditCard",
                lastFourDigits: datosParaEnviar.cardNumber.slice(-4),
            };

            console.log("Orden a crear:", orderData);

            const response = await fetch(
                "http://localhost:3000/order/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(orderData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            successToast(data.message);

            console.log("Orden creada:", data.order);

            const orderId = data.order.id;

            for (const product of cart) {

                const orderProductData = {
                    orderId: data.order.id,
                    productId: product.id,
                    quantity: product.cantidad,
                    priceAtPurchase: product.price * product.cantidad
                };

                const orderProductResponse = await fetch(
                    "http://localhost:3000/order/product/create",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(orderProductData)
                    }
                );

                const orderProductResult = await orderProductResponse.json();

                if (!orderProductResponse.ok) {
                    throw new Error(orderProductResult.message);
                }

                console.log("OrderProduct creado:", orderProductResult);
            }

            navigate(
                `/success?order=${data.order.orderCode}&id=${data.order.id}`
            );

        } catch (error) {

            console.log(error);
            errorToast(error.message);

        } finally {

            setProcessing(false);

        }
    };
    return (
        <Container className="py-4 py-lg-5">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <Button as={Link} to="/checkout" variant="link" className="text-secondary text-decoration-none ps-0 mb-2 d-inline-flex align-items-center gap-1">
                    <ArrowLeft size={16} /> Volver al envío
                </Button>
                <h1 className="fw-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Pasarela de pago
                </h1>
                <p className="text-secondary mb-4">Paso 2 de 2 — pago seguro simulado</p>

                <Row className="g-4">
                    <Col lg={8}>
                        <Form
                            onSubmit={handleSubmit}
                        >
                            <Card className="border mb-4">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <span style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'rgba(43, 86, 245, 0.1)',
                                            color: '#2b56f5',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}><CreditCard size={16} /></span>
                                        <h2 className="fs-5 fw-bold mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            Datos de la tarjeta
                                        </h2>
                                        <span className="ms-auto d-flex align-items-center gap-1 text-secondary small">
                                            <Lock size={14} /> Pago seguro
                                        </span>
                                    </div>

                                    <div className=" mb-4" style={{
                                        background: 'linear-gradient(135deg, #2b56f5 0%, #7d3df0 50%, #f57b1f 100%)',
                                        color: '#fff',
                                        borderRadius: '1rem',
                                        padding: '1.5rem',
                                        boxShadow: '0 18px 48px -16px rgba(43, 86, 245, 0.35)'
                                    }}>
                                        <div className="d-flex justify-content-between align-items-start mb-4">
                                            <span className="small opacity-75">TechNova Card</span>
                                            <CreditCard size={22} />
                                        </div>
                                        <div className="font-monospace fs-5" style={{ letterSpacing: "0.15em" }}>
                                            {form.cardNumber || "•••• •••• •••• ••••"}
                                        </div>
                                        <div className="d-flex justify-content-between mt-3" style={{ fontSize: 12 }}>
                                            <div>
                                                <div className="opacity-75">Titular</div>
                                                <div className="fw-semibold text-uppercase">{form.cardName || "NOMBRE APELLIDO"}</div>
                                            </div>
                                            <div>
                                                <div className="opacity-75">Vence</div>
                                                <div className="fw-semibold">{form.expiry || "MM/AA"}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Número de tarjeta</Form.Label>
                                                <Form.Control inputMode="numeric" placeholder="1234 5678 9012 3456"
                                                    name="cardNumber"
                                                    value={form.cardNumber}
                                                    onChange={(e) => handleFormChange(e)}
                                                    isInvalid={!!errors.cardNumber}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.cardNumber}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Nombre del titular</Form.Label>
                                                <Form.Control placeholder="Como figura en la tarjeta"
                                                    name="cardName"
                                                    value={form.cardName}
                                                    onChange={(e) => handleFormChange(e)}
                                                    isInvalid={!!errors.cardName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.cardName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Vencimiento</Form.Label>
                                                <Form.Control placeholder="MM/AA"
                                                    name="expiry"
                                                    value={form.expiry}
                                                    onChange={(e) => handleFormChange(e)}
                                                    isInvalid={!!errors.expiry}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.expiry}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>CVC</Form.Label>
                                                <Form.Control inputMode="numeric" placeholder="123" maxLength={4}
                                                    name="cvc"
                                                    value={form.cvc}
                                                    onChange={(e) => handleFormChange(e)}
                                                    isInvalid={!!errors.cvc}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.cvc}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Button type="submit" size="lg" variant="primary"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 shadow-glow"
                                disabled={processing}
                            >
                                <span>Aceptar</span>
                                {processing ? (
                                    <><Spinner as="span" animation="border" size="sm" /> Procesando pago...</>
                                ) : (
                                    <><Lock size={16} /> Pagar {formatPrice(finalTotal)}</>
                                )}
                            </Button>
                        </Form>
                    </Col>

                    <Col lg={4}>
                        <div className="position-sticky" style={{ top: 90 }}>
                            <Card className="border mb-3">
                                <Card.Body className="p-4">
                                    <h2 className="fs-6 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Envío a
                                    </h2>
                                    <div className="small text-secondary">
                                        <div className="fw-semibold text-dark">{shippingAddress.fullName}</div>
                                        <div>{shippingAddress.address}</div>
                                        <div>{shippingAddress.city}, {shippingAddress.province} ({shippingAddress.zipCode})</div>
                                        <div>Tel: {shippingAddress.phone}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className="border">
                                <Card.Body className="p-4">
                                    <h2 className="fs-6 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Tu pedido ({cart.length})
                                    </h2>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Envío</span><span>                                                {shippingCost === 0 ?
                                            <span className="text-success">Gratis</span> : formatPrice(shippingCost)
                                        }</span>
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
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default Payment