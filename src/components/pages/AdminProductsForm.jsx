import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PRODUCTS } from "../../data/products";

function AdminProductsForm() {

    const { id } = useParams();
    console.log(id);

    const [isEditing,setIsEditing] = useState(false)

    const [form, setForm] = useState({
        name: "",
        brand: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "",
        subcategory: "",
        features: "",
        isFeatured: false,
        isNew: false
    });

    useEffect(() => {
        if (id) {

            const productFound = PRODUCTS.find((p) => p.id === Number(id))

            
            if (productFound) {
                setIsEditing(true)
                setForm({
                    name: productFound.name,
                    brand: productFound.brand,
                    description: productFound.description,
                    price: productFound.price,
                    stock: productFound.stock,
                    image: productFound.image,
                    category: productFound.category,
                    subcategory: productFound.subcategory,

                    // array => string
                    features: productFound.features.join("\n"),

                    isFeatured: productFound.isFeatured,
                    isNew: productFound.isNew
                });

                
            }
        }
        
    },[id])



    const [errors, setErrors] = useState({})


    const handleFormChange = (event) => {

        //hago destructuring con los atributos del input para que sean variables
        const { name, value, type, checked } = event.target
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value //esto hace que sea dinamico , si name : brand y value: logitech , queda brand:logitech
            //tambien hace que si el type es checkbox usa checked (para los switches) si no usa value 

        })

    }


    const validateErrors = () => {

        const newErrors = {}
        if (form.name.trim() === "") {
            newErrors.name = "El nombre no puede estar vacio"
        }
        if (form.brand.trim() === "") {
            newErrors.brand = "La marca es obligatoria";
        }
        if (form.description.trim() === "") {
            newErrors.description = "La descripción es obligatoria";
        }
        if (form.price <= 0) {
            newErrors.price = "El precio debe ser mayor a 0";
        }

        if (form.stock < 0) {
            newErrors.stock = "El stock no puede ser negativo";
        }

        if (form.image.trim() === "") {
            newErrors.image = "La imagen es obligatoria";
        }

        setErrors(newErrors)
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const isValid = validateErrors();

        if (!isValid) {
            toast.error("Hay errores en el formulario")
            return;
        }

        console.log(form);

        toast.success("Producto creado")
    }
    return (
        <div>

            {/* VOLVER */}
            <Link
                to="/admin/products"
                className="text-secondary text-decoration-none small d-inline-flex align-items-center gap-1 mb-2"
            >
                <ArrowLeft size={14} />
                Volver
            </Link>

            {/* TITULO */}
            <h2
                className="h4 fw-bold mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                Nuevo producto
            </h2>

            <Form
                onSubmit={handleSubmit}
            >

                <Row className="g-3">

                    {/* IZQUIERDA */}
                    <Col lg={8}>

                        <Card className="border mb-3">
                            <Card.Body>

                                <Row className="g-3">

                                    {/* NOMBRE */}
                                    <Col xs={12}>
                                        <Form.Label>Nombre</Form.Label>

                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleFormChange}
                                            isInvalid={!!errors.name}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.name}
                                        </Form.Control.Feedback>
                                    </Col>

                                    {/* MARCA */}
                                    <Col sm={6}>
                                        <Form.Label>Marca</Form.Label>

                                        <Form.Control
                                            name="brand"
                                            value={form.brand}
                                            onChange={handleFormChange}
                                            isInvalid={!!errors.brand}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.brand}
                                        </Form.Control.Feedback>
                                    </Col>

                                    {/* IMAGEN */}
                                    <Col sm={6}>
                                        <Form.Label>URL imagen</Form.Label>

                                        <Form.Control
                                            name="image"
                                            value={form.image}
                                            onChange={handleFormChange}
                                            isInvalid={!!errors.image}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.image}
                                        </Form.Control.Feedback>
                                    </Col>

                                    {/* DESCRIPCION */}
                                    <Col xs={12}>
                                        <Form.Label>Descripción</Form.Label>

                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            name="description"
                                            value={form.description}
                                            onChange={handleFormChange}
                                            isInvalid={!!errors.description}
                                        />

                                        <Form.Control.Feedback type="invalid">
                                            {errors.description}
                                        </Form.Control.Feedback>
                                    </Col>
                                    {/* CARACTERISTICAS */}
                                    <Col xs={12}>
                                        <Form.Label>Características (una por línea)</Form.Label>
                                        <Form.Control as="textarea" rows={4}
                                            value={form.features}
                                            onChange={handleFormChange}
                                            placeholder={"Ej: Bluetooth 5.3\nBatería 30h\nIPX5"} />
                                    </Col>

                                </Row>

                            </Card.Body>
                        </Card>

                    </Col>

                    {/* DERECHA */}
                    <Col lg={4}>

                        {/* PRECIO */}
                        <Card className="border mb-3">
                            <Card.Body>

                                <h3 className="h6 fw-bold mb-3">
                                    Precio y stock
                                </h3>

                                <Form.Group className="mb-2">

                                    <Form.Label>Precio</Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleFormChange}
                                        isInvalid={!!errors.price}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.price}
                                    </Form.Control.Feedback>

                                </Form.Group>

                                <Form.Group>

                                    <Form.Label>Stock</Form.Label>

                                    <Form.Control
                                        type="number"
                                        name="stock"
                                        value={form.stock}
                                        onChange={handleFormChange}
                                        isInvalid={!!errors.stock}
                                    />

                                    <Form.Control.Feedback type="invalid">
                                        {errors.stock}
                                    </Form.Control.Feedback>

                                </Form.Group>

                            </Card.Body>
                        </Card>

                        {/* CATEGORIAS */}
                        <Card className="border mb-3">
                            <Card.Body>

                                <h3 className="h6 fw-bold mb-3">
                                    Categoría
                                </h3>

                                <Form.Group className="mb-2">

                                    <Form.Label>Categoría</Form.Label>

                                    <Form.Select
                                        name="category"
                                        value={form.category}
                                        onChange={handleFormChange}
                                    >
                                        <option value="perifericos">Periféricos</option>
                                        <option value="audio">Audio</option>
                                        <option value="monitores">Monitores</option>
                                    </Form.Select>

                                </Form.Group>

                                <Form.Group>

                                    <Form.Label>Subcategoría</Form.Label>

                                    <Form.Select
                                        name="subcategory"
                                        value={form.subcategory}
                                        onChange={handleFormChange}
                                    >
                                        <option value="mouses">Mouses</option>
                                        <option value="teclados">Teclados</option>
                                    </Form.Select>

                                </Form.Group>

                            </Card.Body>
                        </Card>

                        {/* SWITCHES */}
                        <Card className="border mb-3">
                            <Card.Body>

                                <h3 className="h6 fw-bold mb-3">
                                    Visibilidad
                                </h3>

                                <Form.Check
                                    type="switch"
                                    label="Destacado"
                                    name="isFeatured"
                                    checked={form.isFeatured}
                                    onChange={handleFormChange}
                                />

                                <Form.Check
                                    type="switch"
                                    label="Nuevo"
                                    name="isNew"
                                    checked={form.isNew}
                                    onChange={handleFormChange}
                                />

                            </Card.Body>
                        </Card>

                        {/* PREVIEW */}
                        <Card className="border">
                            <Card.Body>

                                <h3 className="h6 fw-bold mb-2">
                                    Vista previa
                                </h3>

                                <img
                                    src={form.image || "/placeholder.svg"}
                                    alt="preview"
                                    className="rounded w-100 bg-light"
                                    style={{
                                        aspectRatio: "1/1",
                                        objectFit: "cover"
                                    }}
                                />

                            </Card.Body>
                        </Card>

                    </Col>

                </Row>

                {/* BOTONES */}
                <div className="d-flex gap-2 justify-content-end mt-3">

                    <Button
                        as={Link}
                        to="/admin/products"
                        variant="outline-secondary"
                    >
                        Cancelar
                    </Button>

                    <Button
                        type="submit"
                        variant="primary"
                    >
                        {isEditing == true ? "editar producto" : "crear producto"}
                    </Button>

                </div>

            </Form>
        </div>
    )
}

export default AdminProductsForm