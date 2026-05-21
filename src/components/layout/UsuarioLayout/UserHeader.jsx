import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Form, Button, Dropdown, Offcanvas } from "react-bootstrap";
import { Cpu, Search, ShoppingCart, User, LogOut, Package, ShieldCheck } from "lucide-react";
import { cartContext } from '../../Context/CartContext/cartContext';
import { AuthContext } from "../../Context/AuthContext/authContext";
import { CATEGORIES } from "../../../data/categories";
import { errorToast, successToast } from "../../shared/toast/toast";

function UserHeader() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [showMobile, setShowMobile] = useState(false);


  //carrito real
  const { cart, totalQuantity } = useContext(cartContext)

  const {handleUserLogout} = useContext(AuthContext)
  

  console.log(cart);
  console.log(totalQuantity);


  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/catalog?q=${search}`);
    }
    setSearch("");
  };

  const user = {
    name: "Mati",
    email: "mati@email.com",
    role: "user"

  }

  const handleLogOutUser = () =>{
    handleUserLogout()
    successToast("Saliste de tu cuenta! 👋😊")

  }
  return (
    <header className="tn-header">
      <Container className="d-flex align-items-center" style={{ height: 70 }}>

        {/* LOGO */}
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none text-dark"
        >
          <img
            src="/logo-technova.jpg"
            alt="TechNova"
            style={{ height: "40px", width: "auto", borderRadius: "6px" }}
            className="me-2"
          />

          <span className="fw-bold fs-4">
            Tech<span className="text-primary">Nova</span>
          </span>
        </Link>

        {/* CATEGORÍAS DESKTOP */}
        <Nav className="d-none d-lg-flex ms-4">
          {CATEGORIES.map((cat) => (
            <Nav.Link
              key={cat.id}
              as={Link}
              to={`/catalog?category=${cat.id}`}
              className="text-secondary"
            >
              {cat.name}
            </Nav.Link>
          ))}
        </Nav>

        {/* SEARCH */}
        <Form
          onSubmit={handleSearch}
          className="d-none d-md-flex ms-auto"
          style={{ maxWidth: 300 }}
        >
          <div className="position-relative w-100">
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)"
              }}
            />

            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos"
              style={{ paddingLeft: 30 }}
            />
          </div>
        </Form>

        {/* ACCIONES */}
        <div className="d-flex align-items-center gap-2 ms-auto ms-md-2">
          {/* panel admin */}

          <Dropdown align="end">
            <Dropdown.Toggle
              variant="link"
              className="text-decoration-none text-dark d-flex align-items-center gap-2 border-0 p-1"
            >
              <span
                className="rounded-circle  text-white d-inline-flex align-items-center justify-content-center fw-semibold"
                style={{ width: 30, height: 30, fontSize: 13, background: 'linear-gradient(135deg, #2b56f5, #5b8bff)' }}
              >
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="d-none d-sm-inline small">{user.name.split(" ")[0]}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Header className="text-truncate" style={{ maxWidth: 220 }}>
                {user.email}
              </Dropdown.Header>
              <Dropdown.Divider />
              <Dropdown.Item as={Link} to="/history-orders">
                <Package size={14} className="me-2" /> Mis pedidos
              </Dropdown.Item>
              {(user.role === "admin" || user.role === "superadmin") && (
                <Dropdown.Item as={Link} to="/admin/dashboard">
                  <ShieldCheck size={14} className="me-2" /> Panel admin
                </Dropdown.Item>
              )}
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={handleLogOutUser}>
                <LogOut size={14} className="me-2" />
                Cerrar sesión
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* finaliza panel admin */}
          {/* CARRITO */}
          <Button
            as={Link}
            to="/my-cart"
            variant="outline-secondary"
            className="position-relative d-flex align-items-center gap-1"
          >
            <ShoppingCart size={16} />

            {totalQuantity > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -5,
                  right: -5,
                  background: "#f57b1f",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: 10,
                  padding: "2px 6px"
                }}
              >
                {totalQuantity}
              </span>
            )}
          </Button>

          {/* BOTÓN MOBILE */}
          <Button
            variant="link"
            className="d-lg-none text-dark"
            onClick={() => setShowMobile(true)}
          >
            ☰
          </Button>
        </div>

        {/* MENU MOBILE */}
        <Offcanvas
          show={showMobile}
          onHide={() => setShowMobile(false)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menú</Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>

            <h6 className="mb-3">Categorías</h6>

            <Nav className="flex-column">
              {CATEGORIES.map((cat) => (
                <Nav.Link
                  key={cat.id}
                  as={Link}
                  to={`/catalog?category=${cat.id}`}
                  onClick={() => setShowMobile(false)}
                >
                  {cat.name}
                </Nav.Link>
              ))}
            </Nav>

            <hr />

            <Form onSubmit={handleSearch}>
              <Form.Control
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos"
              />
            </Form>

          </Offcanvas.Body>
        </Offcanvas>

      </Container>
    </header>
  )
}

export default UserHeader