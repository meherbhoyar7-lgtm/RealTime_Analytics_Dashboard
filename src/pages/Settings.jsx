import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { pushActivity } from "../store/dashboardSlice";

const Settings = () => {
  const dispatch = useDispatch();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    name: storedUser?.name || storedUser?.username || "",
    email: storedUser?.email || "",
  });
  const [preview, setPreview] = useState(storedUser?.avatar || null);
  const [saved, setSaved] = useState(false);

  /* Notification prefs */
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem("nexus_prefs")) || { alerts: true, sound: false, refreshRate: 3 }; }
    catch { return { alerts: true, sound: false, refreshRate: 3 }; }
  });

  /* Data export */
  const handleExport = () => {
    const data = {
      user: storedUser,
      prefs,
      exportedAt: new Date().toISOString(),
      dashboard: JSON.parse(localStorage.getItem("persist:dashboard") || "{}"),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexusboard-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    dispatch(pushActivity({ action: "settings", detail: "Exported dashboard data" }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    const updatedUser = { ...storedUser, name: profile.name, email: profile.email, avatar: preview };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    localStorage.setItem("nexus_prefs", JSON.stringify(prefs));

    /* Also update the registered-users list if email matches */
    try {
      const users = JSON.parse(localStorage.getItem("nexusboard_registered_users") || "[]");
      const idx = users.findIndex((u) => u.email === storedUser.email);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: profile.name, avatar: preview };
        localStorage.setItem("nexusboard_registered_users", JSON.stringify(users));
      }
    } catch { /* ignore */ }

    dispatch(pushActivity({ action: "settings", detail: `Profile updated: ${profile.name}` }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
        <span className="chart-icon">⚙️</span> Settings
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
        Manage your profile, preferences, and data
      </p>

      <div className="settings-grid">
        {/* Profile Card */}
        <div className="chart-card settings-card">
          <h3><span className="chart-icon">👤</span> Profile</h3>

          <div className="avatar-upload" style={{ marginBottom: 20 }}>
            <label htmlFor="settings-avatar">
              {preview ? <img src={preview} alt="avatar" /> : (profile.name?.[0] || "U")}
            </label>
            <input type="file" id="settings-avatar" hidden accept="image/*" onChange={handleAvatar} />
          </div>

          <div className="input-group">
            <label htmlFor="s-name">Display Name</label>
            <input
              id="s-name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
            />
          </div>

          <div className="input-group" style={{ marginTop: 12 }}>
            <label htmlFor="s-email">Email</label>
            <input
              id="s-email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="Your email"
            />
          </div>
        </div>

        {/* Preferences Card */}
        <div className="chart-card settings-card">
          <h3><span className="chart-icon">🔔</span> Preferences</h3>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">Push Alerts</p>
              <p className="settings-row-sub">Show in-app alert notifications</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.alerts} onChange={(e) => setPrefs({ ...prefs, alerts: e.target.checked })} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">Sound Effects</p>
              <p className="settings-row-sub">Play sounds on critical alerts</p>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={prefs.sound} onChange={(e) => setPrefs({ ...prefs, sound: e.target.checked })} />
              <span className="toggle-slider" />
            </label>
          </div>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">Refresh Rate</p>
              <p className="settings-row-sub">Data update interval (seconds)</p>
            </div>
            <select
              className="range-select"
              value={prefs.refreshRate}
              onChange={(e) => setPrefs({ ...prefs, refreshRate: Number(e.target.value) })}
            >
              <option value={1}>1s</option>
              <option value={2}>2s</option>
              <option value={3}>3s</option>
              <option value={5}>5s</option>
              <option value={10}>10s</option>
            </select>
          </div>
        </div>

        {/* Data & Export Card */}
        <div className="chart-card settings-card">
          <h3><span className="chart-icon">💾</span> Data</h3>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">Export Dashboard Data</p>
              <p className="settings-row-sub">Download your data as JSON</p>
            </div>
            <button className="refresh-btn" onClick={handleExport}>📥 Export</button>
          </div>

          <div className="settings-row">
            <div>
              <p className="settings-row-title">Clear Local Storage</p>
              <p className="settings-row-sub">Reset all saved data (caution!)</p>
            </div>
            <button
              className="refresh-btn"
              style={{ borderColor: "rgba(239,68,68,0.3)", color: "var(--danger)" }}
              onClick={() => {
                if (window.confirm("This will clear all data including your account. Continue?")) {
                  localStorage.clear();
                  window.location.href = "/login";
                }
              }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 16 }}>
        <button className="auth-btn" style={{ maxWidth: 200 }} onClick={handleSave}>
          {saved ? "✅ Saved!" : "Save Changes"}
        </button>
        {saved && <span style={{ color: "var(--success)", fontWeight: 600, fontSize: 14 }}>Changes saved successfully</span>}
      </div>
    </div>
  );
};

export default Settings;
