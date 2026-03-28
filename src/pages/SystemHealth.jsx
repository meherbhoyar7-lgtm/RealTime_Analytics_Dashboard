import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import MetricCard from "../components/MetricCard";

const SystemHealth = () => {
  const { cpu, memory, network, errors } = useSelector((state) => state.dashboard);
  const [selectedService, setSelectedService] = useState(null);

  // Service health data
  const services = [
    { id: 1, name: "API Server", status: "healthy", uptime: "99.98%", responseTime: "45ms", icon: "🖥️" },
    { id: 2, name: "Database", status: "healthy", uptime: "99.99%", responseTime: "12ms", icon: "💾" },
    { id: 3, name: "Cache Layer", status: "healthy", uptime: "99.95%", responseTime: "5ms", icon: "⚡" },
    { id: 4, name: "Message Queue", status: "warning", uptime: "99.85%", responseTime: "78ms", icon: "📨" },
    { id: 5, name: "CDN", status: "healthy", uptime: "99.99%", responseTime: "18ms", icon: "🌐" },
    { id: 6, name: "Load Balancer", status: "healthy", uptime: "100%", responseTime: "2ms", icon: "⚖️" },
  ];

  // System resources utilization
  const resourceData = [
    { name: "CPU", value: cpu, maxValue: 100, color: "#f59e0b" },
    { name: "Memory", value: memory, maxValue: 100, color: "#8b5cf6" },
    { name: "Network", value: network, maxValue: 100, color: "#0ea5e9" },
    { name: "Disk", value: 65, maxValue: 100, color: "#10b981" },
  ];

  // Uptime data
  const uptimeData = [
    { time: "00:00", uptime: 99.9 },
    { time: "04:00", uptime: 99.98 },
    { time: "08:00", uptime: 99.95 },
    { time: "12:00", uptime: 99.92 },
    { time: "16:00", uptime: 99.88 },
    { time: "20:00", uptime: 99.98 },
    { time: "24:00", uptime: 99.99 },
  ];

  // Incident data
  const incidents = [
    { id: 1, type: "Database Query", severity: "critical", time: "2 hours ago", status: "resolved" },
    { id: 2, type: "Memory Spike", severity: "warning", time: "45 minutes ago", status: "resolved" },
    { id: 3, type: "High Latency", severity: "warning", time: "30 minutes ago", status: "ongoing" },
  ];

  const healthyServices = useMemo(() => services.filter((s) => s.status === "healthy").length, [services]);
  const warningServices = useMemo(() => services.filter((s) => s.status === "warning").length, [services]);
  const avgUptime = useMemo(() => (uptimeData.reduce((sum, d) => sum + d.uptime, 0) / uptimeData.length).toFixed(2), []);

  const tooltipStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        <span className="chart-icon">🏥</span> System Health
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
        Monitor system status, services, and incidents
      </p>

      {/* Health Status Cards */}
      <div className="metrics-grid" style={{ marginBottom: 28 }}>
        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon green">✅</div>
          </div>
          <div className="metric-value">{healthyServices}/{services.length}</div>
          <div className="metric-label">Services Healthy</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon yellow">⚠️</div>
          </div>
          <div className="metric-value">{warningServices}</div>
          <div className="metric-label">Warnings</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon blue">📈</div>
          </div>
          <div className="metric-value">{avgUptime}%</div>
          <div className="metric-label">Average Uptime</div>
        </div>

        <div className="metric-card fade-in-up">
          <div className="metric-header">
            <div className="metric-icon red">🔴</div>
          </div>
          <div className="metric-value">{incidents.filter((i) => i.status === "ongoing").length}</div>
          <div className="metric-label">Active Incidents</div>
        </div>
      </div>

      {/* Services Status */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">🔧</span> Services Status</h3>
        <div className="health-list" style={{ marginTop: 16 }}>
          {services.map((service) => (
            <div
              key={service.id}
              className="health-item"
              onClick={() => setSelectedService(selectedService?.id === service.id ? null : service)}
              style={{ cursor: "pointer" }}
            >
              <div className="service-name">
                <span className="service-icon">{service.icon}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{service.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    Response: {service.responseTime} • Uptime: {service.uptime}
                  </div>
                </div>
              </div>
              <div className={`service-status ${service.status}`}>
                <div
                  className="status-dot"
                  style={{
                    background: service.status === "healthy" ? "var(--success)" : "var(--warning)",
                  }}
                ></div>
                {service.status === "healthy" ? "Healthy" : "Warning"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Usage & Uptime Charts */}
      <div className="charts-row">
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📊</span> Resource Utilization</h3>
          <div style={{ marginTop: 16 }}>
            {resourceData.map((resource) => (
              <div key={resource.name} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                    {resource.name}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: resource.color }}>
                    {resource.value}%
                  </span>
                </div>
                <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div
                    style={{
                      height: "100%",
                      width: `${resource.value}%`,
                      background: resource.color,
                      borderRadius: 4,
                      transition: "width 0.6s ease",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📈</span> Uptime Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis domain={[99, 100]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="uptimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="uptime"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: "#10b981", r: 4 }}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">⚠️</span> Recent Incidents</h3>
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Severity</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id}>
                <td style={{ fontWeight: 500 }}>{incident.type}</td>
                <td>
                  <span
                    className={`table-status ${incident.severity === "critical" ? "active" : "pending"}`}
                    style={{
                      background: incident.severity === "critical" ? "var(--danger-bg)" : "var(--warning-bg)",
                      color: incident.severity === "critical" ? "var(--danger)" : "var(--warning)",
                    }}
                  >
                    {incident.severity === "critical" ? "🔴" : "🟡"} {incident.severity}
                  </span>
                </td>
                <td style={{ color: "var(--text-muted)" }}>{incident.time}</td>
                <td>
                  <span
                    className={`table-status ${incident.status === "resolved" ? "active" : "pending"}`}
                    style={{
                      background: incident.status === "resolved" ? "var(--success-bg)" : "var(--warning-bg)",
                      color: incident.status === "resolved" ? "var(--success)" : "var(--warning)",
                    }}
                  >
                    {incident.status === "resolved" ? "✅" : "⏳"} {incident.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Performance Metrics */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">⚡</span> Performance Metrics</h3>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div style={{ padding: 16, background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>RESPONSE TIME</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent-light)" }}>45ms</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Average API Response</div>
          </div>

          <div style={{ padding: 16, background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>ERROR RATE</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--danger)" }}>0.12%</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Errors per 1000 requests</div>
          </div>

          <div style={{ padding: 16, background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>THROUGHPUT</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--success)" }}>12.5K</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Requests per second</div>
          </div>

          <div style={{ padding: 16, background: "var(--bg-glass)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>DATA CENTER</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>4</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>Locations worldwide</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealth;
