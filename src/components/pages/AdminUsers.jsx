import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, Badge, Modal, Form } from "react-bootstrap";
import { Trash2, KeyRound, Shield } from "lucide-react";
import { z } from "zod";
import { AuthContext } from "../Context/AuthContext/authContext";
import DeleteModal from "../shared/deleteModal/DeleteModal";


function AdminUsers() {


    const [refreshKey, setRefreshKey] = useState(0);
    const {token,user} = useContext(AuthContext)
    const [users,setUsers] = useState([])

    console.log("usuario logueado",user);


    // Estados para el Modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    


    const [toDelete, setToDelete] = useState(null);
    const [pwTarget, setPwTarget] = useState(null);
    const [newPw, setNewPw] = useState("");
    const [pwError, setPwError] = useState("");

    const refresh = () => setRefreshKey((k) => k + 1);
    void refreshKey;



    const handleChangePassword = () => {
        if (!pwTarget) return;
        const parsed = passwordSchema.safeParse(newPw);
        if (!parsed.success) {
            setPwError(parsed.error.issues[0].message);
            return;
        }
        if (changeUserPassword(pwTarget.id, parsed.data)) {
            setPwTarget(null); setNewPw(""); setPwError("");
        }
    };

    const handleRoleChange = (u, role) => {
        if (changeUserRole(u.id, role)) refresh();
    };

    const roleVariant = (r) =>
        r === "superadmin" ? "warning" : r === "admin" ? "info" : "secondary";


    //obtengo todos los usuarios activos 
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

    console.log(users);

    // Funciones para manejar el modal
    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    const handleDelete = async () => {
    if (!userToDelete) return;

    try {
        const response = await fetch(`http://localhost:3000/delete/user/${userToDelete.id}`, {
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

        
        // Filtrar el estado actual 
        setUsers((prevUsers) => prevUsers.filter(u => u.id !== userToDelete.id));
        
        console.log("Usuario eliminado exitosamente");

    } catch (error) {
        console.error("Error al eliminar:", error);
        errorToast(error.message);
    } finally {
        // Siempre cerramos el modal, pase lo que pase
        handleCloseDeleteModal();
    }
};
    console.log("usuario a borrar",userToDelete);
    console.log("estado del modal",showDeleteModal);
    console.log(users);

    
    
    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <h2 className="h4 fw-bold mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Usuarios <span className="text-secondary fs-6 fw-normal">(3)</span>
                </h2>
            </div>

            <Card className="border">
                <Table responsive hover className="mb-0 align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Creado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => {
                            const isSelf = u.id == user?.userId;
                            const isSuper = u.role.name.toLowerCase() === "superadmin";
                            return (
                                <tr key={u.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="rounded-circle bg-gradient-primary text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                                                style={{ width: 32, height: 32, fontSize: 13,background: 'linear-gradient(135deg, #2b56f5, #5b8bff)' }}>
                                                {u.name.charAt(0).toUpperCase()}
                                            </span>
                                            <div>
                                                <div className="fw-semibold small">{u.name} {isSelf && <span className="text-secondary fw-normal">(vos)</span>}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="small">{u.email}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <Badge bg={roleVariant(u.role.name.toLowerCase())} className="text-uppercase">{u.role.name.toLowerCase()}</Badge>
                                            {!isSuper && !isSelf && (
                                                <Form.Select size="sm" style={{ width: 130 }} value={u.role.name.toLowerCase()}
                                                    onChange={(e) => handleRoleChange(u, e.target.value)}>
                                                    <option value="user">user</option>
                                                    <option value="admin">admin</option>
                                                    <option value="superadmin">superadmin</option>
                                                </Form.Select>
                                            )}
                                        </div>
                                    </td>
                                    <td className="text-secondary small">
                                        {u.creationDate.split("T")[0]}
                                    </td>
                                    <td className="text-end">
                                        <Button size="sm" variant="outline-secondary" className="me-1"
                                            onClick={() => { setPwTarget(u); setNewPw(""); setPwError(""); }}>
                                            <KeyRound size={14} className="me-1" /> Contraseña
                                        </Button>
                                        <Button size="sm" variant="outline-danger"
                                            disabled={isSuper || isSelf}
                                            title={isSuper ? "No se puede eliminar superadmin" : isSelf ? "No podés eliminarte" : "Eliminar"}
                                            onClick={() => handleOpenDeleteModal(u)}>
                                            <Trash2 size={14} />
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Card>
            {/* Delete modal */}
            <DeleteModal 
                show={showDeleteModal}
                user={userToDelete}
                onHide={handleCloseDeleteModal}
                onDelete={handleDelete}
                
            />
                

            {/* Password modal */}
            <Modal show={!!pwTarget} onHide={() => setPwTarget(null)} centered>
                <Modal.Header closeButton><Modal.Title>Cambiar contraseña</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p className="small text-secondary">Usuario: <strong>{pwTarget?.email}</strong></p>
                    <Form.Group>
                        <Form.Label>Nueva contraseña</Form.Label>
                        <Form.Control type="password" value={newPw}
                            onChange={(e) => { setNewPw(e.target.value); setPwError(""); }}
                            isInvalid={!!pwError} placeholder="Mínimo 6 caracteres" autoFocus />
                        <Form.Control.Feedback type="invalid">{pwError}</Form.Control.Feedback>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setPwTarget(null)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleChangePassword}>Actualizar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AdminUsers