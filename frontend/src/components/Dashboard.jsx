import React, { useState, useEffect } from "react";
import VotingForm from "./VotingForm.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

function Dashboard({ token }) {
  const [nominees, setNominees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const checkRole = () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") {
          navigate("/admin");
        }
      } catch (error) {
        console.error("Token parsing error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    checkRole();

    const fetchNominees = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/nominees", {
          headers: { "x-auth-token": token },
        });
        if (!res.ok) throw new Error("Failed to fetch nominees");
        const data = await res.json();
        setNominees(data);
      } catch (error) {
        console.error("Fetch nominees error:", error);
      }
    };
    fetchNominees();
  }, [token, navigate]);

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: `url('/background.jpg')`, // Update with valid path
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-white/30">
        <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 rounded-2xl shadow-xl p-8 backdrop-blur-md">
            <h2 className="text-4xl font-extrabold text-indigo-700 mb-8">
              JIET Student Dashboard
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                  Cast Your Vote
                </h3>
                <VotingForm token={token} nominees={nominees} />
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default Dashboard;
