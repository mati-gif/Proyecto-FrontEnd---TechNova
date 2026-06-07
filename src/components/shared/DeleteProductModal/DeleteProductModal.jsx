import React from 'react'
import { Modal, Button } from "react-bootstrap";
function DeleteProductModal({show,onHide,product,onDelete}) {
    return (
        <Modal centered show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Seguro que querés eliminar <strong>{product?.name}</strong>? Esta acción no se puede deshacer.
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide} >Cancelar</Button>
                <Button variant="danger" onClick={onDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteProductModal