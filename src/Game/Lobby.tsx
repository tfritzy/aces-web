import React from "react";

type LobbyProps = {
  gameId: string;
  players: string[];
};

export const Lobby = (props: LobbyProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-slate-400 w-96 p-4 rounded-md">
        <div className="grid place-content-center text-white">
          <div className="flex flex-col space-y-4">
            <div>Lobby for game {props.gameId}</div>
            <button>Start Game</button>
            {props.players.map((player) => (
              <div>{player}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
