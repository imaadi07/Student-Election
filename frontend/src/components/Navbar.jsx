import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ token }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      isAdmin = payload.role === "admin";
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img
              src="./images/jiet-logo.png"
              alt="JIET Logo"
              className="h-10 w-10 mr-2"
            />
            <h1 className="text-xl font-bold">JIET Student Council Election</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
            >
              Home
            </Link>
            {token && (
              <Link
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
              >
                {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
              </Link>
            )}
            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md transition"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:bg-indigo-700 px-3 py-2 rounded-md transition"
              >
                Login
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block hover:bg-indigo-700 px-3 py-2 rounded-md"
            >
              Home
            </Link>
            {token && (
              <Link
                to={isAdmin ? "/admin-dashboard" : "/dashboard"}
                className="block hover:bg-indigo-700 px-3 py-2 rounded-md"
              >
                {isAdmin ? "Admin Dashboard" : "Student Dashboard"}
              </Link>
            )}
            {token ? (
              <button
                onClick={handleLogout}
                className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="block hover:bg-indigo-700 px-3 py-2 rounded-md"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
