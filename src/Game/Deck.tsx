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
        card={spacerCard}
        index={DECK_HELD_INDEX}
        isHeld={false}
        setHeldIndex={props.setHeldIndex}
        mousePos={props.mousePos}
      />
    );
  }

  return (
    <PlayingCard
      card={cardBack}
      index={DECK_HELD_INDEX}
      isHeld={props.heldIndex === DECK_HELD_INDEX}
      setHeldIndex={props.setHeldIndex}
      mousePos={props.mousePos}
    />
  );
};
