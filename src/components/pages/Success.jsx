import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

function Success() {
    const [params] = useSearchParams();

    const orderId = params.get("order") ?? "TN-XXXXX";

    return (
        <Container className="py-5 text-center" style={{ maxWidth: 640 }}>
            <div className="position-relative d-inline-block mb-4">
                <div
                    className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                    style={{ background: "rgba(30, 167, 90, .2)", filter: "blur(32px)" }}
                />
                <div
                    className="position-relative rounded-circle d-flex align-items-center justify-content-center mx-auto tn-scale-in"
                    style={{ width: 96, height: 96, background: "rgba(30, 167, 90, .12)" }}
                >
                    <CheckCircle2 size={56} className="text-success" />
                </div>
            </div>

            <h1
                className="fw-bold mb-2 tn-fade-in-up"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
                ¡Compra confirmada!
            </h1>
            <p className="lead text-secondary mb-1">Gracias por elegir TechNova 🎉</p>
            <p className="small text-secondary mb-4">
                Te enviamos un email con los detalles de tu pedido.
            </p>

            <Card className="border text-start mx-auto mb-4" style={{ maxWidth: 420 }}>
                <Card.Body className="p-4">
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <div
                            className="rounded-3 d-flex align-items-center justify-content-center"
                            style={{ width: 40, height: 40, background: "rgba(43,86,245,.1)", color: "#2b56f5" }}
                        >
                            <Package size={20} />
                        </div>
                        <div>
                            <div className="text-uppercase text-secondary small fw-semibold" style={{ fontSize: 11 }}>
                                Número de orden
                            </div>
                            <div className="font-monospace fw-bold fs-5">{orderId}</div>
                        </div>
                    </div>
                    <div className="text-secondary small">
                        Tu pedido está siendo preparado. Te llegará en 24-72hs hábiles.
                    </div>
                </Card.Body>
            </Card>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                <Button as={Link} to="/catalogo" size="lg" variant="primary" className="d-inline-flex align-items-center justify-content-center gap-2">
                    Seguir comprando
                    <ArrowRight size={16} />
                </Button>
                <Button as={Link} to="/" size="lg" variant="outline-secondary">
                    Volver al inicio
                </Button>
            </div>
        </Container>
    )
}

export default Success