import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Greeting from "./components/Greeting.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <div className="min-h-screen bg-gray-100">
      {token && <Navbar token={token} />}
      <Routes>
        <Route path="/greeting" element={<Greeting />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/dashboard" element={<Dashboard token={token} />} />
        <Route path="/admin" element={<AdminDashboard token={token} />} />
        <Route path="/" element={<Greeting />} />
      </Routes>
    </div>
  );
}

export default App;
