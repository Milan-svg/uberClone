import React from "react";
import { Outlet } from "react-router-dom";

function MobileLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="mobile-container">
        <Outlet />
      </div>
    </div>
  );
}

export default MobileLayout;
