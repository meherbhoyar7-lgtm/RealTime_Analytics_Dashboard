import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const COMMANDS = [
  { label: "Overview",          path: "/dashboard",             icon: "📊", keywords: "home dashboard overview main" },
  { label: "Performance",       path: "/dashboard/performance", icon: "⚡", keywords: "cpu memory network performance speed" },
  { label: "Errors",            path: "/dashboard/errors",      icon: "🐛", keywords: "errors bugs issues health" },
  { label: "Activity Log",      path: "/dashboard/activity",    icon: "📋", keywords: "activity log history events" },
  { label: "Settings",          path: "/dashboard/settings",    icon: "⚙️", keywords: "settings profile preferences config" },
  { label: "Toggle Theme",      action: "theme",                icon: "🌓", keywords: "dark light theme toggle mode" },
  { label: "Logout",            action: "logout",               icon: "🚪", keywords: "logout sign out exit" },
];

const SearchPalette = React.memo(({ onClose, onToggleTheme }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? COMMANDS.filter((c) => {
        const q = query.toLowerCase();
        return c.label.toLowerCase().includes(q) || c.keywords.includes(q);
      })
    : COMMANDS;

  const handleSelect = useCallback(
    (cmd) => {
      if (cmd.path) {
        navigate(cmd.path);
      } else if (cmd.action === "theme") {
        onToggleTheme?.();
      } else if (cmd.action === "logout") {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        navigate("/login");
      }
      onClose();
    },
    [navigate, onClose, onToggleTheme]
  );

  /* keyboard nav */
  const [active, setActive] = useState(0);
  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((p) => Math.min(p + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive((p) => Math.max(p - 1, 0)); }
      if (e.key === "Enter" && filtered[active]) handleSelect(filtered[active]);
    },
    [filtered, active, handleSelect, onClose]
  );

  return (
    <div className="search-overlay" onClick={onClose} onKeyDown={handleKey}>
      <div className="search-modal fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="search-input-wrap">
          <span className="search-input-icon">🔍</span>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search pages, commands..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKey}
          />
          <kbd className="search-kbd">ESC</kbd>
        </div>

        <div className="search-results">
          {filtered.length === 0 ? (
            <p className="search-empty">No results found</p>
          ) : (
            filtered.map((cmd, i) => (
              <button
                key={cmd.label}
                className={`search-result-item ${i === active ? "active" : ""}`}
                onClick={() => handleSelect(cmd)}
                onMouseEnter={() => setActive(i)}
              >
                <span className="search-result-icon">{cmd.icon}</span>
                <span>{cmd.label}</span>
              </button>
            ))
          )}
        </div>

        <div className="search-footer">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
});

SearchPalette.displayName = "SearchPalette";
export default SearchPalette;
