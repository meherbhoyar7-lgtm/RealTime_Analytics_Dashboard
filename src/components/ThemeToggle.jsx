import React, { useCallback } from "react";

const ThemeToggle = React.memo(({ darkMode, setDarkMode }) => {
  const toggle = useCallback(() => setDarkMode((prev) => !prev), [setDarkMode]);

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Light mode" : "Dark mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
});

ThemeToggle.displayName = "ThemeToggle";
export default ThemeToggle;