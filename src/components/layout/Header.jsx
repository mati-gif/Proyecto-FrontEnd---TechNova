import React from 'react'
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Nav,
    Form,
    Button,
    Offcanvas
} from "react-bootstrap";

import {
    Cpu,
    Search,
    ShoppingCart,
    User
} from "lucide-react";

import { CATEGORIES } from "../../data/categories";
function Header() {

    const [search, setSearch] = useState("");
    const [showMobile, setShowMobile] = useState(false);

    // simulamos carrito (después lo hacemos real)
    const cartCount = 2;

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Buscar:", search);
        setSearch("");
    };
    return (
        <header className="tn-header">
            <Container className="d-flex align-items-center" style={{ height: 70 }}>

                {/* LOGO */}
                <Link to="/" className="d-flex align-items-center text-decoration-none text-dark">
                    <div className="me-2 p-2 rounded bg-primary text-white">
                        <Cpu size={20} />
                    </div>
                    <span className="fw-bold fs-4">
                        Tech<span className="text-primary">Nova</span>
                    </span>
                </Link>

                {/* CATEGORÍAS DESKTOP */}
                <Nav className="d-none d-lg-flex ms-4">
                    {CATEGORIES.map((cat) => (
                        <Nav.Link
                            key={cat.id}
                            as={Link}
                            to={`/catalog?category=${cat.id}`}
                            className="text-secondary"
                        >
                            {cat.name}
                        </Nav.Link>
                    ))}
                </Nav>

                {/* SEARCH */}
                <Form
                    onSubmit={handleSearch}
                    className="d-none d-md-flex ms-auto"
                    style={{ maxWidth: 300 }}
                >
                    <div className="position-relative w-100">
                        <Search
                            size={16}
                            style={{
                                position: "absolute",
                                left: 10,
                                top: "50%",
                                transform: "translateY(-50%)"
                            }}
                        />

                        <Form.Control
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar..."
                            style={{ paddingLeft: 30 }}
                        />
                    </div>
                </Form>

                {/* ACCIONES */}
                <div className="d-flex align-items-center gap-2 ms-auto ms-md-2">

                    {/* LOGIN */}
                    <Button
                        as={Link}
                        to="/login"
                        variant="link"
                        className="text-dark d-none d-sm-flex align-items-center"
                    >
                        <User size={16} className="me-1" />
                        Ingresar
                    </Button>

                    {/* CARRITO */}
                    <Button
                        as={Link}
                        to="/carrito"
                        variant="outline-secondary"
                        className="position-relative d-flex align-items-center gap-1"
                    >
                        <ShoppingCart size={16} />

                        {cartCount > 0 && (
                            <span
                                style={{
                                    position: "absolute",
                                    top: -5,
                                    right: -5,
                                    background: "#f57b1f",
                                    color: "white",
                                    borderRadius: "50%",
                                    fontSize: 10,
                                    padding: "2px 6px"
                                }}
                            >
                                {cartCount}
                            </span>
                        )}
                    </Button>

                    {/* BOTÓN MOBILE */}
                    <Button
                        variant="link"
                        className="d-lg-none text-dark"
                        onClick={() => setShowMobile(true)}
                    >
                        ☰
                    </Button>
                </div>

                {/* MENU MOBILE */}
                <Offcanvas
                    show={showMobile}
                    onHide={() => setShowMobile(false)}
                    placement="end"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Menú</Offcanvas.Title>
                    </Offcanvas.Header>

                    <Offcanvas.Body>

                        <h6 className="mb-3">Categorías</h6>

                        <Nav className="flex-column">
                            {CATEGORIES.map((cat) => (
                                <Nav.Link
                                    key={cat.id}
                                    as={Link}
                                    to={`/catalog?category=${cat.id}`}
                                    onClick={() => setShowMobile(false)}
                                >
                                    {cat.name}
                                </Nav.Link>
                            ))}
                        </Nav>

                        <hr />

                        <Form onSubmit={handleSearch}>
                            <Form.Control
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Buscar..."
                            />
                        </Form>

                    </Offcanvas.Body>
                </Offcanvas>

            </Container>
        </header>
    )
}

export default Header