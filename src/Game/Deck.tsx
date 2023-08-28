import React from "react";

import { PlayingCard } from "Game/PlayingCard";
import { cardBack } from "./Types";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { DECK_HELD_INDEX } from "store/cardManagementSlice";
import { cardHeight, cardWidth } from "Constants";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  const deckSize = useSelector((state: RootState) => state.game.deckSize);

  const cards = React.useMemo(
    () =>
      Array.from({ length: deckSize / 2 }, (_, i) => {
        let card;
        if (i < deckSize / 2 - 3) {
          card = (
            <div
              className="border rounded-xl border-gray-400"
              style={{ width: cardWidth, height: cardHeight }}
            />
          );
        } else {
          card = (
            <PlayingCard
              isHeld={false}
              card={cardBack}
              index={DECK_HELD_INDEX}
            />
          );
        }

        let shadow = "";
        if (i < 1) {
          shadow = "shadow-lg rounded-xl";
        } else if (i < 3) {
          shadow = "shadow-md rounded-xl";
        } else if (i < 5) {
          shadow = "shadow-sm rounded-xl";
        }

        return (
          <div className="relative" key={i}>
            <div
              style={{ position: "absolute", top: -1 * i + "px" }}
              className={shadow}
            >
              {card}
            </div>
          </div>
        );
      }),
    [deckSize]
  );

  return (
    <div
      className={`rounded-md`}
      style={{ width: cardWidth, height: cardHeight }}
    >
      {cards}
    </div>
  );
};
