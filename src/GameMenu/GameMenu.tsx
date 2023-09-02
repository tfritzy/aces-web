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
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { GameStateForPlayer } from "Game/Types";
import { ToastProps } from "components/Toast";
import { resetCards } from "store/cardManagementSlice";
import { Dispatch } from "@reduxjs/toolkit";

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

const joinGame = (
  gameId: string,
  setPending: (pending: boolean) => void,
  token: string,
  displayName: string,
  id: string,
  dispatch: Dispatch,
  navigate: NavigateFunction,
  onFailure: () => void,
  addToast: (props: ToastProps) => void
) => {
  setPending(true);
  fetch(`${API_URL}/api/join_game`, {
    method: "POST",
    headers: {
      token: token,
      "display-name": displayName,
      "game-id": gameId,
      "player-id": id,
    },
  }).then(async (res) => {
    setPending(false);
    if (res.ok) {
      const body: GameStateForPlayer = await res.json();
      resetAll(dispatch);
      dispatch(setPlayers(body.players));
      dispatch(setGameId(gameId));
      dispatch(setState(GameState.Setup));

      return navigate(`/${gameId}`);
    } else {
      handleError(res, addToast);
      onFailure();
    }
  });
};

type JoinSpecificGameMenuProps = {
  addToast: (props: ToastProps) => void;
};

const JoinSpecificGameMenu = (props: JoinSpecificGameMenuProps) => {
  const [joinPending, setJoinPending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gameId = useParams().gameId || "";
  const self = useSelector((state: RootState) => state.self);

  return (
    <div>
      <Button
        text="Join"
        type="primary"
        size="jumbo"
        onClick={() =>
          joinGame(
            gameId,
            setJoinPending,
            self.token,
            self.displayName,
            self.id,
            dispatch,
            navigate,
            () => {},
            props.addToast
          )
        }
        pending={joinPending}
      />
      <div className="mt-6 text-sm">
        Looking for a different game?{" "}
        <button
          onClick={() => {
            navigate("/");
          }}
          className="text-violet-500 dark:text-violet-400 font-semibold"
        >
          Return home
        </button>
      </div>
    </div>
  );
};

type JoinGameMenuProps = {
  addToast: (props: ToastProps) => void;
  setCreatingGame: () => void;
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

        return navigate(`/${gameId}`);
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
    const newCode = code + value;
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
        className={`w-9 h-9 shadow-sm shadow-[#00000011] focus:ring focus:ring-blue-200 rounded-md text-center border border-gray-300 text-black bg-white dark:bg-gray-600 dark:border-gray-400 dark:text-white ${
          joinPending ? "opacity-50" : ""
        }`}
        ref={(el) => {
          digitRefs[i] = el;
          setDigitRefs(digitRefs);
        }}
        tabIndex={i === code.length ? 0 : -1}
        key={i}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            if (code.length > 0) {
              const newCode = code.slice(0, -1);
              setCode(newCode);
              digitRefs[newCode.length]?.focus();
            }
          }
        }}
        onMouseDown={(e) => {
          // Should only ever focus last.
          digitRefs[code.length]?.focus();
        }}
        onClick={(e) => {
          // Should only ever focus last.
          digitRefs[code.length]?.focus();
        }}
      />
    );
  }

  return (
    <div>
      <label className="block mb-4 text-sm font-medium">Enter game code</label>

      <div className="flex justify-between mb-6">{digits}</div>

      <div>
        Or,{" "}
        <button
          onClick={props.setCreatingGame}
          className="text-violet-500 dark:text-violet-400 font-semibold"
        >
          create new game
        </button>
      </div>
    </div>
  );
};

type CreateGameMenuProps = {
  addToast: (props: ToastProps) => void;
  setJoiningGame: () => void;
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

        return navigate(`/${body.id}`);
      } else {
        handleError(res, props.addToast);
      }
    });
  };

  return (
    <>
      <Button
        onClick={handleCreateGame}
        text="Create Game"
        pending={createPending}
        type="primary"
        size="jumbo"
      />

      <div className="mt-6">
        Or,{" "}
        <button
          onClick={props.setJoiningGame}
          className="text-violet-500 dark:text-violet-400 font-semibold"
        >
          join an exsiting game
        </button>
      </div>
    </>
  );
};

type GameMenuProps = {
  shown: boolean;
  isJoinSpecificMenu?: boolean;
};

export const GameMenu = (props: GameMenuProps) => {
  const [showJoinGame, setShowJoinGame] = useState(true);
  const self = useSelector((state: RootState) => state.self);
  const gameIdFromUrl = useParams().gameId || "";
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

  let content;
  let title;
  if (props.isJoinSpecificMenu) {
    content = <JoinSpecificGameMenu addToast={addToast} />;
    title = "Joining game " + gameIdFromUrl;
  } else if (showJoinGame) {
    content = (
      <JoinGameMenu
        addToast={addToast}
        setCreatingGame={() => setShowJoinGame(false)}
      />
    );
    title = "Join game";
  } else {
    content = (
      <CreateGameMenu
        addToast={addToast}
        setJoiningGame={() => setShowJoinGame(true)}
      />
    );
    title = "Create game";
  }

  return (
    <div className="flex flex-col items-center">
      <Toasts toasts={toasts} />
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center text-black dark:text-white">
        <div className="flex flex-col space-y-6 border border-gray-300 dark:border-gray-500 shadow-lg dark:shadow-2xl dark:shadow-[#111111] rounded-md bg-white dark:bg-gray-800 px-12 p-12 pb-10 pt-8 w-[355px]">
          <div className="text-xl font-bold">{title}</div>
          <div className="">
            <label className="block mb-4 text-sm font-medium">
              Display name
            </label>
            <input
              type="text"
              id="display_name"
              className="border shadow-sm text-sm rounded-md block w-full p-3 bg-white border-gray-300 placeholder-gray-400 dark:bg-gray-600 dark:border-gray-400 dark:placeholder-gray-400 focus:ring focus:ring-blue-200"
              value={self.displayName}
              onChange={handleDisplayNameChange}
            />
          </div>

          {content}
        </div>
      </div>
    </div>
  );
};
