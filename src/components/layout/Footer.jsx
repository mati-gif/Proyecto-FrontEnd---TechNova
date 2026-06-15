import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import 'bootstrap-icons/font/bootstrap-icons.css';
function Footer() {
    const [categories, setCategories] = useState([])

    useEffect(() => {

        const res = fetch("http://localhost:3000/category/all", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(res => res.json())
            .then((data) => {
                setCategories([...data])

            })
            .catch((error) => {
                console.log(error)
                errorToast(error.message);
            })
    }, [])

    return (
        <footer className="border-top bg-light pt-5 pb-3">
            <Container>

                <Row className="g-4">

                    {/* LOGO + INFO */}
                    <Col xs={12} md={6}>
                        {/* LOGO */}
                        <Link
                            to="/"
                            className="d-flex align-items-center text-decoration-none text-dark"
                        >
                            <img
                                src="/logo-technova.jpg"
                                alt="TechNova"
                                style={{ height: "40px", width: "auto", borderRadius: "6px" }}
                                className="me-2"
                            />

                            <span className="fw-bold fs-4">
                                Tech<span className="text-primary">Nova</span>
                            </span>
                        </Link>

                        <p className="text-secondary small" style={{ maxWidth: 360, marginTop: 10 }}>
                            Tu tienda de tecnología premium. Encontrá lo último en monitores,
                            periféricos, audio y más.
                        </p>

                        {/* ICONOS */}
                        <div className="d-flex gap-2 mt-3">
                            <a
                                href="https://wa.me/5493412456789"
                                className="d-inline-flex align-items-center justify-content-center border rounded text-secondary"
                                style={{ width: 36, height: 36 }}
                            >
                                <i className="bi bi-whatsapp" style={{ fontSize: 16 }}></i>
                            </a>
                            <a
                                href="https://web.facebook.com/technova-ecommerce"
                                className="d-inline-flex align-items-center justify-content-center border rounded text-secondary"
                                style={{ width: 36, height: 36 }}
                            >
                                <i className="bi bi-facebook" style={{ fontSize: 16 }}></i>
                            </a>
                            <a
                                href="https://www.instagram.com/technova-ecommerce"
                                className="d-inline-flex align-items-center justify-content-center border rounded text-secondary"
                                style={{ width: 36, height: 36 }}
                            >
                                <i className="bi bi-instagram" style={{ fontSize: 16 }}></i>
                            </a>
                        </div>
                    </Col>

                    {/* TIENDA */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Tienda</h6>
                        {categories.map((c) => {
                            return (
                                <ul className="list-unstyled small" key={c.id}>
                                    <li className="mb-2" >
                                        <Link to={`/catalog?category=${c.id}`} className="text-secondary text-decoration-none">
                                            <i className="bi bi-bag"></i> <span>{c.name}</span>
                                        </Link>
                                    </li>
                                </ul>
                            )
                        })}

                    </Col>

                    {/* SOPORTE */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Pagos y envíos</h6>

                        <ul className="list-unstyled small">
                            <li className="mb-2">
                                <i className="bi bi-box2-heart"></i> <span className="text-secondary">Envío gratis en compras superiores a $500.000</span>
                            </li>

                            <li className="mb-2">
                                <i className="bi bi-credit-card"></i> <span className="text-secondary">Aceptamos todos los medios de pago</span>
                            </li>

                            <li className="mb-2">
                                <Link to="/contact-us" className="text-secondary text-decoration-none">
                                    <i className="bi bi-info-square"></i> <span>¿Necesitas ayuda? Escribinos</span>
                                </Link>
                            </li>
                        </ul>
                    </Col>

                </Row>

                <hr className="mt-4" />

                {/* COPYRIGHT */}
                <div className="d-flex flex-column flex-md-row justify-content-between text-secondary small">
                    <span>© 2026 TechNova</span>
                </div>

            </Container>
        </footer>
    )
}

export default Footer