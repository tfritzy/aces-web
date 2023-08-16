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

  const cards = Array.from({ length: deckSize / 2 }, (_, i) => {
    return (
      <div className="relative">
        <div style={{ position: "absolute", top: -1 * i + "px" }}>
          <PlayingCard
            isHeld={false}
            card={cardBack}
            index={DECK_HELD_INDEX}
            key={i}
          />
        </div>
      </div>
    );
  });

  return (
    <div className="w-32 h-44 shadow-lg shadow-[#00000033] rounded-md">
      {props.heldIndex === DECK_HELD_INDEX && (
        <PlayingCard
          isHeld
          key="held-deck-card"
          card={cardBack}
          index={DECK_HELD_INDEX}
        />
      )}
      {cards}
    </div>
  );
};
