import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";

const COLORS = ["#10b981", "#ef4444", "#6366f1"];

const PieChartCard = React.memo(() => {
  const { users, errors, cpu } = useSelector((state) => state.dashboard);

  const data = [
    { name: "Active Users", value: users },
    { name: "Errors", value: errors },
    { name: "CPU Load", value: cpu },
  ];

  return (
    <div className="chart-card fade-in-up">
      <h3>
        <span className="chart-icon">🍩</span>
        System Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            outerRadius={100}
            innerRadius={50}
            paddingAngle={3}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

PieChartCard.displayName = "PieChartCard";
export default PieChartCard;