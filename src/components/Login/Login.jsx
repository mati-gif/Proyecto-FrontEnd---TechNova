import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Form, Button, Tabs, Tab } from "react-bootstrap";
import { Cpu, Eye, EyeOff } from "lucide-react";
import { initialLoginFormErrors } from "./Login.data"


function Login({ onLogin }) {
    const [tab, setTab] = useState("login");
    const [loginForm, setLoginForm] = useState({ email: "", password: "" });
    const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState(initialLoginFormErrors);
    const [showPassword,setShowPassword] = useState(false)

    const emailInputRef = useRef(null)
    const passwordInputRef = useRef(null)

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

    const handleLogin = (event) => {
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

        setErrors(initialLoginFormErrors)
        onLogin()


    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleShowPassword = () =>{
        setShowPassword(!showPassword)
    }

    return (
        <>
            <div
                className="d-flex align-items-center justify-content-center bg-radial-glow"
                style={{ minHeight: "100vh", padding: "3rem 1rem" }}
            >
                <Container style={{ maxWidth: 460 }}>

                    {/* LOGO */}
                    <Link
                        to="/"
                        className="d-flex align-items-center justify-content-center gap-2 text-decoration-none text-dark mb-4"
                    >
                        <span className="tn-logo-mark">
                            <Cpu size={20} />
                        </span>
                        <span className="fw-bold fs-3">
                            Tech<span className="text-gradient-primary">Nova</span>
                        </span>
                    </Link>

                    {/* CARD */}
                    <div className="bg-white rounded-4 border shadow-sm p-4 p-lg-5">

                        {/* TABS */}
                        <Tabs
                            activeKey={tab}
                            onSelect={(k) => setTab(k)}
                            justify
                            className="mb-4"
                        >

                            {/* LOGIN */}
                            <Tab eventKey="login" title="Ingresar">
                                <div className="tn-fade-in">
                                    <h1 className="h4 fw-bold mb-1">
                                        Bienvenido de vuelta
                                    </h1>
                                    <p className="text-secondary small mb-4">
                                        Ingresá para continuar
                                    </p>

                                    <Form onSubmit={handleLogin} >

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={email}
                                                placeholder="johndou@email.com"
                                                onChange={handleEmailChange}
                                                ref={emailInputRef}
                                                isInvalid={!!errors.email}
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
                                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} /> }
                                                </span>
                                            </div>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password && errors.passwordErrorDescription}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button type="submit" className="w-100">
                                            Iniciar sesión
                                        </Button>
                                    </Form>
                                </div>
                            </Tab>

                            {/* REGISTER */}
                            <Tab eventKey="register" title="Crear cuenta">
                                <div className="tn-fade-in">
                                    <h1 className="h4 fw-bold mb-1">
                                        Crear cuenta
                                    </h1>
                                    <p className="text-secondary small mb-4">
                                        Es rápido y gratis
                                    </p>

                                    <Form
                                    // onSubmit={handleRegister}
                                    >
                                        <Form.Group className="mb-3">
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                value={registerForm.name}
                                                onChange={(e) =>
                                                    setRegisterForm({ ...registerForm, name: e.target.value })
                                                }
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        email: e.target.value,
                                                    })
                                                }
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-4">
                                            <Form.Label>Contraseña</Form.Label>
                                            <Form.Control
                                                type="password"
                                                value={registerForm.password}
                                                onChange={(e) =>
                                                    setRegisterForm({
                                                        ...registerForm,
                                                        password: e.target.value,
                                                    })
                                                }
                                                isInvalid={!!errors.password}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button type="submit" className="w-100">
                                            Crear cuenta
                                        </Button>
                                    </Form>
                                </div>
                            </Tab>

                        </Tabs>
                    </div>

                    {/* TEXTO ABAJO */}
                    <p className="text-center text-secondary mt-4" style={{ fontSize: 12 }}>
                        No tienes cuenta ?  Registrate
                    </p>

                </Container>
            </div>
        </>
    )
}

export default Login