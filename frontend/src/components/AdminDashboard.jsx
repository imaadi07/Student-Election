import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [results, setResults] = useState([]);
  const [nominees, setNominees] = useState([]);
  const [nomineeName, setNomineeName] = useState("");
  const [position, setPosition] = useState("president");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/votes/results",
          {
            headers: { "x-auth-token": localStorage.getItem("token") },
          }
        );
        setResults(response.data);
      } catch (err) {
        setError("Failed to load results.");
      }
    };
    fetchResults();
  }, []);

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

  const addNominee = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/nominees",
        { name: nomineeName, position },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setNominees([...nominees, response.data]);
      setNomineeName("");
      setError("");
    } catch (err) {
      setError("Failed to add nominee.");
    }
  };

  const deleteNominee = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/nominees/${id}`, {
        headers: { "x-auth-token": localStorage.getItem("token") },
      });
      setNominees(nominees.filter((nominee) => nominee._id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete nominee.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpeg')" }}
    >
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white bg-opacity-80 p-4 rounded mb-6">
          <h3 className="text-xl font-semibold mb-2">Add Nominee</h3>
          <form onSubmit={addNominee}>
            <input
              type="text"
              value={nomineeName}
              onChange={(e) => setNomineeName(e.target.value)}
              placeholder="Nominee Name"
              className="p-2 border rounded mr-2"
              required
            />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="p-2 border rounded mr-2"
            >
              <option value="president">President</option>
              <option value="vice-president">Vice-President</option>
              <option value="secretary">Secretary</option>
              <option value="treasurer">Treasurer</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Add Nominee
            </button>
          </form>
        </div>
        <div className="bg-white bg-opacity-80 p-4 rounded mb-6">
          <h3 className="text-xl font-semibold mb-2">Nominees</h3>
          {nominees.length === 0 ? (
            <p>No nominees added yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nominees.map((nominee) => (
                <div key={nominee._id} className="border p-4 rounded">
                  <p>
                    <strong>Name:</strong> {nominee.name}
                  </p>
                  <p>
                    <strong>Position:</strong> {nominee.position}
                  </p>
                  <button
                    onClick={() => deleteNominee(nominee._id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white bg-opacity-80 p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Election Results</h3>
          {results.length === 0 ? (
            <p>No votes cast yet.</p>
          ) : (
            results.map((result) => (
              <div
                key={result._id.nomineeId}
                className="border p-4 rounded mb-2"
              >
                <p>
                  <strong>Nominee:</strong> {result.nominee.name}
                </p>
                <p>
                  <strong>Position:</strong> {result._id.position}
                </p>
                <p>
                  <strong>Votes:</strong> {result.count}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
