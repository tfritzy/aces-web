import React from "react";

import { DECK_HELD_INDEX } from "Game/Board";
import { PlayingCard } from "Game/PlayingCard";
import { CardType, cardBack, spacerCard } from "./Types";
import { useSelector } from "react-redux";
import { RootState } from "store/store";

type DeckProps = {
  heldIndex: number;
  setHeldIndex: (index: number) => void;
  mousePos: { x: number; y: number };
};

export const Deck = (props: DeckProps) => {
  const deckSize = useSelector((state: RootState) => state.game.deckSize);

  if (
    deckSize === 0 ||
    (props.heldIndex === DECK_HELD_INDEX && deckSize === 1)
  ) {
    return (
      <PlayingCard
        key="held-deck-card"
        card={spacerCard}
        index={DECK_HELD_INDEX}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        mousePos={props.mousePos}
      />
    );
  }

  const cards = [];
  for (let i = 0; i < deckSize / 2; i++) {
    cards.push(
      <div className="relative h-[.5px] -translate-y-[15px]">
        <div
          key={i}
          className={`absolute w-32 h-4 border-b rounded ${
            i % 2 === 0 ? "border-gray-500" : "border-gray-600"
          } }`}
        ></div>
      </div>
    );
  }

  return (
    <div>
      {props.heldIndex === DECK_HELD_INDEX && (
        <PlayingCard
          key="held-deck-card"
          card={cardBack}
          index={DECK_HELD_INDEX}
          heldIndex={props.heldIndex}
          setHeldIndex={props.setHeldIndex}
          mousePos={props.mousePos}
        />
      )}

      <PlayingCard
        card={cardBack}
        index={DECK_HELD_INDEX}
        heldIndex={props.heldIndex}
        setHeldIndex={props.setHeldIndex}
        mousePos={props.mousePos}
        key="deck"
      />
      {cards}
    </div>
  );
};
