import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Vote.css"; // Import the CSS file

const Vote = () => {
  const [hasVoted, setHasVoted] = useState(false);
  const [votes, setVotes] = useState({ Waffles: 0, Pancakes: 0 });

  useEffect(() => {
    const userVoted = localStorage.getItem("hasVoted");
    if (userVoted) {
      setHasVoted(true);
    }

    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/votes");
      setVotes(response.data);
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  const handleVote = async (choice) => {
    if (hasVoted) return;

    try {
      await axios.post("http://localhost:5000/vote", { vote: choice });
      localStorage.setItem("hasVoted", "true");
      setHasVoted(true);
      fetchVotes(); // Update the votes after voting
    } catch (error) {
      console.error("Error submitting vote", error);
    }
  };

  const resetVote = () => {
    localStorage.removeItem("hasVoted");
    setHasVoted(false);
  };

  const resetCounter = async () => {
    try {
      await axios.post("http://localhost:5000/reset");
      fetchVotes(); // Update the votes after resetting
    } catch (error) {
      console.error("Error resetting votes", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="relative flex justify-center items-center h-64 w-full">
        <div className="relative flex items-center space-x-8">
          <div className="flex flex-col items-center floating1">
            <button
              onClick={() => handleVote("Waffles")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg text-2xl"
              disabled={hasVoted}
            >
              Waffles
            </button>
            <p className="mt-2 text-2xl">Wafflers: {votes.Waffles}</p>
          </div>
          <div className="text-6xl floating2">🍽️</div>{" "}
          {/* Character in between */}
          <div className="flex flex-col items-center floating3">
            <button
              onClick={() => handleVote("Pancakes")}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg text-2xl"
              disabled={hasVoted}
            >
              Pancakes
            </button>
            <p className="mt-2 text-2xl">Pancakers: {votes.Pancakes}</p>
          </div>
        </div>
      </div>
      {hasVoted && <p className="mt-4 text-xl">Thank you for voting!</p>}
      {/* Temporary reset buttons */}
      <button
        onClick={resetVote}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Vote
      </button>
      <button
        onClick={resetCounter}
        className="px-4 py-2 bg-red-500 text-white rounded mt-4"
      >
        Reset Counter
      </button>
    </div>
  );
};

export default Vote;
