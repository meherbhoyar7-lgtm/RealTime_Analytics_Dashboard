import { Outlet } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "./Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import NotificationCenter from "../components/NotificationCenter";
import SearchPalette from "../components/SearchPalette";

const Layout = ({ darkMode, setDarkMode }) => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser?.name || storedUser?.username || "User";
  const [searchOpen, setSearchOpen] = useState(false);

  /* Sidebar collapse state — persisted */
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  /* Mobile overlay open state */
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      localStorage.setItem("sidebar_collapsed", String(!prev));
      return !prev;
    });
  }, []);

  /* Cmd/Ctrl + K to open search palette */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((p) => !p);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* Close mobile sidebar on route change (resize) */
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const toggleTheme = useCallback(() => setDarkMode((p) => !p), [setDarkMode]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`dashboard-layout ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "sidebar-mobile-open" : ""}`}>
        <Sidebar
          userName={userName}
          avatar={storedUser?.avatar}
          collapsed={collapsed}
          onToggle={toggleCollapse}
          onCloseMobile={() => setMobileOpen(false)}
        />
        <div className="page-content">
          <header className="page-header">
            <div className="page-header-left">
              {/* Hamburger for mobile */}
              <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <span /><span /><span />
              </button>
              <div>
                <h1>NexusBoard</h1>
                <p>Real-time analytics simulator</p>
              </div>
            </div>
            <div className="page-header-right">
              <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search">
                🔍 <span className="search-trigger-text">Search</span> <kbd>⌘K</kbd>
              </button>
              <NotificationCenter />
              <span className="status-pill live">Live</span>
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
          </header>
          <main id="main-content" className="page-body">
            <Outlet />
          </main>
        </div>
      </div>

      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onToggleTheme={toggleTheme} />}
    </>
  );
};

export default Layout;