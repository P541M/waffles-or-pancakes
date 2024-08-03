import React, { useState, useEffect } from "react";
import axios from "axios";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="relative flex h-64 w-full items-center justify-center">
        <div className="relative flex items-center space-x-8">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote("Waffles")}
              className="rounded-lg bg-blue-500 px-6 py-3 text-2xl text-white"
              disabled={hasVoted}
            >
              Waffles
            </button>
            <p className="mt-2 text-2xl">Wafflers: {votes.Waffles}</p>
          </div>
          <div className="text-6xl">🍽️</div> {/* Character in between */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote("Pancakes")}
              className="rounded-lg bg-yellow-500 px-6 py-3 text-2xl text-white"
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
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Reset Vote
      </button>
      <button
        onClick={resetCounter}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Reset Counter
      </button>
    </div>
  );
};

export default Vote;
