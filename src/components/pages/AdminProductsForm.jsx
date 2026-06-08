import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Form, Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
// import { PRODUCTS } from "../../data/products";
import { AuthContext } from "../Context/AuthContext/authContext";
import { errorToast, successToast } from "../shared/toast/toast";

function AdminProductsForm() {

    const { token } = useContext(AuthContext)

    const { id } = useParams();
    console.log(id);

    const [isEditing, setIsEditing] = useState(false)
    const [errors, setErrors] = useState({})
    const [product, setProduct] = useState(null)
    const [categories, setCategories] = useState([])

    const navigate = useNavigate()

    const [form, setForm] = useState({
        name: "",
        brand: "",
        slug: "",
        description: "",
        price: 0,
        stock: 0,
        image: "",
        rating: 0,
        categoryId: "",
        subcategory: "",
        features: "",
        isFeatured: false,
        isNew: false
    });

    useEffect(() => {
        if (!product) return;
        setIsEditing(true)
        console.log("producto recibido:", product);
        console.log("features:", product.features);
        setForm({
            name: product.name,
            brand: product.brand,
            slug: product.slug,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: product.image,
            categoryId: product.categoryId,
            subcategory: product.subcategory,
            features: product.features?.join("\n") || "",
            isFeatured: product.isFeatured,
            isNew: product.isNew
        });
    }, [product])


    useEffect(() => {
        if (!id) return;
        const res = fetch(`http://localhost:3000/product/${id}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            }
        })
            .then(res => res.json())
            .then((data) => {
                console.log("producto del backend", data);

                setProduct(data)

            })
            .catch(error => console.log(error))
    }, [id])


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
        if (form.features.trim() === "") {
            newErrors.features = "Las características no pueden estar vacías";
        }
        if (form.price < 0) {
            newErrors.price = "El precio debe ser mayor  0";
        }

        if (form.stock < 0) {
            newErrors.stock = "El stock no puede ser negativo";
        }

        if (form.image.trim() === "") {
            newErrors.image = "La imagen es obligatoria";
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = (event) => {

        event.preventDefault();

        const isValid = validateErrors();

        if (!isValid) {
            errorToast("Hay errores en el formulario")
            return;
        }
        // Generamos un slug simple a partir del nombre antes de enviar
        const slugFormateado = form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');


        const datosParaEnviar = {
            ...form,
            slug: slugFormateado,
            // Convertimos features de Texto a un Array separando por cada enter (\n)
            features: form.features.split("\n").filter(f => f.trim() !== ""),
            categoryId: Number(form.categoryId),
            stock: Number(form.stock)
        };

        if (isEditing) {
            handleUpdate(datosParaEnviar);
        } else {
            handleCreate(datosParaEnviar);
        }
        console.log(form);
        console.log("Aca veo el stock que viaja al be", datosParaEnviar.stock);


    }

    const handleCreate = (datosParaEnviar) => {
        console.log("Aca veo el stock que viaja al be", datosParaEnviar.stock);

        fetch("http://localhost:3000/create", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify(datosParaEnviar)
        })
            .then(res => {
                if (!res.ok) {
                    // Si el backend responde con error (400, 500, etc) disparamos el catch
                    throw new Error("Error al procesar la petición en el servidor");
                }
                return res.json();
            })
            .then((data) => {

                // o solo el ID (si era totalmente nuevo). Controlamos ambos casos:

                setProducts(prevProducts => {
                    if (typeof data === "object" && data !== null) {
                        // Caso backend 200 (actualizó stock y devolvió el objeto producto completo)
                        // Reemplazamos el viejo o simplemente actualizamos la lista
                        return [data, ...prevProducts.filter(p => p.id !== data.id)];
                    } else {
                        // Caso backend 201 (devolvió solo el ID numérico)
                        const nuevoProductoConId = {
                            ...datosParaEnviar,
                            id: data // data es el ID enviado por el backend
                        };
                        return [nuevoProductoConId, ...prevProducts];
                    }
                });


                successToast(data.message);
                navigate("/admin/products", { replace: true });
            })
            .catch((error) => {
                console.log(error.message);

                errorToast(error.message)
            })
    }

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
            .catch((error) => {
                console.log(error)
                errorToast(error.message);
            })
    }, [])

const handleUpdate = (datosParaEnviar) => {

    fetch(`http://localhost:3000/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(datosParaEnviar)
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Error al actualizar el producto");
            }
            return res.json();
        })
        .then(data => {

            successToast(data.message);

            navigate("/admin/products", {
                replace: true
            });

        })
        .catch(error => {
            console.log(error);
            errorToast(error.message);
        });
};

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
                                            name="features"
                                            onChange={handleFormChange}
                                            placeholder={"Ej: Bluetooth 5.3\nBatería 30h\nIPX5"}
                                            isInvalid={!!errors.price}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {errors.features}
                                        </Form.Control.Feedback>
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
                                        name="categoryId"
                                        value={form.categoryId}
                                        onChange={handleFormChange}
                                    >
                                        <option value="all">Todas las categorías</option>
                                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </Form.Select>

                                </Form.Group>

                                <Form.Group>

                                    <Form.Label>Subcategoría</Form.Label>

                                    <Form.Select
                                        name="subcategory"
                                        value={form.subcategory}
                                        onChange={handleFormChange}
                                    >
                                        <option value="all">Todas las categorias</option>
                                        <option value="mouses">Mouses</option>
                                        <option value="teclados">Teclados</option>
                                        <option value="monitores">Monitores</option>
                                        <option value="auriculares">Auriculares</option>
                                        <option value="auriculares-gaming">Auriculares Gaming</option>
                                        <option value="laptops">Laptops</option>
                                        <option value="webcams">Webcams</option>
                                        <option value="microfonos">Microfonos</option>
                                        <option value="almacenamiento">Almacenamiento</option>
                                        <option value="wearables">Wearables</option>
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
                                    src={form.image}
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