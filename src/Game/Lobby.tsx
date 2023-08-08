import React from "react";

import { API_URL } from "Constants";
import { CopyBox } from "components/CopyBox";
import { Modal } from "components/Modal";
import { Button } from "components/Button";

type LobbyProps = {
  gameId: string;
  players: { displayName: string }[];
  token: string;
  onError: (error: string) => void;
  shown: boolean;
  onClose: () => void;
};

export const Lobby = (props: LobbyProps) => {
  const handleStartGame = () => {
    fetch(`${API_URL}/api/start_game`, {
      method: "POST",
      headers: {
        token: props.token,
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
    <Modal shown={props.shown} width="w-64" onClose={props.onClose}>
      <div className="text-gray-700 dark:text-white divide-y divide-gray-200 dark:divide-gray-600">
        <div className="text-center p-3 text-xl font-semibold">Lobby</div>

        <div className="flex flex-col space-y-4 p-3 py-4">
          <div>
            <div className="mb-2">Game code</div>
            <CopyBox text={props.gameId} />
          </div>

          <div className="">
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
        </div>

        <div className="p-3">
          <Button
            onClick={handleStartGame}
            text="Start Game"
            type="primary"
            size="jumbo"
          />
        </div>
      </div>
    </Modal>
  );
};
