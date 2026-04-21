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
      setError(null);

      const [tareasRes, clientesRes] = await Promise.all([
        fetch("/api/tareas"),
        fetch("/api/clientes"),
      ]);

      if (!tareasRes.ok || !clientesRes.ok) {
        throw new Error("Error al cargar los datos");
      }

      const tareasData = await tareasRes.json();
      const clientesData = await clientesRes.json();

      setTareas(tareasData.data || []);
      setClientes(clientesData.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    const colors = {
      "Para hacer": "#ff6b6b",
      "En progreso": "#ffd93d",
      Completado: "#6bcf7f",
      "Bloqueado": "#d90429",
    };
    return colors[estado] || "#9ca3af";
  };

  const getPrioridadColor = (prioridad) => {
    const colors = {
      Alta: "#ff6b6b",
      Media: "#ffd93d",
      Baja: "#6bcf7f",
    };
    return colors[prioridad] || "#9ca3af";
  };

  return (
    <div style={styles.container}>
      <style>{globalStyles}</style>

      <header style={styles.header}>
        <h1 style={styles.title}>🚀 BRODA Dashboard</h1>
        <button style={styles.refreshBtn} onClick={fetchData}>
          🔄 Actualizar
        </button>
      </header>

      {error && (
        <div style={styles.errorBanner}>
          ⚠️ {error}
          <button onClick={fetchData} style={styles.retryBtn}>
            Reintentar
          </button>
        </div>
      )}

      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "tareas" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => {
            setActiveTab("tareas");
            setSelectedItem(null);
          }}
        >
          📋 Tareas ({tareas.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "clientes" ? styles.tabActive : styles.tabInactive),
          }}
          onClick={() => {
            setActiveTab("clientes");
            setSelectedItem(null);
          }}
        >
          👥 Clientes ({clientes.length})
        </button>
      </div>

      {loading ? (
        <div style={styles.loading}>⏳ Cargando datos desde Notion...</div>
      ) : (
        <div style={styles.contentWrapper}>
          {/* PANEL IZQUIERDO - LISTA */}
          <div style={styles.listPanel}>
            {activeTab === "tareas" && (
              <div>
                {tareas.length === 0 ? (
                  <div style={styles.empty}>
                    No hay tareas. ¡Relajate un poco! 😎
                  </div>
                ) : (
                  <div style={styles.list}>
                    {tareas.map((tarea) => (
                      <div
                        key={tarea.id}
                        style={{
                          ...styles.listItem,
                          ...(selectedItem?.id === tarea.id
                            ? styles.listItemActive
                            : {}),
                        }}
                        onClick={() => setSelectedItem(tarea)}
                      >
                        <div style={styles.listItemTitle}>{tarea.titulo}</div>
                        <div style={styles.listItemMeta}>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor: getEstadoColor(tarea.estado),
                            }}
                          >
                            {tarea.estado}
                          </span>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor: getPrioridadColor(
                                tarea.prioridad
                              ),
                            }}
                          >
                            {tarea.prioridad}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "clientes" && (
              <div>
                {clientes.length === 0 ? (
                  <div style={styles.empty}>
                    Sin clientes por ahora. ¡Vamos a conseguir algunos! 💪
                  </div>
                ) : (
                  <div style={styles.list}>
                    {clientes.map((cliente) => (
                      <div
                        key={cliente.id}
                        style={{
                          ...styles.listItem,
                          ...(selectedItem?.id === cliente.id
                            ? styles.listItemActive
                            : {}),
                        }}
                        onClick={() => setSelectedItem(cliente)}
                      >
                        <div style={styles.listItemTitle}>{cliente.nombre}</div>
                        <div style={styles.listItemMeta}>
                          <span style={styles.smallText}>{cliente.empresa}</span>
                          <span
                            style={{
                              ...styles.badge,
                              backgroundColor: "#6366f1",
                            }}
                          >
                            {cliente.estado}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PANEL DERECHO - DETALLE */}
          <div style={styles.detailPanel}>
            {selectedItem ? (
              <div>
                {activeTab === "tareas" && (
                  <div>
                    <h2 style={styles.detailTitle}>{selectedItem.titulo}</h2>
                    <div style={styles.detailGrid}>
                      <div style={styles.detailField}>
                        <span style={styles.fieldLabel}>Estado</span>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: getEstadoColor(
                              selectedItem.estado
                            ),
                          }}
                        >
                          {selectedItem.estado}
                        </span>
                      </div>
                      <div style={styles.detailField}>
                        <span style={styles.fieldLabel}>Prioridad</span>
                        <span
                          style={{
                            ...styles.badge,
                            backgroundColor: getPrioridadColor(
                              selectedItem.prioridad
                            ),
                          }}
                        >
                          {selectedItem.prioridad}
                        </span>
                      </div>
                      <div style={styles.detailField}>
                        <span style={styles.fieldLabel}>Asignado a</span>
                        <span style={styles.value}>{selectedItem.asignado}</span>
                      </div>
                      {selectedItem.fechaVencimiento && (
                        <div style={styles.detailField}>
                          <span style={styles.fieldLabel}>Vencimiento</span>
                          <span style={styles.value}>
                            {new Date(
                              selectedItem.fechaVencimiento
                            ).toLocaleDateString("es-AR")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "clientes" && (
                  <div>
                    <h2 style={styles.detailTitle}>{selectedItem.nombre}</h2>
                    <div style={styles.detailGrid}>
                      {selectedItem.empresa && (
                        <div style={styles.detailField}>
                          <span style={styles.fieldLabel}>Empresa</span>
                          <span style={styles.value}>{selectedItem.empresa}</span>
                        </div>
                      )}
                      {selectedItem.email && (
                        <div style={styles.detailField}>
                          <span style={styles.fieldLabel}>Email</span>
                          
                            href={`mailto:${selectedItem.email}`}
                            style={styles.link}
                          >
                            {selectedItem.email}
                          </a>
                        </div>
                      )}
                      {selectedItem.telefono && (
                        <div style={styles.detailField}>
                          <span style={styles.fieldLabel}>Teléfono</span>
                          
                            href={`tel:${selectedItem.telefono}`}
                            style={styles.link}
                          >
                            {selectedItem.telefono}
                          </a>
                        </div>
                      )}
                      <div style={styles.detailField}>
                        <span style={styles.fieldLabel}>Estado</span>
                        <span style={{ ...styles.badge, backgroundColor: "#6366f1" }}>
                          {selectedItem.estado}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.emptyDetail}>
                👆 Seleccioná un elemento para ver los detalles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }
`;

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px 30px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
  },

  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#1a1a1a",
    margin: 0,
  },

  refreshBtn: {
    padding: "10px 20px",
    fontSize: "14px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },

  errorBanner: {
    background: "#fee2e2",
    border: "2px solid #f87171",
    color: "#991b1b",
    padding: "15px 20px",
    borderRadius: "8px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },

  retryBtn: {
    padding: "5px 15px",
    background: "#f87171",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
  },

  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  tab: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px 8px 0 0",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  tabActive: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#667eea",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },

  tabInactive: {
    background: "rgba(255, 255, 255, 0.5)",
    color: "#666",
  },

  contentWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "20px",
    minHeight: "600px",
  },

  listPanel: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    maxHeight: "700px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  listItem: {
    padding: "15px",
    background: "#f8f9fa",
    border: "2px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  listItemActive: {
    background: "#e0e7ff",
    border: "2px solid #667eea",
    boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
  },

  listItemTitle: {
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
    fontSize: "14px",
  },

  listItemMeta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  detailPanel: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    maxHeight: "700px",
  },

  detailTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: "25px",
    paddingBottom: "15px",
    borderBottom: "2px solid #e5e7eb",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  detailField: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  fieldLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  badge: {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "white",
    width: "fit-content",
  },

  value: {
    fontSize: "16px",
    color: "#1a1a1a",
    fontWeight: "500",
  },

  link: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "14px",
  },

  smallText: {
    fontSize: "13px",
    color: "#666",
  },

  empty: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#999",
    fontSize: "14px",
  },

  emptyDetail: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "#999",
    fontSize: "16px",
  },

  loading: {
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "60px 20px",
    textAlign: "center",
    color: "#667eea",
    fontSize: "18px",
    fontWeight: "600",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  },
};