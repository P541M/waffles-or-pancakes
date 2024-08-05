import React from "react";
import avatar from "../assets/characters/naked.png";
// import pancake from "../assets/characters/pancakes.png";
// import waffle from "../assets/characters/waffles.png";

const Page = () => {
    return (
        <section className="flex flex-col min-h-screen justify-center items-center  bg-sage">
            <div className="h-4">
                <p className="mt-4 font-sub text-xl text-blue">WHAT?! You switched from Waffles to Pancake!</p>
            </div>
            <div className="flex relative w-full items-center justify-center space-x-10">
                <div className="flex flex-col items-center justify-center w-64">   
                    <button className="font-main text-transparent text-6xl text-stroke-3 text-stroke-blue hover:text-blue mb-2">WAFFLES</button>
                    <p className="font-main text-blue">Wafflers: 24</p>
                </div>
                <div className="flex items-center justify-center z-10">
                    <img src={avatar} alt="" className="h-80 object-contain"></img>
                </div>
                <div className="flex flex-col items-center justify-center w-64">
                    <button className="font-main text-transparent text-6xl text-stroke-3 text-stroke-blue hover:text-blue mb-2">PANCAKES</button>
                    <p className="font-main text-blue">Pancakers: 24</p>
                </div>
            </div>
            <button className="rounded-full px-7 py-2 tracking-wider text-sage bg-blue font-main">VOTE</button>
        </section>
    );
};

export default Page;