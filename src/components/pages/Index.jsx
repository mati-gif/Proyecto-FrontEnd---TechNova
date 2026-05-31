import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import { Truck, ShieldCheck, CreditCard, Zap, ArrowRight, Star } from "lucide-react";
import ProductCard from "../biz/ProductCard/ProductCard";
import heroImage from "../../assets/hero-tech.jpg";

import React, { useState } from 'react'

function Index() {

    const [products,setProducts] = useState([])
    const [categories,setCategories] = useState([])
    
    
        useEffect(() => {
    
            const res = fetch("http://localhost:3000/product/all", {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then((data) => {
                    console.log("productos del backend", data);
    
                    setProducts([...data])
    
                })
                .catch(error => console.log(error))//hacer mas robusto este catch
        }, [])


        useEffect(() => {
        
                const res = fetch("http://localhost:3000/category/all", {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                    .then(res => res.json())
                    .then((data) => {
                        console.log("categorias del backend", data);
        
                        setCategories([...data])
        
                    })
                    .catch(error => console.log(error))//hacer mas robusto este catch
            }, [])
    
        console.log(products);
    const featured = products.filter(p => p.isFeatured).slice(0, 4);
    const newest = products.filter(p => p.isNew).slice(0, 4);


    
    return (
        <>
            {/* HERO */}
            <section className="bg-gradient-hero text-white position-relative">
                <Container className="py-5">
                    <Row className="align-items-center g-5">

                        {/* TEXTO */}
                        <Col lg={6}>
                            <Badge bg="light" text="dark" className="mb-3 d-inline-flex align-items-center gap-2">
                                <Zap size={20} />
                                Envíos a todo el país
                            </Badge>

                            <h1 className="fw-bold">
                                Tecnología que <br />
                                <span className="text-warning">eleva tu setup </span>
                            </h1>

                            <p className="mt-3">
                                Monitores, periféricos y más al mejor precio
                            </p>

                            <div className="d-flex gap-2 mt-3">
                                <Button
                                    as={Link}
                                    to="/catalog"
                                    variant="light"
                                    className="d-flex align-items-center gap-2"
                                >
                                    Ver catálogo <ArrowRight size={16} />
                                </Button>

                                <Button variant="outline-light">
                                    Ver ofertas
                                </Button>
                            </div>

                            {/* Rating */}
                            <div className="d-flex align-items-center gap-2 mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill="white" />
                                ))}
                                <span>4.9</span>
                            </div>
                        </Col>

                        {/* IMAGEN */}
                        <Col lg={6} className="position-relative">
                            <div className="position-relative">
                                <img
                                    width={1600}
                                    height={1024}
                                    src={heroImage}
                                    alt="Setup tecnológico"
                                    className="img-fluid rounded shadow"
                                />
                            </div>
                        </Col>

                    </Row>
                </Container>
            </section>

            {/* BENEFICIOS */}
            <section className="bg-white border-bottom">
                <Container className="py-4">
                    <Row className="text-center">
                        <Col md={3}>
                            <Truck />
                            <p>Envío gratis</p>
                        </Col>
                        <Col md={3}>
                            <ShieldCheck />
                            <p>Garantía</p>
                        </Col>
                        <Col md={3}>
                            <CreditCard />
                            <p>Cuotas</p>
                        </Col>
                        <Col md={3}>
                            <Zap />
                            <p>Soporte</p>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* CATEGORÍAS  */}
            <Container className="py-5">
                <h2 className="mb-4">Categorías</h2>

                <Row>
                    {categories.map(cat => (
                        <Col md={3} key={cat.id} className="mb-3" >
                            <Link
                                to={`/catalog?category=${cat.id}`}
                                className="tn-category-tile d-block p-3 border rounded"
                            >
                                <h5>{cat.name}</h5>
                                <p className="text-secondary small">{cat.description}</p>
                                <ArrowRight size={16} />
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* DESTACADOS */}
            <Container className="pb-5">
                <h2 className="mb-4">Destacados</h2>

                <Row>
                    {featured.map(p => (
                        <Col md={3} key={p.id} className="mb-4">
                            <ProductCard  product={p} />
                        </Col>
                    ))}
                </Row>
            </Container>

            {/* NUEVOS */}
            <Container className="pb-5">
                <div className="p-4 bg-light rounded">
                    <h2 className="mb-4">Nuevos productos</h2>

                    <Row>
                        {newest.map(p => (
                            <Col md={3} key={p.id} className="mb-4">
                                <ProductCard  product={p} />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </>
    )
}

export default Index