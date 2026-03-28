import React, { useCallback, useState } from "react";

const RefreshButton = React.memo(({ onClick }) => {
  const [spinning, setSpinning] = useState(false);

  const handleClick = useCallback(() => {
    setSpinning(true);
    onClick?.();
    setTimeout(() => setSpinning(false), 600);
  }, [onClick]);

  return (
    <button className="refresh-btn" onClick={handleClick} aria-label="Refresh data">
      <span className="icon" style={spinning ? { transform: "rotate(360deg)" } : {}}>
        🔄
      </span>
      Refresh
    </button>
  );
});

RefreshButton.displayName = "RefreshButton";
export default RefreshButton;