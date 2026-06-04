import { Modal, Button,Form } from "react-bootstrap";

import React,{useState} from 'react'
import { Eye, EyeOff } from "lucide-react";

function ChangePasswordModal({show,onHide,user,error,changePassword,newPass,onSubmit}) {

// Estado para manejar si se ve o no la contraseña
    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);    
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton><Modal.Title>Cambiar contraseña</Modal.Title></Modal.Header>
            <Modal.Body>
                <p className="small text-secondary">Usuario: <strong>{user?.email}</strong></p>
                <Form.Group >
                    <Form.Label>Nueva contraseña</Form.Label>
                    <div className="input-group has-validation position-relative">
                        <Form.Control 
                            type={showPassword ? "text" : "password"} 
                            value={newPass}
                            onChange={changePassword}
                            isInvalid={!!error} 
                            placeholder="Mínimo 7 caracteres" 
                            autoFocus 
                            style={{ paddingRight: "45px" }} // Dejamos espacio para el ojo
                        />
                        
                        <span 
                            onClick={handleTogglePassword}
                            style={{
                                position: "absolute",
                                right: error ? 40 : 10, 
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#6c757d",
                                zIndex: 5
                            }}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </span>

                        {/* <Form.Control.Feedback type="invalid">
                            {error}
                        </Form.Control.Feedback> */}
                    </div>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide} >Cancelar</Button>
                <Button variant="primary" onClick={onSubmit}>Actualizar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ChangePasswordModal