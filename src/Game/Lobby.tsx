import React from "react";

import { API_URL } from "Constants";
import { CopyBox } from "components/CopyBox";

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
      // todo: handle errors
    });
  };

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div className="bg-gray-700 border-2 border-gray-600 w-64 p-4 rounded-md">
        <div className="text-white">
          <div className="text-center mb-3 text-xl font-semibold">Lobby</div>

          <div className="flex flex-col space-y-3">
            <div>
              <div className="mb-1">Game code</div>
              <CopyBox text={props.gameId} />
            </div>

            <div className="pb-2">
              <div className="flex flex-col space-y-2">
                <span>Players</span>
                {props.players.map((player) => (
                  <div>
                    <div
                      key={player}
                      className="min-w-fit rounded-md bg-slate-600 text-slate-200 font-bold px-3 py-1 w-min text-sm"
                    >
                      {player}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <button
                className="rounded-md w-full bg-teal-500 px-4 p-2 text-gray-50 font-semibold hover:bg-teal-600"
                onClick={handleStartGame}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
