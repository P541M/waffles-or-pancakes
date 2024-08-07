import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Import UUID library for generating unique IDs
import avatar from "../assets/characters/naked.png";
import pancake from "../assets/characters/pancakes.png";
import waffle from "../assets/characters/waffles.png";
import skewedPancake from "../assets/characters/pancakes_skewed.png"; // Import skewed versions of the characters
import skewedWaffle from "../assets/characters/waffles_skewed.png";
import skewedRight from "../assets/characters/naked_right.png"; // Placeholder for skewed avatar version 1
import skewedLeft from "../assets/characters/naked_left.png"; // Placeholder for skewed avatar version 2

const Vote = () => {
  const [votes, setVotes] = useState({ Waffles: 0, Pancakes: 0 });
  const [userVote, setUserVote] = useState(null); // Track the user's vote
  const [switchMessage, setSwitchMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(avatar);

  const apiKey = process.env.REACT_APP_API_KEY; // Ensure this is added to your frontend environment variables in Vercel

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
      const response = await axios.get("/api/votes", {
        headers: {
          "x-api-key": apiKey,
        },
      });
      setVotes(response.data);
    } catch (error) {
      console.error("Error fetching votes", error);
    }
  };

  // Fetch the user's vote from the server
  const fetchUserVote = async () => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`/api/userVote/${userId}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
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
    }, 12); // Display skewed image for 12 milliseconds
  };

  // Handle user voting
  const handleVote = async (choice) => {
    if (userVote === choice) {
      // If the user is voting for the same option, do nothing
      console.log("You have already voted for this option.");
      return;
    }

    const userId = localStorage.getItem("userId");
    try {
      await axios.post(
        "/api/vote",
        { userId, vote: choice },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );
      if (userVote && userVote !== choice) {
        setSwitchMessage(getRandomSwitchMessage(userVote, choice));
      }
      setUserVote(choice);
      fetchVotes(); // Update the votes after voting
    } catch (error) {
      console.error("Error submitting vote", error);
    }
  };

  // Reset to default character when clicking outside options and vote button
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".option-button") &&
        !event.target.closest(".vote-button")
      ) {
        setDisplayedImage(
          selectedOption === "Pancakes" ? skewedLeft : skewedRight,
        );
        setTimeout(() => {
          setDisplayedImage(avatar);
        }, 20); // Display skewed avatar for 20 milliseconds
        setSelectedOption(null);
        setSwitchMessage("");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [selectedOption]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-between bg-sage p-4 md:p-8 lg:p-16">
      <div className="flex flex-grow flex-col items-center justify-center">
        {/* Display Switch Message */}
        <div className="mb-4 h-4 md:mb-8 lg:mb-12">
          {switchMessage && (
            <p className="px-4 text-center font-sub text-xl text-blue">
              {switchMessage}
            </p>
          )}
        </div>

        {/* Voting Section */}
        <div className="relative flex w-full flex-col items-center justify-center space-y-6 px-4 md:flex-row md:space-x-10 md:space-y-0 md:px-8 lg:px-16">
          {/* Waffles Vote Button */}
          <div className="flex w-full flex-col items-center justify-center md:w-64">
            <button
              onClick={() => handleOptionClick("Waffles")}
              className={`option-button font-main text-3xl tracking-wide text-stroke-3 text-stroke-blue hover:text-blue md:text-6xl ${
                selectedOption === "Waffles" ? "text-blue" : "text-transparent"
              }`}
            >
              WAFFLES
            </button>
            {/* Display Waffles vote count */}
            <div className="mt-2">
              <p className="font-main text-xl text-blue md:text-2xl">
                Wafflers: {votes.Waffles}
              </p>
            </div>
          </div>
          {/* The Character */}
          <div className="relative flex h-40 w-40 items-center justify-center md:h-80 md:w-80">
            <img
              src={displayedImage}
              alt=""
              className="absolute h-full object-contain"
            ></img>
          </div>
          {/* Pancakes Vote Button */}
          <div className="flex w-full flex-col items-center justify-center md:w-64">
            <button
              onClick={() => handleOptionClick("Pancakes")}
              className={`option-button font-main text-3xl tracking-wide text-stroke-3 text-stroke-blue hover:text-blue md:text-6xl ${
                selectedOption === "Pancakes" ? "text-blue" : "text-transparent"
              }`}
            >
              PANCAKES
            </button>
            {/* Display Pancakes vote count */}
            <div className="mt-2">
              <p className="font-main text-xl text-blue md:text-2xl">
                Pancakers: {votes.Pancakes}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 h-[40px] md:mt-5">
          {selectedOption && (
            <button
              onClick={() => handleVote(selectedOption)}
              className="vote-button rounded-full bg-blue px-4 py-2 font-main text-lg tracking-wider text-sage md:px-7 md:py-4 md:text-xl"
            >
              VOTE!
            </button>
          )}
        </div>
      </div>
      <footer className="absolute bottom-0 left-0 px-4 py-4 text-left text-sm text-blue opacity-50">
        <p>&copy; {new Date().getFullYear()} Waffles Or Pancakes!?</p>
        <p>
          Crafted by{" "}
          <a
            href="https://github.com/P541M"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eleazar
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/milychang19"
            className="hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Emily
          </a>
        </p>
      </footer>
    </section>
  );
};

export default Vote;
