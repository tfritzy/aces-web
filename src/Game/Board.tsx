import React, { useEffect } from "react";

import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card } from "Game/Types";
import { API_URL } from "Constants";
import { EventType, Message } from "Game/Events";
import { Lobby } from "Game/Lobby";
import { Toasts, useToasts } from "components/Toasts";
import { ToastProps } from "components/Toast";
import { RoundSummary } from "Game/RoundSummary";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  addPlayer,
  playersSlice,
  setPlayers,
  updatePlayer,
} from "store/playerSlice";
import {
  GameState,
  addToPile,
  setRound,
  removeTopFromPile,
  setDeckSize,
  setPile,
  setState,
  setTurn,
  setHand,
  setGameId,
} from "store/gameSlice";
import { generateId } from "helpers/generateId";
import { PlayerList } from "Game/PlayerList";
import { Scorecard } from "./Scorecard";
import { useParams } from "react-router-dom";
import { Pile } from "./Pile";
import {
  DECK_HELD_INDEX,
  NULL_HELD_INDEX,
  PILE_HELD_INDEX,
  setDropSlotIndex,
  setHeldIndex,
  setMousePos,
} from "store/cardManagementSlice";
import { Alert } from "components/Alert";

const handleMessage = (
  message: Message,
  dispatch: AppDispatch,
  addToast: (props: ToastProps) => void,
  setAlertMessage: (message: string) => void,
  state: RootState
) => {
  console.log(
    "handling message",
    EventType[message.type],
    JSON.stringify(message)
  );
  switch (message.type) {
    case EventType.JoinGame:
      dispatch(
        addPlayer({
          id: message.playerId,
          displayName: message.displayName,
          scorePerRound: [],
          totalScore: 0,
        })
      );
      addToast({
        message: `${message.displayName} joined the game`,
        type: "info",
        id: generateId("toast", 12),
      });
      break;
    case EventType.StartGame:
      dispatch(setState(GameState.Playing));
      break;
    case EventType.DrawFromDeck:
      if (message.playerId !== state.self.id) {
        addToast({
          message: `${message.playerId} drew from the deck`,
          type: "info",
          id: generateId("toast", 12),
        });
        dispatch(setDeckSize(state.game.deckSize - 1));
      }
      break;
    case EventType.DrawFromPile:
      if (message.playerId !== state.self.id) {
        addToast({
          message: `${message.playerId} drew from the pile`,
          type: "info",
          id: generateId("toast", 12),
        });
        dispatch(removeTopFromPile());
      }
      break;
    case EventType.Discard:
      if (message.playerId !== state.self.id) {
        const card = message.card;
        dispatch(addToPile(card));
      }
      break;
    case EventType.AdvanceRound:
      dispatch(setRound(message.round));
      dispatch(setState(GameState.TurnSummary));
      break;
    case EventType.AdvanceTurn:
      dispatch(setTurn(message.turn));
      if (state.self.id === state.players.players[message.turn].id) {
        addToast({
          message: "It's your turn",
          type: "info",
          id: generateId("toast", 12),
        });
      }
      break;
    case EventType.PlayerWentOut:
      const displayName =
        state.players.players.find((p) => p.id === message.playerId)
          ?.displayName || "A player";
      setAlertMessage(`${displayName} went out! You have one more turn.`);
      break;
    case EventType.PlayerDoneForRound:
      addToast({
        message: `${message.playerId} ended round with ${message.roundScore}`,
        type: "info",
        id: generateId("toast", 12),
      });
      dispatch(
        updatePlayer({
          playerId: message.playerId,
          roundScore: message.roundScore,
          totalScore: message.totalScore,
        })
      );
      break;
    default:
      console.error("unhandled message", message);
  }
};

const openWebsocket = async (
  playerId: string,
  gameId: string,
  onMessage: (message: MessageEvent<any>) => void,
  handleError: (response: Response) => void
) => {
  let res = await fetch(`${API_URL}/api/negotiate`, {
    headers: {
      "user-id": playerId,
      "game-id": gameId,
    },
  });
  if (!res.ok) {
    await handleError(res);
  }

  let url = await res.json();
  let ws = new WebSocket(url.url);
  ws.onmessage = (message) => {
    onMessage(message);
  };

  // Sleep for a bit so that the connection resolves and the player is known to pub sub.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  let joinResp = await fetch(`${API_URL}/api/join_game_group`, {
    method: "POST",
    headers: {
      "user-id": playerId,
      "game-id": gameId,
    },
  });

  if (!joinResp.ok) {
    await handleError(joinResp);
  }

  return ws;
};

type BoardProps = {};

export const Board = (props: BoardProps) => {
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );
  const [recentMessage, setRecentMessage] =
    React.useState<MessageEvent<any> | null>(null);
  const [scorecardShown, setScorecardShown] = React.useState<boolean>(false);
  const [websocket, setWebsocket] = React.useState<
    WebSocket | null | undefined
  >(undefined);
  const [endTurnPending, setEndTurnPending] = React.useState<boolean>(false);
  const [goOutPending, setGoOutPending] = React.useState<boolean>(false);
  const [alertMessage, setAlertMessage] = React.useState<string | undefined>(
    undefined
  );
  const [alertMessageShown, setAlertMessageShown] =
    React.useState<boolean>(false);
  const { toasts, addToast } = useToasts();
  const players = useSelector((state: RootState) => state.players.players);
  const game = useSelector((state: RootState) => state.game);
  const heldCards = useSelector((state: RootState) => state.game.hand);
  const self = useSelector((state: RootState) => state.self);
  const rootState = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const gameId = useParams().gameId || "";

  const handleError = React.useCallback(
    async (response: Response) => {
      if (response.status.toString().startsWith("4")) {
        let body = await response.text();
        addToast({
          message: body,
          type: "error",
          id: generateId("toast", 12),
        });
      } else {
        addToast({
          message: "Something went wrong.",
          type: "error",
          id: generateId("toast", 12),
        });
      }
    },
    [addToast]
  );

  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      dispatch(setMousePos({ x: event.clientX, y: event.clientY }));
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setHeldIndex(NULL_HELD_INDEX));
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    const reconnect = async (token: string) => {
      let gameState = await fetch(`${API_URL}/api/get_game_state`, {
        headers: {
          token: token,
          "game-id": gameId,
        },
      });

      if (!gameState.ok) {
        await handleError(gameState);
      } else {
        const state = await gameState.json();
        dispatch(setGameId(gameId));
        dispatch(setState(state.state));
        dispatch(setRound(state.round));
        dispatch(setTurn(state.turn));
        dispatch(setPile(state.pile));
        dispatch(setDeckSize(state.deckSize));
        dispatch(setState(state.state));
        dispatch(setHand(state.hand));

        // TODO: Score
        dispatch(
          setPlayers(
            state.players.map((p: any) => ({
              id: p.id,
              displayName: p.displayName,
              scorePerRound: p.scorePerRound,
              totalScore: p.score,
            }))
          )
        );
      }
    };

    if (game.state === GameState.Invalid && self.token) {
      reconnect(self.token);
    }

    // Going for a mount effect, but token starts null.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [self.token]);

  const setAlertMessageAndShow = React.useCallback((message: string) => {
    setAlertMessage(message);
    setAlertMessageShown(true);
  }, []);

  useEffect(() => {
    if (recentMessage) {
      const message = JSON.parse(recentMessage.data);
      console.log("New message", message);
      setRecentMessage(null);
      handleMessage(
        message,
        dispatch,
        addToast,
        setAlertMessageAndShow,
        rootState
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recentMessage]);

  useEffect(() => {
    if (websocket === undefined) {
      setWebsocket(null);
      openWebsocket(self.id, gameId || "", setRecentMessage, handleError).then(
        (websocket) => setWebsocket(websocket)
      );
    }
  }, [gameId, handleError, self.id, websocket]);

  useEffect(() => {
    const getState = async () => {
      let joinResp = await fetch(`${API_URL}/api/get_game_state`, {
        headers: {
          token: self.token,
          "game-id": gameId || "",
        },
      });

      return await joinResp.json();
    };

    if (game.state === GameState.Playing) {
      getState().then((state) => {
        dispatch(setHand(state.hand));
        dispatch(setPile(state.pile));
        dispatch(setDeckSize(state.deckSize));
      });
    }
  }, [dispatch, game.state, gameId, self.token]);

  const drawFromPile = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/draw_from_pile`, {
      method: "POST",
      headers: {
        token: self.token,
        "game-id": gameId,
      },
    });

    if (!res.ok) {
      await handleError(res);
    }

    return res;
  }, [gameId, handleError, self.token]);

  const drawFromDeck = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/draw_from_deck`, {
      method: "POST",
      headers: {
        token: self.token,
        "game-id": gameId,
      },
    });

    if (!res.ok) {
      await handleError(res);
    }

    return res;
  }, [gameId, handleError, self.token]);

  const discard = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/discard`, {
      method: "POST",
      headers: {
        token: self.token,
        "game-id": gameId,
        card: heldCards[heldIndex].type.toString(),
      },
      body: JSON.stringify({
        card: {
          type: heldCards[heldIndex].type,
          deck: heldCards[heldIndex].deck,
        },
      }),
    });

    if (!res.ok) {
      await handleError(res);
    }

    return res;
  }, [gameId, handleError, heldCards, heldIndex, self.token]);

  const handleDrop = React.useCallback(
    async (dropIndex: number) => {
      if (dropIndex === null || heldIndex === null) {
        console.log("drop failed");
        return;
      }

      const updatedHand = [...heldCards];
      if (heldIndex === PILE_HELD_INDEX && dropIndex >= 0) {
        console.log("draw from pile");
        const response = await drawFromPile();

        if (response.ok) {
          const dropCard = game.pile[game.pile.length - 1];
          console.log("drop card", dropCard);
          updatedHand.splice(dropIndex, 0, dropCard);
          dispatch(removeTopFromPile());
        }
      } else if (dropIndex === PILE_HELD_INDEX && heldIndex >= 0) {
        console.log("discard");
        const response = await discard();

        if (response.ok) {
          const dropCard = updatedHand[heldIndex];
          dispatch(addToPile(dropCard));
          updatedHand.splice(heldIndex, 1);
        }
      } else if (dropIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
        const response = await drawFromDeck();

        if (response.ok) {
          const dropCard = (await response.json()) as Card;
          console.log(dropCard);
          updatedHand.splice(dropIndex, 0, dropCard);
        }
      } else {
        const dropCard = updatedHand[heldIndex];
        const indexMod = dropIndex > heldIndex ? 1 : 0;
        updatedHand.splice(heldIndex, 1);
        updatedHand.splice(dropIndex - indexMod, 0, dropCard);
      }
      dispatch(setHeldIndex(NULL_HELD_INDEX));
      dispatch(setHand(updatedHand));
      setDropSlotIndex(null);
    },
    [
      discard,
      dispatch,
      drawFromDeck,
      drawFromPile,
      game.pile,
      heldCards,
      heldIndex,
    ]
  );

  const endTurn = React.useCallback(async () => {
    setEndTurnPending(true);
    var res = await fetch(`${API_URL}/api/end_turn`, {
      method: "POST",
      headers: {
        token: self.token,
        "game-id": gameId,
      },
    });
    setEndTurnPending(false);

    if (!res.ok) {
      await handleError(res);
    }
  }, [gameId, handleError, self.token]);

  const goOut = React.useCallback(async () => {
    setGoOutPending(true);
    var res = await fetch(`${API_URL}/api/go_out`, {
      method: "POST",
      headers: {
        token: self.token,
        "game-id": gameId,
      },
      body: JSON.stringify({
        cards: heldCards,
      }),
    });
    setGoOutPending(false);

    if (!res.ok) {
      await handleError(res);
    }
  }, [gameId, handleError, heldCards, self.token]);

  const buttons = React.useMemo(() => {
    return (
      <div className="flex justify-end space-x-2 p-2">
        <Button
          key="goOut"
          onClick={goOut}
          text="Go out"
          type="secondary"
          pending={goOutPending}
        />
        <Button
          key="endTurn"
          onClick={endTurn}
          text="End turn"
          type="primary"
          pending={endTurnPending}
        />
      </div>
    );
  }, [endTurn, endTurnPending, goOut, goOutPending]);

  return (
    <div
      className="min-w-screen min-h-screen flex flex-col items-center"
      onMouseUp={() => {
        dispatch(setHeldIndex(NULL_HELD_INDEX));
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          dispatch(setHeldIndex(NULL_HELD_INDEX));
        }
      }}
    >
      <Toasts toasts={toasts} key="toasts" />

      <PlayerList key="playerList" />

      <div key="top-right-buttons" className="absolute top-2 right-2">
        <Button
          onClick={() => setScorecardShown(!scorecardShown)}
          type="secondary"
          text={
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.5 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2.5"
                stroke-width="1.5"
                stroke-linecap="round"
                className="stroke-gray-600 dark:stroke-white"
              ></path>
              <path
                d="M8 6.4V4.5a.5.5 0 01.5-.5c.276 0 .504-.224.552-.496C9.2 2.652 9.774 1 12 1s2.8 1.652 2.948 2.504c.048.272.276.496.552.496a.5.5 0 01.5.5v1.9a.6.6 0 01-.6.6H8.6a.6.6 0 01-.6-.6z"
                stroke-width="1.5"
                stroke-linecap="round"
                className="stroke-gray-600 dark:stroke-white"
              ></path>
            </svg>
          }
        />
      </div>

      <Scorecard
        shown={scorecardShown}
        onClose={() => setScorecardShown(false)}
      />

      <Dock
        key="dock"
        onDrop={handleDrop}
        cards={heldCards}
        buttons={buttons}
      />

      <div
        key="cards"
        className="fixed top-[20%] py-8 px-10 border-2 border-gray-100 dark:border-gray-800 rounded-lg shadow-inner"
      >
        <div className="relative flex flex-row space-x-8" key="cards">
          <Deck key="deck" heldIndex={heldIndex} setHeldIndex={setHeldIndex} />

          <Pile key="pile" handleDrop={handleDrop} />
        </div>
      </div>

      <Lobby
        shown={game.state === GameState.Setup}
        key="lobby"
        token={self.token}
        gameId={gameId}
        players={players}
        onError={(message) => {
          addToast({
            message: message,
            id: generateId("toast", 5),
            type: "error",
          });
        }}
        onClose={() => {}}
      />

      <RoundSummary
        shown={game.state === GameState.TurnSummary}
        key="roundSummary"
        onContinue={() => {
          dispatch(setState(GameState.Playing));
        }}
      />

      <Alert
        close={() => setAlertMessageShown(false)}
        shown={alertMessageShown}
        message={alertMessage || ""}
      />
    </div>
  );
};
export { NULL_HELD_INDEX };
