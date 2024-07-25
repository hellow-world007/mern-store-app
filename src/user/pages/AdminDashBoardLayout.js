import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashBoardLayout = () => {
  const activeStyles = {
    color: "#161616",
    fontWeight: "600",
    backgroundColor: "#dcdde1",
  };

  return (
    <div className="dashboardElement">
      <div className="dash">
          <nav className="host--navbar">
            <NavLink
              to="/admin-dashboard"
              end
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Users
            </NavLink>

            <NavLink
              to="/admin-dashboard/upload-product"
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Upload Products
            </NavLink>
            <NavLink
              to="/admin-dashboard/manage-product"
              style={({ isActive }) => (isActive ? activeStyles : null)}
            >
              Manage Products
            </NavLink>
          </nav>
        <div className="outlets">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashBoardLayout;
