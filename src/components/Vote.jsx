import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import avatar from "../assets/characters/naked.png";
import pancake from "../assets/characters/pancakes.png";
import waffle from "../assets/characters/waffles.png";

const Vote = () => {
  const [votes, setVotes] = useState({ Waffles: 0, Pancakes: 0 });
  const [userVote, setUserVote] = useState(null);
  const [switchMessage, setSwitchMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [displayedImage, setDisplayedImage] = useState(avatar);

  const apiKey = process.env.REACT_APP_API_KEY;

  const fetchVotes = useCallback(async () => {
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
  }, [apiKey]);

  const fetchUserVote = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await axios.get(`/api/userVote/${userId}`, {
        headers: {
          "x-api-key": apiKey,
        },
      });
      setUserVote(response.data.vote);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setUserVote(null);
      } else {
        console.error("Error fetching user vote", error);
      }
    }
  }, [apiKey]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      const userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    fetchVotes();
    fetchUserVote();
  }, [fetchVotes, fetchUserVote]);

  // Update displayed image whenever userVote changes
  useEffect(() => {
    if (userVote === "Pancakes") {
      setDisplayedImage(pancake);
    } else if (userVote === "Waffles") {
      setDisplayedImage(waffle);
    } else {
      setDisplayedImage(avatar);
    }
  }, [userVote]);

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

  // Highlight logic: if user already voted for something, or user just selected it
  const isWafflesActive =
    selectedOption === "Waffles" || userVote === "Waffles";
  const isPancakesActive =
    selectedOption === "Pancakes" || userVote === "Pancakes";

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === "Pancakes") {
      setDisplayedImage(pancake);
    } else if (option === "Waffles") {
      setDisplayedImage(waffle);
    }
  };

  const handleVote = async (choice) => {
    if (userVote === choice) {
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
      fetchVotes();
    } catch (error) {
      console.error("Error submitting vote", error);
    }
  };

  // Revoke the current user’s vote
  const handleRevokeVote = async () => {
    if (!userVote) return;

    const userId = localStorage.getItem("userId");
    try {
      await axios.post(
        "/api/revokeUserVote",
        { userId },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );

      setUserVote(null);
      setSelectedOption(null);
      setDisplayedImage(avatar);
      setSwitchMessage("");
      fetchVotes();
    } catch (error) {
      console.error("Error revoking vote", error);
    }
  };

  // Clear selections when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !event.target.closest(".option-button") &&
        !event.target.closest(".vote-button") &&
        !event.target.closest(".revoke-button")
      ) {
        setSelectedOption(null);
        setSwitchMessage("");

        if (!userVote) {
          setDisplayedImage(avatar);
        } else {
          setDisplayedImage(userVote === "Pancakes" ? pancake : waffle);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [userVote]);

  return (
    <section className="flex min-h-screen flex-col items-center justify-between bg-sage p-4 transition-all ease-in-out md:p-8 lg:p-16">
      <div className="flex flex-grow flex-col items-center justify-center">
        {/* Switch Message */}
        <div className="mb-4 h-4 md:mb-8 lg:mb-12">
          {switchMessage && (
            <p className="fade-in px-4 text-center font-sub text-xl text-blue">
              {switchMessage}
            </p>
          )}
        </div>

        {/* Voting Section */}
        <div className="relative flex w-full flex-col items-center justify-center space-y-6 px-4 md:flex-row md:space-x-10 md:space-y-0 md:px-8 lg:px-16">
          {/* Waffles */}
          <div className="flex w-full flex-col items-center justify-center md:w-64">
            <button
              onClick={() => handleOptionClick("Waffles")}
              className={`option-button transform font-main text-3xl tracking-wide transition duration-300 text-stroke-3 text-stroke-blue hover:scale-105 md:text-6xl ${
                isWafflesActive
                  ? "text-blue"
                  : "text-transparent hover:text-blue"
              }`}
            >
              WAFFLES
            </button>
            <div className="mt-2">
              <p className="font-main text-xl text-blue md:text-2xl">
                Wafflers: {votes.Waffles}
              </p>
            </div>
          </div>

          {/* Character */}
          <div className="relative z-50 flex h-40 w-40 items-center justify-center md:h-80 md:w-80">
            <img
              src={displayedImage}
              alt=""
              className="absolute h-full object-contain"
            />
          </div>

          {/* Pancakes */}
          <div className="flex w-full flex-col items-center justify-center md:w-64">
            <button
              onClick={() => handleOptionClick("Pancakes")}
              className={`option-button transform font-main text-3xl tracking-wide transition duration-300 text-stroke-3 text-stroke-blue hover:scale-105 md:text-6xl ${
                isPancakesActive
                  ? "text-blue"
                  : "text-transparent hover:text-blue"
              }`}
            >
              PANCAKES
            </button>
            <div className="mt-2">
              <p className="font-main text-xl text-blue md:text-2xl">
                Pancakers: {votes.Pancakes}
              </p>
            </div>
          </div>
        </div>

        {/* Vote & Revoke Buttons */}
        <div className="mt-3 flex flex-col items-center space-y-2 md:mt-5">
          {selectedOption && (
            <button
              onClick={() => handleVote(selectedOption)}
              className="vote-button transform rounded-full bg-blue px-4 py-2 font-main text-lg tracking-wider text-sage transition-transform duration-200 hover:scale-105 hover:bg-green md:px-7 md:py-4 md:text-xl"
            >
              VOTE!
            </button>
          )}

          {userVote && (
            <button
              onClick={handleRevokeVote}
              className="revoke-button hover:bg-yellow-100 transform rounded-full bg-transparent px-2 py-1 font-main text-sm text-blue opacity-70 transition-colors duration-200 hover:opacity-100"
            >
              Reset my vote!
            </button>
          )}
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 px-4 py-4 text-left text-sm text-blue opacity-50">
        <p>&copy; {new Date().getFullYear()} Waffles or Pancakes?!</p>
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
