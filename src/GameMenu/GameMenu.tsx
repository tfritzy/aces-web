import React, { useState } from "react";

import { API_URL } from "Constants";
import Cookies from "universal-cookie";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/store";
import { setDisplayName } from "store/selfSlice";
import { GameState, resetAll as resetGame, setGameId } from "store/gameSlice";
import { setPlayers } from "store/playerSlice";
import { setState } from "store/gameSlice";
import { handleError } from "helpers/handleError";
import { Toasts, useToasts } from "components/Toasts";
import { useNavigate } from "react-router-dom";
import { GameStateForPlayer } from "Game/Types";
import { ToastProps } from "components/Toast";
import { TabRow } from "components/TabRow";
import { resetCards } from "store/cardManagementSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { FlyingCard } from "components/FlyingCard";
import { Background } from "components/Background";
import { Spinner } from "components/Spinner";

const adjectives = [
  "Stealthy",
  "Shadowy",
  "Covert",
  "Veiled",
  "Masked",
  "Mysterious",
  "Incognito",
  "Silent",
  "Camouflaged",
  "Disguised",
  "Anonymous",
  "Cloaked",
  "Ghostly",
  "Concealed",
];

const nouns = [
  "Bear",
  "Hawk",
  "Lynx",
  "Wolf",
  "Lion",
  "Deer",
  "Fox",
  "Crow",
  "Swan",
  "Snake",
  "Toad",
  "Cat",
  "Bat",
  "Frog",
  "Owl",
  "Dove",
  "Fish",
  "Moth",
  "Wasp",
  "Crab",
];

type JoinGameMenuProps = {
  addToast: (props: ToastProps) => void;
};

const resetAll = (dispatch: Dispatch) => {
  dispatch(resetCards());
  dispatch(resetGame());
  dispatch(setPlayers([]));
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

  const handleJoinGame = (gameId: string) => {
    setJoinPending(true);
    fetch(`${API_URL}/api/join_game`, {
      method: "POST",
      headers: {
        token: self.token,
        "display-name": self.displayName,
        "game-id": gameId,
        "player-id": self.id,
      },
    }).then(async (res) => {
      setJoinPending(false);
      if (res.ok) {
        const body: GameStateForPlayer = await res.json();
        resetAll(dispatch);
        dispatch(setPlayers(body.players));
        dispatch(setGameId(gameId));
        dispatch(setState(GameState.Setup));

        return navigate(`/game/${gameId}`);
      } else {
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
      handleJoinGame(newCode);
    }
  };

  const digits = [];
  for (let i = 0; i < 6; i++) {
    digits.push(
      <input
        type="text"
        onChange={(e) => handleCodeChange(e.target.value, i)}
        value={code[i] || ""}
        className={`w-9 h-9 shadow-sm shadow-[#00000011] rounded-md text-center border border-gray-300 text-black bg-white dark:bg-gray-600 dark:border-gray-400 dark:text-white ${
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
      <label className="block mb-4 text-sm font-medium">Enter game code</label>

      <div className="flex justify-between">{digits}</div>
    </div>
  );
};

type CreateGameMenuProps = {
  addToast: (props: ToastProps) => void;
};

const CreateGameMenu = (props: CreateGameMenuProps) => {
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
        resetAll(dispatch);
        dispatch(setGameId(body.id));
        dispatch(setState(GameState.Setup));
        dispatch(
          setPlayers([
            {
              displayName: self.displayName,
              id: self.id,
              mostRecentGroupedCards: [],
              mostRecentUngroupedCards: [],
              scorePerRound: [],
              totalScore: 0,
            },
          ])
        );

        return navigate(`/game/${body.id}`);
      } else {
        handleError(res, props.addToast);
      }
    });
  };

  return (
    <div>
      Or,{" "}
      <button
        onClick={handleCreateGame}
        className="text-violet-500 dark:text-violet-400"
      >
        create new game
      </button>
    </div>
  );

  return (
    <Button
      onClick={handleCreateGame}
      text="Create Game"
      pending={createPending}
      type="primary"
      size="jumbo"
    />
  );
};

type GameMenuProps = {
  shown: boolean;
};

export const GameMenu = (props: GameMenuProps) => {
  const [showJoinGame, setShowJoinGame] = useState(true);

  const self = useSelector((state: RootState) => state.self);
  const dispatch = useDispatch();
  const { toasts, addToast } = useToasts();

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
    <div>
      <Background />
      <Toasts toasts={toasts} />
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-black dark:text-white">
        <div className="flex flex-col space-y-6 border border-gray-300 dark:border-gray-500 shadow-lg dark:shadow-2xl dark:shadow-[#111111] rounded-md bg-white dark:bg-gray-800 px-12 pb-12 pt-8 w-[355px]">
          <div className="text-xl font-bold">Join game</div>
          <div className="">
            <label className="block mb-4 text-sm font-medium">
              Display name
            </label>
            <input
              type="text"
              id="display_name"
              className="border shadow-sm text-sm rounded-md focus:ring-emerald block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-600 dark:border-gray-400 dark:placeholder-gray-400"
              value={self.displayName}
              onChange={handleDisplayNameChange}
            />
          </div>

          <JoinGameMenu addToast={addToast} />

          <CreateGameMenu addToast={addToast} />
        </div>
      </div>
    </div>
  );
};
