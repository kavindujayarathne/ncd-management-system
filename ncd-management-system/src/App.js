import React, { useState } from "react";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import HospitalDashboard from "./components/HospitalDashboard";
import NavigationBar from "./components/NavigationBar";
//Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [userType, setUserType] = useState(() => {
    return localStorage.getItem("userType") || "hospital";
  });

  const handleLogin = (type) => {
    setIsLoggedIn(true);
    setUserType(type);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userType", type);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType("hospital");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userType");
  };

  return (
    <Router>
      <NavigationBar
        isLoggedIn={isLoggedIn}
        userType={userType}
        handleLogout={handleLogout}
      />
      <Routes>
        <Route>element</Route>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/Login" element={<Login handleLogin={handleLogin} />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/UserDashboard" element={<UserDashboard />} />
        <Route path="/HospitalDashboard" element={<HospitalDashboard />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
