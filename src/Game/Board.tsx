import React, { useEffect } from "react";
import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card, spacerCard } from "Game/Types";
import { API_URL } from "Constants";
import { EventType, Message } from "Game/Events";
import { Lobby } from "Game/Lobby";
import { GameMenu } from "GameMenu/GameMenu";
import Cookies from "universal-cookie";
import { PlayingCard } from "Game/PlayingCard";
import { Toasts, useToasts } from "components/Toasts";
import { ToastProps } from "components/Toast";
import { RoundSummary } from "Game/RoundSummary";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import { addPlayer, updatePlayer } from "store/playerSlice";
import {
  GameState,
  addToPile,
  incrementRound,
  removeTopFromPile,
  setDeckSize,
  setPile,
  setState,
  setTurn,
} from "store/gameSlice";
import { setUserId } from "store/selfSlice";
import { generateId } from "helpers/generateId";
import { PlayerList } from "Game/PlayerList";

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

const handleMessage = (
  message: Message,
  dispatch: AppDispatch,
  addToast: (props: ToastProps) => void,
  state: RootState
) => {
  console.log("handling message", EventType[message.type], message);
  switch (message.type) {
    case EventType.JoinGame:
      dispatch(addPlayer({ displayName: message.displayName }));
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
      if (message.player !== state.self.displayName) {
        addToast({
          message: `${message.player} drew from the deck`,
          type: "info",
          id: generateId("toast", 12),
        });
        dispatch(setDeckSize(state.game.deckSize - 1));
      }
      break;
    case EventType.DrawFromPile:
      if (message.player !== state.self.displayName) {
        addToast({
          message: `${message.player} drew from the pile`,
          type: "info",
          id: generateId("toast", 12),
        });
        dispatch(removeTopFromPile());
      }
      break;
    case EventType.Discard:
      if (message.player !== state.self.displayName) {
        const card = message.card;
        dispatch(addToPile(card));
      }
      break;
    case EventType.AdvanceRound:
      dispatch(incrementRound());
      dispatch(setState(GameState.TurnSummary));
      break;
    case EventType.AdvanceTurn:
      console.log("advancing turn");
      console.log("Players", state.players.players.length);
      dispatch(setTurn((state.game.turn + 1) % state.players.players.length));
      break;
    case EventType.PlayerWentOut:
      addToast({
        message: `${message.player} went out!`,
        type: "info",
        id: generateId("toast", 12),
      });
      break;
    case EventType.PlayerDoneForRound:
      addToast({
        message: `${message.displayName} ended round with ${message.roundScore}`,
        type: "info",
        id: generateId("toast", 12),
      });
      updatePlayer({
        displayName: message.displayName,
        roundScore: message.roundScore,
        totalScore: message.totalScore,
      });
      break;
    default:
      console.error("unhandled message", message);
  }
};

const openWebsocket = async (
  userId: string,
  gameId: string,
  onMessage: (message: MessageEvent<any>) => void,
  handleError: (response: Response) => void
) => {
  let res = await fetch(`${API_URL}/api/negotiate`, {
    headers: {
      "user-id": userId,
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
      "user-id": userId,
      "game-id": gameId,
    },
  });

  if (!joinResp.ok) {
    await handleError(joinResp);
  }

  return ws;
};

export const Board = () => {
  const [recentMessage, setRecentMessage] =
    React.useState<MessageEvent<any> | null>(null);
  const [heldIndex, setHeldIndex] = React.useState<number>(NULL_HELD_INDEX);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [heldCards, setHandCards] = React.useState<Card[]>([]);
  const [websocket, setWebsocket] = React.useState<
    WebSocket | null | undefined
  >(undefined);
  const [endTurnPending, setEndTurnPending] = React.useState<boolean>(false);
  const [goOutPending, setGoOutPending] = React.useState<boolean>(false);
  const { toasts, addToast } = useToasts();
  const players = useSelector((state: RootState) => state.players.players);
  const game = useSelector((state: RootState) => state.game);
  const self = useSelector((state: RootState) => state.self);
  const rootState = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();

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
    const cookies = new Cookies();
    let id = cookies.get("unique-id");
    if (!id) {
      id = generateId("plr", 12);
      cookies.set("unique-id", id, { path: "/" });
    }
    dispatch(setUserId(id));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    if (game.state === GameState.Lobby && websocket === undefined) {
      setWebsocket(null);
      openWebsocket(self.id, game.id, setRecentMessage, handleError).then(
        (websocket) => setWebsocket(websocket)
      );
    }
  }, [game.id, game.state, handleError, self.id, websocket]);

  React.useEffect(() => {
    const getState = async () => {
      let joinResp = await fetch(`${API_URL}/api/get_game_state`, {
        headers: {
          "user-id": self.id,
          "game-id": game.id,
        },
      });

      return await joinResp.json();
    };

    if (game.state === GameState.Playing) {
      getState().then((state) => {
        setHandCards(state.hand);
        dispatch(setPile(state.pile));
        setDeckSize(state.deckSize);
      });
    }
  }, [dispatch, game.id, game.state, self.id]);

  const drawFromPile = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/draw_from_pile`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "game-id": game.id,
      },
    });

    if (!res.ok) {
      await handleError(res);
    }

    return res;
  }, [game.id, handleError, self.id]);

  const drawFromDeck = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/draw_from_deck`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "game-id": game.id,
      },
    });

    if (!res.ok) {
      await handleError(res);
    }

    return res;
  }, [game.id, handleError, self.id]);

  const discard = React.useCallback(async () => {
    var res = await fetch(`${API_URL}/api/discard`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "game-id": game.id,
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
  }, [game.id, handleError, heldCards, heldIndex, self.id]);

  const handleSetDropSlotIndex = React.useCallback(
    (index: number | null) => {
      if (index === null) {
        return;
      }

      if (index === dropSlotIndex) {
        return;
      }

      if (index - heldIndex === 0 || index - heldIndex === 1) {
        setDropSlotIndex(null);
        return;
      }

      if (dropSlotIndex) {
        setHandCards([...heldCards.slice(0, index), ...heldCards.slice(index)]);
      }

      setDropSlotIndex(index);
    },
    [dropSlotIndex, heldCards, heldIndex]
  );

  const handleDrop = React.useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();

      if (dropSlotIndex === null || heldIndex === null) {
        return;
      }

      if (heldIndex === PILE_HELD_INDEX && dropSlotIndex >= 0) {
        const response = await drawFromPile();

        if (response.ok) {
          const dropCard = game.pile[game.pile.length - 1];
          heldCards.splice(dropSlotIndex, 0, dropCard);
          dispatch(removeTopFromPile());
        }
      } else if (dropSlotIndex === PILE_HELD_INDEX && heldIndex >= 0) {
        const response = await discard();

        if (response.ok) {
          const dropCard = heldCards[heldIndex];
          dispatch(addToPile(dropCard));
          heldCards.splice(heldIndex, 1);
        }
      } else if (dropSlotIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
        const response = await drawFromDeck();

        if (response.ok) {
          const dropCard = (await response.json()) as Card;
          console.log(dropCard);
          heldCards.splice(dropSlotIndex, 0, dropCard);
        }
      } else {
        const dropCard = heldCards[heldIndex];
        const indexMod = heldIndex > dropSlotIndex ? 1 : 0;
        heldCards.splice(dropSlotIndex, 0, dropCard);
        heldCards.splice(heldIndex + indexMod, 1);
      }

      setHandCards([...heldCards]);
      setDropSlotIndex(null);
      setHeldIndex(NULL_HELD_INDEX);
    },
    [
      discard,
      dispatch,
      drawFromDeck,
      drawFromPile,
      dropSlotIndex,
      game.pile,
      heldCards,
      heldIndex,
    ]
  );

  const handleSetHeldIndex = React.useCallback((index: number) => {
    setHeldIndex(index);
  }, []);

  const endTurn = React.useCallback(async () => {
    setEndTurnPending(true);
    var res = await fetch(`${API_URL}/api/end_turn`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "game-id": game.id,
      },
    });
    setEndTurnPending(false);

    if (!res.ok) {
      await handleError(res);
    }
  }, [game.id, handleError, self.id]);

  const goOut = React.useCallback(async () => {
    setGoOutPending(true);
    var res = await fetch(`${API_URL}/api/go_out`, {
      method: "POST",
      headers: {
        "user-id": self.id,
        "game-id": game.id,
      },
      body: JSON.stringify({
        cards: heldCards,
      }),
    });
    setGoOutPending(false);

    if (!res.ok) {
      await handleError(res);
    }
  }, [game.id, handleError, heldCards, self.id]);

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

  if (game.state === GameState.None) {
    return (
      <>
        <PlayerList />
        <GameMenu addToast={addToast} />
      </>
    );
  }

  return (
    <div className="w-full h-full">
      <Toasts toasts={toasts} />

      <PlayerList />

      <div className="text-gray-700 dark:text-white">
        <div>Current turn: {players[game.turn]?.displayName || "No one"}</div>
        <div>Current round: {game.round}</div>
      </div>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row space-x-8">
          <Deck heldIndex={heldIndex} setHeldIndex={setHeldIndex} />
          <PlayingCard
            card={game.pile[game.pile.length - 1] || spacerCard}
            index={PILE_HELD_INDEX}
            heldIndex={heldIndex}
            setHeldIndex={setHeldIndex}
            setDropSlotIndex={handleSetDropSlotIndex}
            onDrop={handleDrop}
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
      />

      {game.state === GameState.Lobby && (
        <Lobby
          userId={self.id}
          gameId={game.id}
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

      {game.state === GameState.TurnSummary && <RoundSummary />}
    </div>
  );
};
