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
    <div className="grid place-content-center h-screen text-white">
      <div className="rounded-md border-2 border-slate-600 bg-slate-700 p-4 w-80">
        <div className="text-3xl text-center mb-4">Aces</div>

        <div className="flex flex-col space-y-8 divide-y divide-slate-500">
          <div>
            <label className="block mb-2 text-sm font-medium text-white">
              Display name
            </label>
            <input
              type="text"
              id="display_name"
              className="border text-sm rounded-lg focus:ring-emerald block w-full p-2 bg-slate-600 border-slate-400 placeholder-slate-400 text-white"
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
                  className="border text-sm rounded-lg focus:ring-emerald block w-full h-full p-2 bg-slate-600 border-slate-400 placeholder-slate-400 text-white"
                  value={joinGameInput}
                  placeholder="AIE-JCS"
                  onChange={(e) => setJoinGameInput(e.target.value)}
                />
              </div>

              <button
                className="flex-none rounded-md bg-emerald-500 px-4 p-2 text-slate-50 font-semibold"
                onClick={handleJoinGame}
              >
                Join
              </button>
            </div>

            <div className="text-slate-400 text-center">— or —</div>

            <button
              className="rounded-md bg-emerald-500 p-2 text-slate-50 font-semibold"
              onClick={handleCreateGame}
            >
              Create Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
