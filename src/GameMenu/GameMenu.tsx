import React, { ChangeEvent, useState } from "react";

import { API_URL } from "Constants";
import { Modal } from "components/Modal";
import Cookies from "universal-cookie";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setDisplayName } from "store/selfSlice";
import { GameState, setGameId } from "store/gameSlice";
import { addPlayer, setPlayers } from "store/playerSlice";
import { setState } from "store/gameSlice";
import { handleError } from "helpers/handleError";
import { Toasts, useToasts } from "components/Toasts";
import { useNavigate } from "react-router-dom";
import { GameStateForPlayer } from "Game/Types";
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

type JoinGameMenuProps = {
  addToast: (props: ToastProps) => void;
};

const JoinGameMenu = (props: JoinGameMenuProps) => {
  const [code, setCode] = useState("");
  const [joinPending, setJoinPending] = useState(false);
  const dispatch = useDispatch();
  const self = useSelector((state: RootState) => state.self);
  const navigate = useNavigate();
  const [digitRefs, setDigitRefs] = useState<(HTMLInputElement | null)[]>([
    null,
    null,
    null,
    null,
    null,
    null,
  ]);

  const handleJoinGame = () => {
    setJoinPending(true);
    fetch(`${API_URL}/api/join_game`, {
      method: "POST",
      headers: {
        token: self.token,
        "display-name": self.displayName,
        "game-id": code,
        "player-id": self.id,
      },
    }).then(async (res) => {
      setJoinPending(false);
      if (res.ok) {
        const body: GameStateForPlayer = await res.json();
        body.players.forEach((p) => {
          dispatch(addPlayer(p));
        });
        dispatch(setGameId(code));
        dispatch(setState(GameState.Setup));

        return navigate(`/game/${code}`);
      } else {
        console.log(digitRefs);
        digitRefs[0]?.focus();
        handleError(res, props.addToast);
        setCode("");
      }
    });
  };

  const handleCodeChange = (value: string, i: number) => {
    if (joinPending) {
      return;
    }

    let newCode = code;
    while (code.length < i) {
      newCode += " ";
    }

    newCode = newCode.slice(0, i) + value + newCode.slice(i + 1);
    setCode(newCode);
    if (newCode.length < 6) {
      digitRefs[newCode.length]?.focus();
    } else {
      handleJoinGame();
    }
  };

  const digits = [];
  for (let i = 0; i < 6; i++) {
    digits.push(
      <input
        type="text"
        onChange={(e) => handleCodeChange(e.target.value, i)}
        value={code[i] || ""}
        className={`w-8 h-8 rounded-lg text-center text-black bg-gray-200 ${
          joinPending ? "opacity-50" : ""
        }`}
        ref={(el) => {
          digitRefs[i] = el;
          setDigitRefs(digitRefs);
        }}
        key={i}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            if (code.length > 0) {
              setCode(code.slice(0, -1));
              digitRefs[i - 1]?.focus();
            }
          }
        }}
      />
    );
  }

  return (
    <div>
      Game code:
      <div className="flex space-x-2">{digits}</div>
    </div>
  );
};

type GameMenuProps = {
  addToast: (props: ToastProps) => void;
};

const CreateGameMenu = (props: GameMenuProps) => {
  const [createPending, setCreatePending] = useState(false);
  const dispatch = useDispatch();
  const self = useSelector((state: RootState) => state.self);
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    setCreatePending(true);
    fetch(`${API_URL}/api/create_game`, {
      method: "POST",
      headers: {
        token: self.token,
        "display-name": self.displayName,
        "player-id": self.id,
      },
    }).then(async (res) => {
      setCreatePending(false);
      if (res.ok) {
        const body = await res.json();
        dispatch(setGameId(body.id));
        dispatch(setState(GameState.Setup));
        dispatch(setPlayers([{ displayName: self.displayName }]));

        return navigate(`/game/${body.id}`);
      } else {
        handleError(res, props.addToast);
      }
    });
  };

  return (
    <Button
      onClick={handleCreateGame}
      text="Create Game"
      pending={createPending}
      type="primary"
    />
  );
};

export const GameMenu = () => {
  const [showJoinGame, setShowJoinGame] = useState(true);
  const [joinGameInput, setJoinGameInput] = useState("");

  const self = useSelector((state: RootState) => state.self);
  const dispatch = useDispatch();
  const { toasts, addToast } = useToasts();
  const navigate = useNavigate();

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

  const handleDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setDisplayName(e.target.value));
    const cookies = new Cookies();
    cookies.set("display-name", e.target.value, { path: "/" });
  };

  return (
    <>
      <Toasts toasts={toasts} />
      <Modal width="w-80">
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

            <div className="flex flex-row items-center justify-center">
              <button
                className={`rounded-l ${
                  showJoinGame ? "bg-emerald-400" : "bg-white"
                }`}
                onClick={() => setShowJoinGame(true)}
              >
                Join
              </button>
              <button
                className={`rounded-r ${
                  showJoinGame ? "bg-white" : "bg-emerald-400"
                }`}
                onClick={() => setShowJoinGame(false)}
              >
                Create
              </button>
            </div>

            {showJoinGame ? (
              <JoinGameMenu addToast={addToast} />
            ) : (
              <CreateGameMenu addToast={addToast} />
            )}

            {/* <div className="pt-8 flex flex-col space-y-3">
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
              /> */}
            {/* </div> */}
          </div>
        </div>
      </Modal>
    </>
  );
};
