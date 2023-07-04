import { API_URL } from "Constants";
import React from "react";

type LobbyProps = {
  gameId: string;
  players: string[];
  userId: string;
};

export const Lobby = (props: LobbyProps) => {
  const handleStartGame = () => {
    fetch(`${API_URL}/api/start_game`, {
      method: "POST",
      headers: {
        "user-id": props.userId,
        "game-id": props.gameId,
      },
    }).then(async (res) => {
      if (res.ok) {
        console.log("started game", res);
      } else {
        console.log("failed to start game", res);
      }
    });
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-slate-400 w-96 p-4 rounded-md">
        <div className="grid place-content-center text-white">
          <div className="flex flex-col space-y-4">
            <div>Lobby for game {props.gameId}</div>
            <button onClick={handleStartGame}>Start Game</button>
            {props.players.map((player) => (
              <div key={player}>{player}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
