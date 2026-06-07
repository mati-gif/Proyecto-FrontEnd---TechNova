import React, { useContext, useEffect, useState } from "react";
import { Card, Table, Button, Badge, Modal, Form } from "react-bootstrap";
import { Trash2, KeyRound, Shield } from "lucide-react";
import { z } from "zod";
import { AuthContext } from "../Context/AuthContext/authContext";
import DeleteModal from "../shared/deleteModal/DeleteModal";
import ChangePasswordModal from "../shared/changePasswordModal/ChangePasswordModal";
import { successToast, errorToast } from "../shared/toast/toast";
function AdminUsers() {

    const { token, user } = useContext(AuthContext)
    const [users, setUsers] = useState([])


    // Estados para el Modal de eliminación
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    //estados del modal de cambiar la contraseña
    const [userToChangePassword, setUserToChangePassword] = useState(null)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [newPw, setNewPw] = useState("");
    const [pwError, setPwError] = useState("");



    const handleRoleChange = async (userToUpdate, newRoleName) => {

        try {
            const response = await fetch(`http://localhost:3000/change/role/${userToUpdate.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ roleName: newRoleName })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar el rol");
            }

            // 2. Si todo sale bien, actualizamos el estado local de los usuarios
            // Esto hace que el cambio sea instantáneo en la UI
            setUsers((prevUsers) =>
                prevUsers.map((u) =>
                    u.id === userToUpdate.id
                        ? { ...u, role: { ...u.role, name: newRoleName } }
                        : u
                )
            );

            successToast("Rol actualizado exitosamente");

        } catch (error) {
            console.error("Error al cambiar rol:", error);
            errorToast(error.message);

        }
    };


    const roleVariant = (r) =>
        r === "superadmin" ? "warning" : r === "admin" ? "info" : "secondary";


    //obtengo todos los usuarios activos 
    useEffect(() => {
        const res = fetch("http://localhost:3000/user/all", {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${token}`
            }

        })
            .then(res => res.json())
            .then((data) => {
                setUsers([...data])
            })
            .catch((error) => {
                errorToast(error.message);
                console.log(error)
            })
    }, [])

    console.log(users);

    // Funciones para manejar el modal de eliminacion
    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setUserToDelete(null);
    };

    //funciones para manejar el modal de cambiar la contraseña
    const handleOpenPasswordModal = (user) => {
        setUserToChangePassword(user)
        setShowPasswordModal(true)

    }

    const handleHidePasswordModal = () => {
        setUserToChangePassword(null)
        setShowPasswordModal(false)
        setNewPw(""); // Limpiamos el input al cerrar
        setPwError("");
    }

    const changePassword = (event) => {

        setNewPw(event.target.value)
        setPwError("");
    }

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
            const data = await response.json();
            // Filtrar el estado actual 
            setUsers((prevUsers) => prevUsers.filter(u => u.id !== userToDelete.id));

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


    const handleChangePassword = async (event) => {

        event.preventDefault()
        if (!newPw) {
            setPwError("La contraseña no puede estar vacía");
            return;
        }

        if (newPw.length < 7) {
            setPwError("La contraseña debe tener un mínimo de 7 caracteres");
            return;
        }



        try {
            const response = await fetch(`http://localhost:3000/change/password/${userToChangePassword.id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ newPw })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al actualizar la contraseña");
            }

            const data = await response.json();

            successToast(data.message || "Contraseña actualizada exitosamente");
            handleHidePasswordModal(); // Cierra el modal y limpia los estados

        } catch (error) {
            console.error("Error cambiando contraseña:", error);
            setPwError(error.message);
            errorToast(error.message); // También lo muestra en el toast
        }


    };


    console.log("Nueva contraseña: ", newPw);

    return (
        <div>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <h2 className="h4 fw-bold mb-0" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Usuarios <span className="text-secondary fs-6 fw-normal">({users.length})</span>
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
                                                style={{ width: 32, height: 32, fontSize: 13, background: 'linear-gradient(135deg, #2b56f5, #5b8bff)' }}>
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
                                            onClick={() => handleOpenPasswordModal(u)}>
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
            <ChangePasswordModal
                show={showPasswordModal}
                onHide={handleHidePasswordModal}
                user={userToChangePassword}
                changePassword={changePassword}
                newPass={newPw}
                error={pwError}
                onSubmit={handleChangePassword}

            />



        </div>
    )
}

export default AdminUsers