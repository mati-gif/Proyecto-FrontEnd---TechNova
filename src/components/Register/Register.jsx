
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Tabs, Tab } from "react-bootstrap";
import { initialRegisterFormErrors } from "./Register.data"
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { successToast, errorToast } from "../shared/toast/toast.js";
function Register({ onRegisterSuccess }) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [errors, setErrors] = useState(initialRegisterFormErrors);
    const [showPassword, setShowPassword] = useState(false)

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)
    const nameInputRef = useRef(null)

    const navigate = useNavigate()

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
        setErrors((prevErrors) => ({
            ...prevErrors,
            email: false
        }))
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
        setErrors((prevErrors) => ({
            ...prevErrors,
            password: false
        }))
    }

    const handleNameChange = (event) => {
        setName(event.target.value)
        setErrors((prevErrors) => ({
            ...prevErrors,
            name: false
        }))
    }



    const handleRegister = (event) => {
        event.preventDefault();

        if (email == "") {
            emailInputRef.current.focus()
            setErrors((prevErrors) => ({
                ...prevErrors,
                emailErrorDescription: "El email es requerido",
                email: true
            }))
            return
        }
        if (!validateEmail(email)) {
            emailInputRef.current.focus();
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: true,
                emailErrorDescription: "El email debe tener formato @email.com"
            }))
            return
        }

        if (password === "") {
            passwordInputRef.current.focus();
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordErrorDescription: "La contraseña es requerida",
                password: true
            }))
            return;
        }
        if (password.includes(' ')) {
            passwordInputRef.current.focus();
            setErrors((prevErrors) => ({
                ...prevErrors,
                passwordErrorDescription: "La contraseña no puede contener espacios",
                password: true
            }))
            return;
        }

        if (name == "") {
            nameInputRef.current.focus();
            setErrors((prevErrors) => ({
                ...prevErrors,
                nameErrorDescription: "El nombre no puede estar vacio",
                name: true
            }))
            return
        }

        manageRegister(name, email, password);

        onRegisterSuccess()
    }

    const manageRegister = (name, email, password) => {

        fetch("http://localhost:3000/register", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify({ name, email, password })
        })
            .then(async res => {
                const body = await res.json()
                if (!res.ok) throw body       // body.message esperado
                return body
            })
            .then((res) => {
                setEmail("")
                setPassword("")
                setName("")
                setErrors(initialRegisterFormErrors)
                successToast(res.message)
                // navigate("/login")// cuando se maneje los roles que te direccione a otra pagina 
            })
            .catch((err) => {
                console.log(err)
                errorToast(`Ha ocurrido un error: ${err.message || JSON.stringify(err)}`)
            })
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            {/* REGISTER */}
            <div className="tn-fade-in">
                <h1 className="h4 fw-bold mb-1">
                    Crear cuenta
                </h1>
                <p className="text-secondary small mb-4">
                    Es rápido y gratis
                </p>

                <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Ingrese su nombre completo"
                            isInvalid={!!errors.name}
                            ref={nameInputRef}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name && errors.nameErrorDescription}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="text"
                            value={email}
                            placeholder="johndou@email.com"
                            onChange={handleEmailChange}
                            isInvalid={!!errors.email}
                            ref={emailInputRef}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email && errors.emailErrorDescription}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>Contraseña</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                placeholder="Ingresar contraseña"
                                onChange={handlePasswordChange}
                                ref={passwordInputRef}
                                isInvalid={!!errors.password}//isInvalid = true pone el color rojo del texto es react boostrap
                            />

                            <span
                                onClick={handleShowPassword}
                                style={{
                                    position: "absolute",
                                    right: 10,
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer",
                                    color: "#6c757d"
                                }}
                            >
                                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                            </span>
                        </div>
                        <Form.Control.Feedback type="invalid">
                            {errors.password && errors.passwordErrorDescription}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button type="submit" className="w-100">
                        Crear cuenta
                    </Button>
                </Form>
            </div>

        </>
    )
}

export default Register