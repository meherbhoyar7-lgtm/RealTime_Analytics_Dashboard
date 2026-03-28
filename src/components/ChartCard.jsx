import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import React, { useMemo } from "react";

const ChartCard = React.memo(({ range }) => {
  const { history } = useSelector((state) => state.dashboard);

  const chartData = useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((item, index) => ({
      time: `T${index + 1}`,
      users: item.users,
      cpu: item.cpu,
    }));
  }, [history]);

  return (
    <div className="chart-card fade-in-up">
      <h3>
        <span className="chart-icon">📈</span>
        Users &amp; CPU Trend ({range})
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="var(--text-muted)" />
          <YAxis stroke="var(--text-muted)" tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={400}
          />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            isAnimationActive
            animationDuration={400}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

ChartCard.displayName = "ChartCard";
export default ChartCard;