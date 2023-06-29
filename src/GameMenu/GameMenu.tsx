import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

type GameMenuProps = {};

export const GameMenu = (props: GameMenuProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid place-content-center h-screen h-48 text-white">
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => {
            fetch("https://aces-backend.azurewebsites.net/api/create_game", {
              method: "POST",
              // credentials: "include",
            }).then((res) => {
              console.log(res);
              if (res.ok) {
                navigate("/game?id=asdf");
              }
            });
          }}
        >
          Create Game
        </button>
        <button>Join Game</button>
      </div>
    </div>
  );
};
