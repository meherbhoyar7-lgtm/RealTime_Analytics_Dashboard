import { useSelector, useDispatch } from "react-redux";
import { updateMetrics } from "../store/dashboardSlice";
import MetricCard from "../components/MetricCard";
import ChartCard from "../components/ChartCard";
import RefreshButton from "../components/RefreshButton";
import PieChartCard from "../components/PieChartCard";
import { useWebSocketSimulator } from "../hooks/useWebSocketSimulator";
import { useState, useMemo } from "react";
import { FiDownload, FiArrowUpRight } from "react-icons/fi";

const Overview = () => {
  const dispatch = useDispatch();
  const { users, cpu, errors, memory, network } = useSelector(
    (state) => state.dashboard
  );

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUser = storedUser?.username || storedUser?.name;

  const [range, setRange] = useState("Today");

  useWebSocketSimulator();

  const multiplier = useMemo(() => {
    if (range === "Today") return 1;
    if (range === "This Week") return 7;
    return 30;
  }, [range]);

  const revenue = users * 12 * multiplier;
  const expectedIncome = users * 18 * multiplier;
  const growth = ((users % 15) + 5).toFixed(1);

  // Sample events data
  const upcomingEvents = [
    { id: 1, title: "System Maintenance", time: "Tomorrow 2:00 AM", priority: "high" },
    { id: 2, title: "Team Meeting", time: "Today 3:00 PM", priority: "medium" },
    { id: 3, title: "Database Backup", time: "Today 11:00 PM", priority: "low" },
  ];

  return (
    <div className="overview">
      {/* Welcome header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Welcome back{currentUser ? `, ${currentUser}` : ""} 👋
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, marginTop: 4 }}>
            Real-time analytics and intelligent system insights.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="range-select"
            aria-label="Time range"
          >
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <RefreshButton onClick={() => dispatch(updateMetrics())} />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid stagger">
        <MetricCard title="Active Users" value={(users * multiplier).toLocaleString()} trend={parseFloat(growth)} icon="users" />
        <MetricCard title="CPU Usage" value={`${cpu}%`} trend={cpu > 70 ? -((cpu % 10) + 1) : (cpu % 8) + 1} icon="cpu" />
        <MetricCard title="Errors" value={errors} trend={errors > 4 ? -((errors % 5) + 2) : (errors % 3) + 0.5} icon="errors" />
        <MetricCard title="Revenue" value={`$${revenue.toLocaleString()}`} trend={parseFloat(growth)} icon="revenue" />
        <MetricCard title="Expected Income" value={`$${expectedIncome.toLocaleString()}`} trend={(users % 8) + 3} icon="income" />
        <MetricCard title="Growth Rate" value={`${growth}%`} trend={parseFloat(growth)} icon="growth" />
      </div>

      {/* Quick Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 28 }}>
        <div className="revenue-card">
          <div className="card-icon">💳</div>
          <div className="card-label">Total Revenue ({range})</div>
          <div className="card-value">${(revenue / 1000).toFixed(1)}K</div>
          <div className="card-subtext">↑ {growth}% from previous period</div>
        </div>

        <div className="revenue-card" style={{ background: "linear-gradient(135deg, #8b5cf6, #d946ef)" }}>
          <div className="card-icon">🎯</div>
          <div className="card-label">Conversion Rate</div>
          <div className="card-value">{((users % 5) + 2).toFixed(1)}%</div>
          <div className="card-subtext">Target: 5% per period</div>
        </div>

        <div className="revenue-card" style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}>
          <div className="card-icon">📱</div>
          <div className="card-label">Active Sessions</div>
          <div className="card-value">{(users * 0.45).toLocaleString()}</div>
          <div className="card-subtext">Real-time connected users</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row-3">
        <ChartCard range={range} />
        <PieChartCard />
      </div>

      {/* Main Content Grid */}
      <div className="charts-row">
        {/* AI Insights */}
        <div className="chart-card">
          <h3><span className="chart-icon">🧠</span> AI Insights</h3>
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-icon">⚡</span>
              <span>Traffic increased by <strong>{growth}%</strong> during {range.toLowerCase()}</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">📉</span>
              <span>Error rate remains stable at <strong>{errors}</strong> incidents</span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">🔥</span>
              <span>CPU spike probability: <strong>{(cpu % 40) + 30}%</strong></span>
            </div>
            <div className="insight-item">
              <span className="insight-icon">💡</span>
              <span>Revenue projection is strong — <strong>${(expectedIncome * 1.2).toLocaleString()}</strong> estimated</span>
            </div>
          </div>
        </div>

        {/* Top Regions */}
        <div className="chart-card">
          <h3><span className="chart-icon">🌍</span> Top Regions</h3>
          <div className="region-list">
            {[
              { flag: "🇮🇳", name: "India", pct: (users % 50) + 30 },
              { flag: "🇺🇸", name: "USA", pct: (users % 25) + 15 },
              { flag: "🇩🇪", name: "Germany", pct: (users % 10) + 10 },
              { flag: "🌍", name: "Others", pct: 18 },
            ].map((r) => (
              <div className="region-row" key={r.name}>
                <span className="region-name">{r.flag} {r.name}</span>
                <div className="region-bar">
                  <div className="region-bar-fill" style={{ width: `${r.pct}%` }} />
                </div>
                <span className="region-pct">{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Upcoming Events & Status */}
      <div className="charts-row">
        {/* Upcoming Events */}
        <div className="chart-card">
          <h3><span className="chart-icon">📅</span> Upcoming Events</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  padding: 12,
                  background: "var(--bg-glass)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {event.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                    {event.time}
                  </div>
                </div>
                <span
                  style={{
                    padding: "4px 10px",
                    borderRadius: 50,
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.3,
                    background:
                      event.priority === "high"
                        ? "var(--danger-bg)"
                        : event.priority === "medium"
                          ? "var(--warning-bg)"
                          : "var(--success-bg)",
                    color:
                      event.priority === "high"
                        ? "var(--danger)"
                        : event.priority === "medium"
                          ? "var(--warning)"
                          : "var(--success)",
                  }}
                >
                  {event.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="chart-card">
          <h3><span className="chart-icon">⚙️</span> Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <button className="action-btn primary" style={{ justifyContent: "center" }}>
              <FiDownload size={14} /> Export Dashboard
            </button>
            <button className="action-btn" style={{ justifyContent: "center" }}>
              📧 Send Report
            </button>
            <button className="action-btn" style={{ justifyContent: "center" }}>
              🔍 Run Diagnostics
            </button>
            <button className="action-btn" style={{ justifyContent: "center" }}>
              💾 Backup Data
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="chart-card">
        <h3><span className="chart-icon">🔔</span> Recent Activity</h3>
        <div className="notif-list">
          {currentUser && (
            <div className="notif-item">
              <span className="notif-icon">🔐</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                  Logged in successfully
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                  {currentUser} • 2 minutes ago
                </div>
              </div>
            </div>
          )}
          <div className="notif-item">
            <span className="notif-icon">🚀</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                New deployment completed
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                v2.1.0 • 15 minutes ago
              </div>
            </div>
          </div>
          <div className="notif-item">
            <span className="notif-icon">⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                High memory usage detected
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {memory}% utilized • 1 hour ago
              </div>
            </div>
          </div>
          <div className="notif-item">
            <span className="notif-icon">✅</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                Daily backup completed
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                2.4 GB • 2 hours ago
              </div>
            </div>
          </div>
          <div className="notif-item">
            <span className="notif-icon">📊</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>
                Revenue target achieved
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                {range} • 82% of target
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item online">
          <span className="dot" /> Database: Online
        </div>
        <div className="status-item online">
          <span className="dot" /> API: Stable
        </div>
        <div className="status-item warning">
          <span className="dot" /> Cache: {(cpu % 30) + 50}% Usage
        </div>
        <div className="status-item error">
          <span className="dot" /> Jobs: {errors} Failed
        </div>
        <div className="status-item online">
          <span className="dot" /> Network: {network}%
        </div>
      </div>
    </div>
  );
};

export default Overview;
