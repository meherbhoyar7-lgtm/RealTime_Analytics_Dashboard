import { useSelector } from "react-redux";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import MetricCard from "../components/MetricCard";

const Errors = () => {
  const { errors, history } = useSelector((state) => state.dashboard);

  const chartData = useMemo(() => {
    if (!history?.length) return [];
    return history.map((item, index) => ({
      time: `T${index + 1}`,
      errors: item.errors,
    }));
  }, [history]);

  const healthStatus = errors > 4 ? "CRITICAL" : errors > 2 ? "WARNING" : "STABLE";

  const tooltipStyle = {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
  };

  return (
    <div>
      {/* Metrics */}
      <div className="errors-metrics stagger">
        <MetricCard
          title="System Errors"
          value={errors}
          trend={errors > 4 ? -((errors % 5) + 2) : (errors % 3) + 0.5}
          icon="errors"
        />
        <MetricCard
          title="Health Status"
          value={healthStatus}
          trend={healthStatus === "STABLE" ? 0 : healthStatus === "WARNING" ? -1.5 : -5}
          icon="health"
        />
      </div>

      {/* Charts */}
      <div className="errors-charts">
        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📉</span> Error Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
              <YAxis domain={[0, "dataMax + 2"]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="errLineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <Line
                type="monotone"
                dataKey="errors"
                stroke="url(#errLineGrad)"
                strokeWidth={3}
                dot={false}
                animationDuration={400}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card fade-in-up">
          <h3><span className="chart-icon">📊</span> Error Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
              <YAxis domain={[0, "dataMax + 2"]} stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <defs>
                <linearGradient id="errBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={1} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <Bar
                dataKey="errors"
                fill="url(#errBarGrad)"
                radius={[6, 6, 0, 0]}
                animationDuration={400}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Errors;
