import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Button,
  Accordion,
  Spinner,
} from "react-bootstrap";
import { Package, ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { cartContext } from "../../Context/CartContext/cartContext";
import { AuthContext } from "../../Context/AuthContext/authContext";
function HistoryOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token } = useContext(AuthContext);

  const { cart, totalPrice } = useContext(cartContext);

  useEffect(() => {
    fetch(`http://localhost:3000/order/history/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.log(error);
        errorToast(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner />
      </Container>
    );
  }

  return (
    <Container className="py-4 py-lg-5" style={{ maxWidth: 960 }}>
      <h1
        className="fw-bold mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Mis Pedidos
      </h1>
      <p className="text-secondary mb-4">
        Historial de tus compras en TechNova
      </p>

      {orders.length === 0 ? (
        <Card className="border text-center p-5">
          <div
            className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}
          >
            <ShoppingBag size={32} className="text-secondary" />
          </div>
          <h2 className="h5 fw-bold mb-2">Aún no tenés pedidos</h2>
          <p className="text-secondary mb-3">
            Cuando completes una compra aparecerá acá.
          </p>
          <div>
            <Button as={Link} to="/catalogo" variant="primary">
              Explorar productos
            </Button>
          </div>
        </Card>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen={false}>
          {orders.map((o, idx) => (
            <Accordion.Item eventKey={String(idx)} key={o.id} className="mb-2">
              <Accordion.Header>
                <div className="d-flex flex-wrap align-items-center gap-3 w-100 pe-3">
                  <span className="tn-step-icon">
                    <Package size={16} />
                  </span>
                  <div className="me-auto">
                    <div className="fw-semibold font-monospace">
                      {o.orderCode}
                    </div>
                    <div className="text-secondary small">{o.creationDate}</div>
                  </div>
                  <Badge
                    bg={
                      o.status === "COMPLETADA"
                        ? "success"
                        : o.status === "PENDIENTE"
                          ? "info"
                          : "warning"
                    }
                    className="text-uppercase"
                  >
                    {o.status}
                  </Badge>
                  <span className="fw-bold fs-5">
                    {formatPrice(o.totalPrice)}
                  </span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-flex flex-column gap-3 mb-3">
                  {o.products.map((product) => (
                    <div
                      key={product.id}
                      className="d-flex gap-3 align-items-center"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="rounded bg-light"
                        style={{ width: 64, height: 64, objectFit: "cover" }}
                      />
                      <div className="flex-grow-1">
                        <div
                          className="text-uppercase text-secondary"
                          style={{ fontSize: 11 }}
                        >
                          {product.brand}
                        </div>
                        <div className="fw-semibold">{product.name}</div>
                        <div className="text-secondary small">
                          x{product.orderProduct.quantity} c/u
                        </div>
                      </div>
                      <div className="fw-bold">
                        {formatPrice(product.orderProduct.priceAtPurchase)}
                      </div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="row g-3 small">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2 fw-semibold">
                      <MapPin size={14} /> Envío
                    </div>
                    <div className="text-secondary">
                      {o.shippingAddress?.fullName}
                      <br />
                      {o.shippingAddress?.address}
                      <br />
                      {o.shippingAddress?.city}, {o.shippingAddress?.province} (
                      {o.shippingAddress?.zipCode})<br />
                      Tel: {o.shippingAddress?.phone}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2 fw-semibold">
                      <CreditCard size={14} /> Pago
                    </div>
                    <div className="text-secondary">
                      Tarjeta terminada en •••• {o.lastFourDigits}
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Subtotal</span>
                      <span>{formatPrice(o.subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-secondary">Envío</span>
                      <span>
                        {o.shippingCost === 0
                          ? "Gratis"
                          : formatPrice(o.shippingCost)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold mt-1">
                      <span>Total</span>
                      <span>{formatPrice(o.totalPrice)}</span>
                    </div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
}

export default HistoryOrders;
