import React, { useContext, useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Mail, Calendar, User, Search } from "lucide-react";
import { AuthContext } from "../Context/AuthContext/authContext";

function AdminContactGroups() {
  const { token } = useContext(AuthContext);
  const [contactGroups, setContactGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchContactGroups = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3000/admin/contact-us/all", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar las consultas");
        }

        const data = await res.json();
        setContactGroups(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching contact groups:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchContactGroups();
    }
  }, [token]);

  const filteredGroups = contactGroups.filter(
    (group) =>
      group.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1
        className="h4 fw-bold mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Consultas
      </h1>

      {/* Buscador */}
      <Card className="border mb-4">
        <Card.Body>
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar por email o nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Lista de consultas */}
      {filteredGroups.length === 0 ? (
        <Card className="border text-center">
          <Card.Body className="py-5">
            <Mail
              size={48}
              className="text-muted mb-3 d-block mx-auto opacity-50"
            />
            <p className="text-muted mb-0">
              {searchTerm
                ? "No se encontraron consultas."
                : "No hay consultas registradas."}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="row g-3">
          {filteredGroups.map((group) => (
            <div
              key={group.email}
              className="col-md-6 col-lg-4 d-flex align-items-stretch"
            >
              <Card
                className="border tn-card-hover"
                style={{ width: "100%", aspectRatio: "1 / 1", minHeight: 280 }}
              >
                <Card.Body className="p-3 d-flex flex-column">
                  <div className="d-flex align-items-center gap-2 mb-3 w-100">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: 36,
                        height: 36,
                        background: "#e7f1ff",
                        color: "#0d6efd",
                      }}
                    >
                      <User size={16} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <h6 className="mb-0 fw-bold small text-truncate">
                        {group.fullname}
                      </h6>
                      <small className="text-muted text-truncate d-block">
                        {group.email}
                      </small>
                    </div>
                  </div>

                  <div className="w-100 flex-grow-1 d-flex flex-column justify-content-start">
                    {group.messages.slice(0, 1).map((msg) => (
                      <div
                        key={msg.id}
                        className="mb-0 p-3 bg-light rounded w-100 h-100"
                        style={{
                          borderLeft: "3px solid #0d6efd",
                          fontSize: "0.82rem",
                          minHeight: 140,
                        }}
                      >
                        <div
                          className="text-muted mb-2"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </div>
                        <div
                          className="text-dark"
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {msg.message}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactGroups;
