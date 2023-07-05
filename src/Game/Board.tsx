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
  const [canPickup, setCanPickup] = React.useState<boolean>(true);
  const [heldIndex, setHeldIndex] = React.useState<number>(NULL_HELD_INDEX);
  const [dropSlotIndex, setDropSlotIndex] = React.useState<number | null>(null);
  const [pile, setPile] = useState<Card[]>([]);
  const [deckSize, setDeckSize] = useState<number>(1);
  const [heldCards, setHandCards] = React.useState<Card[]>([]);
  const [gameState, setGameState] = useState<GameState>(GameState.None);
  const [websocket, setWebsocket] = React.useState<WebSocket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);

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
      ws.onopen = () => console.log("websocket connected");
      ws.onmessage = (event) => {
        console.log("recieved message", event);
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
      console.log("joined game group", joinResp);

      return ws;
    };

    if (!websocket) {
      openWebsocket(userId, gameId).then((websocket) =>
        setWebsocket(websocket)
      );
    }
  }, [gameId, handleMessage, userId, websocket]);

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
        console.log("got state", state);
        setHandCards(state.hand.map((c: CardType) => getCard(c, 0)));
        setPile(state.pile.map((c: CardType) => getCard(c, 0)));
        setDeckSize(state.deckSize);
      });
    }
  }, [gameId, gameState, userId]);

  const drawFromPile = async () => {
    return await fetch(`${API_URL}/api/draw_from_pile`, {
      method: "POST",
      headers: {
        "user-id": userId,
        "game-id": gameId,
      },
    });
  };

  const discard = async () => {
    return await fetch(`${API_URL}/api/discard`, {
      method: "POST",
      headers: {
        "user-id": userId,
        "game-id": gameId,
      },
      body: JSON.stringify({
        card: heldCards[heldIndex],
      }),
    });
  };

  const handleSetDropSlotIndex = (index: number | null) => {
    console.log("setting drop slot index", index);
    if (!canPickup) {
      return;
    }

    if (!index) {
      return;
    }

    if (index - heldIndex === 0 || index - heldIndex === 1) {
      setDropSlotIndex(null);
      return;
    }

    setDropSlotIndex(index);
  };

  const getDroppedCard = (heldIndex: number): Card | undefined => {
    if (heldIndex === DECK_HELD_INDEX) {
      return pile.pop(); // TODO: Make api call and what not
    } else if (heldIndex === PILE_HELD_INDEX) {
      return pile.pop();
    } else {
      return heldCards[heldIndex];
    }
  };

  const cleanupInvalidCards = () => {
    const numInvalidBeforeIndex = [];
    let sum = 0;
    for (let i = 0; i < heldCards.length; i++) {
      numInvalidBeforeIndex.push(sum);
      if (heldCards[i].type === CardType.INVALID) {
        sum++;
      }
    }

    const now = Date.now();
    const invalidCards = heldCards.filter(
      (card) =>
        card.createdTimeMs &&
        card.type === CardType.INVALID &&
        now - card.createdTimeMs > 150
    );

    invalidCards.forEach((card) => {
      heldCards.splice(heldCards.indexOf(card), 1);
    });
    setHandCards([...heldCards]);

    setCanPickup(true);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();

    if (dropSlotIndex === null || heldIndex === null) {
      return;
    }

    const dropCard = getDroppedCard(heldIndex);
    if (!dropCard) {
      return;
    }

    if (heldIndex === PILE_HELD_INDEX) {
      const response = await drawFromPile();

      if (!response.ok) {
        console.error("failed to draw from pile", response);
        setHeldIndex(NULL_HELD_INDEX);
        setDropSlotIndex(null);
        return;
      }
    }

    if (dropSlotIndex === PILE_HELD_INDEX) {
      const response = await discard();

      if (!response.ok) {
        console.error("failed to discard", response);
        setHeldIndex(NULL_HELD_INDEX);
        setDropSlotIndex(null);
        return;
      }
    }

    const indexMod = heldIndex > dropSlotIndex ? 1 : 0;
    const dummyCard = {
      type: CardType.INVALID,
      deck: 0,
      points: 0,
      suit: 0,
      value: 0,
      createdTimeMs: Date.now(),
    };
    heldCards.splice(dropSlotIndex, 0, dropCard);
    heldCards[heldIndex + indexMod] = dummyCard;

    setHandCards([...heldCards]);
    setDropSlotIndex(null);
    setHeldIndex(NULL_HELD_INDEX);
    setCanPickup(false);

    setTimeout(cleanupInvalidCards, 200);
  };

  const handleSetHeldIndex = (index: number) => {
    if (!canPickup) {
      return;
    }

    setHeldIndex(index);
  };

  // if (gameState === GameState.None) {
  //   return (
  //     <GameMenu
  //       userId={userId}
  //       displayName={displayName}
  //       setDisplayName={setDisplayName}
  //       onGameEnter={(gameId, players) => {
  //         setPlayers(players);
  //         setGameId(gameId);
  //         setGameState(GameState.Lobby);
  //       }}
  //     />
  //   );
  // }

  return (
    <div className="w-full h-full">
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-row space-x-8">
          <Deck heldIndex={heldIndex} setHeldIndex={setHeldIndex} />
          <PlayingCard
            card={pile[pile.length - 1]}
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

      {/* {gameState === GameState.Lobby && (
        <Lobby userId={userId} gameId={gameId} players={players} />
      )} */}
      <Lobby
        userId={userId}
        gameId={"DKWIFH"}
        players={["Orange Smurf", "Red Cactus"]}
      />
    </div>
  );
};
