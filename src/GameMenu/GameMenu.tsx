import { API_URL } from "Constants";
import React, { useState } from "react";

type GameMenuProps = {
  userId: string;
  displayName: string;
  setDisplayName: (displayName: string) => void;
  onGameEnter: (gameId: string, players: string[]) => void;
};

export const GameMenu = (props: GameMenuProps) => {
  const [joinGameInput, setJoinGameInput] = useState("");

  const handleCreateGame = async () => {
    console.log("creating game");
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        "user-id": props.userId,
        "display-name": props.displayName,
      },
    }).then(async (res) => {
      if (res.ok) {
        const body = await res.json();
        handleGameEnter(body.id, [props.displayName]);
      }
    });
  };

  const handleJoinGame = () => {
    fetch(`${API_URL}/api/join_game`, {
      method: "POST",
      headers: {
        "user-id": props.userId,
        "display-name": props.displayName,
        "game-id": joinGameInput,
      },
    }).then(async (res) => {
      console.log("joining game", res);
      if (res.ok) {
        const body = await res.json();
        console.log("joined game", body);
        handleGameEnter(joinGameInput, body.players);
      }
    });
  };

  const handleGameEnter = async (gameId: string, players: string[]) => {
    props.onGameEnter(gameId, players);
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
