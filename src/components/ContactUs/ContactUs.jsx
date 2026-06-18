import React, { useEffect, useRef, useState } from "react";
import {
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { User, Mail, MessageSquare, Send } from "lucide-react";
import { initialContactUsFormErrors } from "./ContactUs.data";

function ContactUs({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState(initialContactUsFormErrors);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (!toast.show) return;
    const timeout = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 5000);
    return () => clearTimeout(timeout);
  }, [toast.show]);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForm = async (event) => {
    event.preventDefault();
    setToast((prev) => ({ ...prev, show: false }));

    if (name === "") {
      nameInputRef.current.focus();
      setErrors((prev) => ({
        ...prev,
        name: true,
        nameErrorDescription: "El nombre no puede estar vacío",
      }));
      return;
    }

    if (email === "") {
      emailInputRef.current.focus();
      setErrors((prev) => ({
        ...prev,
        email: true,
        emailErrorDescription: "El email es requerido",
      }));
      return;
    }

    if (!validateEmail(email)) {
      emailInputRef.current.focus();
      setErrors((prev) => ({
        ...prev,
        email: true,
        emailErrorDescription: "Formato de email inválido",
      }));
      return;
    }

    if (message === "") {
      messageInputRef.current.focus();
      setErrors((prev) => ({
        ...prev,
        message: true,
        messageErrorDescription: "El mensaje es requerido",
      }));
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: name,
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al enviar el mensaje");
      }

      await response.json();

      setName("");
      setEmail("");
      setMessage("");
      setErrors(initialContactUsFormErrors);

      setToast({
        show: true,
        message: "Mensaje enviado con éxito!",
        variant: "success",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setToast({
        show: true,
        message: "No se pudo enviar su mensaje, intente nuevamente.",
        variant: "danger",
      });
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card
            className="border-0 shadow mt-2 p-3"
            style={{ borderRadius: "16px" }}
          >
            <Card.Body>
              <div className="mb-4">
                <h2 className="fw-bold text-dark mb-1">
                  Formulario de Contacto
                </h2>
                <p className="text-secondary small">
                  Envianos tu consulta y nos pondremos en contacto a la
                  brevedad.
                </p>
              </div>

              <Form onSubmit={handleForm}>
                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2 fw-semibold small">
                    <User size={16} className="text-primary" /> NOMBRE Y
                    APELLIDO
                  </Form.Label>
                  <Form.Control
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name)
                        setErrors((prev) => ({ ...prev, name: false }));
                    }}
                    isInvalid={!!errors.name}
                    placeholder="Ingrese su nombre y apellido completos"
                    className="bg-light border-0 py-2 px-3"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nameErrorDescription}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="d-flex align-items-center gap-2 fw-semibold small">
                    <Mail size={16} className="text-primary" /> EMAIL
                  </Form.Label>
                  <Form.Control
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors((prev) => ({ ...prev, email: false }));
                    }}
                    isInvalid={!!errors.email}
                    placeholder="Ingrese su correo electrónico"
                    className="bg-light border-0 py-2 px-3"
                    style={{ borderRadius: "8px" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.emailErrorDescription}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center gap-2 fw-semibold small">
                    <MessageSquare size={16} className="text-primary" /> TU
                    MENSAJE
                  </Form.Label>
                  <Form.Control
                    ref={messageInputRef}
                    as="textarea"
                    rows={4}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message)
                        setErrors((prev) => ({ ...prev, message: false }));
                    }}
                    isInvalid={!!errors.message}
                    placeholder="¿En qué podemos ayudarte?"
                    className="bg-light border-0 py-2 px-3"
                    style={{ borderRadius: "8px", resize: "none" }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.messageErrorDescription}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-60 fw-bold d-flex mx-auto align-items-center justify-content-center gap-2 shadow-sm"
                  style={{ borderRadius: "10px", transition: "0.3s" }}
                >
                  <Send size={18} /> Enviar Mensaje
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="bottom-center" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
          show={toast.show}
          autohide
          delay={5000}
          className="border-0"
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default ContactUs;
