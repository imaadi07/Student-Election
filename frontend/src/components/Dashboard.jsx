import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [nominees, setNominees] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchNominees = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/nominees", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setNominees(response.data);
      } catch (err) {
        setError("Failed to load nominees.");
      }
    };
    fetchNominees();
  }, []);

  const handleVote = async (nomineeId, position) => {
    try {
      await axios.post(
        "http://localhost:5000/api/votes",
        { nomineeId, position },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      alert("Vote cast successfully!");
    } catch (err) {
      setError(err.response?.data?.msg || "Voting failed.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {nominees.length === 0 ? (
          <p>No nominees available for voting.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nominees.map((nominee) => (
              <div
                key={nominee._id}
                className="bg-white bg-opacity-80 p-4 rounded"
              >
                <h3 className="text-lg font-semibold">{nominee.name}</h3>
                <p>
                  <strong>Position:</strong> {nominee.position}
                </p>
                <button
                  onClick={() => handleVote(nominee._id, nominee.position)}
                  className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-2"
                >
                  Vote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
