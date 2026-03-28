import { useSelector } from "react-redux";
import { useState, useMemo } from "react";

const ACTION_LABELS = {
  metrics_update: { icon: "📡", label: "Metrics Update" },
  login:          { icon: "🔐", label: "User Login" },
  logout:         { icon: "🚪", label: "User Logout" },
  settings:       { icon: "⚙️", label: "Settings Changed" },
  alert:          { icon: "🔔", label: "Alert Triggered" },
};

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const ActivityLog = () => {
  const { activityLog } = useSelector((s) => s.dashboard);
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return activityLog;
    return activityLog.filter((e) => e.action === filter);
  }, [activityLog, filter]);

  return (
    <div>
      {/* Header */}
      <div className="activity-header">
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>
            <span className="chart-icon">📋</span> Activity Log
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            Real-time system event history
          </p>
        </div>
        <select
          className="range-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter activity type"
        >
          <option value="all">All Events</option>
          <option value="metrics_update">Metrics Updates</option>
          <option value="login">Logins</option>
          <option value="logout">Logouts</option>
          <option value="settings">Settings</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="metrics-grid stagger" style={{ marginTop: 20 }}>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon blue">📡</div>
          </div>
          <div className="metric-value">{activityLog.length}</div>
          <div className="metric-label">Total Events</div>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon green">✅</div>
          </div>
          <div className="metric-value">{activityLog.filter((e) => e.action === "metrics_update").length}</div>
          <div className="metric-label">Metric Ticks</div>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            <div className="metric-icon purple">🔐</div>
          </div>
          <div className="metric-value">{activityLog.filter((e) => e.action === "login").length}</div>
          <div className="metric-label">Login Events</div>
        </div>
      </div>

      {/* Event list */}
      <div className="chart-card" style={{ marginTop: 20 }}>
        <h3><span className="chart-icon">🕐</span> Event Timeline</h3>
        <div className="activity-timeline">
          {filtered.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: 32 }}>
              No events recorded yet. Data will appear as the simulator runs.
            </p>
          ) : (
            filtered.slice(0, 50).map((evt) => {
              const cfg = ACTION_LABELS[evt.action] || { icon: "📌", label: evt.action };
              return (
                <div className="activity-row" key={evt.id}>
                  <span className="activity-row-icon">{cfg.icon}</span>
                  <div className="activity-row-body">
                    <span className="activity-row-label">{cfg.label}</span>
                    <span className="activity-row-detail">{evt.detail || "—"}</span>
                  </div>
                  <span className="activity-row-time">{formatTime(evt.time)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
