import React from "react";

import { parseCard, spinnerCard } from "Game/Types";
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

  // //shuffle the cards in the hand every 3000 ms
  // React.useEffect(() => {
  //   const interval = setInterval(() => {
  //     const hand = [...heldCards];
  //     const shuffledCards = hand.sort(() => Math.random() - 0.5);
  //     dispatch(setHand(shuffledCards));
  //     console.log(
  //       "shuffled hand",
  //       shuffledCards.map((c) => c.type)
  //     );
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, [dispatch, heldCards]);

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
        dispatch(setHeldIndex(null));
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

  const handleDrop = React.useCallback(
    async (dropIndex?: number) => {
      dropIndex = dropIndex ?? cardManagement.dropSlotIndex ?? undefined;
      if (dropIndex === undefined || heldIndex === null) {
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
          if (res?.ok) {
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
          <div className="w-screen h-screen flex flex-row justify-center">
            <div className="max-w-[1400px] min-w-[1000px] h-screen border-l border-r shadow-md border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-gray-900">
              <PlayerList key="playerList" />

              <div className="absolute top-0 right-0">
                <div className="relative flex flex-col items-end p-2 space-y-2">
                  <ScorecardButton />

                  {isOwnTurn && <TurnFlowchart />}
                </div>
              </div>

              <CardManagement onDrop={handleDrop} buttons={buttons} />
            </div>
          </div>
        </div>

        <Toasts toasts={toasts} key="toasts" />

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
    </MouseProvider>
  );
};
