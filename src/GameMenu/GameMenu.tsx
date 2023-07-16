import { API_URL } from "Constants";
import { Modal } from "components/Modal";
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
      if (res.ok) {
        const body = await res.json();
        handleGameEnter(joinGameInput, body.players);
      }
    });
  };

  const handleGameEnter = async (gameId: string, players: string[]) => {
    props.onGameEnter(gameId, players);
  };

  return (
    <Modal>
      <div className="p-4">
        <div className="text-3xl text-center mb-4">Aces</div>

        <div className="flex flex-col space-y-8 divide-y divide-gray-300 dark:divide-gray-600">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Display name
            </label>
            <input
              type="text"
              id="display_name"
              className="border drop-shadow text-sm rounded-lg focus:ring-emerald block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-400 dark:placeholder-gray-400"
              value={props.displayName}
              onChange={(e) => props.setDisplayName(e.target.value)}
            />
          </div>

          <div className="pt-8 flex flex-col space-y-3">
            <div className="flex flex-row space-x-2">
              <div className="grow">
                <input
                  type="text"
                  id="game"
                  className="border drop-shadow text-sm rounded-lg focus:ring-emerald block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-400 dark:placeholder-gray-400"
                  value={joinGameInput}
                  placeholder="AIE-JCS"
                  onChange={(e) => setJoinGameInput(e.target.value)}
                />
              </div>

              <button
                className="flex-none rounded-md bg-teal-500 border border-teal-600 drop-shadow px-4 p-2 text-gray-50 font-semibold"
                onClick={handleJoinGame}
              >
                Join
              </button>
            </div>

            <div className="text-gray-400 text-center">— or —</div>

            <button
              className="rounded-md bg-teal-500 border border-teal-600 drop-shadow p-2 text-gray-50 font-semibold"
              onClick={handleCreateGame}
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
