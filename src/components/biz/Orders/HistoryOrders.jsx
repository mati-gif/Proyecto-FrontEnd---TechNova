import React,{useContext} from 'react'
import { Link } from "react-router-dom";
import { Container, Card, Badge, Button, Accordion } from "react-bootstrap";
import { Package, ShoppingBag, MapPin, CreditCard } from "lucide-react";
import { formatPrice } from "../../utils/formatPrice";
import { cartContext } from '../../Context/CartContext/cartContext';
function HistoryOrders() {

  const orders = [{
    id:1,
    status:"entregado",
    items:[
      {
        productId:2,
        imagen:"",
        name:"Monitor",
        price:500,
        quantity:2,
        fullname:"Melba morel",
        email:"m.morel@email.com",
        street:"rosario",
        city:"rosario",
        state:"Santa fe ",
        phone:"123456",
        brand:"string",
        total:12000,
        paymentLast4:"456789"


      }
    ]
  }]

  const {cart,totalPrice} = useContext(cartContext)

  console.log(totalPrice);
  
  return (
    <Container className="py-4 py-lg-5" style={{ maxWidth: 960 }}>
      <h1 className="fw-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Mis pedidos
      </h1>
      <p className="text-secondary mb-4">Historial de tus compras en TechNova</p>

      {cart.length === 0 ? (
        <Card className="border text-center p-5">
          <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mx-auto mb-3"
            style={{ width: 72, height: 72 }}>
            <ShoppingBag size={32} className="text-secondary" />
          </div>
          <h2 className="h5 fw-bold mb-2">Aún no tenés pedidos</h2>
          <p className="text-secondary mb-3">Cuando completes una compra aparecerá acá.</p>
          <div>
            <Button as={Link} to="/catalogo" variant="primary">Explorar productos</Button>
          </div>
        </Card>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen={false}>
          {orders.map((o, idx) => (
            <Accordion.Item eventKey={String(idx)} key={o.id} className="mb-2">
              <Accordion.Header>
                <div className="d-flex flex-wrap align-items-center gap-3 w-100 pe-3">
                  <span className="tn-step-icon"><Package size={16} /></span>
                  <div className="me-auto">
                    <div className="fw-semibold font-monospace">{o.id}</div>
                    <div className="text-secondary small">
                      {new Date(o.createdAt).toLocaleString("es-AR")}
                    </div>
                  </div>
                  <Badge bg={o.status === "entregado" ? "success" : o.status === "enviado" ? "info" : "primary"}
                    className="text-uppercase">{o.status}</Badge>
                  <span className="fw-bold fs-5">{formatPrice(totalPrice)}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <div className="d-flex flex-column gap-3 mb-3">
                  {cart.map((it) => (
                    <div key={it.id} className="d-flex gap-3 align-items-center">
                      <img src={it.image} alt={it.name} className="rounded bg-light"
                        style={{ width: 64, height: 64, objectFit: "cover" }} />
                      <div className="flex-grow-1">
                        <div className="text-uppercase text-secondary" style={{ fontSize: 11 }}>{it.brand}</div>
                        <div className="fw-semibold">{it.name}</div>
                        <div className="text-secondary small">x{it.cantidad} · {formatPrice(it.price)} c/u</div>
                      </div>
                      <div className="fw-bold">{formatPrice(it.price * it.cantidad)}</div>
                    </div>
                  ))}
                </div>
                <hr />
                <div className="row g-3 small">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2 fw-semibold"><MapPin size={14} /> Envío</div>
                    <div className="text-secondary">
                      {o.fullName}<br />
                      {o.street}<br />
                      {o.city}, {o.state} ({o.zip})<br />
                      Tel: {o.phone}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex align-items-center gap-2 mb-2 fw-semibold"><CreditCard size={14} /> Pago</div>
                    <div className="text-secondary">Tarjeta terminada en •••• {o.paymentLast4}</div>
                    <hr />
                    <div className="d-flex justify-content-between"><span className="text-secondary">Subtotal</span><span>{formatPrice(o.subtotal)}</span></div>
                    <div className="d-flex justify-content-between"><span className="text-secondary">IVA</span><span>{formatPrice(o.tax)}</span></div>
                    <div className="d-flex justify-content-between"><span className="text-secondary">Envío</span><span>{o.shipping === 0 ? "Gratis" : formatPrice(o.shipping)}</span></div>
                    <div className="d-flex justify-content-between fw-bold mt-1"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  )
}

export default HistoryOrders