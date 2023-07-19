import React, { useState } from "react";

import { API_URL } from "Constants";
import { Modal } from "components/Modal";
import Cookies from "universal-cookie";
import { Button } from "components/Button";

type GameMenuProps = {
  userId: string;
  displayName: string;
  setDisplayName: (displayName: string) => void;
  onGameEnter: (gameId: string, players: string[]) => void;
};

const adjectives = [
  "Joyful",
  "Radiant",
  "Whimsical",
  "Playful",
  "Cheerful",
  "Enchanting",
  "Lively",
  "Sunny",
  "Breezy",
  "Delightful",
  "Sparkling",
  "Charming",
  "Sprightly",
  "Jolly",
  "Festive",
  "Blissful",
  "Grinning",
  "Magical",
  "Harmonious",
  "Carefree",
];

const nouns = [
  "Dreamer",
  "Starlight",
  "Sunshine",
  "Flutterby",
  "Merrymaker",
  "Rainbow",
  "Sparkler",
  "Sweetheart",
  "Wishmaker",
  "Smiler",
  "Joybringer",
  "Hugbug",
  "Giggler",
  "Bubbly",
  "Heartwarming",
  "Laughter",
  "Songbird",
  "Sunbeam",
  "Happy-Go-Lucky",
  "Puddlejumper",
];

export const GameMenu = (props: GameMenuProps) => {
  const [joinGameInput, setJoinGameInput] = useState("");
  const [joinPending, setJoinPending] = useState(false);
  const [createPending, setCreatePending] = useState(false);

  React.useEffect(() => {
    const cookies = new Cookies();
    let displayName = cookies.get("display-name");
    if (!displayName) {
      displayName = `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
      } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    }
    props.setDisplayName(displayName);
    // Mount effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateGame = async () => {
    setCreatePending(true);
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        "user-id": props.userId,
        "display-name": props.displayName,
      },
    }).then(async (res) => {
      setCreatePending(false);
      if (res.ok) {
        const body = await res.json();
        handleGameEnter(body.id, [props.displayName]);
      }
    });
  };

  const handleJoinGame = () => {
    setJoinPending(true);
    fetch(`${API_URL}/api/join_game`, {
      method: "POST",
      headers: {
        "user-id": props.userId,
        "display-name": props.displayName,
        "game-id": joinGameInput,
      },
    }).then(async (res) => {
      setJoinPending(false);
      if (res.ok) {
        const body = await res.json();
        handleGameEnter(joinGameInput, body.players);
      }
    });
  };

  const handleGameEnter = async (gameId: string, players: string[]) => {
    props.onGameEnter(gameId, players);
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.setDisplayName(e.target.value);
    const cookies = new Cookies();
    cookies.set("display-name", e.target.value, { path: "/" });
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
              onChange={handleDisplayNameChange}
            />
          </div>

          <div className="pt-8 flex flex-col space-y-3">
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

            <Button
              text="Join"
              onClick={handleJoinGame}
              pending={joinPending}
              type="primary"
            />

            <div className="text-gray-400 text-center">— or —</div>

            <Button
              onClick={handleCreateGame}
              text="Create Game"
              pending={createPending}
              type="primary"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
