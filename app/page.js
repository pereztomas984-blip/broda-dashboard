"use client";

import { useState, useEffect } from "react";

export default function Dashboard() {
  const [tareas, setTareas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("tareas");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tareasRes, clientesRes] = await Promise.all([
        fetch("/api/tareas"),
        fetch("/api/clientes"),
      ]);

      const tareasData = await tareasRes.json();
      const clientesData = await clientesRes.json();

      setTareas(tareasData.data || []);
      setClientes(clientesData.data || []);
      setError(null);
    } catch (err) {
      setError("Error cargando datos: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "12px", padding: "20px 30px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "bold", margin: 0 }}>🚀 BRODA Dashboard</h1>
        <button onClick={fetchData} style={{ padding: "10px 20px", background: "#667eea", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}>
          🔄 Actualizar
        </button>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "2px solid #f87171", color: "#991b1b", padding: "15px 20px", borderRadius: "8px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => { setActiveTab("tareas"); setSelectedItem(null); }} style={{ padding: "12px 24px", background: activeTab === "tareas" ? "white" : "rgba(255,255,255,0.5)", color: activeTab === "tareas" ? "#667eea" : "#666", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
          📋 Tareas ({tareas.length})
        </button>
        <button onClick={() => { setActiveTab("clientes"); setSelectedItem(null); }} style={{ padding: "12px 24px", background: activeTab === "clientes" ? "white" : "rgba(255,255,255,0.5)", color: activeTab === "clientes" ? "#667eea" : "#666", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontWeight: "600", fontSize: "16px" }}>
          👥 Clientes ({clientes.length})
        </button>
      </div>

      {loading ? (
        <div style={{ background: "white", borderRadius: "12px", padding: "60px 20px", textAlign: "center", color: "#667eea", fontSize: "18px", fontWeight: "600" }}>
          ⏳ Cargando datos desde Notion...
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "20px" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "20px", maxHeight: "700px", overflowY: "auto" }}>
            {activeTab === "tareas" && (
              <div>
                {tareas.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#999", padding: "40px 20px" }}>No hay tareas 😎</div>
                ) : (
                  tareas.map((tarea) => (
                    <div key={tarea.id} onClick={() => setSelectedItem(tarea)} style={{ padding: "15px", background: selectedItem?.id === tarea.id ? "#e0e7ff" : "#f8f9fa", border: selectedItem?.id === tarea.id ? "2px solid #667eea" : "2px solid transparent", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" }}>
                      <div style={{ fontWeight: "600", marginBottom: "8px" }}>{tarea.titulo}</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ background: tarea.estado === "Para hacer" ? "#ff6b6b" : tarea.estado === "En progreso" ? "#ffd93d" : "#6bcf7f", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{tarea.estado}</span>
                        <span style={{ background: tarea.prioridad === "Alta" ? "#ff6b6b" : tarea.prioridad === "Media" ? "#ffd93d" : "#6bcf7f", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{tarea.prioridad}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {activeTab === "clientes" && (
              <div>
                {clientes.length === 0 ? (
                  <div style={{ textAlign: "center", color: "#999", padding: "40px 20px" }}>Sin clientes aún 💪</div>
                ) : (
                  clientes.map((cliente) => (
                    <div key={cliente.id} onClick={() => setSelectedItem(cliente)} style={{ padding: "15px", background: selectedItem?.id === cliente.id ? "#e0e7ff" : "#f8f9fa", border: selectedItem?.id === cliente.id ? "2px solid #667eea" : "2px solid transparent", borderRadius: "8px", cursor: "pointer", marginBottom: "10px" }}>
                      <div style={{ fontWeight: "600", marginBottom: "8px" }}>{cliente.nombre}</div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "13px", color: "#666" }}>{cliente.empresa}</span>
                        <span style={{ background: "#6366f1", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" }}>{cliente.estado}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          <div style={{ background: "white", borderRadius: "12px", padding: "30px", maxHeight: "700px", overflowY: "auto" }}>
            {selectedItem ? (
              activeTab === "tareas" ? (
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "25px", paddingBottom: "15px", borderBottom: "2px solid #e5e7eb" }}>{selectedItem.titulo}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Estado</span>
                      <div style={{ marginTop: "8px", background: selectedItem.estado === "Para hacer" ? "#ff6b6b" : selectedItem.estado === "En progreso" ? "#ffd93d" : "#6bcf7f", color: "white", padding: "6px 12px", borderRadius: "20px", display: "inline-block", fontSize: "12px", fontWeight: "600" }}>{selectedItem.estado}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Prioridad</span>
                      <div style={{ marginTop: "8px", background: selectedItem.prioridad === "Alta" ? "#ff6b6b" : selectedItem.prioridad === "Media" ? "#ffd93d" : "#6bcf7f", color: "white", padding: "6px 12px", borderRadius: "20px", display: "inline-block", fontSize: "12px", fontWeight: "600" }}>{selectedItem.prioridad}</div>
                    </div>
                    <div>
                      <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Asignado</span>
                      <div style={{ marginTop: "8px", fontSize: "16px", fontWeight: "500" }}>{selectedItem.asignado}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "25px", paddingBottom: "15px", borderBottom: "2px solid #e5e7eb" }}>{selectedItem.nombre}</h2>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                    {selectedItem.empresa && (
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Empresa</span>
                        <div style={{ marginTop: "8px", fontSize: "16px", fontWeight: "500" }}>{selectedItem.empresa}</div>
                      </div>
                    )}
                    {selectedItem.email && (
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Email</span>
                        <div style={{ marginTop: "8px" }}><a href={"mailto:" + selectedItem.email} style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>{selectedItem.email}</a></div>
                      </div>
                    )}
                    {selectedItem.telefono && (
                      <div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#666", textTransform: "uppercase" }}>Teléfono</span>
                        <div style={{ marginTop: "8px" }}><a href={"tel:" + selectedItem.telefono} style={{ color: "#667eea", textDecoration: "none", fontWeight: "500" }}>{selectedItem.telefono}</a></div>
                      </div>
                    )}
                  </div>
                </div>
              )
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "16px" }}>
                👆 Seleccioná un elemento
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}