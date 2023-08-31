import React from "react";

import { Dock } from "Game/Dock";
import { Deck } from "Game/Deck";
import { cardBack, parseCard, spinnerCard } from "Game/Types";
import { API_URL } from "Constants";
import { Toasts, useToasts } from "components/Toasts";
import { RoundSummary } from "Game/RoundSummary";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  GameState,
  removeTopFromPile,
  setDeckSize,
  setPile,
  setHand,
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
  setDisabled,
  setDropSlotIndex,
  setHeldIndex,
} from "store/cardManagementSlice";
import { TurnFlowchart } from "./TurnFlowchart";
import { PlayingCard } from "./PlayingCard";
import { MouseProvider } from "Game/MouseContext";

type BoardProps = {
  reconnect: (
    token: string,
    dispatch: ReturnType<typeof useDispatch>,
    gameId: string,
    handleError: (r: Response) => void
  ) => void;
};

export const Board = (props: BoardProps) => {
  const heldIndex = useSelector(
    (state: RootState) => state.cardManagement.heldIndex
  );

  const [endTurnPending, setEndTurnPending] = React.useState<boolean>(false);
  const [goOutPending, setGoOutPending] = React.useState<boolean>(false);
  const { toasts, addToast } = useToasts();
  const players = useSelector((state: RootState) => state.players.players);
  const game = useSelector((state: RootState) => state.game);
  const heldCards = useSelector((state: RootState) => state.game.hand);
  const self = useSelector((state: RootState) => state.self);
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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setHeldIndex(NULL_HELD_INDEX));
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
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

  const handleDrop = React.useCallback(
    async (dropIndex?: number) => {
      dropIndex = dropIndex ?? cardManagement.dropSlotIndex ?? undefined;
      if (dropIndex === undefined || heldIndex === NULL_HELD_INDEX) {
        return;
      }

      if (cardManagement.disabled) {
        return;
      }

      if (dropIndex === PILE_HELD_INDEX && heldIndex === DECK_HELD_INDEX) {
        return;
      }

      const originalHand = [...heldCards];
      if (heldIndex === PILE_HELD_INDEX && dropIndex >= 0) {
        const finalHand = [...heldCards];
        const originalPile = [...game.pile];
        const drawnCard = game.pile[game.pile.length - 1];
        finalHand.splice(dropIndex, 0, drawnCard);
        dispatch(removeTopFromPile());
        dispatch(setHand(finalHand));
        dispatch(setDisabled(true));

        drawFromPile().then((res) => {
          dispatch(setDisabled(false));
          if (res.ok) {
            // Nothing to do.
          } else {
            dispatch(setHand(originalHand));
            dispatch(setPile(originalPile));
          }
        });
      } else if (dropIndex === PILE_HELD_INDEX && heldIndex >= 0) {
        const originalPile = [...game.pile];
        const finalHand = [...heldCards];
        const finalPile = [...game.pile];
        const dropCard = finalHand[heldIndex];
        finalPile.push(dropCard);
        finalHand.splice(heldIndex, 1);
        dispatch(setHand(finalHand));
        dispatch(setPile(finalPile));
        dispatch(setDisabled(true));

        discard().then((res) => {
          dispatch(setDisabled(false));
          if (res.ok) {
            // Nothing to do.
          } else {
            dispatch(setHand(originalHand));
            dispatch(setPile(originalPile));
          }
        });
      } else if (dropIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
        const originalDeckSize = game.deckSize;
        const pendingHand = [...heldCards];
        pendingHand.splice(dropIndex, 0, spinnerCard);
        dispatch(setHand(pendingHand));
        dispatch(setDisabled(true));

        const pendingSlot = dropIndex;
        drawFromDeck().then(async (res) => {
          dispatch(setDisabled(false));
          if (res.ok) {
            const finalHand = [...heldCards];
            const drawnCard = parseCard(await res.json());
            finalHand.splice(pendingSlot, 0, drawnCard);
            dispatch(setHand(finalHand));
            dispatch(setDeckSize(game.deckSize - 1));
          } else {
            dispatch(setHand(originalHand));
            dispatch(setDeckSize(originalDeckSize));
          }
        });
      } else {
        const finalHand = [...heldCards];
        const dropCard = finalHand[heldIndex];
        const indexMod = dropIndex > heldIndex ? 1 : 0;
        finalHand.splice(heldIndex, 1);
        finalHand.splice(dropIndex - indexMod, 0, dropCard);
        dispatch(setHand(finalHand));
      }

      dispatch(setHeldIndex(NULL_HELD_INDEX));
      setDropSlotIndex(null);
    },
    [
      cardManagement.disabled,
      cardManagement.dropSlotIndex,
      discard,
      dispatch,
      drawFromDeck,
      drawFromPile,
      game.deckSize,
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
      body: JSON.stringify({
        hand: heldCards,
      }),
    });
    setEndTurnPending(false);

    if (!res.ok) {
      await handleError(res);
    }
  }, [gameId, handleError, heldCards, self.token]);

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

  const canGoOut = game.hand.length > 0 && game.hand.every((c) => c.isGrouped);
  const buttons = React.useMemo(() => {
    return (
      <div className="flex justify-center w-full">
        <div className="flex justify-end space-x-2 p-2 w-full">
          <Button
            key="goOut"
            onClick={goOut}
            text="Go out"
            type={canGoOut ? "primary" : "secondary"}
            pending={goOutPending}
          />
          <Button
            key="endTurn"
            onClick={endTurn}
            text="End turn"
            type={!canGoOut ? "primary" : "secondary"}
            pending={endTurnPending}
          />
        </div>
      </div>
    );
  }, [endTurn, endTurnPending, goOut, goOutPending, canGoOut]);

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
    <MouseProvider>
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

        <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen max-w-[1400px] min-w-[1000px] h-screen border-l border-r shadow-md border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-gray-900">
          <PlayerList key="playerList" />

          <div className="absolute top-0 right-0">
            <div className="relative flex flex-col items-end p-2 space-y-2">
              <ScorecardButton />
              {isOwnTurn && <TurnFlowchart />}
            </div>
          </div>

          <div className="flex flex-col h-screen">
            <div key="cards" className="flex grow items-center">
              <div
                className="relative flex flex-row justify-center space-x-8 w-full"
                key="cards"
              >
                <div>
                  <div className="text-center text-xl text-gray-300 dark:text-slate-700 front-bold pb-4">
                    Deck
                  </div>
                  <div className="py-2 px-3 border-2 border-gray-100 dark:border-gray-800 rounded-lg shadow-inner">
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
                  <div className="py-2 px-3 border-2 border-gray-100 dark:border-gray-800 rounded-lg shadow-inner">
                    <Pile key="pile" handleDrop={handleDrop} />
                  </div>
                </div>
              </div>
            </div>

            <div className="justify-center">
              <Dock
                key="dock"
                onDrop={handleDrop}
                cards={heldCards}
                buttons={buttons}
              />
            </div>
          </div>
        </div>

        <RoundSummary
          shown={game.state === GameState.TurnSummary || true}
          key="roundSummary"
          onContinue={() => {
            props.reconnect(self.token, dispatch, gameId, handleError);
          }}
        />
      </div>
    </MouseProvider>
  );
};
