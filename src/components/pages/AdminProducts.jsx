import React, { useEffect, useMemo, useState, useContext } from 'react'
import { Link } from "react-router-dom";
import { Card, Button, Form, Table, Modal, Badge } from "react-bootstrap";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { formatPrice } from '../utils/formatPrice';
// import { CATEGORIES } from "../../data/categories"
import { AuthContext } from '../Context/AuthContext/authContext';
import { errorToast, successToast } from '../shared/toast/toast';
import DeleteProductModal from '../shared/DeleteProductModal/DeleteProductModal';

function AdminProducts() {


    const { token } = useContext(AuthContext)
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])

    // Estados para el Modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

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
            .catch((error) => {
                console.log(error)
                errorToast(error.message);
            })
    }, [])

    // Funciones para manejar el modal de eliminacion
    const handleOpenDeleteModal = (product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

    console.log(products);

    console.log("Producto a eliminar ", productToDelete);

    const handleDelete = async () => {
        if (!productToDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/delete/${productToDelete.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            // 1. Validar si la respuesta es exitosa
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al eliminar el usuario");
            }
            const data = await response.json();
            // Filtrar el estado actual 
            setProducts((prevProducts) => prevProducts.filter(p => p.id !== productToDelete.id));

            console.log("Usuario eliminado exitosamente");
            successToast(data.message || "Usuario eliminado exitosamente");

        } catch (error) {
            console.error("Error al eliminar:", error);
            errorToast(error.message);
        } finally {
            // Siempre cerramos el modal, pase lo que pase
            handleCloseDeleteModal();
        }
    };




    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <h2 className="h4 fw-bold mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Productos <span className="text-secondary fs-6 fw-normal">({products.length})</span>
                </h2>
                <Link to="/admin/products/new" className="btn btn-primary ms-auto d-inline-flex align-items-center gap-1">
                    <Plus size={16} /> Nuevo producto
                </Link>
            </div>

            <Card className="border mb-3">
                <Card.Body className="d-flex flex-wrap gap-2 align-items-center">
                    <div className="tn-search-wrap flex-grow-1" style={{ maxWidth: 360, position: "relative" }}>
                        <Search size={16}
                            style={{
                                position: 'absolute',
                                left: '0.75rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#5b6478',
                                pointerEvents: 'none',
                                zIndex: 5 // Para asegurar que quede arriba
                            }}
                        />
                        <Form.Control placeholder="Buscar por nombre o marca..."
                            // value={query} onChange={(e) => setQuery(e.target.value)}
                            style={{
                                paddingLeft: '2.4rem',
                                background: 'rgba(15, 23, 42, 0.04)',
                                borderColor: 'transparent'
                            }}
                        />
                    </div>
                    <Form.Select style={{ maxWidth: 220 }}>
                        <option value="all">Todas las categorías</option>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </Form.Select>
                </Card.Body>
            </Card>

            <Card className="border">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th className="text-end">Precio</th>
                            <th className="text-center">Stock</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 && (
                            <tr><td colSpan={5} className="text-center text-secondary py-4">Sin resultados</td></tr>
                        )}
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-2">
                                        <img src={p.image} alt={p.name} className="rounded bg-light"
                                            style={{ width: 44, height: 44, objectFit: "cover" }} />
                                        <div>
                                            <div className="fw-semibold small">{p.name}</div>
                                            <div className="text-secondary" style={{ fontSize: 11 }}>{p.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td><Badge bg="light" text="dark" className="text-capitalize">{p.subcategory}</Badge></td>
                                <td className="text-end fw-semibold">{formatPrice(p.price)}</td>
                                <td className="text-center">
                                    <span className={`fw-semibold ${p.stock === 0 ? "text-danger" : p.stock <= 5 ? "text-warning" : ""}`}>
                                        {p.stock}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <Link to={`/admin/products/${p.id}/edit`} className="btn btn-sm btn-outline-secondary me-1">
                                        <Pencil size={14} />
                                    </Link>
                                    <Button variant="outline-danger" size="sm"
                                        onClick={() => handleOpenDeleteModal(p)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            <DeleteProductModal
                onHide={handleCloseDeleteModal}
                show={showDeleteModal}
                product={productToDelete}
                onDelete={handleDelete}
            />
        </div>
    )
}

export default AdminProducts