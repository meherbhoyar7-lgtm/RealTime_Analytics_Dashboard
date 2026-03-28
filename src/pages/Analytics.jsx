import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import MetricCard from "../components/MetricCard";

const Analytics = () => {
  const { history } = useSelector((state) => state.dashboard);

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((item, index) => ({
      time: `T${index + 1}`,
      cpu: item.cpu,
      memory: item.memory,
      users: item.users,
      network: item.network,
      errors: item.errors,
    }));
  }, [history]);

  const tooltipStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
  };

  // Calculate analytics
  const avgCpu = useMemo(() => {
    if (!chartData.length) return 0;
    return (chartData.reduce((sum, item) => sum + item.cpu, 0) / chartData.length).toFixed(1);
  }, [chartData]);

  const avgMemory = useMemo(() => {
    if (!chartData.length) return 0;
    return (chartData.reduce((sum, item) => sum + item.memory, 0) / chartData.length).toFixed(1);
  }, [chartData]);

  const totalErrors = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, item) => sum + item.errors, 0);
  }, [chartData]);

  const peakUsers = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.max(...chartData.map((item) => item.users));
  }, [chartData]);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        <span className="chart-icon">📊</span> Analytics & Reports
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
        In-depth performance metrics and historical data
      </p>

      {/* Analytics Cards */}
      <div className="analytics-grid">
        <div className="analytics-card fade-in-up">
          <div className="card-title">Average CPU</div>
          <div className="card-value">{avgCpu}%</div>
          <div className="card-growth positive">↓ 5.2% from last period</div>
        </div>

        <div className="analytics-card fade-in-up">
          <div className="card-title">Average Memory</div>
          <div className="card-value">{avgMemory}%</div>
          <div className="card-growth positive">↓ 3.1% from last period</div>
        </div>

        <div className="analytics-card fade-in-up">
          <div className="card-title">Total Errors</div>
          <div className="card-value">{totalErrors}</div>
          <div className="card-growth negative">↑ 2.8% from last period</div>
        </div>

        <div className="analytics-card fade-in-up">
          <div className="card-title">Peak Users</div>
          <div className="card-value">{peakUsers}</div>
          <div className="card-growth positive">↑ 12.5% from last period</div>
        </div>
      </div>

      {/* Combined Performance Chart */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">📈</span> System Performance Over Time</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="cpu" stroke="#f59e0b" fill="url(#cpuGrad)" animationDuration={400} />
            <Area type="monotone" dataKey="memory" stroke="#8b5cf6" fill="url(#memGrad)" animationDuration={400} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth & Network Load */}
      <div className="charts-row">
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">👥</span> User Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
                isAnimationActive={true}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">🌐</span> Network Load Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="networkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={1} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar dataKey="network" fill="url(#networkGrad)" radius={[6, 6, 0, 0]} animationDuration={400} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Error Analysis */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">⚠️</span> Error Analysis</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="time" stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
            <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <defs>
              <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <Bar dataKey="errors" fill="url(#errorGrad)" radius={[6, 6, 0, 0]} animationDuration={400} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats Table */}
      <div className="chart-card fade-in-up">
        <h3><span className="chart-icon">📋</span> Summary Statistics</h3>
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Metric</th>
              <th>Average</th>
              <th>Peak</th>
              <th>Minimum</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>CPU Usage</td>
              <td>{avgCpu}%</td>
              <td>{Math.max(...chartData.map((d) => d.cpu)) || 0}%</td>
              <td>{Math.min(...chartData.map((d) => d.cpu)) || 0}%</td>
              <td>
                <span className="table-status active">
                  <span className="dot"></span> Healthy
                </span>
              </td>
            </tr>
            <tr>
              <td>Memory Usage</td>
              <td>{avgMemory}%</td>
              <td>{Math.max(...chartData.map((d) => d.memory)) || 0}%</td>
              <td>{Math.min(...chartData.map((d) => d.memory)) || 0}%</td>
              <td>
                <span className="table-status active">
                  <span className="dot"></span> Healthy
                </span>
              </td>
            </tr>
            <tr>
              <td>Active Users</td>
              <td>{Math.round(chartData.reduce((sum, d) => sum + d.users, 0) / chartData.length) || 0}</td>
              <td>{peakUsers}</td>
              <td>{Math.min(...chartData.map((d) => d.users)) || 0}</td>
              <td>
                <span className="table-status active">
                  <span className="dot"></span> Active
                </span>
              </td>
            </tr>
            <tr>
              <td>Total Errors</td>
              <td>{(totalErrors / chartData.length).toFixed(1)}</td>
              <td>{Math.max(...chartData.map((d) => d.errors)) || 0}</td>
              <td>{Math.min(...chartData.map((d) => d.errors)) || 0}</td>
              <td>
                <span className="table-status warning">
                  <span className="dot"></span> Monitor
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
