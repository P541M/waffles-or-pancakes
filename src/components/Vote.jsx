import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating unique IDs
import avatar from "../assets/characters/naked.png";
import pancake from "../assets/characters/pancakes.png";
import waffle from "../assets/characters/waffles.png";
import skewedPancake from "../assets/characters/pancakes_skewed.png"; // Import skewed versions of the characters
import skewedWaffle from "../assets/characters/waffles_skewed.png";

const Vote = () => {
  const [votes, setVotes] = useState({ Waffles: 0, Pancakes: 0 });
  const [userVote, setUserVote] = useState(null); // Track the user's vote
  const [switchMessage, setSwitchMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(avatar);

  // Fetch votes and user vote on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    fetchVotes();
    fetchUserVote();
  }, []);

  // Fetch current vote counts from the server
  const fetchVotes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/votes");
      setVotes(response.data);
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  // Fetch the user's vote from the server
  const fetchUserVote = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(
        `http://localhost:5000/userVote/${userId}`,
      );
      setUserVote(response.data.vote);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Handle the case where the user vote is not found
        setUserVote(null);
      } else {
        console.error("Error fetching user vote", error);
      }
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

  // Handle user selection
  const handleOptionClick = (option) => {
    setSelectedOption(option);

    // Show skewed image for transition
    if (option === "Pancakes") {
      setDisplayedImage(skewedPancake);
    } else if (option === "Waffles") {
      setDisplayedImage(skewedWaffle);
    }

    setTimeout(() => {
      // Set the final image after the skewed image
      if (option === "Pancakes") {
        setDisplayedImage(pancake);
      } else if (option === "Waffles") {
        setDisplayedImage(waffle);
      }
    }, 10); // Display skewed image for 10 milliseconds
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
    setDisplayedImage(avatar);
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
    <section className="flex min-h-screen flex-col items-center justify-center bg-sage">
      {/* Display Switch Message */}
      <div className="h-4">
        {switchMessage && (
          <p className="mt-4 font-sub text-xl text-blue">{switchMessage}</p>
        )}
      </div>

      {/* Voting Section */}
      <div className="relative flex w-full items-center justify-center space-x-10">
        {/* Waffles Vote Button */}
        <div className="flex w-64 flex-col items-center justify-center">
          <button
            onClick={() => handleOptionClick("Waffles")}
            className={`font-main text-6xl text-stroke-3 text-stroke-blue hover:text-blue ${
              selectedOption === "Waffles" ? "text-blue" : "text-transparent"
            }`}
          >
            WAFFLES
          </button>
          {/* Display Waffles vote count */}
          <div className="mt-2">
            <p className="font-main text-blue">Wafflers: {votes.Waffles}</p>
          </div>
        </div>
        {/* The Character */}
        <div className="relative flex h-80 w-80 items-center justify-center">
          <img
            src={displayedImage}
            alt=""
            className="absolute h-full object-contain"
          ></img>
        </div>
        {/* Pancakes Vote Button */}
        <div className="flex w-64 flex-col items-center justify-center">
          <button
            onClick={() => handleOptionClick("Pancakes")}
            className={`font-main text-6xl text-stroke-3 text-stroke-blue hover:text-blue ${
              selectedOption === "Pancakes" ? "text-blue" : "text-transparent"
            }`}
          >
            PANCAKES
          </button>
          {/* Display Pancakes vote count */}
          <div className="mt-2">
            <p className="font-main text-blue">Pancakers: {votes.Pancakes}</p>
          </div>
        </div>
      </div>

      <div className="h-[40px]">
        {selectedOption && (
          <button
            onClick={() => handleVote(selectedOption)}
            className="rounded-full bg-blue px-7 py-2 font-main tracking-wider text-sage"
          >
            VOTE
          </button>
        )}
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
