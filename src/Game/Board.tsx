import React, { useEffect, useState } from "react";
import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { Card, CardType, getCard } from "Game/Types";
import { API_URL } from "Constants";
import { EventType, Message } from "Game/Events";
import { Lobby } from "Game/Lobby";
import { GameMenu } from "GameMenu/GameMenu";
import Cookies from "universal-cookie";
import { PlayingCard } from "Game/PlayingCard";
import { get } from "http";
import { Toast } from "components/Toast";
import { Toasts, useToasts } from "components/Toasts";

export const NULL_HELD_INDEX = -3;
export const DECK_HELD_INDEX = -2;
export const PILE_HELD_INDEX = -1;

const generateId = (prefix: string, length: number) => {
  return (
    prefix +
    "_" +
    Math.random()
      .toString(9)
      .substring(2, 2 + length)
  );
};

enum GameState {
  None,
  Lobby,
  Playing,
}

export const Board = () => {
  const [userId, setUserId] = React.useState<string>("");
  const [displayName, setDisplayName] = React.useState<string>(
    generateId("player", 4)
  );
  const [gameId, setGameId] = React.useState<string>("");
  const [heldIndex, setHeldIndex] = React.useState<number>(NULL_HELD_INDEX);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [pile, setPile] = useState<Card[]>([]);
  const [deckSize, setDeckSize] = useState<number>(1);
  const [heldCards, setHandCards] = React.useState<Card[]>([
    getCard(CardType.JACK_OF_DIAMONDS, 0),
    getCard(CardType.JACK_OF_DIAMONDS, 1),
    getCard(CardType.JACK_OF_DIAMONDS, 2),
    getCard(CardType.JACK_OF_DIAMONDS, 3),
  ]);
  const [gameState, setGameState] = useState<GameState>(GameState.None);
  const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const { toasts, addToast } = useToasts();

  const handleMessage = React.useCallback(
    (message: Message) => {
      console.log("handling message", message);
      switch (message.type) {
        case EventType.JoinGame:
          setPlayers([...players, message.name]);
          break;
        case EventType.StartGame:
          setGameState(GameState.Playing);
          break;
        case EventType.DrawFromPile:
          if (message.player !== displayName) {
            setPile(pile.slice(0, pile.length - 1));
          }
          break;
        case EventType.Discard:
          if (message.player !== displayName) {
            const card = getCard(message.card, 0);
            setPile([...pile, card]);
          }
          break;
        case EventType.RoundStart:
          setRoundIndex(message.round);
          break;
        case EventType.TurnStart:
          setTurnIndex(message.turnIndex);
          break;
        default:
          console.error("unhandled message", message);
      }
    },
    [pile, players, displayName]
  );

  React.useEffect(() => {
    const cookies = new Cookies();
    let id = cookies.get("unique-id");
    if (!id) {
      id = generateId("uniq", 12);
      cookies.set("unique-id", id, { path: "/" });
    }
    setUserId(id);
  }, []);

  useEffect(() => {
    const openWebsocket = async (userId: string, gameId: string) => {
      let res = await fetch(`${API_URL}/api/negotiate`, {
        headers: {
          "user-id": userId,
          "game-id": gameId,
        },
      });
      let url = await res.json();
      let ws = new WebSocket(url.url);
      ws.onmessage = (event) => {
        handleMessage(JSON.parse(event.data));
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

      return ws;
    };

    if (gameState === GameState.Lobby && !websocket) {
      openWebsocket(userId, gameId).then((websocket) =>
        setWebsocket(websocket)
      );
    }
  }, [gameId, gameState, handleMessage, userId, websocket]);

  React.useEffect(() => {
    const getState = async () => {
      let joinResp = await fetch(`${API_URL}/api/get_game_state`, {
        headers: {
          "user-id": userId,
          "game-id": gameId,
        },
      });

      return await joinResp.json();
    };

    if (gameState === GameState.Playing) {
      getState().then((state) => {
        setHandCards(state.hand.map((c: CardType) => getCard(c, 0)));
        setPile(state.pile.map((c: CardType) => getCard(c, 0)));
        setDeckSize(state.deckSize);
      });
    }
  }, [gameId, gameState, userId]);

  const drawFromPile = React.useCallback(async () => {
    return await fetch(`${API_URL}/api/draw_from_pile`, {
      method: "POST",
      headers: {
        "user-id": userId,
        "game-id": gameId,
      },
    });
  }, [gameId, userId]);

  const drawFromDeck = React.useCallback(async () => {
    return await fetch(`${API_URL}/api/draw_from_deck`, {
      method: "POST",
      headers: {
        "user-id": userId,
        "game-id": gameId,
      },
    });
  }, [gameId, userId]);

  const discard = React.useCallback(async () => {
    return await fetch(`${API_URL}/api/discard`, {
      method: "POST",
      headers: {
        "user-id": userId,
        "game-id": gameId,
        card: heldCards[heldIndex].type.toString(),
      },
    });
  }, [gameId, heldCards, heldIndex, userId]);

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
          const dropCard = pile[pile.length - 1];
          heldCards.splice(dropSlotIndex, 0, dropCard);
          pile.pop();
        } else if (response.status.toString().startsWith("4")) {
          const body: string = await response.text();
          addToast({
            message: body,
            type: "error",
            id: generateId("toast", 12),
          });
        }
      } else if (dropSlotIndex === PILE_HELD_INDEX && heldIndex >= 0) {
        const response = await discard();

        if (response.ok) {
          const dropCard = heldCards[heldIndex];
          pile.push(dropCard);
          heldCards.splice(heldIndex, 1);
          // TODO: Error handle
        }
      } else if (dropSlotIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
        const response = await drawFromDeck();

        if (response.ok) {
          const dropCardType = (await response.json()).card;
          const dropCard = getCard(dropCardType, 0);
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
      addToast,
      discard,
      drawFromDeck,
      drawFromPile,
      dropSlotIndex,
      heldCards,
      heldIndex,
      pile,
    ]
  );

  const handleSetHeldIndex = React.useCallback((index: number) => {
    setHeldIndex(index);
  }, []);

  if (gameState === GameState.None) {
    return (
      <>
        <GameMenu
          userId={userId}
          displayName={displayName}
          setDisplayName={(name) => {
            setDisplayName(name);
          }}
          onGameEnter={(gameId, players) => {
            console.log("game enter", gameId, players);
            setPlayers(players);
            setGameId(gameId);
            setGameState(GameState.Lobby);
          }}
        />
      </>
    );
  }

  return (
    <div className="w-full h-full">
      <Toasts toasts={toasts} />
      <div className="text-white">
        <div>Current turn: {players[turnIndex] || "No one"}</div>
        <div>Current round: {roundIndex}</div>
      </div>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row space-x-8">
          <Deck heldIndex={heldIndex} setHeldIndex={setHeldIndex} />
          <PlayingCard
            card={pile[pile.length - 1] || getCard(CardType.SPACER, 0)}
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
      />

      {gameState === GameState.Lobby && (
        <Lobby userId={userId} gameId={gameId} players={players} />
      )}
    </div>
  );
};
