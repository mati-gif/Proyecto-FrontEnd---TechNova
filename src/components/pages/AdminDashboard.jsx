import React from 'react'
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { Package, Users, ShoppingBag, DollarSign } from "lucide-react";
import { formatPrice } from '../utils/formatPrice';
import { PRODUCTS } from "../../data/products"
function AdminDashboard() {

    const user = {
        role: "admin"
    }
    const isSuperadmin = user?.role === "superadmin";
    const lowStock = PRODUCTS.filter((p) => p.stock <= 5).length;
    const stats = [
        {
            label: "Productos",
            value: PRODUCTS.length,
            icon: Package, 
            color: "#2b56f5",
            to: "/admin/products"
        },
        {
            label: "Pedidos totales",
            value: 15,
            icon: ShoppingBag,
            color: "#1ea75a"
        },
        {
            label: "Ingresos",
            value: 50,
            icon: DollarSign, 
            color: "#f57b1f"
        },
        ...(isSuperadmin ? [{
            label: "Usuarios",
            value: 100,
            icon: Users,
            color: "#7d3df0",
            to: "/admin/usuarios"
        }] : []),
    ];
    return (
        <div>
            <Row className="g-3 mb-4">
                {stats.map((s) => {
                    const Icon = s.icon;
                    const card = (
                        <Card className="border h-100 tn-card-hover">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="rounded-3 d-flex align-items-center justify-content-center"
                                    style={{ width: 48, height: 48, background: `${s.color}1A`, color: s.color }}>
                                    <Icon size={22} />
                                </div>
                                <div>
                                    <div className="text-secondary small text-uppercase" style={{ fontSize: 11, letterSpacing: ".05em" }}>{s.label}</div>
                                    <div className="fs-4 fw-bold">{s.value}</div>
                                </div>
                            </Card.Body>
                        </Card>
                    );
                    return (
                        <Col sm={6} lg={3} key={s.label}>
                            {s.to ? <Link to={s.to} className="text-decoration-none text-dark">{card}</Link> : card}
                        </Col>
                    );
                })}
            </Row>

            <Card className="border">
                <Card.Body>
                    <h2 className="h5 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Atajos
                    </h2>
                    <div className="d-flex flex-wrap gap-2">
                        <Link to="/admin/productos/nuevo" className="btn btn-primary btn-sm">+ Nuevo producto</Link>
                        <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">Gestionar productos</Link>
                        {isSuperadmin && (
                            <Link to="/admin/usuarios" className="btn btn-outline-secondary btn-sm">Gestionar usuarios</Link>
                        )}
                    </div>
                    {lowStock > 0 && (
                        <div className="alert alert-warning mt-3 mb-0 small">
                            ⚠️ Hay <strong>{lowStock}</strong> productos con stock bajo (≤ 5 unidades).
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    )
}

export default AdminDashboard