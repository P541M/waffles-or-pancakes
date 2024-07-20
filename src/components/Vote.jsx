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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl mb-4">Vote for Your Favorite</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => handleVote("Waffles")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={hasVoted}
        >
          Waffles
        </button>
        <button
          onClick={() => handleVote("Pancakes")}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          disabled={hasVoted}
        >
          Pancakes
        </button>
      </div>
      {hasVoted && <p className="mt-4">Thank you for voting!</p>}
      <div className="mt-8">
        <h2 className="text-2xl mb-2">Current Votes:</h2>
        <p>Waffles: {votes.Waffles}</p>
        <p>Pancakes: {votes.Pancakes}</p>
      </div>
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
