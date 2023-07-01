import { AppState } from "App";
import { API_URL } from "Constants";
import React, { useEffect, useState } from "react";

type GameMenuProps = {
  displayName: string;
  setDisplayName: (displayName: string) => void;
  onGameEnter: (gameId: string) => void;
};

export const GameMenu = (props: GameMenuProps) => {
  const [joinGameInput, setJoinGameInput] = useState("");

  const handleCreateGame = async () => {
    console.log("creating game");
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        "user-id": props.displayName,
      },
    }).then(async (res) => {
      console.log("created game", res);
      if (res.ok) {
        const body = await res.json();
        console.log("created game", body);
        handleGameEnter(body.id);
      }
    });
  };

  const handleJoinGame = () => {
    handleGameEnter(joinGameInput);
  };

  const handleGameEnter = async (gameId: string) => {
    props.onGameEnter(gameId);
  };

  return (
    <div className="grid place-content-center h-screen h-48 text-white">
      <div className="flex flex-col space-y-12">
        <button onClick={handleCreateGame}>Create Game</button>

        <div className="flex flex-col">
          <div className="text-black">
            <input
              type="text"
              value={joinGameInput}
              placeholder="AIE-JCS"
              onChange={(e) => setJoinGameInput(e.target.value)}
            />
          </div>

          <button onClick={handleJoinGame}>Join Game</button>
        </div>

        <div>
          <div>Display name</div>
          <div className="text-black">
            <input
              type="text"
              value={props.displayName}
              onChange={(e) => props.setDisplayName(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
