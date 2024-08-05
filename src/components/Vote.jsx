import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating unique IDs
import avatar from "../assets/characters/naked.png";

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
    <section className="flex flex-col min-h-screen justify-center items-center  bg-sage">
      {/* Display Switch Message */}
      <div className="h-4">
        {switchMessage && (
          <p className="mt-4 font-sub text-xl text-blue">{switchMessage}</p>
        )}
      </div>

      {/* Voting Section */}
      <div className="flex relative w-full items-center justify-center space-x-10">
        {/* Waffles Vote Button */}
        <div className="flex items-center justify-center w-64">   
          <button
            onClick={() => handleVote("Waffles")}
            className="font-main text-transparent text-6xl text-stroke-3 text-stroke-blue hover:text-blue"
          >
            WAFFLES
          </button>
          {userVote && <p className="font-main text-blue">Wafflers: {votes.Waffles}</p>}
        </div>
        {/* The Character */}
        <div className="flex items-center justify-center z-10">
          <img src={avatar} alt="" className="h-80 object-contain"></img>
        </div>
        {/* Pancakes Vote Button */}
        <div className="flex items-center justify-center w-64">
          <button
            onClick={() => handleVote("Pancakes")}
            className="font-main text-transparent text-6xl text-stroke-3 text-stroke-blue hover:text-blue"
          >
            PANCAKES
          </button>
          {userVote && <p className="font-main text-blue">Pancakers: {votes.Pancakes}</p>}
        </div>
      </div>
      {/* Display user's vote */}
      {/* {userVote && <p className="mt-4 text-xl">You voted for {userVote}</p>} */}
      
      <div>
        <button className="rounded-full px-7 py-2 tracking-wider text-sage bg-blue font-main">VOTE</button>
      </div>
      {/* Testing components, don't mind these */}
      {/* Reset Vote Button */}
      <button
        onClick={resetVote}
        className="m-2 rounded bg-yellow px-4 py-4 text-blue"
      >
        Reset Vote
      </button>
      {/* Reset Counter Button */}
      <button
        onClick={resetCounter}
        className="m-2 rounded bg-yellow px-4 py-4 text-blue"
      >
        Reset Counter
      </button>
    </section>
  );
};

export default Vote;
