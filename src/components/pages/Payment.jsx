import { useState } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { Lock, CreditCard, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { formatPrice } from "../utils/formatPrice";

function Payment() {
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
                        // onSubmit={handleSubmit}
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
                                            {/*{form.cardNumber || "•••• •••• •••• ••••"} */}
                                        </div>
                                        <div className="d-flex justify-content-between mt-3" style={{ fontSize: 12 }}>
                                            <div>
                                                <div className="opacity-75">Titular</div>
                                                <div className="fw-semibold text-uppercase">{/*{form.cardName || "NOMBRE APELLIDO"}*/}</div>
                                            </div>
                                            <div>
                                                <div className="opacity-75">Vence</div>
                                                <div className="fw-semibold">{/*{form.expiry || "MM/AA"}*/}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Número de tarjeta</Form.Label>
                                                <Form.Control inputMode="numeric" placeholder="1234 5678 9012 3456"
                                                // value={form.cardNumber}
                                                // onChange={(e) => updateField("cardNumber", formatCardNumber(e.target.value))}
                                                // isInvalid={!!errors.cardNumber} 
                                                />
                                                <Form.Control.Feedback type="invalid">{/*{errors.cardNumber}*/}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Nombre del titular</Form.Label>
                                                <Form.Control placeholder="Como figura en la tarjeta"
                                                // value={form.cardName}
                                                // onChange={(e) => updateField("cardName", e.target.value)}
                                                // isInvalid={!!errors.cardName} 
                                                />
                                                <Form.Control.Feedback type="invalid">{/*{errors.cardName}*/}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Vencimiento</Form.Label>
                                                <Form.Control placeholder="MM/AA"
                                                // value={form.expiry}
                                                // onChange={(e) => updateField("expiry", formatExpiry(e.target.value))}
                                                // isInvalid={!!errors.expiry} 
                                                />
                                                <Form.Control.Feedback type="invalid">{/*{errors.expiry}*/}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>CVC</Form.Label>
                                                <Form.Control inputMode="numeric" placeholder="123" maxLength={4}
                                                // value={form.cvc}
                                                // onChange={(e) => updateField("cvc", e.target.value.replace(/\D/g, ""))}
                                                // isInvalid={!!errors.cvc} 
                                                />
                                                <Form.Control.Feedback type="invalid">{/*{errors.cvc}*/}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Alert variant="light" className="mt-4 d-flex align-items-start gap-2 small text-secondary border">
                                        <Lock size={16} className="flex-shrink-0 mt-1" />
                                        <span>
                                            Esta es una <strong>demo</strong>. No ingreses datos reales de tarjeta. Podés usar
                                            cualquier número de 16 dígitos, ej. <code>4242 4242 4242 4242</code>, vencimiento <code>12/30</code> y CVC <code>123</code>.
                                        </span>
                                    </Alert>
                                </Card.Body>
                            </Card>

                            <Button type="submit" size="lg" variant="primary"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 shadow-glow"
                            // disabled={processing}
                            >
                                <span>Aceptar</span>
                                {/* {processing ? (
                                    <><Spinner as="span" animation="border" size="sm" /> Procesando pago...</>
                                ) : (
                                    <><Lock size={16} /> Pagar {formatPrice(total)}</>
                                )} */}
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
                                        <div className="fw-semibold text-dark">{/*{shippingData.fullName}*/}</div>
                                        <div>{/*{shippingData.street}*/}</div>
                                        <div>{/*{shippingData.city}, {shippingData.state} ({shippingData.zip}*/})</div>
                                        <div>Tel: {/*{shippingData.phone}*/}</div>
                                    </div>
                                </Card.Body>
                            </Card>
                            <Card className="border">
                                <Card.Body className="p-4">
                                    <h2 className="fs-6 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Tu pedido ({/*{items.length}*/})
                                    </h2>
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Subtotal</span><span>{/*{formatPrice(cartSubtotal)}*/}</span></div>
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">IVA (21%)</span><span>{/*{formatPrice(tax)}*/}</span></div>
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Envío</span><span>{/*{shipping === 0 ? <span className="text-success">Gratis</span> : formatPrice(shipping)}*/}</span></div>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-baseline">
                                        <span className="fw-semibold">Total</span>
                                        <span className="fs-3 fw-bold">{/*{formatPrice(total)}*/}</span>
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