import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, Badge, Modal, Form } from "react-bootstrap";
import { Trash2, KeyRound, Shield } from "lucide-react";
import { z } from "zod";
import { AuthContext } from "../Context/AuthContext/authContext";


function AdminUsers() {


    const [refreshKey, setRefreshKey] = useState(0);
    const {token,user} = useContext(AuthContext)
    const [users,setUsers] = useState([])

    console.log("usuario logueado",user);
    


    const [toDelete, setToDelete] = useState(null);
    const [pwTarget, setPwTarget] = useState(null);
    const [newPw, setNewPw] = useState("");
    const [pwError, setPwError] = useState("");

    const refresh = () => setRefreshKey((k) => k + 1);
    void refreshKey;

    const handleDelete = () => {
        if (!toDelete) return;
        if (deleteUser(toDelete.id)) refresh();
        setToDelete(null);
    };

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
                                            onClick={() => setToDelete(u)}>
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
            <Modal show={!!toDelete} onHide={() => setToDelete(null)} centered>
                <Modal.Header closeButton><Modal.Title>Eliminar usuario</Modal.Title></Modal.Header>
                <Modal.Body>
                    ¿Eliminar a <strong>{toDelete?.name}</strong> ({toDelete?.email})? Sus pedidos quedarán sin propietario.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setToDelete(null)}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

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