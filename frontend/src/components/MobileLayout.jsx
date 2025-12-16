import React from "react";
import { Outlet } from "react-router-dom";

function MobileLayout() {
  return (
    <div className="app-shell">
      <div className="mobile-shell">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileLayout;
