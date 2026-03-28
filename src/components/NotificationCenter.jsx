import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { markAlertRead, markAllAlertsRead, clearAlerts } from "../store/dashboardSlice";

const TYPE_CONFIG = {
  error:   { icon: "🔴", label: "Error" },
  warning: { icon: "🟡", label: "Warning" },
  info:    { icon: "🔵", label: "Info" },
  success: { icon: "🟢", label: "Success" },
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const NotificationCenter = React.memo(() => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { alerts, unreadAlerts } = useSelector((s) => s.dashboard);

  /* close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = useCallback(() => setOpen((p) => !p), []);

  return (
    <div className="notif-center" ref={ref}>
      <button className="notif-bell" onClick={toggle} aria-label="Notifications">
        🔔
        {unreadAlerts > 0 && <span className="notif-badge">{unreadAlerts > 9 ? "9+" : unreadAlerts}</span>}
      </button>

      {open && (
        <div className="notif-dropdown fade-in-up">
          <div className="notif-dropdown-header">
            <h4>Notifications</h4>
            <div className="notif-dropdown-actions">
              {unreadAlerts > 0 && (
                <button onClick={() => dispatch(markAllAlertsRead())}>Mark all read</button>
              )}
              {alerts.length > 0 && (
                <button onClick={() => dispatch(clearAlerts())}>Clear all</button>
              )}
            </div>
          </div>

          <div className="notif-dropdown-body">
            {alerts.length === 0 ? (
              <p className="notif-empty">No notifications yet</p>
            ) : (
              alerts.slice(0, 20).map((a) => {
                const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
                return (
                  <div
                    key={a.id}
                    className={`notif-dropdown-item ${a.read ? "" : "unread"}`}
                    onClick={() => dispatch(markAlertRead(a.id))}
                  >
                    <span className="notif-dropdown-icon">{cfg.icon}</span>
                    <div className="notif-dropdown-content">
                      <p>{a.message}</p>
                      <span className="notif-dropdown-time">{timeAgo(a.time)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
});

NotificationCenter.displayName = "NotificationCenter";
export default NotificationCenter;
