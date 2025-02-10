// src/components/settings/SettingsLayout.tsx
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const SettingsLayout: React.FC = () => {
  const location = useLocation();

  const tabs = [
    { name: "Profile", path: "/settings/profile" },
    { name: "Security", path: "/settings/security" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        {tabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              "px-4 py-2 -mb-px",
              location.pathname === tab.path
                ? "border-b-2 border-purple-500 text-purple-600"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default SettingsLayout;