import React, { useState } from "react";

import { API_URL } from "Constants";
import { Modal } from "components/Modal";
import Cookies from "universal-cookie";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setDisplayName } from "store/selfSlice";
import { GameState, setGameId } from "store/gameSlice";
import { addPlayer } from "store/playerSlice";
import { setState } from "store/gameSlice";
import { handleError } from "helpers/handleError";
import { ToastProps } from "components/Toast";

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
  "Smith",
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
  "Laugher",
  "Songbird",
  "Sunbeam",
  "Mason",
  "Puddlejumper",
];

type GameMenuProps = {
  addToast: (props: ToastProps) => void;
};

export const GameMenu = (props: GameMenuProps) => {
  const [joinGameInput, setJoinGameInput] = useState("");
  const [joinPending, setJoinPending] = useState(false);
  const [createPending, setCreatePending] = useState(false);
  const self = useSelector((state: RootState) => state.self);
  const dispatch = useDispatch();

  React.useEffect(() => {
    const cookies = new Cookies();
    let displayName = cookies.get("display-name");
    if (!displayName) {
      displayName = `${
        adjectives[Math.floor(Math.random() * adjectives.length)]
      } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    }
    dispatch(setDisplayName(displayName));

    // Mount effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateGame = async () => {
    setCreatePending(true);
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "display-name": self.displayName,
      },
    }).then(async (res) => {
      setCreatePending(false);
      if (res.ok) {
        const body = await res.json();
        dispatch(setGameId(body.id));
        dispatch(setState(GameState.Lobby));
        dispatch(addPlayer({ displayName: self.displayName }));
      } else {
        handleError(res, props.addToast);
      }
    });
  };

  const handleJoinGame = () => {
    setJoinPending(true);
    fetch(`${API_URL}/api/join_game`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "display-name": self.displayName,
        "game-id": joinGameInput,
      },
    }).then(async (res) => {
      setJoinPending(false);
      if (res.ok) {
        const body = await res.json();
        body.players.forEach((displayName: string) => {
          dispatch(addPlayer({ displayName }));
        });
        dispatch(setGameId(joinGameInput));
        dispatch(setState(GameState.Lobby));
      } else {
        handleError(res, props.addToast);
      }
    });
  };

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDisplayName(e.target.value));
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
              className="border shadow-inner text-sm rounded-lg focus:ring-emerald block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-400 dark:placeholder-gray-400"
              value={self.displayName}
              onChange={handleDisplayNameChange}
            />
          </div>

          <div className="pt-8 flex flex-col space-y-3">
            <div className="grow">
              <input
                type="text"
                id="game"
                className="border shadow-inner text-sm rounded-lg focus:ring-emerald block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-700 dark:border-gray-400 dark:placeholder-gray-400"
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
