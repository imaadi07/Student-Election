import React, { useState, useEffect } from "react";
import AdminNomineeForm from "./AdminNomineeForm.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./Navbar.jsx";

function AdminDashboard({ token }) {
  const [nominees, setNominees] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const checkRole = () => {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role !== "admin") {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Token parsing error:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    checkRole();

    const fetchData = async () => {
      try {
        const nomineesRes = await fetch("http://localhost:5000/api/nominees", {
          headers: { "x-auth-token": token },
        });
        const resultsRes = await fetch(
          "http://localhost:5000/api/votes/results",
          {
            headers: { "x-auth-token": token },
          }
        );
        if (!nomineesRes.ok || !resultsRes.ok)
          throw new Error("Failed to fetch data");
        setNominees(await nomineesRes.json());
        setResults(await resultsRes.json());
      } catch (error) {
        console.error("Fetch data error:", error);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleRemove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/nominees/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });
      if (!res.ok) throw new Error("Failed to remove nominee");
      setNominees(nominees.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Remove nominee error:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 bg-cover bg-center"
      style={{
        backgroundImage: `url('/path/to/background-image.jpg')`, // Replace with actual image path
        backgroundAttachment: "fixed",
      }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-white/30">
        {/* <Navbar token={token} /> */}
        <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 rounded-2xl shadow-xl p-8 backdrop-blur-md">
            <h2 className="text-4xl font-extrabold text-indigo-700 mb-8">
              JIET Admin Dashboard
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <AdminNomineeForm token={token} setNominees={setNominees} />
              </div>
              <div>
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Nominees
                  </h3>
                  <ul className="space-y-3">
                    {nominees.map((n) => (
                      <li
                        key={n._id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <span className="text-gray-800 font-medium">
                          {n.name} -{" "}
                          {n.position.replace("-", " ").toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleRemove(n._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Election Results
                  </h3>
                  <ul className="space-y-3">
                    {results.map((r) => (
                      <li
                        key={r._id.nomineeId}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-800">
                          {r.nominee.name} (
                          {r._id.position.replace("-", " ").toUpperCase()}):{" "}
                        </span>
                        <span className="font-semibold">{r.count} votes</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
}

export default AdminDashboard;
