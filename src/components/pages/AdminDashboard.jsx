import React,{useContext,useState,useEffect} from 'react'
import { Link } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";
import { Package, Users, ShoppingBag, DollarSign } from "lucide-react";
import { formatPrice } from '../utils/formatPrice';
// import { PRODUCTS } from "../../data/products"
import { AuthContext } from '../Context/AuthContext/authContext';
function AdminDashboard() {



    const {user,token} = useContext(AuthContext)
    const [products,setProducts] = useState([])
    const [users,setUsers] = useState([])
console.log(users);

    const isSuperadmin = user?.userRole === "superadmin";
    const lowStock = products.filter((p) => p.stock <= 5).length;
    const stats = [
        {
            label: "Productos",
            value: products.length,
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
            value: users.length,
            icon: Users,
            color: "#7d3df0",
            to: "/admin/users"
        }] : []),
    ];

        
    
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

            useEffect(()=>{
                const res = fetch("http://localhost:3000/user/all",{
                    method:"GET",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization": `Bearer ${token}`
                    }
                    
                })
                .then(res => res.json())
                .then((data) =>{
                    setUsers([...data])
                })
                .catch(error => console.log(error)//hacer mas robusto este catch
                )
            },[])
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
                        <Link to="/admin/products/new" className="btn btn-primary btn-sm">+ Nuevo producto</Link>
                        <Link to="/admin/products" className="btn btn-outline-secondary btn-sm">Gestionar productos</Link>
                        {isSuperadmin && (
                            <Link to="/admin/users" className="btn btn-outline-secondary btn-sm">Gestionar usuarios</Link>
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