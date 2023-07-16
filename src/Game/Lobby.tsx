import React from "react";

import { API_URL } from "Constants";
import { CopyBox } from "components/CopyBox";
import { Modal } from "components/Modal";

type LobbyProps = {
  gameId: string;
  players: { displayName: string }[];
  userId: string;
  onError: (error: string) => void;
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
      if (!res.ok) {
        const body = await res.text();
        props.onError(body);
      }
    });
  };

  return (
    <Modal>
      <div className="text-gray-700 dark:text-white p-4">
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
                <div
                  key={player.displayName}
                  className="min-w-fit rounded-md font-bold px-3 py-1 w-min text-sm text-gray-600 bg-gray-200 dark:bg-slate-600 dark: dark:text-slate-200"
                >
                  {player.displayName}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <button
              className="rounded-md w-full drop-shadow bg-teal-500 border border-teal-600 px-4 p-2 text-white font-semibold hover:bg-teal-600"
              onClick={handleStartGame}
            >
              Start Game
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
