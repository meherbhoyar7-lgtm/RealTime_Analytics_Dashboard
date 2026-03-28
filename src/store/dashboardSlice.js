import { createSlice } from "@reduxjs/toolkit";

/* ── helpers ── */
const ts = () => new Date().toISOString();

const ALERT_TEMPLATES = [
  { type: "warning", msg: "Memory usage exceeded 85%" },
  { type: "error",   msg: "API response time > 2 s" },
  { type: "info",    msg: "Auto-scaling triggered — 2 new instances" },
  { type: "success", msg: "Database backup completed" },
  { type: "warning", msg: "Disk I/O approaching threshold" },
  { type: "error",   msg: "Failed health-check on node-03" },
  { type: "info",    msg: "SSL certificate renews in 7 days" },
  { type: "success", msg: "CDN cache purged successfully" },
  { type: "warning", msg: "Unusual login activity detected" },
  { type: "error",   msg: "Queue consumer lag increasing" },
];

const initialState = {
  users: 120,
  cpu: 45,
  errors: 3,
  memory: 50,
  network: 30,
  history: [],
  theme: "light",

  /* New — alerts */
  alerts: [],
  unreadAlerts: 0,

  /* New — activity log */
  activityLog: [],

  /* New — uptime counter (seconds since first load) */
  uptimeStart: Date.now(),
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateMetrics: (state) => {
      const prevCpu = state.cpu;
      const prevMem = state.memory;
      const prevErr = state.errors;

      state.users = Math.floor(Math.random() * 1000);
      state.cpu = Math.floor(Math.random() * 100);
      state.errors = Math.floor(Math.random() * 10);
      state.memory = Math.floor(Math.random() * 100);
      state.network = Math.floor(Math.random() * 100);

      state.history.push({
        timestamp: Date.now(),
        users: state.users,
        cpu: state.cpu,
        memory: state.memory,
        network: state.network,
        errors: state.errors,
      });
      if (state.history.length > 30) state.history.shift();

      /* ── auto-generate alerts on thresholds ── */
      if (state.cpu > 85 && prevCpu <= 85) {
        const a = { id: Date.now(), type: "error", message: `CPU spiked to ${state.cpu}%`, time: ts(), read: false };
        state.alerts.unshift(a);
        state.unreadAlerts += 1;
      }
      if (state.memory > 80 && prevMem <= 80) {
        const a = { id: Date.now() + 1, type: "warning", message: `Memory at ${state.memory}%`, time: ts(), read: false };
        state.alerts.unshift(a);
        state.unreadAlerts += 1;
      }
      if (state.errors > 6 && prevErr <= 6) {
        const a = { id: Date.now() + 2, type: "error", message: `Error surge: ${state.errors} errors`, time: ts(), read: false };
        state.alerts.unshift(a);
        state.unreadAlerts += 1;
      }

      /* ── random alert (10 % chance each tick) ── */
      if (Math.random() < 0.10) {
        const tpl = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
        const a = { id: Date.now() + 3, type: tpl.type, message: tpl.msg, time: ts(), read: false };
        state.alerts.unshift(a);
        state.unreadAlerts += 1;
      }
      if (state.alerts.length > 50) state.alerts = state.alerts.slice(0, 50);

      /* ── activity log entry ── */
      state.activityLog.unshift({
        id: Date.now(),
        action: "metrics_update",
        detail: `Users ${state.users} | CPU ${state.cpu}% | Mem ${state.memory}% | Err ${state.errors}`,
        time: ts(),
      });
      if (state.activityLog.length > 100) state.activityLog = state.activityLog.slice(0, 100);
    },

    /* Mark single alert as read */
    markAlertRead: (state, action) => {
      const alert = state.alerts.find((a) => a.id === action.payload);
      if (alert && !alert.read) {
        alert.read = true;
        state.unreadAlerts = Math.max(0, state.unreadAlerts - 1);
      }
    },

    /* Mark all alerts read */
    markAllAlertsRead: (state) => {
      state.alerts.forEach((a) => { a.read = true; });
      state.unreadAlerts = 0;
    },

    /* Clear all alerts */
    clearAlerts: (state) => {
      state.alerts = [];
      state.unreadAlerts = 0;
    },

    /* Push a custom activity log entry (login, logout, settings change, etc.) */
    pushActivity: (state, action) => {
      state.activityLog.unshift({
        id: Date.now(),
        ...action.payload,
        time: ts(),
      });
      if (state.activityLog.length > 100) state.activityLog = state.activityLog.slice(0, 100);
    },

    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const {
  updateMetrics,
  toggleTheme,
  markAlertRead,
  markAllAlertsRead,
  clearAlerts,
  pushActivity,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;