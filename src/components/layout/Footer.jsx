import React from 'react'
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Cpu } from "lucide-react";
import { FaInstagram, FaTwitter } from "react-icons/fa";
function Footer() {
    return (
        <footer className="border-top bg-light mt-5 pt-5 pb-3">
            <Container>

                <Row className="g-4">

                    {/* LOGO + INFO */}
                    <Col xs={12} md={6}>
                        <Link
                            to="/"
                            className="d-inline-flex align-items-center text-decoration-none text-dark mb-2"
                        >
                            <div className="me-2 p-2 bg-primary text-white rounded">
                                <Cpu size={20} />
                            </div>

                            <span className="fw-bold fs-4">
                                Tech<span className="text-primary">Nova</span>
                            </span>
                        </Link>

                        <p className="text-secondary small" style={{ maxWidth: 360 }}>
                            Tu tienda de tecnología premium. Encontrá lo último en monitores,
                            periféricos, audio y más.
                        </p>

                        {/* ICONOS */}
                        <div className="d-flex gap-2 mt-3">
                            {[FaTwitter, FaInstagram].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="d-inline-flex align-items-center justify-content-center border rounded text-secondary"
                                    style={{ width: 36, height: 36 }}
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </Col>

                    {/* TIENDA */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Tienda</h6>

                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <Link to="/catalogo" className="text-secondary text-decoration-none">
                                    Catálogo
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/catalogo?categoria=monitores" className="text-secondary text-decoration-none">
                                    Monitores
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/catalogo?categoria=audio" className="text-secondary text-decoration-none">
                                    Audio
                                </Link>
                            </li>

                            <li className="mb-2">
                                <Link to="/catalogo?categoria=computadoras" className="text-secondary text-decoration-none">
                                    Computadoras
                                </Link>
                            </li>
                        </ul>
                    </Col>

                    {/* SOPORTE */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Soporte</h6>

                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <a href="#" className="text-secondary text-decoration-none">Envíos</a>
                            </li>

                            <li className="mb-2">
                                <a href="#" className="text-secondary text-decoration-none">Devoluciones</a>
                            </li>

                            <li className="mb-2">
                                <a href="#" className="text-secondary text-decoration-none">Garantía</a>
                            </li>

                            <li className="mb-2">
                                <a href="#" className="text-secondary text-decoration-none">Contacto</a>
                            </li>
                        </ul>
                    </Col>

                </Row>

                <hr className="mt-4" />

                {/* COPYRIGHT */}
                <div className="d-flex flex-column flex-md-row justify-content-between text-secondary small">
                    <span>© {new Date().getFullYear()} TechNova</span>
                    <span>Hecho con ⚡</span>
                </div>

            </Container>
        </footer>
    )
}

export default Footer