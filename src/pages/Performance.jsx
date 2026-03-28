import { useSelector } from "react-redux";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import MetricCard from "../components/MetricCard";
import { useMemo } from "react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];

const Performance = () => {
  const { cpu, users, memory, network, history } = useSelector(
    (state) => state.dashboard
  );

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((item, index) => ({
      time: `T${index + 1}`,
      cpu: item.cpu,
      users: item.users,
      memory: item.memory,
      network: item.network,
    }));
  }, [history]);

  const pieData = [
    { name: "CPU", value: cpu },
    { name: "Memory", value: memory },
    { name: "Network", value: network },
  ];

  const tooltipStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
  };

  return (
    <div>
      {/* Metrics */}
      <div className="perf-grid stagger">
        <MetricCard title="CPU Usage" value={`${cpu}%`} trend={cpu > 70 ? -(cpu % 8 + 1) : cpu % 5 + 2} icon="cpu" />
        <MetricCard title="Active Users" value={users.toLocaleString()} trend={(users % 10) + 1} icon="users" />
        <MetricCard title="Memory Usage" value={`${memory}%`} trend={memory > 80 ? -(memory % 6 + 1) : memory % 4 + 1} icon="memory" />
        <MetricCard title="Network Load" value={`${network}%`} trend={(network % 7) + 1} icon="network" />
      </div>

      {/* CPU & Users Trend */}
      <div className="charts-row">
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📈</span> CPU &amp; Users Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="cpu" stroke="#6366f1" strokeWidth={3} dot={false} animationDuration={400} />
              <Line type="monotone" dataKey="users" stroke="#10b981" strokeWidth={3} dot={false} animationDuration={400} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Trend */}
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">💾</span> Memory Usage Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="memory" stroke="#f59e0b" fill="url(#memGrad)" strokeWidth={3} animationDuration={400} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth & System Distribution */}
      <div className="charts-row">
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📊</span> User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar dataKey="users" fill="url(#barGrad)" radius={[6, 6, 0, 0]} animationDuration={400} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">🍩</span> System Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                innerRadius={50}
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Performance;
