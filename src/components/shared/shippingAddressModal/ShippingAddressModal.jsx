import React from "react";
import {
  Modal,
  Card,
  Badge,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { Search, Power, PowerOff, Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { errorToast, successToast } from "../toast/toast";

const MAX_ACTIVE = 3;

function ShippingAddressModal({
  showAddresses,
  onHide,
  activeAddresses,
  inactiveAddresses,
  selectedAddress,
  selectedId,
  search,
  onSearchChange,
  filteredInactiveAddresses,
  handleSelect,
  handleDesactivate,
  handleActivate,
  handleConfirmSelection,
  loadingAddresses,
}) {
  return (
    <>
      {/* Modal de direcciones guardadas */}
      <Modal show={showAddresses} onHide={onHide} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title
            className="fw-bold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Direcciones guardadas
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingAddresses ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" />
              <div className="mt-3">Cargando direcciones...</div>
            </div>
          ) : (
            <>
              {/* Sección activas */}
              <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="fs-6 fw-bold mb-0">Direcciones activas</h3>
                  <Badge
                    bg={
                      activeAddresses.length >= MAX_ACTIVE
                        ? "warning"
                        : "secondary"
                    }
                    text={
                      activeAddresses.length >= MAX_ACTIVE ? "dark" : undefined
                    }
                  >
                    {activeAddresses.length} / {MAX_ACTIVE}
                  </Badge>
                </div>
                {activeAddresses.length === 0 ? (
                  <Card className="border-dashed text-center py-4">
                    <Card.Body>
                      <p className="text-secondary small mb-0">
                        No tenés direcciones activas. Activá una desde la lista
                        de abajo.
                      </p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {activeAddresses.map((a) => {
                      const isSelected = selectedId === a.id;
                      return (
                        <Card
                          key={a.id}
                          className={`border ${isSelected ? "border-primary border-2" : ""}`}
                          style={{ cursor: "pointer", transition: "all .15s" }}
                          onClick={() => handleSelect(a)}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-start gap-3">
                              <Form.Check
                                type="radio"
                                name="active-addr"
                                checked={isSelected}
                                onChange={() => handleSelect(a)}
                                onClick={(e) => e.stopPropagation()}
                                className="mt-1"
                              />
                              <div
                                className="flex-grow-1"
                                style={{ minWidth: 0 }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                  <span className="fw-bold">{a.id}</span>
                                  <Badge
                                    bg="success"
                                    pill
                                    className="d-inline-flex align-items-center gap-1"
                                  >
                                    <Check size={12} /> Activa
                                  </Badge>
                                </div>
                                <div className="small">{a.fullName}</div>
                                <div className="small text-secondary">
                                  {a.address}
                                </div>
                                <div className="small text-secondary">
                                  {a.city}, {a.province} — CP {a.zipCode}
                                </div>
                                <div className="small text-secondary">
                                  Tel: {a.phone}
                                </div>
                              </div>
                              <div className="d-flex flex-column gap-2">
                                <Button
                                  size="sm"
                                  variant={
                                    isSelected ? "primary" : "outline-primary"
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelect(a);
                                  }}
                                >
                                  {isSelected ? "Seleccionada" : "Seleccionar"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDesactivate(a.id);
                                  }}
                                  className="d-flex align-items-center justify-content-center gap-1"
                                >
                                  <PowerOff size={14} /> Desactivar
                                </Button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              <hr />

              {/* Sección guardadas (inactivas) */}
              <div>
                <h3 className="fs-6 fw-bold mb-3">Direcciones guardadas</h3>
                <InputGroup className="mb-3">
                  <InputGroup.Text>
                    <Search size={16} />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Buscar dirección por nombre, calle, ciudad o provincia..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                  />
                </InputGroup>

                {filteredInactiveAddresses.length === 0 ? (
                  <Card className="border-dashed text-center py-4">
                    <Card.Body>
                      <p className="text-secondary small mb-0">
                        {inactiveAddresses.length === 0
                          ? "No hay direcciones guardadas."
                          : "No se encontraron direcciones que coincidan con la búsqueda."}
                      </p>
                    </Card.Body>
                  </Card>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {filteredInactiveAddresses.map((a) => {
                      const limitReached = activeAddresses.length >= MAX_ACTIVE;
                      return (
                        <Card
                          key={a.id}
                          className="border"
                          style={{
                            opacity: 0.7,
                            background: "var(--bs-light, #f8f9fa)",
                          }}
                        >
                          <Card.Body className="p-3">
                            <div className="d-flex align-items-start gap-3">
                              <div
                                className="flex-grow-1"
                                style={{ minWidth: 0 }}
                              >
                                <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                                  <span className="fw-bold text-secondary">
                                    ○ {a.id}
                                  </span>
                                  <Badge bg="secondary" pill>
                                    Inactiva
                                  </Badge>
                                </div>
                                <div className="small text-secondary">
                                  {a.fullName}
                                </div>
                                <div className="small text-secondary">
                                  {a.address}
                                </div>
                                <div className="small text-secondary">
                                  {a.city}, {a.province} — CP {a.zipCode}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => handleActivate(a.id)}
                                disabled={limitReached}
                                title={
                                  limitReached
                                    ? `Máximo ${MAX_ACTIVE} direcciones activas`
                                    : "Activar dirección"
                                }
                                className="d-flex align-items-center gap-1"
                              >
                                <Power size={14} /> Activar
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div className="d-flex gap-2">
            <Button variant="light" onClick={onHide}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmSelection}
              disabled={!selectedId}
            >
              Usar dirección seleccionada
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShippingAddressModal;
