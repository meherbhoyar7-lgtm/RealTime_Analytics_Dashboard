import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutButton from "../components/LogoutButton";

const Sidebar = ({ userName, avatar, collapsed, onToggle, onCloseMobile }) => {
  const { errors, unreadAlerts } = useSelector((s) => s.dashboard);

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className={`sidebar ${collapsed ? "collapsed" : ""}`} aria-label="Main navigation">
      {/* Logo + collapse toggle */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-row">
          {!collapsed && (
            <h2>
              <span>Nexus</span>Board
            </h2>
          )}
          <button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? "»" : "«"}
          </button>
        </div>
        {!collapsed && <p>Analytics Engine</p>}
      </div>

      {/* Close button for mobile overlay */}
      <button className="sidebar-close-mobile" onClick={onCloseMobile} aria-label="Close menu">✕</button>

      {/* Nav Links */}
      <div className="sidebar-nav">
        <NavLink to="/dashboard" end title="Overview" onClick={onCloseMobile}>
          <span className="nav-icon">📊</span>
          {!collapsed && <span className="nav-label">Overview</span>}
        </NavLink>
        <NavLink to="/dashboard/performance" title="Performance" onClick={onCloseMobile}>
          <span className="nav-icon">⚡</span>
          {!collapsed && <span className="nav-label">Performance</span>}
        </NavLink>
        <NavLink to="/dashboard/errors" title="Errors" onClick={onCloseMobile}>
          <span className="nav-icon">🐛</span>
          {!collapsed && <span className="nav-label">Errors</span>}
          {errors > 5 && <span className="nav-badge danger">{errors}</span>}
        </NavLink>
        <NavLink to="/dashboard/analytics" title="Analytics" onClick={onCloseMobile}>
          <span className="nav-icon">📈</span>
          {!collapsed && <span className="nav-label">Analytics</span>}
        </NavLink>
        <NavLink to="/dashboard/health" title="System Health" onClick={onCloseMobile}>
          <span className="nav-icon">🏥</span>
          {!collapsed && <span className="nav-label">System Health</span>}
        </NavLink>
        <NavLink to="/dashboard/team" title="Team Members" onClick={onCloseMobile}>
          <span className="nav-icon">👥</span>
          {!collapsed && <span className="nav-label">Team Members</span>}
        </NavLink>
        <NavLink to="/dashboard/activity" title="Activity Log" onClick={onCloseMobile}>
          <span className="nav-icon">📋</span>
          {!collapsed && <span className="nav-label">Activity Log</span>}
        </NavLink>
        <NavLink to="/dashboard/settings" title="Settings" onClick={onCloseMobile}>
          <span className="nav-icon">⚙️</span>
          {!collapsed && <span className="nav-label">Settings</span>}
        </NavLink>
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">
            {avatar ? <img src={avatar} alt={userName} /> : initials}
          </div>
          {!collapsed && (
            <div className="user-info">
              <div className="name">{userName}</div>
              <div className="role">Admin</div>
            </div>
          )}
        </div>
        {!collapsed && <LogoutButton />}
      </div>
    </nav>
  );
};

export default Sidebar;