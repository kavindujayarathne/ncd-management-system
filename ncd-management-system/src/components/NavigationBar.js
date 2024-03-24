import "./NavigationBar.css";
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const NavigationBar = ({ isLoggedIn, userType, handleLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="nav-link" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/About" className="nav-link" activeClassName="active">
          About
        </NavLink>
        {isLoggedIn && (
          <>
            {userType === "normal" ? (
              <NavLink
                to="/UserDashboard"
                className="nav-link"
                activeClassName="active"
              >
                User Dashboard
              </NavLink>
            ) : (
              <NavLink
                to="/HospitalDashboard"
                className="nav-link"
                activeClassName="active"
              >
                Hospital Dashboard
              </NavLink>
            )}
          </>
        )}
      </div>
      <div className="navbar-right">
        {isLoggedIn ? (
          <button className="btn" onClick={handleLogoutClick}>
            Log Out
          </button>
        ) : (
          <>
            <NavLink to="/Login" className="nav-link" activeClassName="active">
              Login
            </NavLink>
            <NavLink to="/SignUp" className="nav-link" activeClassName="active">
              SignUp
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
