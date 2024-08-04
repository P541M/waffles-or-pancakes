import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating unique IDs

const Vote = () => {
  const [votes, setVotes] = useState({ Waffles: 0, Pancakes: 0 });
  const [userVote, setUserVote] = useState(null); // Track the user's vote
  const [switchMessage, setSwitchMessage] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    fetchVotes();
    fetchUserVote();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/votes");
      setVotes(response.data);
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  const fetchUserVote = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://localhost:5000/userVote/${userId}`,
      );
      setUserVote(response.data.vote);
    } catch (error) {
      console.error("Error fetching user vote", error);
    }
  };

  // Generate a random switch message
  const getRandomSwitchMessage = (from, to) => {
    const messages = [
      `WHAT?! You switched from ${from} to ${to}!`,
      `Oh no! Betrayed ${from} for ${to}!`,
      `Switched from ${from} to ${to}? Bold move!`,
      `Goodbye ${from}, hello ${to}!`,
      `${from} was yesterday, today it's ${to}!`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // Handle user voting
  const handleVote = async (choice) => {
    const userId = localStorage.getItem("userId");
    try {
      await axios.post("http://localhost:5000/vote", { userId, vote: choice });
      if (userVote && userVote !== choice) {
        setSwitchMessage(getRandomSwitchMessage(userVote, choice));
      }
      setUserVote(choice);
      fetchVotes(); // Update the votes after voting
    } catch (error) {
      console.error("Error submitting vote", error);
    }
  };

  // Reset user's vote
  const resetVote = () => {
    localStorage.removeItem("userId");
    setUserVote(null);
    setSwitchMessage("");
  };

  // Reset all votes
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
      {/* Voting Section */}
      <div className="relative flex h-64 w-full items-center justify-center">
        <div className="relative flex items-center space-x-8">
          {/* Waffles Vote Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote("Waffles")}
              className="rounded-lg bg-blue-500 px-6 py-3 text-2xl text-white"
            >
              Waffles
            </button>
            <p className="mt-2 text-2xl">Wafflers: {votes.Waffles}</p>
          </div>
          <div className="text-6xl">🍽️</div> {/* Character in between */}
          {/* Pancakes Vote Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleVote("Pancakes")}
              className="rounded-lg bg-yellow-500 px-6 py-3 text-2xl text-white"
            >
              Pancakes
            </button>
            <p className="mt-2 text-2xl">Pancakers: {votes.Pancakes}</p>
          </div>
        </div>
      </div>
      {/* Display user's vote */}
      {userVote && <p className="mt-4 text-xl">You voted for {userVote}</p>}
      {/* Display switch message */}
      {switchMessage && (
        <p className="mt-4 text-xl text-red-500">{switchMessage}</p>
      )}

      {/* Testing components, don't mind these */}
      {/* Reset Vote Button */}
      <button
        onClick={resetVote}
        className="mt-4 rounded bg-red-500 px-4 py-2 text-white"
      >
        Reset Vote
      </button>
      {/* Reset Counter Button */}
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
