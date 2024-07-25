import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Dashboard.css";
import { AuthContext } from "../../shared/context/auth-context";

const UserDashboardLayout = () => {
  const activeStyles = {
    color: "#161616",
    fontWeight: "600",
    backgroundColor: "#dcdde1",
  };
  const auth = useContext(AuthContext)

  return (
    <div className="dashboardEl">
      <div className="dashboard">
        <nav className="host--navv">
          <div className="account">Account</div>
          <NavLink
            to={`/user-dashboard/${auth.userId}`}
            end
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Account Details
          </NavLink>

          <NavLink
            to={`/user-dashboard/${auth.userId}/address`}
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Address
          </NavLink>

          <NavLink
            to={`/user-dashboard/${auth.userId}/orders`}
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Order
          </NavLink>

          <NavLink
            to={`/user-dashboard/${auth.userId}/wishlist`}
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Wishlist
          </NavLink>

          <NavLink
            to={`/user-dashboard/${auth.userId}/support`}
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Support
          </NavLink>
        </nav>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardLayout;
