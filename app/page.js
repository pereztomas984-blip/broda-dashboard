"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [tareas, setTareas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tareas");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(function () {
    fetchData();
  }, []);

  function fetchData() {
    setLoading(true);
    Promise.all([
      fetch("/api/tareas").then(function (r) { return r.json(); }),
      fetch("/api/clientes").then(function (r) { return r.json(); }),
    ])
      .then(function (results) {
        setTareas(results[0].data || []);
        setClientes(results[1].data || []);
        setError(null);
      })
      .catch(function (err) {
        setError("Error: " + err.message);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function getEstadoColor(estado) {
    if (estado === "Sin iniciar") return "#9ca3af";
    if (estado === "En progreso") return "#3b82f6";
    if (estado === "En revision") return "#fbbf24";
    if (estado === "Bloqueado") return "#ef4444";
    if (estado === "Completado") return "#22c55e";
    return "#9ca3af";
  }

  function getPrioridadColor(prioridad) {
    if (prioridad === "Urgente") return "#dc2626";
    if (prioridad === "Alta") return "#f97316";
    if (prioridad === "Media") return "#eab308";
    if (prioridad === "Baja") return "#22c55e";
    return "#9ca3af";
  }

  function getSaludColor(salud) {
    if (salud === "En tiempo") return "#22c55e";
    if (salud === "Atencion") return "#eab308";
    if (salud === "En riesgo") return "#ef4444";
    if (salud === "Pausado") return "#9ca3af";
    return "#6366f1";
  }

  function formatDate(dateStr) {
    if (!dateStr) return null;
    var d = new Date(dateStr);
    return d.toLocaleDateString("es-AR");
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" }}>

      <div style={{ background: "white", borderRadius: "12px", padding: "20px 30px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#1a1a1a" }}>
          BRODA Dashboard
        </h1>
        <button onClick={fetchData} style={{ padding: "10px 20px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}>
          Actualizar
        </button>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "2px solid #f87171", color: "#991b1b", padding: "15px 20px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={function () { setActiveTab("tareas"); setSelectedItem(null); }} style={{ padding: "12px 24px", background: activeTab === "tareas" ? "white" : "rgba(255,255,255,0.5)", color: activeTab === "tareas" ? "#667eea" : "#666", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
          Tareas ({tareas.length})
        </button>
        <button onClick={function () { setActiveTab("clientes"); setSelectedItem(null); }} style={{ padding: "12px 24px", background: activeTab === "clientes" ? "white" : "rgba(255,255,255,0.5)", color: activeTab === "clientes" ? "#667eea" : "#666", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
          Clientes ({clientes.length})
        </button>
      </div>

      {loading ? (
        <div style={{ background: "white", borderRadius: "12px", padding: "60px 20px", textAlign: "center", color: "#667eea", fontSize: "18px", fontWeight: "600", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          Cargando datos desde Notion...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>

          <div style={{ background: "white", borderRadius: "12px", padding: "20px", maxHeight: "700px", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>

            {activeTab === "tareas" && (tareas.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px 20px", fontSize: "14px" }}>No hay tareas</div>
            ) : (
              tareas.map(function (item) {
                return (
                  <div key={item.id} onClick={function () { setSelectedItem(item); }} style={{ padding: "15px", background: selectedItem && selectedItem.id === item.id ? "#e0e7ff" : "#f8f9fa", border: selectedItem && selectedItem.id === item.id ? "2px solid #667eea" : "2px solid transparent", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" }}>
                    <div style={{ fontWeight: "600", marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}>{item.titulo}</div>
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      <span style={{ background: getEstadoColor(item.estado), color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>{item.estado}</span>
                      <span style={{ background: getPrioridadColor(item.prioridad), color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>{item.prioridad}</span>
                    </div>
                  </div>
                );
              })
            ))}

            {activeTab === "clientes" && (clientes.length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", padding: "40px 20px", fontSize: "14px" }}>Sin clientes</div>
            ) : (
              clientes.map(function (item) {
                return (
                  <div key={item.id} onClick={function () { setSelectedItem(item); }} style={{ padding: "15px", background: selectedItem && selectedItem.id === item.id ? "#e0e7ff" : "#f8f9fa", border: selectedItem && selectedItem.id === item.id ? "2px solid #667eea" : "2px solid transparent", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" }}>
                    <div style={{ fontWeight: "600", marginBottom: "8px", color: "#1a1a1a", fontSize: "14px" }}>{item.nombre}</div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                      {item.rubro && <span style={{ fontSize: "12px", color: "#666" }}>{item.rubro}</span>}
                      <span style={{ background: getSaludColor(item.saludProyecto), color: "white", padding: "3px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600" }}>{item.saludProyecto}</span>
                    </div>
                  </div>
                );
              })
            ))}
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "30px", maxHeight: "700px", overflowY: "auto", boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
            {selectedItem ? (
              activeTab === "tareas" ? (
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", paddingBottom: "15px", borderBottom: "2px solid #e5e7eb", color: "#1a1a1a" }}>{selectedItem.titulo}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Estado</div>
                      <span style={{ background: getEstadoColor(selectedItem.estado), color: "white", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "600", display: "inline-block" }}>{selectedItem.estado}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Prioridad</div>
                      <span style={{ background: getPrioridadColor(selectedItem.prioridad), color: "white", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "600", display: "inline-block" }}>{selectedItem.prioridad}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Etapa</div>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.etapa}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Persona</div>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.persona}</div>
                    </div>
                    {selectedItem.deadline && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Deadline</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{formatDate(selectedItem.deadline)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", paddingBottom: "15px", borderBottom: "2px solid #e5e7eb", color: "#1a1a1a" }}>{selectedItem.nombre}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Etapa Actual</div>
                      <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.etapaActual}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Salud</div>
                      <span style={{ background: getSaludColor(selectedItem.saludProyecto), color: "white", padding: "5px 12px", borderRadius: "16px", fontSize: "12px", fontWeight: "600", display: "inline-block" }}>{selectedItem.saludProyecto}</span>
                    </div>
                    {selectedItem.contactoPrincipal && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Contacto Principal</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.contactoPrincipal}</div>
                      </div>
                    )}
                    {selectedItem.responsable && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Responsable</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.responsable}</div>
                      </div>
                    )}
                    {selectedItem.rubro && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Rubro / Nicho</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.rubro}</div>
                      </div>
                    )}
                    {selectedItem.email && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Email</div>
                        <a href={"mailto:" + selectedItem.email} style={{ color: "#667eea", textDecoration: "none", fontWeight: "500", fontSize: "14px" }}>{selectedItem.email}</a>
                      </div>
                    )}
                    {selectedItem.whatsapp && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>WhatsApp</div>
                        <a href={"https://wa.me/" + selectedItem.whatsapp.replace(/[^0-9]/g, "")} target="_blank" rel="noopener noreferrer" style={{ color: "#25d366", textDecoration: "none", fontWeight: "500", fontSize: "14px" }}>{selectedItem.whatsapp}</a>
                      </div>
                    )}
                    {selectedItem.instagram && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Instagram</div>
                        <a href={selectedItem.instagram} target="_blank" rel="noopener noreferrer" style={{ color: "#e1306c", textDecoration: "none", fontWeight: "500", fontSize: "14px" }}>{selectedItem.instagram}</a>
                      </div>
                    )}
                    {selectedItem.web && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Web</div>
                        <a href={selectedItem.web} target="_blank" rel="noopener noreferrer" style={{ color: "#667eea", textDecoration: "none", fontWeight: "500", fontSize: "14px" }}>{selectedItem.web}</a>
                      </div>
                    )}
                    {selectedItem.origenLead && (
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Origen del Lead</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.origenLead}</div>
                      </div>
                    )}
                    {selectedItem.proximoEntregable && (
                      <div style={{ gridColumn: "1 / -1" }}>
                        <div style={{ fontSize: "11px", fontWeight: "600", color: "#888", textTransform: "uppercase", marginBottom: "6px" }}>Proximo Entregable</div>
                        <div style={{ fontSize: "15px", fontWeight: "500", color: "#1a1a1a" }}>{selectedItem.proximoEntregable}</div>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "16px" }}>
                Selecciona un elemento para ver detalles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
