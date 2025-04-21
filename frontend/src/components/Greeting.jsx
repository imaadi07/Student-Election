import React from "react";
import { useNavigate } from "react-router-dom";

function Greeting() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: `url('/images/background.jpeg  ')`, // Update with your image filename
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-white/30 flex items-center justify-center">
        <div className="text-center p-6 bg-white/80 rounded-xl shadow-lg backdrop-blur-md">
          <h1 className="text-4xl font-bold text-indigo-700 mb-6">
            Welcome to JIET Student Council Election
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Please choose an option to get started.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Greeting;
