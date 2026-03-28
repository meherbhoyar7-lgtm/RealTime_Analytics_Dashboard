import React from "react";

const ICON_MAP = {
  users: { emoji: "👥", color: "blue" },
  cpu: { emoji: "⚡", color: "yellow" },
  errors: { emoji: "🔴", color: "red" },
  revenue: { emoji: "💰", color: "green" },
  income: { emoji: "📈", color: "purple" },
  growth: { emoji: "🚀", color: "green" },
  memory: { emoji: "💾", color: "purple" },
  network: { emoji: "🌐", color: "blue" },
  health: { emoji: "🛡️", color: "green" },
};

const MetricCard = React.memo(({ title, value, trend, icon }) => {
  const config = ICON_MAP[icon] || { emoji: "📊", color: "blue" };
  const trendNum = typeof trend === "number" ? trend : null;
  const isUp = trendNum !== null && trendNum >= 0;

  return (
    <div className="metric-card fade-in-up" role="region" aria-label={`${title}: ${value}`}>
      <div className="metric-header">
        <div className={`metric-icon ${config.color}`}>{config.emoji}</div>
        {trendNum !== null && (
          <span className={`metric-trend ${isUp ? "up" : "down"}`}>
            {isUp ? "↑" : "↓"} {Math.abs(trendNum).toFixed(1)}%
          </span>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{title}</div>
    </div>
  );
});

MetricCard.displayName = "MetricCard";
export default MetricCard;