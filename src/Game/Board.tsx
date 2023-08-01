import React, { useEffect } from "react";
import { throttle } from "lodash";

import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card, spacerCard } from "Game/Types";
import { API_URL } from "Constants";
import { EventType, Message } from "Game/Events";
import { Lobby } from "Game/Lobby";
import { PlayingCard } from "Game/PlayingCard";
import { Toasts, useToasts } from "components/Toasts";
import { ToastProps } from "components/Toast";
import { RoundSummary } from "Game/RoundSummary";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { addPlayer, setPlayers, updatePlayer } from "store/playerSlice";
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

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

const handleMessage = (
  message: Message,
  dispatch: AppDispatch,
  addToast: (props: ToastProps) => void,
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
      break;
    case EventType.PlayerWentOut:
      addToast({
        message: `${message.playerId} went out!`,
        type: "info",
        id: generateId("toast", 12),
      });
      break;
    case EventType.PlayerDoneForRound:
      addToast({
        message: `${message.playerId} ended round with ${message.roundScore}`,
        type: "info",
        id: generateId("toast", 12),
      });
      updatePlayer({
        playerId: message.playerId,
        roundScore: message.roundScore,
        totalScore: message.totalScore,
      });
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
  const [recentMessage, setRecentMessage] =
    React.useState<MessageEvent<any> | null>(null);
  const [heldIndex, setHeldIndex] = React.useState<number>(NULL_HELD_INDEX);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [scorecardShown, setScorecardShown] = React.useState<boolean>(false);
  const [websocket, setWebsocket] = React.useState<
    WebSocket | null | undefined
  >(undefined);
  const [endTurnPending, setEndTurnPending] = React.useState<boolean>(false);
  const [goOutPending, setGoOutPending] = React.useState<boolean>(false);
  const { toasts, addToast } = useToasts();
  const players = useSelector((state: RootState) => state.players.players);
  const game = useSelector((state: RootState) => state.game);
  const heldCards = useSelector((state: RootState) => state.game.hand);
  const self = useSelector((state: RootState) => state.self);
  const rootState = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const gameId = useParams().gameId || "";
  const [mousePos, setMousePos] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

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

  useEffect(() => {
    if (recentMessage) {
      const message = JSON.parse(recentMessage.data);
      console.log("New message", message);
      setRecentMessage(null);
      handleMessage(message, dispatch, addToast, rootState);
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

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

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

  const throttledSetDropSlotIndex = React.useCallback(
    throttle(
      (index: number | null) => {
        setDropSlotIndex(index);
      },
      200,
      { trailing: true }
    ),
    []
  );

  const handleSetDropSlotIndex = React.useCallback(
    (index: number | null) => {
      if (index === null) {
        return;
      }

      if (dropSlotIndex) {
        dispatch(
          setHand([...heldCards.slice(0, index), ...heldCards.slice(index)])
        );
      }

      throttledSetDropSlotIndex(index);
    },
    [dispatch, dropSlotIndex, heldCards, throttledSetDropSlotIndex]
  );

  const handleDrop = React.useCallback(async () => {
    if (dropSlotIndex === null || heldIndex === null) {
      return;
    }

    const updatedHand = [...heldCards];
    if (heldIndex === PILE_HELD_INDEX && dropSlotIndex >= 0) {
      const response = await drawFromPile();

      if (response.ok) {
        const dropCard = game.pile[game.pile.length - 1];
        updatedHand.splice(dropSlotIndex, 0, dropCard);
        dispatch(removeTopFromPile());
      }
    } else if (dropSlotIndex === PILE_HELD_INDEX && heldIndex >= 0) {
      const response = await discard();

      if (response.ok) {
        const dropCard = updatedHand[heldIndex];
        dispatch(addToPile(dropCard));
        updatedHand.splice(heldIndex, 1);
      }
    } else if (dropSlotIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
      const response = await drawFromDeck();

      if (response.ok) {
        const dropCard = (await response.json()) as Card;
        console.log(dropCard);
        updatedHand.splice(dropSlotIndex, 0, dropCard);
      }
    } else {
      const dropCard = updatedHand[heldIndex];
      const indexMod = heldIndex > dropSlotIndex ? 1 : 0;
      updatedHand.splice(dropSlotIndex, 0, dropCard);
      updatedHand.splice(heldIndex + indexMod, 1);
    }

    dispatch(setHand(updatedHand));
    setDropSlotIndex(null);
    setHeldIndex(NULL_HELD_INDEX);
  }, [
    discard,
    dispatch,
    drawFromDeck,
    drawFromPile,
    dropSlotIndex,
    game.pile,
    heldCards,
    heldIndex,
  ]);

  const handleSetHeldIndex = React.useCallback(
    (index: number) => {
      if (heldIndex !== NULL_HELD_INDEX) {
        return;
      }

      setHeldIndex(index);
    },
    [heldIndex]
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
          onClick={goOut}
          text="Go out"
          type="secondary"
          pending={goOutPending}
        />
        <Button
          onClick={endTurn}
          text="End turn"
          type="primary"
          pending={endTurnPending}
        />
      </div>
    );
  }, [endTurn, endTurnPending, goOut, goOutPending]);

  return (
    <div className="w-full h-full">
      <Toasts toasts={toasts} />

      <PlayerList />

      <div
        className="absolute top-2 right-2 w-8 h-8 bg-gray-300"
        onMouseEnter={() => setScorecardShown(true)}
        onMouseLeave={() => setScorecardShown(false)}
      />
      {scorecardShown && <Scorecard />}

      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row space-x-8">
          <Deck
            heldIndex={heldIndex}
            setHeldIndex={setHeldIndex}
            mousePos={mousePos}
          />
          <PlayingCard
            card={game.pile[game.pile.length - 1] || spacerCard}
            index={PILE_HELD_INDEX}
            isHeld={heldIndex === PILE_HELD_INDEX}
            setHeldIndex={setHeldIndex}
            setDropSlotIndex={handleSetDropSlotIndex}
            onDrop={handleDrop}
            mousePos={mousePos}
          />
        </div>
      </div>

      <Dock
        heldIndex={heldIndex}
        setHeldIndex={handleSetHeldIndex}
        onDrop={handleDrop}
        cards={heldCards}
        dropSlotIndex={dropSlotIndex}
        setDropSlotIndex={handleSetDropSlotIndex}
        buttons={buttons}
        mousePos={mousePos}
      />

      {game.state === GameState.Setup && (
        <Lobby
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
        />
      )}

      {game.state === GameState.TurnSummary && (
        <RoundSummary
          onContinue={() => {
            dispatch(setState(GameState.Playing));
          }}
        />
      )}
    </div>
  );
};
