import React from "react";

import { PlayingCard } from "Game/PlayingCard";
import { cardBack } from "./Types";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import { DECK_HELD_INDEX } from "store/cardManagementSlice";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
};

export const Deck = (props: DeckProps) => {
  const deckSize = useSelector((state: RootState) => state.game.deckSize);

  const cards = [];
  for (let i = 0; i < deckSize / 2; i++) {
    cards.push(
      <div className="relative h-[.5px] -translate-y-[15px]" key={i}>
        <div
          key={i}
          className={`absolute w-32 h-4 border-b rounded ${
            i % 2 === 0
              ? "border-gray-200 dark:border-gray-500"
              : "border-gray-300 dark:border-gray-600"
          } }`}
        ></div>
      </div>
    );
  }

  return (
    <div>
      {props.heldIndex === DECK_HELD_INDEX && (
        <PlayingCard
          isHeld
          key="held-deck-card"
          card={cardBack}
          index={DECK_HELD_INDEX}
        />
      )}

      <PlayingCard
        isHeld={false}
        card={cardBack}
        index={DECK_HELD_INDEX}
        key="deck"
      />
      {cards}
    </div>
  );
};
