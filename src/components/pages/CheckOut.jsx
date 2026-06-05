import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { MapPin, ArrowRight, Check } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { formatPrice } from "../utils/formatPrice";
import { cartContext } from "../Context/CartContext/cartContext";
import { AuthContext } from "../Context/AuthContext/authContext";
import { errorToast, successToast } from "../shared/toast/toast";

function CheckOut() {
    const [errors, setErrors] = useState(false)
    const navigate = useNavigate()

    const { shippingThreshold, shippingCost, finalTotal, cart, totalPrice } = useContext(cartContext)
    const { user ,token} = useContext(AuthContext)

    const [form, setForm] = useState({
        fullName: "",
        address: "",
        city: "",
        province: "",
        zipCode: "",
        phone: ""
    });

    const validateErrors = () => {

        const newErrors = {}
        if (form.fullName.trim() === "") {
            newErrors.fullName = "El nombre no puede estar vacio"
        }
        if (form.address.trim() === "") {
            newErrors.address = "La direccion es obligatoria";
        }
        if (form.city.trim() === "") {
            newErrors.city = "La ciudad es obligatoria";
        }
        if (form.province.trim() === "") {
            newErrors.province = "La provincia no pueden estar vacía";
        }
        if (form.zipCode.trim() === "") {
            newErrors.zipCode = "El codigo postal no puede estar vacio";
        }

        if (!/^\d{7,15}$/.test(form.phone)) {
            newErrors.phone = "Ingrese un número de teléfono válido (7-15 dígitos)";
        }
        if (form.phone.trim() === "") {
            newErrors.phone = "El telefono no puede estar vacio"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handlePhoneChange = (e) => {
        const digits = e.target.value.replace(/\D/g, "");
        setForm(prev => ({ ...prev, phone: digits }));
    };

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

        handleCreate(datosParaEnviar)
        console.log(form);
        console.log("Datos para enviar ", datosParaEnviar);


    }

    const handleCreate = (datosParaEnviar) => {

        fetch(`http://localhost:3000/shippingAddress/create/${user.id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify(datosParaEnviar)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error al crear la direccion de envio");
                }
                return res.json();
            })
            .then(data => {

                successToast(data.message);
                navigate("/payment")
            })
            .catch(error => {
                console.log(error);
                errorToast(error.message);
            });
    }

    return (
        <Container className="py-4 py-lg-5">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                <h1 className="fw-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Datos de envío
                </h1>
                <p className="text-secondary mb-4">Paso 1 de 2 — luego completás el pago</p>

                <Row className="g-4">
                    <Col lg={8}>
                        <Form
                            onSubmit={handleSubmit}
                        >
                            <Card className="border mb-4">
                                <Card.Body className="p-4">
                                    <div className="d-flex align-items-center gap-2 mb-4">
                                        <span className="tn-step-icon"><MapPin size={16} /></span>
                                        <h2 className="fs-5 fw-bold mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                            Dirección de envío
                                        </h2>
                                    </div>
                                    <Row className="g-3">
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Nombre completo</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="fullName"
                                                    value={form.fullName}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.fullName}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12}>
                                            <Form.Group>
                                                <Form.Label>Dirección</Form.Label>
                                                <Form.Control placeholder="Calle, número, piso, dpto"
                                                    type="text"
                                                    name="address"
                                                    value={form.address}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.address}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Ciudad</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="city"
                                                    value={form.city}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.city}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Provincia / Estado</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="province"
                                                    value={form.province}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.province}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.province}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Código postal</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="zipCode"
                                                    value={form.zipCode}
                                                    onChange={handleFormChange}
                                                    isInvalid={!!errors.zipCode}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.zipCode}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col sm={6}>
                                            <Form.Group>
                                                <Form.Label>Teléfono</Form.Label>
                                                <Form.Control
                                                    value={form.phone}
                                                    onChange={handlePhoneChange}
                                                    isInvalid={!!errors.phone}
                                                    inputMode="numeric"
                                                    pattern="[0-9]*"
                                                    maxLength={15}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.phone}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            <Button type="submit" size="lg" variant="primary"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 shadow-glow">
                                Continuar al pago <ArrowRight size={16} />
                            </Button>
                        </Form>
                    </Col>

                    <Col lg={4}>
                        <div className="position-sticky" style={{ top: 90 }}>
                            <Card className="border">
                                <Card.Body className="p-4">
                                    <h2 className="fs-6 fw-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                        Tu pedido
                                    </h2>
                                    <div className="d-flex flex-column gap-3" style={{ maxHeight: 280, overflowY: "auto" }}>
                                        {cart.map((product) => (
                                            <div key={product.id} className="d-flex gap-3">
                                                <div className="position-relative flex-shrink-0">
                                                    <img src={product.image} alt={product.name} loading="lazy"
                                                        className="rounded bg-light"
                                                        style={{ width: 56, height: 56, objectFit: "cover" }} />
                                                    <span className="position-absolute rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
                                                        style={{ top: -6, right: -6, width: 20, height: 20, fontSize: 10, fontWeight: 700 }}>
                                                        {product.cantidad}
                                                    </span>
                                                </div>
                                                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                                    <div className="small fw-medium" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                                        {product.name}
                                                    </div>
                                                    <div className="text-secondary" style={{ fontSize: 12 }}>{product.brand}</div>
                                                </div>
                                                <div className="small fw-semibold text-nowrap">
                                                    {formatPrice(product.price * product.cantidad)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <hr />
                                    <div className="small">
                                        <div className="d-flex justify-content-between mb-2"><span className="text-secondary">Subtotal</span><span>{formatPrice(totalPrice)}</span></div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-secondary">Envío</span>
                                            <span>
                                                {shippingCost === 0 ?
                                                    <span className="text-success">Gratis</span> : formatPrice(shippingCost)}
                                            </span>
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
                                    <div className="mt-3 d-flex align-items-center gap-2 text-success small">
                                        <Check size={14} /> 12 cuotas sin interés disponibles
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

export default CheckOut