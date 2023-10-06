import React from "react";

import { parseCard } from "Game/Types";
import { API_URL } from "Constants";
import { Toasts, useToasts } from "components/Toasts";
import { RoundSummary } from "Game/RoundSummary";
import { Button } from "components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/store";
import {
  GameState,
  removeTopFromPile,
  setPile,
  setHand,
  TurnPhase,
  popTopDeck,
  setDeck,
} from "store/gameSlice";
import { generateId } from "helpers/generateId";
import { PlayerList } from "Game/PlayerList";
import { ScorecardButton } from "./Scorecard";
import { useParams } from "react-router-dom";
import {
  DECK_HELD_INDEX,
  PILE_HELD_INDEX,
  setDisabled,
  setDropSlotIndex,
  setHeldIndex,
} from "store/cardManagementSlice";
import { TurnFlowchart } from "./TurnFlowchart";
import { MouseProvider } from "Game/MouseContext";
import { CardManagement } from "./CardManagement";
import { HotkeysButton } from "./Hotkeys";

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

  const sort = React.useCallback(async () => {
    const hand = [...heldCards];
    hand.sort((a, b) => {
      if (a.suit === b.suit) {
        return a.type - b.type;
      }

      return a.suit - b.suit;
    });
    dispatch(setHand(hand));
  }, [heldCards, dispatch]);

  const discard = React.useCallback(async () => {
    if (heldIndex === null) {
      return;
    }

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

  const handleDrop = React.useCallback(
    async (dropIndex?: number) => {
      dropIndex = dropIndex ?? cardManagement.dropSlotIndex ?? undefined;
      if (dropIndex === undefined || heldIndex === null) {
        return;
      }

      if (cardManagement.disabled) {
        return;
      }

      if (
        (dropIndex === PILE_HELD_INDEX || dropIndex === DECK_HELD_INDEX) &&
        (heldIndex === DECK_HELD_INDEX || heldIndex === PILE_HELD_INDEX)
      ) {
        setHeldIndex(null);
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
          if (res?.ok) {
            // Nothing to do.
          } else {
            dispatch(setHand(originalHand));
            dispatch(setPile(originalPile));
          }
        });
      } else if (dropIndex >= 0 && heldIndex === DECK_HELD_INDEX) {
        const originalDeck = [...game.deck];
        const topCard = game.deck[game.deck.length - 1];
        const pendingHand = [...heldCards];
        pendingHand.splice(dropIndex, 0, topCard);
        dispatch(setHand(pendingHand));
        dispatch(setDeck(originalDeck.slice(0, -1)));
        dispatch(setDisabled(true));

        const pendingSlot = dropIndex;
        drawFromDeck().then(async (res) => {
          dispatch(setDisabled(false));
          if (res.ok) {
            const finalHand = [...heldCards];
            const drawnCard = parseCard(await res.json());
            finalHand.splice(pendingSlot, 0, drawnCard);
            dispatch(setHand(finalHand));
            dispatch(popTopDeck());
          } else {
            dispatch(setHand(originalHand));
            dispatch(setDeck(originalDeck));
          }
        });
      } else {
        const finalHand = [...heldCards];
        const dropCard = finalHand[heldIndex];
        finalHand.splice(heldIndex, 1);
        finalHand.splice(dropIndex, 0, dropCard);
        dispatch(setHand(finalHand));
      }

      dispatch(setHeldIndex(null));
      setDropSlotIndex(null);
    },
    [
      cardManagement.disabled,
      cardManagement.dropSlotIndex,
      discard,
      dispatch,
      drawFromDeck,
      drawFromPile,
      game.deck,
      game.pile,
      heldCards,
      heldIndex,
    ]
  );

  React.useEffect(() => {
    const handleHotkeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dispatch(setHeldIndex(null));
      }
      if (event.key === "e") {
        endTurn();
      }
      if (event.key === "g") {
        goOut();
      }
      if (event.key === "s") {
        sort();
      }
      if (event.key === "p") {
        if (heldIndex === null) {
          dispatch(setHeldIndex(PILE_HELD_INDEX));
        } else {
          handleDrop(PILE_HELD_INDEX);
        }
      }

      // if is numeric key
      if (event.key.match(/[0-9]/)) {
        let num = parseInt(event.key);

        // + 10 if shift
        if (event.shiftKey) {
          num += 10;
        }

        if (num > 0 && num <= heldCards.length) {
          if (heldIndex === null) {
            dispatch(setHeldIndex(num - 1));
          } else {
            handleDrop(num - 1);
          }
        }
      }

      if (event.key === "d") {
        if (heldIndex === null) {
          dispatch(setHeldIndex(DECK_HELD_INDEX));
        } else {
          handleDrop(DECK_HELD_INDEX);
        }
      }
    };

    window.addEventListener("keydown", handleHotkeys);

    return () => {
      window.removeEventListener("keydown", handleHotkeys);
    };
  }, [dispatch, endTurn, goOut, handleDrop, heldCards.length, heldIndex, sort]);

  const canGoOut = game.hand.length > 0 && game.hand.every((c) => c.isGrouped);
  const isInEndRoundPhase = isOwnTurn && game.turnPhase === TurnPhase.Ending;
  const buttons = React.useMemo(() => {
    return (
      <div className="flex justify-end py-2 w-[950px]">
        <div className="flex justify-between w-full">
          <Button
            key="sort"
            onClick={sort}
            text={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className="w-5 h-5 stroke-black dark:stroke-white"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14H2M8 10H2M6 6H2M12 18H2M19 20V4m0 16 3-3m-3 3-3-3m3-13 3 3m-3-3-3 3"
                ></path>
              </svg>
            }
            type={"secondary"}
          />

          <div className="flex flex-row space-x-1">
            <Button
              key="goOut"
              onClick={goOut}
              text="Go out"
              type={isInEndRoundPhase && canGoOut ? "primary" : "secondary"}
              pending={goOutPending}
              disabled={!isInEndRoundPhase}
            />
            <Button
              key="endTurn"
              onClick={endTurn}
              text="End turn"
              type={isInEndRoundPhase && !canGoOut ? "primary" : "secondary"}
              pending={endTurnPending}
              disabled={!isInEndRoundPhase}
            />
          </div>
        </div>
      </div>
    );
  }, [
    sort,
    goOut,
    isInEndRoundPhase,
    canGoOut,
    goOutPending,
    endTurn,
    endTurnPending,
  ]);

  return (
    <MouseProvider>
      <div>
        <div
          className="min-w-screen min-h-screen flex flex-col items-center"
          onMouseUp={() => {
            dispatch(setHeldIndex(null));
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              dispatch(setHeldIndex(null));
            }
          }}
        >
          <div className="absolute max-w-[1400px] min-w-[1000px] h-screen border-l border-r shadow-md border-gray-100 dark:border-slate-700 bg-white dark:bg-gray-900">
            <PlayerList key="playerList" />

            <div className="absolute top-0 right-0">
              <div className="relative flex flex-col items-end p-2 space-y-2">
                <div className="flex flex-row space-x-2">
                  <HotkeysButton />
                  <ScorecardButton />
                </div>

                {isOwnTurn && <TurnFlowchart />}
              </div>
            </div>
          </div>

          <CardManagement onDrop={handleDrop} buttons={buttons} />

          <RoundSummary
            shown={
              game.state === GameState.TurnSummary ||
              game.state === GameState.Finished
            }
            key="roundSummary"
            onContinue={() => {
              props.reconnect(self.token, dispatch, gameId, handleError);
            }}
          />
        </div>

        <Toasts toasts={toasts} key="toasts" />
      </div>
    </MouseProvider>
  );
};
