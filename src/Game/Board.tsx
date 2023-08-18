import React, { useEffect } from "react";

import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card, cardBack } from "Game/Types";
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
  setTurnPhase,
  TurnPhase,
} from "store/gameSlice";
import { generateId } from "helpers/generateId";
import { PlayerList } from "Game/PlayerList";
import { ScorecardButton } from "./Scorecard";
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
import { TurnFlowchart } from "./TurnFlowchart";
import { PlayingCard } from "./PlayingCard";

const handleMessage = (
  message: Message,
  dispatch: AppDispatch,
  addToast: (props: ToastProps) => void,
  setAlertMessage: (message: string) => void,
  state: RootState
) => {
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
      break;
    case EventType.StartGame:
      dispatch(setState(GameState.Playing));
      break;
    case EventType.DrawFromDeck:
      if (message.playerId !== state.self.id) {
        dispatch(setDeckSize(state.game.deckSize - 1));
      }
      dispatch(setTurnPhase(TurnPhase.Discarding));
      break;
    case EventType.DrawFromPile:
      if (message.playerId !== state.self.id) {
        dispatch(removeTopFromPile());
      }
      dispatch(setTurnPhase(TurnPhase.Discarding));
      break;
    case EventType.Discard:
      if (message.playerId !== state.self.id) {
        const card = message.card;
        dispatch(addToPile(card));
      }
      dispatch(setTurnPhase(TurnPhase.Ending));
      break;
    case EventType.AdvanceRound:
      dispatch(setRound(message.round));
      dispatch(setState(GameState.TurnSummary));
      dispatch(setTurnPhase(TurnPhase.Drawing));
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
      dispatch(setTurnPhase(TurnPhase.Drawing));
      break;
    case EventType.PlayerWentOut:
      if (message.playerId !== state.self.id) {
        const displayName =
          state.players.players.find((p) => p.id === message.playerId)
            ?.displayName || "A player";
        setAlertMessage(`${displayName} went out! You have one more turn.`);
      }
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
  const cardManagement = useSelector(
    (state: RootState) => state.cardManagement
  );
  const dispatch: AppDispatch = useDispatch();
  const gameId = useParams().gameId || "";
  const isOwnTurn = players[game.turn]?.id === self.id;

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
        dispatch(setTurnPhase(state.turnPhase));

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
    async (dropIndex?: number) => {
      dropIndex = dropIndex ?? cardManagement.dropSlotIndex ?? undefined;
      if (dropIndex === undefined || heldIndex === NULL_HELD_INDEX) {
        return;
      }

      if (dropIndex === PILE_HELD_INDEX && heldIndex === DECK_HELD_INDEX) {
        return;
      }

      const updatedHand = [...heldCards];
      if (heldIndex === PILE_HELD_INDEX && dropIndex >= 0) {
        const response = await drawFromPile();

        if (response.ok) {
          const dropCard = game.pile[game.pile.length - 1];
          updatedHand.splice(dropIndex, 0, dropCard);
          dispatch(removeTopFromPile());
        }
      } else if (dropIndex === PILE_HELD_INDEX && heldIndex >= 0) {
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
      cardManagement.dropSlotIndex,
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
      <div className="flex justify-center w-full">
        <div className="flex justify-end space-x-2 p-2 w-full">
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
      </div>
    );
  }, [endTurn, endTurnPending, goOut, goOutPending]);

  let heldCard;
  if (heldIndex !== NULL_HELD_INDEX) {
    if (heldIndex === DECK_HELD_INDEX) {
      heldCard = cardBack;
    } else if (heldIndex === PILE_HELD_INDEX) {
      heldCard = game.pile[game.pile.length - 1];
    } else {
      heldCard = heldCards[heldIndex];
    }
  }

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
      {heldIndex !== NULL_HELD_INDEX && heldCard && (
        <PlayingCard
          isHeld
          card={heldCard}
          index={PILE_HELD_INDEX}
          key={heldCard.type + "-" + heldCard.deck}
        />
      )}

      <Toasts toasts={toasts} key="toasts" />

      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-screen border-l border-r shadow-md border-gray-100 dark:border-slate-700">
        <PlayerList key="playerList" />

        <div className="absolute top-0 right-0">
          <div className="relative flex flex-col items-end p-2 space-y-2">
            <ScorecardButton />
            {isOwnTurn && <TurnFlowchart />}
          </div>
        </div>

        <div className="flex flex-col h-screen">
          <div key="cards" className="flex grow-[3] items-center">
            <div
              className="relative flex flex-row justify-center space-x-8 w-full"
              key="cards"
            >
              <div>
                <div className="text-center text-xl text-gray-300 dark:text-slate-700 front-bold pb-4">
                  Deck
                </div>
                <div className="py-4 px-6 border-2 border-gray-100 dark:border-gray-800 rounded-lg shadow-inner">
                  <Deck
                    key="deck"
                    heldIndex={heldIndex}
                    setHeldIndex={setHeldIndex}
                  />
                </div>
              </div>

              <div>
                <div className="text-center text-xl text-gray-300 dark:text-slate-700 front-bold pb-4">
                  Discard
                </div>
                <div className="py-4 px-6 border-2 border-gray-100 dark:border-gray-800 rounded-lg shadow-inner">
                  <Pile key="pile" handleDrop={handleDrop} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex grow-[1] justify-center">
            <Dock
              key="dock"
              onDrop={handleDrop}
              cards={heldCards}
              buttons={buttons}
            />
          </div>
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
